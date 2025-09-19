// controllers/prescription.controller.js
const Prescription = require('../model/Prescription');
const DoctorsPres = require('../model/DoctorsPres');
const mongoose = require('mongoose');

const User = require('../model/User');

exports.listMyPrescriptions = async (req, res) => {
  try {
    const userId = req.user.sub; // set by JWT middleware [web:143]

    const docs = await Prescription
      .find({ user: userId })
      .sort({ createdAt: -1 }) // newest first [web:167]
      .populate('doctor', 'name email role medTrackId'); // safe fields [web:151]

    return res.json({ count: docs.length, prescriptions: docs });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};


// POST /prescriptions
// Body: { patientMedTrackId, visitReason?, diagnosis?, notes?, medicines?: { names[], dosages[], frequencies[], routes[], durationDays[], instructions[] }, issueDate?, attachmentUrl? }
exports.createForPatientByMedTrackId = async (req, res) => {
  try {
    const doctorId = req.user.sub;
    const role = req.user.role;
    if (role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Only doctors can create prescriptions' });
    } // RBAC [web:144]

    const {
      patientMedTrackId,
      visitReason,
      diagnosis,
      notes,
      medicines = {},
      issueDate,
      attachmentUrl,
      doctorNote, // optional note for DoctorsPres log
    } = req.body;

    if (!patientMedTrackId) {
      return res.status(400).json({ message: 'patientMedTrackId is required' });
    } // validation [web:151]

    const patient = await User.findOne({ medTrackId: patientMedTrackId }).select('_id medTrackId');
    if (!patient) return res.status(404).json({ message: 'Patient not found' }); // resolve patient [web:151]

    const doctor = await User.findById(doctorId).select('_id medTrackId');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' }); // resolve doctor [web:151]

    const {
      names = [],
      dosages = [],
      frequencies = [],
      routes = [],
      durationDays = [],
      instructions = [],
    } = medicines;

    const lens = [names.length, dosages.length, frequencies.length, routes.length, durationDays.length, instructions.length];
    const nonZero = lens.filter(l => l > 0);
    if (nonZero.length && !lens.every(l => l === lens[0])) {
      return res.status(400).json({ message: 'Medicine arrays must have equal lengths' });
    } // arrays alignment [web:134]

    const rx = await Prescription.create({
      user: patient._id,
      doctor: doctor._id,
      patientMedTrackId: patient.medTrackId,
      doctorMedTrackId: doctor.medTrackId,
      visitReason,
      diagnosis,
      notes,
      medicineNames: names,
      medicineDosages: dosages,
      medicineFrequencies: frequencies,
      medicineRoutes: routes,
      medicineDurationDays: durationDays,
      medicineInstructions: instructions,
      issueDate: issueDate || Date.now(),
      attachmentUrl,
    }); // create Rx [web:151][web:134]

    await DoctorsPres.create({
      doctor: doctor._id,
      doctorMedTrackId: doctor.medTrackId,
      patient: patient._id,
      patientMedTrackId: patient.medTrackId,
      prescription: rx._id,
      notes: doctorNote || undefined,
    }); // log for doctor-patient linkage [web:151]

    const populated = await rx.populate('doctor', 'name email role medTrackId');
    return res.status(201).json({ message: 'Prescription created', prescription: populated });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getPrescriptionByIdForMe = async (req, res) => {
  try {
    const userId = req.user.sub; // from JWT [web:183]
    const { id } = req.params;

    const doc = await Prescription
      .findById(id)
      .populate('doctor', 'name email role medTrackId'); // safe subset [web:180]

    if (!doc) {
      return res.status(404).json({ message: 'Prescription not found' });
    } // [web:186]

    // Ownership check: only the prescription's user can view
    if (doc.user.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    } // [web:183]

    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.getPatientMinimalByMedTrackId = async (req, res) => {
  try {
    // Role enforcement
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Only doctors can access this resource' });
    } // [web:144]

    const { medTrackId } = req.params;
    if (!medTrackId) {
      return res.status(400).json({ message: 'medTrackId is required' });
    } // [web:151]

    // Select safe, minimal fields (schema has aadhaar/password as select:false)
    const patient = await User.findOne({ medTrackId })
      .select('name email phone role medTrackId createdAt'); // safe subset [web:151]

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    } // [web:151]

    return res.json({
      id: patient._id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      role: patient.role,
      medTrackId: patient.medTrackId,
      createdAt: patient.createdAt,
    }); // [web:151]
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.listDoctorIssuedPrescriptions = async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Only doctors can access this resource' });
    } // RBAC [web:144]

    const doctorId = req.user.sub;

    const docs = await Prescription
      .find({ doctor: doctorId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone role medTrackId'); // patient info for doctor view [web:180]

    return res.json({ count: docs.length, prescriptions: docs });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
exports.getDoctorPrescriptionById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Only doctors can access this resource' });
    } // RBAC [web:332]

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid prescription id' });
    } // guard cast errors [web:358]

    const doctorId = req.user.sub;

    // First fetch, ensure ownership
    const doc = await Prescription.findOne({ _id: id, doctor: doctorId }); // [web:204]
    if (!doc) {
      return res.status(404).json({ message: 'Prescription not found' });
    } // not found vs 500

    // Populate after existence check
    await doc.populate('user', 'name email phone role medTrackId');   // patient [web:180]
    await doc.populate('doctor', 'name email role medTrackId');       // doctor [web:180]

    // Optional: computed status for UI
    const json = doc.toObject();
    json.status = json.dispenseDate ? 'DISPENSED' : 'PENDING';

    return res.json(json);
  } catch (err) {
    console.error('getDoctorPrescriptionById error:', err); // inspect stack [web:274]
    return res.status(500).json({ message: 'Server error' });
  }
};