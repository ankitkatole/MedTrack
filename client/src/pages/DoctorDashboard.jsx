import React, { useState } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import ProfileCard from '../components/Patient/ProfileCard';
import DoctorPrescriptionsList from '../components/Doctor/DoctorPrescriptionsList';
import AddPrescriptionForm from '../components/Doctor/AddPrescriptionForm';
import HealthAnalytics from '../components/Patient/HealthAnalytics';
import DoctorPrescriptionDetail from '../components/Doctor/PrescriptionDetail';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileCard />;
      case 'prescriptions':
        if (selectedPrescription) {
          // You can create a DoctorPrescriptionDetail component similar to Patient's
          return selectedPrescription ? (
            <DoctorPrescriptionDetail
              prescription={selectedPrescription}
              onBack={() => setSelectedPrescription(null)}
            />
          ) : (
            <DoctorPrescriptionsList onViewPrescription={setSelectedPrescription} />
          );
        }
        return (
          <DoctorPrescriptionsList
            onViewPrescription={setSelectedPrescription}
          />
        );
      case 'add-prescription':
        return <AddPrescriptionForm />;
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

export default DoctorDashboard;
