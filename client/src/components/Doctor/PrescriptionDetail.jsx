import React, { useRef } from 'react'; // add useRef
import { ArrowLeft, FileText, Calendar, User, Clock, Pill, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const PrescriptionDetail = ({ prescription, onBack }) => {
  const printRef = useRef(null); // NEW: ref for PDF capture

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDownload = async () => {
    try {
      if (!prescription.attachmentUrl) return;
      const token = localStorage.getItem('token');
      const res = await fetch(prescription.attachmentUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }); // file download [web:298]
      if (!res.ok) throw new Error('Failed to download');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const defaultName = `prescription-${prescription._id?.slice(-8) || 'file'}.pdf`;
      a.download = prescription.fileName || defaultName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download failed:', e);
    }
  };

  // NEW: client-side PDF from current UI
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    const fileName = `prescription-${prescription._id?.slice(-8) || 'medtrack'}.pdf`;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    }; // [web:384][web:385]
    try {
      await html2pdf().from(printRef.current).set(opt).save(); // generate + download [web:384]
    } catch (e) {
      console.error('PDF generation failed:', e); // basic error handling
    }
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const getStatusColor = (p) =>
    p.dispenseDate
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';

  const getStatusText = (p) => (p.dispenseDate ? 'Dispensed' : 'Pending');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prescription Details</h2>
          <p className="text-gray-500 dark:text-gray-400">Prescription ID: {prescription._id.slice(-8)}</p>
        </div>
      </div>

      {/* Wrap all printable content in this ref */}
      <div ref={printRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Diagnosis & Visit Info */}
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

          {/* Medicines */}
          {prescription.medicineNames && prescription.medicineNames.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Prescribed Medicines</h3>
              <div className="space-y-4">
                {prescription.medicineNames.map((medicine, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">{medicine}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {prescription.medicineDosages?.[index] && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Dosage: </span>
                              <span className="text-gray-900 dark:text-white">{prescription.medicineDosages[index]}</span>
                            </div>
                          )}
                          {prescription.medicineFrequencies?.[index] && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Frequency: </span>
                              <span className="text-gray-900 dark:text-white">{prescription.medicineFrequencies[index]}</span>
                            </div>
                          )}
                          {prescription.medicineRoutes?.[index] && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Route: </span>
                              <span className="text-gray-900 dark:text-white">{prescription.medicineRoutes[index]}</span>
                            </div>
                          )}
                          {prescription.medicineDurationDays?.[index] && (
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Duration: </span>
                              <span className="text-gray-900 dark:text-white">{prescription.medicineDurationDays[index]} days</span>
                            </div>
                          )}
                          {prescription.medicineInstructions?.[index] && (
                            <div className="md:col-span-2">
                              <span className="text-gray-500 dark:text-gray-400">Instructions: </span>
                              <span className="text-gray-900 dark:text-white">{prescription.medicineInstructions[index]}</span>
                            </div>
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription)}`}>
                  {getStatusText(prescription)}
                </span>
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

          {/* Doctor Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Doctor Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dr. {prescription.doctor?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {prescription.doctor?.medTrackId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* end printable area */}

      {/* Actions */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
        {prescription.attachmentUrl && (
          <button onClick={handleDownload} className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download Attachment</span>
          </button>
        )}
        <button onClick={handleDownloadPdf} className="w-full flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <FileText className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDetail;
