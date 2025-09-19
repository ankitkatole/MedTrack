// models/Prescription.js
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },   
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, 

    patientMedTrackId: { type: String, index: true },                                          
    doctorMedTrackId: { type: String, index: true },                                             

    visitReason: { type: String, trim: true },                                            
    diagnosis: { type: String, trim: true },                                                   
    notes: { type: String, trim: true },                                                       

    medicineNames: { type: [String], default: [] },                                              // names [web:134]
    medicineDosages: { type: [String], default: [] },                                            // e.g., "500 mg" [web:134]
    medicineFrequencies: { type: [String], default: [] },                                        // e.g., "1-0-1" [web:134]
    medicineRoutes: { type: [String], default: [] },                                             // e.g., "oral" [web:134]
    medicineDurationDays: { type: [Number], default: [] },                                       // e.g., [5,7] [web:134]
    medicineInstructions: { type: [String], default: [] },                                       // e.g., "after food" [web:134]

    issueDate: { type: Date, default: Date.now },                                                // issue timestamp [web:168]
    dispenseDate: { type: Date },                                                                // optional fulfillment date [web:151]

    attachmentUrl: { type: String, trim: true },                                                 // PDF/image URL [web:151]
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
