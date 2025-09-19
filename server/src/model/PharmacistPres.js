// models/PharmacistPres.js
const mongoose = require('mongoose');

const pharmacistPresSchema = new mongoose.Schema(
  {
    pharmacist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },    // pharmacist userId [web:134]
    pharmacistMedTrackId: { type: String, index: true },                                               // denormalized [web:151]
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },       // patient userId [web:134]
    patientMedTrackId: { type: String, index: true },                                                  // denormalized [web:151]
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true, index: true }, // dispensed Rx [web:134]
    dispensedAt: { type: Date, default: Date.now },                                                    // when dispensed [web:151]
    remarks: { type: String, trim: true },                                                             // optional pharmacist note [web:151]
  },
  { timestamps: true }
);

pharmacistPresSchema.index({ pharmacist: 1, prescription: 1 }, { unique: true }); // avoid re-dispense duplicates [web:151]

module.exports = mongoose.model('PharmacistPres', pharmacistPresSchema);
