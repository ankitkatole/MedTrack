import React, { useState } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import ProfileCard from '../components/Patient/ProfileCard';
import PrescriptionsList from '../components/Patient/PrescriptionsList';
import PrescriptionDetail from '../components/Patient/PrescriptionDetail';
import HealthAnalytics from '../components/Patient/HealthAnalytics';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileCard />;
      case 'prescriptions':
        if (selectedPrescription) {
          return (
            <PrescriptionDetail
              prescription={selectedPrescription}
              onBack={() => setSelectedPrescription(null)}
            />
          );
        }
        return (
          <PrescriptionsList
            onViewPrescription={setSelectedPrescription}
          />
        );
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

export default PatientDashboard;
