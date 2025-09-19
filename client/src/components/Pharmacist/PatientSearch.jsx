import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, User, FileText, Eye, CheckCircle, X, Calendar, Clock } from 'lucide-react';
import axios from 'axios';

const PatientSearch = () => {
  const { API_BASE_URL } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [dispensing, setDispensing] = useState(false);
  const [remarks, setRemarks] = useState('');

  const searchPatient = async () => {
    if (!searchTerm.trim()) { setError('Please enter a MedTrack ID'); return; }
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token'); // or from context
      const res = await axios.get(`${API_BASE_URL}/pharmacy/prescriptions/patient/${searchTerm.trim()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatient(res.data.patient || null); // set from top-level patient
      setPrescriptions(res.data.prescriptions || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Patient not found or no prescriptions available.');
      setPatient(null);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };


  const dispensePrescription = async (prescriptionId) => {
    try {
      setDispensing(true);
      console.log('💊 Dispensing prescription:', prescriptionId);
      const response = await axios.post(`${API_BASE_URL}/pharmacy/dispense/${prescriptionId}`, {
        remarks: remarks || undefined,
      });
      console.log('✅ Prescription dispensed successfully:', response.data);
      setError('');
      setRemarks('');
      setSelectedPrescription(null);
      // Refresh prescriptions
      searchPatient();
    } catch (error) {
      console.error('❌ Dispense failed:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to dispense prescription');
    } finally {
      setDispensing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (prescription) => {
    if (prescription.dispenseDate) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  const getStatusText = (prescription) => {
    if (prescription.dispenseDate) {
      return 'Dispensed';
    }
    return 'Pending';
  };

  const resetSearch = () => {
    setSearchTerm('');
    setPatient(null);
    setPrescriptions([]);
    setSelectedPrescription(null);
    setError('');
    setRemarks('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Patient Search
        </h2>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Search Form */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter patient's MedTrack ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={searchPatient}
            disabled={loading || !searchTerm.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {patient && (
            <button
              onClick={resetSearch}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Patient Info */}
      {patient && (
        <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium text-gray-900 dark:text-white">Patient Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Name: </span>
              <span className="text-gray-900 dark:text-white font-medium">{patient.name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">MedTrack ID: </span>
              <span className="text-gray-900 dark:text-white font-medium font-mono">{patient.medTrackId || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Email: </span>
              <span className="text-gray-900 dark:text-white">{patient.email || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Phone: </span>
              <span className="text-gray-900 dark:text-white">{patient.phone || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions List */}
      {prescriptions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Available Prescriptions ({prescriptions.length})
          </h3>
          <div className="space-y-4">
            {prescriptions.map((prescription) => {
              if (!prescription || !prescription._id) {
                return null; // Skip invalid prescriptions
              }

              return (
                <div
                  key={prescription._id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {prescription.diagnosis || 'Prescription'}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            prescription
                          )}`}
                        >
                          {getStatusText(prescription)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Issued: {prescription.issueDate ? formatDate(prescription.issueDate) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{prescription.medicineNames?.length || 0} medicines</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedPrescription(prescription)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {!prescription.dispenseDate && (
                        <button
                          onClick={() => setSelectedPrescription(prescription)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Dispense
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Dispense Prescription
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Diagnosis:</strong> {selectedPrescription?.diagnosis || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Medicines:</strong> {selectedPrescription?.medicineNames?.length || 0}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dispense Remarks (Optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Any additional notes about the dispense..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedPrescription(null);
                  setRemarks('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedPrescription?._id && dispensePrescription(selectedPrescription._id)}
                disabled={dispensing || !selectedPrescription?._id}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {dispensing ? 'Dispensing...' : 'Confirm Dispense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
