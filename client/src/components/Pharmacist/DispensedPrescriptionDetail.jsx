import React, { useRef } from "react";
import { ArrowLeft, FileText, Clock, Pill, User } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function DispensedPrescriptionDetail({ dispensedRecord, onBack }) {
  const printRef = useRef(null);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    const fileName = `dispensed-${dispensedRecord.prescription?._id?.slice(-8) || 'pharm'}.pdf`;
    const opt = { margin: [10,10,10,10], filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    await html2pdf().from(printRef.current).set(opt).save();
  };

  const { prescription, pharmacist, patient, remarks, createdAt } = dispensedRecord;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Dispensed Prescription</h2>
          <p className="text-gray-500">ID: {prescription._id?.slice(-8)}</p>
        </div>
      </div>
      <div ref={printRef} className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Patient</h3>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{patient?.name}</span>
            <span className="text-xs text-gray-500">({patient?.medTrackId})</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Prescribed Medicines</h3>
          <div>
            {(prescription?.medicineNames || []).map((name, i) => (
              <div key={i} className="mb-2 border-b pb-2">
                <div className="flex items-center space-x-2">
                  <Pill className="w-4 h-4" />
                  <span className="font-medium">{name}</span>
                  {prescription.medicineDosages?.[i] && <span>| Dosage: {prescription.medicineDosages[i]}</span>}
                  {prescription.medicineFrequencies?.[i] && <span>| Frequency: {prescription.medicineFrequencies[i]}</span>}
                  {prescription.medicineRoutes?.[i] && <span>| Route: {prescription.medicineRoutes[i]}</span>}
                  {prescription.medicineDurationDays?.[i] && <span>| Duration: {prescription.medicineDurationDays[i]} days</span>}
                </div>
                {prescription.medicineInstructions?.[i] && (
                  <div className="text-sm text-gray-500 mt-1">Instructions: {prescription.medicineInstructions[i]}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Dispensed By</h3>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>{pharmacist?.name}</span>
            <span className="text-xs text-gray-500">({pharmacist?.pharmacistId})</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Dispensed At</h3>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
        {remarks && (
          <div>
            <h3 className="font-semibold mb-2">Pharmacist Remarks</h3>
            <div className="text-gray-700">{remarks}</div>
          </div>
        )}
      </div>
      <div className="mt-4">
        <button onClick={handleDownloadPdf} className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          <FileText className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
}
