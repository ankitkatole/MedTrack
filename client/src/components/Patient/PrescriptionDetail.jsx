// components/Doctor/DoctorPrescriptionDetail.jsx
import React, { useRef } from 'react'; // add useRef [web:395]
import { ArrowLeft, FileText, Calendar, User, Clock, Pill, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js'; // client HTML->PDF [web:384]

export default function DoctorPrescriptionDetail({ prescription, onBack }) {
  const printRef = useRef(null); // NEW: printable wrapper ref [web:395]

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); // date fmt [web:395]

  const statusColor = prescription.dispenseDate
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'; // status color [web:395]

  const statusText = prescription.dispenseDate ? 'Dispensed' : 'Pending'; // status text [web:395]

  // NEW: Download the on-screen content as PDF
  const handleDownloadPdf = async () => {
    if (!printRef.current) return; // guard [web:395]
    const fileName = `prescription-${prescription._id?.slice(-8) || 'medtrack'}.pdf`; // name [web:395]
    const opt = {
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    }; // tuned options [web:384][web:385]
    await html2pdf().from(printRef.current).set(opt).save(); // generate + save [web:384]
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prescription Details</h2>
          <p className="text-gray-500 dark:text-gray-400">ID: {prescription._id?.slice(-8)}</p>
        </div>
      </div>

      {/* Wrap ALL printable content */}
      <div ref={printRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Visit Information</h3>
            <div className="space-y-3">
              {prescription.diagnosis && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Diagnosis</label>
                  <p className="text-gray-900 dark:text-white">{prescription.diagnosis}</p>
                </div>
              )}
              {prescription.visitReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Visit Reason</label>
                  <p className="text-gray-900 dark:text-white">{prescription.visitReason}</p>
                </div>
              )}
              {prescription.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Doctor's Notes</label>
                  <p className="text-gray-900 dark:text-white">{prescription.notes}</p>
                </div>
              )}
            </div>
          </div>

          {!!(prescription.medicineNames?.length) && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prescribed Medicines</h3>
              <div className="space-y-4">
                {prescription.medicineNames.map((name, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {prescription.medicineDosages?.[i] && (
                            <div><span className="text-gray-500 dark:text-gray-400">Dosage: </span><span className="text-gray-900 dark:text-white">{prescription.medicineDosages[i]}</span></div>
                          )}
                          {prescription.medicineFrequencies?.[i] && (
                            <div><span className="text-gray-500 dark:text-gray-400">Frequency: </span><span className="text-gray-900 dark:text-white">{prescription.medicineFrequencies[i]}</span></div>
                          )}
                          {prescription.medicineRoutes?.[i] && (
                            <div><span className="text-gray-500 dark:text-gray-400">Route: </span><span className="text-gray-900 dark:text-white">{prescription.medicineRoutes[i]}</span></div>
                          )}
                          {prescription.medicineDurationDays?.[i] && (
                            <div><span className="text-gray-500 dark:text-gray-400">Duration: </span><span className="text-gray-900 dark:text-white">{prescription.medicineDurationDays[i]} days</span></div>
                          )}
                          {prescription.medicineInstructions?.[i] && (
                            <div className="md:col-span-2"><span className="text-gray-500 dark:text-gray-400">Instructions: </span><span className="text-gray-900 dark:text-white">{prescription.medicineInstructions[i]}</span></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{statusText}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Issued</span>
                <span className="text-gray-900 dark:text-white">{formatDate(prescription.issueDate)}</span>
              </div>
              {prescription.dispenseDate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Dispensed</span>
                  <span className="text-gray-900 dark:text-white">{formatDate(prescription.dispenseDate)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patient</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-gray-900 dark:text-white">{prescription.user?.name}</span>
                <span className="text-xs text-gray-500">({prescription.user?.medTrackId})</span>
              </div>
              {prescription.user?.email && <div className="text-gray-500 dark:text-gray-400">{prescription.user.email}</div>}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Doctor</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-gray-900 dark:text-white">Dr. {prescription.doctor?.name}</span>
                <span className="text-xs text-gray-500">({prescription.doctor?.medTrackId})</span>
              </div>
              {prescription.doctor?.email && <div className="text-gray-500 dark:text-gray-400">{prescription.doctor.email}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        <button onClick={handleDownloadPdf} className="w-full flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <FileText className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}
