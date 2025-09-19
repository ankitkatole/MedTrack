
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { createForPatientByMedTrackId, getPatientMinimalByMedTrackId, getDoctorPrescriptionById,listDoctorIssuedPrescriptions } = require('../controllers/userPrescriptionController');

router.post('/prescriptions', auth(), createForPatientByMedTrackId); 
router.get('/patient/:medTrackId', auth(), getPatientMinimalByMedTrackId); 
router.get('/prescriptions/issued', auth(), listDoctorIssuedPrescriptions); 
router.get('/prescriptions/:id', auth(), getDoctorPrescriptionById); 

module.exports = router;
