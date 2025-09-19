// src/components/Pharmacist/DispenseAnalytics.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Package } from 'lucide-react';
import { aggregateMonthly, countTop } from '../../utils/analytics';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function DispenseAnalytics() {
  const { API_BASE_URL } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDispenses: 0,
    totalMedicines: 0,
    monthlyData: [],
    topPatients: [],
    medicineTypes: [],
  });

  useEffect(() => {
    (async function load() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/pharmacy/prescriptions/dispensed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.records || [];
        setRecords(data);

        const totalDispenses = data.length;
        const totalMedicines = data.reduce((sum, rec) => sum + (rec.prescription?.medicineNames?.length || 0), 0);

        // Monthly: use record.createdAt or dispensedAt
        const monthlyData = aggregateMonthly(
          data,
          'createdAt',
          (rec) => rec.prescription?.medicineNames?.length || 0
        ); // [web:307]

        // Top patients by dispenses
        const topPatients = countTop(
          data,
          (rec) => (rec.patient?.name ? `${rec.patient.name} (${rec.patient.medTrackId || 'N/A'})` : 'Unknown'),
          5
        ).map((x) => ({ patient: x.key, dispenses: x.count })); // [web:302]

        // Medicine categories by dispensed items
        const medicineTypesMap = new Map();
        for (const rec of data) {
          for (const name of rec.prescription?.medicineNames || []) {
            const n = name.toLowerCase();
            let cat = 'Other';
            if (n.includes('amoxicillin') || n.includes('penicillin') || n.includes('antibiotic')) cat = 'Antibiotics';
            else if (n.includes('paracetamol') || n.includes('ibuprofen') || n.includes('pain')) cat = 'Pain Relief';
            else if (n.includes('vitamin') || n.includes('supplement')) cat = 'Vitamins';
            else if (n.includes('cough') || n.includes('cold')) cat = 'Respiratory';
            else if (n.includes('stomach') || n.includes('digestive')) cat = 'Digestive';
            medicineTypesMap.set(cat, (medicineTypesMap.get(cat) || 0) + 1);
          }
        }
        const medicineTypes = Array.from(medicineTypesMap.entries()).map(([name, value]) => ({ name, value }));

        setStats({ totalDispenses, totalMedicines, monthlyData, topPatients, medicineTypes });
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    })();
  }, [API_BASE_URL]);

  if (loading) return <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dispense Analytics</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Dispensed prescriptions and patient insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Dispenses" value={stats.totalDispenses} />
        <StatCard title="Total Medicines" value={stats.totalMedicines} />
        <StatCard title="Unique Patients" value={new Set(records.map((r) => r.patient?._id || r.patient)).size} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dispenses Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
              <Line type="monotone" dataKey="prescriptions" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Medicine Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={stats.medicineTypes} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                {stats.medicineTypes.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Patients</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topPatients}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="patient" stroke="#6B7280" hide />
            <YAxis stroke="#6B7280" />
            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px', color: '#F9FAFB' }} />
            <Bar dataKey="dispenses" fill="#10B981" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
          <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
      </div>
    </div>
  );
}
