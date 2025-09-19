import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  FileText, 
  LogOut, 
  Moon, 
  Sun, 
  BarChart3,
  Stethoscope,
  Pill,
  UserCheck
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout, darkMode, toggleDarkMode } = useAuth();

  const getRoleIcon = (role) => {
    switch (role) {
      case 'DOCTOR':
        return <Stethoscope className="w-5 h-5" />;
      case 'PHARMACIST':
        return <Pill className="w-5 h-5" />;
      case 'PATIENT':
        return <UserCheck className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'DOCTOR':
        return 'text-blue-400';
      case 'PHARMACIST':
        return 'text-green-400';
      case 'PATIENT':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'PATIENT':
        return [
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'prescriptions', label: 'My Prescriptions', icon: FileText },
          { id: 'analytics', label: 'Health Analytics', icon: BarChart3 },
        ];
      case 'DOCTOR':
        return [
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'prescriptions', label: 'My Prescriptions', icon: FileText },
          { id: 'add-prescription', label: 'Add Prescription', icon: FileText },
        ];
      case 'PHARMACIST':
        return [
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'dispensed', label: 'Dispensed Medicines', icon: FileText },
          { id: 'patient-search', label: 'Patient Search', icon: UserCheck },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="w-64 bg-gray-900 dark:bg-gray-800 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">MedTrack</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-gray-300" />}
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {getRoleIcon(user?.role)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className={`text-xs ${getRoleColor(user?.role)} truncate`}>
              {user?.role}
            </p>
            <p className="text-xs text-gray-400 truncate">ID: {user?.medTrackId}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {getNavigationItems().map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
