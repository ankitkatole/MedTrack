import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Plus, Trash2, Search, FileText, Pill } from 'lucide-react';
import axios from 'axios';

const AddPrescriptionForm = () => {
  const { API_BASE_URL } = useAuth();
  const [step, setStep] = useState(1); // 1: Patient Search, 2: Prescription Form
  const [patient, setPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    visitReason: '',
    diagnosis: '',
    notes: '',
    medicines: {
      names: [''],
      dosages: [''],
      frequencies: [''],
      routes: [''],
      durationDays: [''],
      instructions: [''],
    },
  });

  const searchPatient = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a MedTrack ID');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('🔍 Searching for patient with MedTrack ID:', searchTerm.trim());
      const response = await axios.get(`${API_BASE_URL}/doctor/patient/${searchTerm.trim()}`);
      console.log('✅ Patient found:', response.data);
      setPatient(response.data);
      setStep(2);
    } catch (error) {
      console.error('❌ Patient search failed:', error.response?.data || error.message);
      setError('Patient not found. Please check the MedTrack ID.');
    } finally {
      setLoading(false);
    }
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: {
        names: [...formData.medicines.names, ''],
        dosages: [...formData.medicines.dosages, ''],
        frequencies: [...formData.medicines.frequencies, ''],
        routes: [...formData.medicines.routes, ''],
        durationDays: [...formData.medicines.durationDays, ''],
        instructions: [...formData.medicines.instructions, ''],
      },
    });
  };

  const removeMedicine = (index) => {
    if (formData.medicines.names.length > 1) {
      setFormData({
        ...formData,
        medicines: {
          names: formData.medicines.names.filter((_, i) => i !== index),
          dosages: formData.medicines.dosages.filter((_, i) => i !== index),
          frequencies: formData.medicines.frequencies.filter((_, i) => i !== index),
          routes: formData.medicines.routes.filter((_, i) => i !== index),
          durationDays: formData.medicines.durationDays.filter((_, i) => i !== index),
          instructions: formData.medicines.instructions.filter((_, i) => i !== index),
        },
      });
    }
  };

  const updateMedicine = (index, field, value) => {
    const newMedicines = { ...formData.medicines };
    newMedicines[field][index] = value;
    setFormData({ ...formData, medicines: newMedicines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Filter out empty medicines
      const validMedicines = formData.medicines.names
        .map((name, index) => ({
          name,
          dosage: formData.medicines.dosages[index],
          frequency: formData.medicines.frequencies[index],
          route: formData.medicines.routes[index],
          durationDays: formData.medicines.durationDays[index],
          instructions: formData.medicines.instructions[index],
        }))
        .filter(med => med.name.trim());

      const prescriptionData = {
        patientMedTrackId: patient.medTrackId,
        visitReason: formData.visitReason,
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        medicines: {
          names: validMedicines.map(m => m.name),
          dosages: validMedicines.map(m => m.dosage),
          frequencies: validMedicines.map(m => m.frequency),
          routes: validMedicines.map(m => m.route),
          durationDays: validMedicines.map(m => parseInt(m.durationDays) || 0),
          instructions: validMedicines.map(m => m.instructions),
        },
      };

      console.log('💊 Creating prescription:', prescriptionData);
      const response = await axios.post(`${API_BASE_URL}/doctor/prescriptions`, prescriptionData);
      console.log('✅ Prescription created successfully:', response.data);
      setSuccess('Prescription created successfully!');
      
      // Reset form
      setFormData({
        visitReason: '',
        diagnosis: '',
        notes: '',
        medicines: {
          names: [''],
          dosages: [''],
          frequencies: [''],
          routes: [''],
          durationDays: [''],
          instructions: [''],
        },
      });
      setPatient(null);
      setStep(1);
      setSearchTerm('');
    } catch (error) {
      console.error('❌ Prescription creation failed:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
    setPatient(null);
    setSearchTerm('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Prescription
        </h2>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {step === 1 ? (
        // Patient Search Step
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Find Patient
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the patient's MedTrack ID to continue
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                MedTrack ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter MedTrack ID (e.g., MT-20241201-ABC123)"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <button
              onClick={searchPatient}
              disabled={loading || !searchTerm.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Searching...' : 'Find Patient'}
            </button>
          </div>
        </div>
      ) : (
        // Prescription Form Step
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-medium text-gray-900 dark:text-white">Patient Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name: </span>
                <span className="text-gray-900 dark:text-white font-medium">{patient.name}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">MedTrack ID: </span>
                <span className="text-gray-900 dark:text-white font-medium font-mono">{patient.medTrackId}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Email: </span>
                <span className="text-gray-900 dark:text-white">{patient.email}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Phone: </span>
                <span className="text-gray-900 dark:text-white">{patient.phone}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={goBack}
              className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              ← Change Patient
            </button>
          </div>

          {/* Visit Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Visit Reason
              </label>
              <input
                type="text"
                value={formData.visitReason}
                onChange={(e) => setFormData({ ...formData, visitReason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Routine checkup, fever, headache"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Diagnosis
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., Common cold, Hypertension"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Doctor's Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Additional notes or instructions..."
              />
            </div>
          </div>

          {/* Medicines */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medicines</h3>
              <button
                type="button"
                onClick={addMedicine}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.medicines.names.map((_, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Medicine {index + 1}
                      </span>
                    </div>
                    {formData.medicines.names.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        value={formData.medicines.names[index]}
                        onChange={(e) => updateMedicine(index, 'names', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Paracetamol"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={formData.medicines.dosages[index]}
                        onChange={(e) => updateMedicine(index, 'dosages', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., 500mg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={formData.medicines.frequencies[index]}
                        onChange={(e) => updateMedicine(index, 'frequencies', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., 1-0-1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Route
                      </label>
                      <input
                        type="text"
                        value={formData.medicines.routes[index]}
                        onChange={(e) => updateMedicine(index, 'routes', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., Oral"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Duration (days)
                      </label>
                      <input
                        type="number"
                        value={formData.medicines.durationDays[index]}
                        onChange={(e) => updateMedicine(index, 'durationDays', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., 7"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Instructions
                      </label>
                      <input
                        type="text"
                        value={formData.medicines.instructions[index]}
                        onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., After food"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={goBack}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Creating Prescription...' : 'Create Prescription'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddPrescriptionForm;
