// controllers/pharmacist.controller.js
const Prescription = require('../model/Prescription');
const User = require('../model/User');
const PharmacistPres = require('../model/PharmacistPres');
const mongoose = require('mongoose');

// Ensure caller has PHARMACIST role
function requirePharmacist(req, res) {
  if (req.user.role !== 'PHARMACIST') {
    res.status(403).json({ message: 'Only pharmacists can access this resource' });
    return false;
  }
  return true;
}

// GET /pharmacist/prescriptions/patient/:medTrackId
// controllers/pharmacistController.js
exports.getPrescriptionsByPatientMedTrackId = async (req, res) => {
  try {
    if (!requirePharmacist(req, res)) return; // RBAC [web:235]

    const { medTrackId } = req.params;

    const patient = await User.findOne({ medTrackId })
      .select('name email phone role medTrackId createdAt'); // safe subset [web:180]
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    } // 404 for missing patient [web:235]

    // Explicitly include medicine arrays in case of select:false in schema
    const prescriptions = await Prescription.find({ user: patient._id })
      .sort({ createdAt: -1 })
      .select(
        'diagnosis visitReason notes issueDate dispenseDate ' +
        'medicineNames medicineDosages medicineFrequencies medicineRoutes ' +
        'medicineDurationDays medicineInstructions doctor user createdAt updatedAt'
      ) // include medicines [web:180]
      .populate('doctor', 'name email role medTrackId'); // for card display [web:180]

    return res.json({ patient, prescriptions, count: prescriptions.length });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /pharmacy/prescriptions/:id
exports.getPrescriptionByIdAsPharmacist = async (req, res) => {
  try {
    if (!requirePharmacist(req, res)) return; // RBAC [web:235]

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid prescription id' });
    } // guard bad ids [web:206]

    const doc = await Prescription.findById(id)
      .select(
        'diagnosis visitReason notes issueDate dispenseDate ' +
        'medicineNames medicineDosages medicineFrequencies medicineRoutes ' +
        'medicineDurationDays medicineInstructions doctor user'
      ) // full fields for modal [web:180]
      .populate('doctor', 'name email role medTrackId')
      .populate('user', 'name email phone role medTrackId'); // show patient too [web:180]

    if (!doc) {
      return res.status(404).json({ message: 'Prescription not found' });
    } // not found [web:235]

    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};



exports.dispensePrescription = async (req, res) => {
  try {
    if (!requirePharmacist(req, res)) return;

    const pharmacistId = req.user.sub;
    const pharmacist = await User.findById(pharmacistId).select('_id medTrackId');
    if (!pharmacist) return res.status(404).json({ message: 'Pharmacist not found' });

    const { id } = req.params;
    const { remarks } = req.body;

    // 1) Load prescription
    const rx = await Prescription.findById(id);
    if (!rx) return res.status(404).json({ message: 'Prescription not found' });

    // 2) Resolve patient
    const patient = await User.findById(rx.user).select('_id medTrackId');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // 3) Upsert log to be idempotent
    const filter = { pharmacist: pharmacist._id, prescription: rx._id };
    const update = {
      $setOnInsert: {
        pharmacist: pharmacist._id,
        pharmacistMedTrackId: pharmacist.medTrackId,
        patient: patient._id,
        patientMedTrackId: patient.medTrackId,
        prescription: rx._id,
      },
      $set: { remarks: remarks || undefined, dispensedAt: new Date() },
    };
    const options = { upsert: true, new: true };
    const log = await PharmacistPres.findOneAndUpdate(filter, update, options); // [web:204][web:209]

    // 4) Update prescription fulfillment fields idempotently
    if (!rx.dispenseDate) {
      rx.dispenseDate = new Date();
    }
    // If you keep a dispensed boolean
    if ('dispensed' in rx) {
      rx.dispensed = true;
    }
    await rx.save(); // persists new fields [web:209]

    return res.status(log.wasNew ? 201 : 200).json({
      message: log.wasNew ? 'Dispense recorded' : 'Dispense already recorded',
      prescription: rx,
      record: log,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Already dispensed by this pharmacist for this prescription' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};



exports.listPharmacistDispensedPrescriptions = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'PHARMACIST') {
      return res.status(403).json({ message: 'Only pharmacists can access this resource' });
    } // RBAC [web:261]

    const pharmacistId = req.user.sub;
    if (!mongoose.isValidObjectId(pharmacistId)) {
      return res.status(400).json({ message: 'Invalid pharmacist id' });
    } // guard [web:206]

    const logs = await PharmacistPres.find({ pharmacist: pharmacistId })
      .sort({ createdAt: -1 })
      .populate('patient', 'name email phone role medTrackId') // safe subset [web:180]
      .populate({
        path: 'prescription',
        select:
          'issueDate dispenseDate patientMedTrackId doctorMedTrackId medicineNames medicineDosages medicineFrequencies medicineRoutes medicineDurationDays medicineInstructions createdAt updatedAt',
      }); // scoped fields [web:180]

    return res.json({ count: logs.length, records: logs });
  } catch (err) {
    console.error('listPharmacistDispensedPrescriptions error:', err); // inspect stack [web:259]
    return res.status(500).json({ message: 'Server error' });
  }
};

