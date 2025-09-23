import React, { useState } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import ProfileCard from '../components/Patient/ProfileCard';
import DispensedMedicines from '../components/Pharmacist/DispensedMedicines';
import PatientSearch from '../components/Pharmacist/PatientSearch';
import HealthAnalytics from '../components/Patient/HealthAnalytics';
import DispensedPrescriptionDetail from '../components/Pharmacist/DispensedPrescriptionDetail';

const PharmacistDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileCard />;
      case 'dispensed':
        if (selectedPrescription) {
          return <DispensedPrescriptionDetail dispensedRecord={selectedPrescription} onBack={() => setSelectedPrescription(null)} />;
          // return (
          //   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          //     <button
          //       onClick={() => setSelectedPrescription(null)}
          //       className="mb-4 text-blue-600 dark:text-blue-400 hover:underline"
          //     >
          //       ← Back to Dispensed Medicines
          //     </button>
          //     <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          //       Prescription Details
          //     </h2>
          //     <p className="text-gray-600 dark:text-gray-400">
          //       Prescription detail view for pharmacists
          //     </p>
          //   </div>
          // );
        }
        return (
          <DispensedMedicines
            onViewPrescription={setSelectedPrescription}
          />
        );
      case 'patient-search':
        return <PatientSearch />;
      case 'analytics':
        return <HealthAnalytics />;
      default:
        return <ProfileCard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
