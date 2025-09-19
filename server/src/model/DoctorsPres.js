
const mongoose = require('mongoose');

const doctorsPresSchema = new mongoose.Schema(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },        // doctor userId [web:134]
    doctorMedTrackId: { type: String, index: true },                                                   // denormalized for quick search [web:151]
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },       // patient userId [web:134]
    patientMedTrackId: { type: String, index: true },                                                  // denormalized for quick search [web:151]
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true, index: true }, // link to prescription [web:134]
    notes: { type: String, trim: true },                                                                // optional doctor note [web:151]
  },
  { timestamps: true }
);

doctorsPresSchema.index({ doctor: 1, patient: 1, prescription: 1 }, { unique: true }); 

module.exports = mongoose.model('DoctorsPres', doctorsPresSchema);
