import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, Pill, Activity } from 'lucide-react';
import axios from 'axios';

const HealthAnalytics = () => {
  const { user, API_BASE_URL } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalPrescriptions: 0,
    totalMedicines: 0,
    monthlyData: [],
    medicineTypes: [],
    doctorVisits: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/user/prescriptions`);
      const prescriptionsData = response.data.prescriptions || [];
      setPrescriptions(prescriptionsData);
      
      // Process analytics data
      const processedAnalytics = processAnalyticsData(prescriptionsData);
      setAnalytics(processedAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (prescriptions) => {
    const totalPrescriptions = prescriptions.length;
    const totalMedicines = prescriptions.reduce((sum, rx) => sum + (rx.medicineNames?.length || 0), 0);

    // Monthly data for prescriptions
    const monthlyData = prescriptions.reduce((acc, rx) => {
      const month = new Date(rx.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.prescriptions += 1;
        existing.medicines += rx.medicineNames?.length || 0;
      } else {
        acc.push({ month, prescriptions: 1, medicines: rx.medicineNames?.length || 0 });
      }
      return acc;
    }, []).sort((a, b) => new Date(a.month) - new Date(b.month));

    // Medicine types (simplified categorization)
    const medicineTypes = prescriptions.reduce((acc, rx) => {
      rx.medicineNames?.forEach(medicine => {
        const category = categorizeMedicine(medicine);
        const existing = acc.find(item => item.name === category);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: category, value: 1 });
        }
      });
      return acc;
    }, []);

    // Doctor visits
    const doctorVisits = prescriptions.reduce((acc, rx) => {
      const doctorName = rx.doctor?.name || 'Unknown Doctor';
      const existing = acc.find(item => item.doctor === doctorName);
      if (existing) {
        existing.visits += 1;
      } else {
        acc.push({ doctor: doctorName, visits: 1 });
      }
      return acc;
    }, []).sort((a, b) => b.visits - a.visits).slice(0, 5);

    return {
      totalPrescriptions,
      totalMedicines,
      monthlyData,
      medicineTypes,
      doctorVisits,
    };
  };

  const categorizeMedicine = (medicineName) => {
    const name = medicineName.toLowerCase();
    if (name.includes('antibiotic') || name.includes('amoxicillin') || name.includes('penicillin')) {
      return 'Antibiotics';
    } else if (name.includes('pain') || name.includes('paracetamol') || name.includes('ibuprofen')) {
      return 'Pain Relief';
    } else if (name.includes('vitamin') || name.includes('supplement')) {
      return 'Vitamins';
    } else if (name.includes('cough') || name.includes('cold')) {
      return 'Respiratory';
    } else if (name.includes('stomach') || name.includes('digestive')) {
      return 'Digestive';
    } else {
      return 'Other';
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Health Analytics
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Insights into your medical history and prescription patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Prescriptions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalPrescriptions}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Medicines</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalMedicines}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Medicines/Rx</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalPrescriptions > 0 
                  ? (analytics.totalMedicines / analytics.totalPrescriptions).toFixed(1)
                  : '0'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Doctors</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.doctorVisits.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Prescriptions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Prescriptions Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="prescriptions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Medicine Types */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Medicine Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.medicineTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.medicineTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Doctor Visits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Doctor Visits
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.doctorVisits}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="doctor" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }} 
            />
            <Bar dataKey="visits" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthAnalytics;
