
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getPrescriptionsByPatientMedTrackId,
  getPrescriptionByIdAsPharmacist,
  dispensePrescription,
  listPharmacistDispensedPrescriptions
} = require('../controllers/pharmacistController');

router.get('/prescriptions/patient/:medTrackId', auth(), getPrescriptionsByPatientMedTrackId);

router.get('/prescriptions/dispensed', auth(), listPharmacistDispensedPrescriptions);
router.get('/prescriptions/:id', auth(), getPrescriptionByIdAsPharmacist);
router.post('/dispense/:id', auth(), dispensePrescription);
// Express route
router.get('/pharmacy/prescriptions/dispensed', auth, individualDescription);


module.exports = router;
