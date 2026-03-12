import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  CreditCard, 
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CareAgentDashboard = () => {
  const [stats] = useState({
    totalPatients: 124,
    activeAlerts: 5,
    pendingPayments: 12,
    deliveriesInTransit: 8
  });

  useEffect(() => {
    // In the future, this is where we would fetch real stats from the API
    // api.get('/api/care-agent/stats').then(res => setStats(res.data));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Care Command Center</h1>
          <p className="text-gray-500 mt-1">Coordination hub for patient care and field logistics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/dashboard/field-users/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-200"
          >
            <UserPlus size={18} />
            <span>Proxy Register</span>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: stats.totalPatients, icon: <Users className="text-blue-600" />, color: 'bg-blue-50' },
          { label: 'Active Alerts', value: stats.activeAlerts, icon: <Activity className="text-red-600" />, color: 'bg-red-50' },
          { label: 'Pending Payments', value: stats.pendingPayments, icon: <CreditCard className="text-amber-600" />, color: 'bg-amber-50' },
          { label: 'In Transit', value: stats.deliveriesInTransit, icon: <Activity className="text-green-600" />, color: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Urgent Alerts Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-black">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold">Active Patient Alerts</h2>
              <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
            </div>
            <div className="p-0">
              {/* Dummy Alerts */}
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-6 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                      <Activity size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Mrs. Adebayo (Elderly)</h4>
                      <p className="text-sm text-gray-500">Critical Blood Pressure flag: 160/95 mmHg</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">HIGH RISK</span>
                    <button className="text-sm text-indigo-600 font-semibold">Triage Patient</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shortcuts & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-indigo-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold">Field Tools</h3>
              <p className="text-indigo-200 text-sm">Collect payments or register new users directly from the field agent toolkit.</p>
              <div className="grid grid-cols-1 gap-3 pt-2">
                <Link to="/dashboard/payments" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center gap-3 transition-colors">
                  <CreditCard size={20} />
                  <span>Wallet Funding</span>
                </Link>
                <Link to="/dashboard/field-users/new" className="bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center gap-3 transition-colors">
                  <UserPlus size={20} />
                  <span>New Proxy Register</span>
                </Link>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-black">
            <h3 className="text-lg font-bold mb-4">Network Status</h3>
            <div className="space-y-4">
              {[
                  { name: 'City Central Pharmacy', status: 'Online', color: 'bg-green-500' },
                  { name: 'St. Mary\'s Lab', status: 'Busy', color: 'bg-amber-500' },
                  { name: 'Logistics Fleet A', status: '7 Active', color: 'bg-blue-500' }
              ].map((provider, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{provider.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${provider.color}`}></div>
                    <span className="text-xs font-medium text-gray-500">{provider.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareAgentDashboard;
