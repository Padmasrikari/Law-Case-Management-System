import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { LayoutDashboard, Users, FileText, Scale, Shield, TrendingUp, Clock, CheckCircle, XCircle, ArrowRight, AlertTriangle, DownloadCloud } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/admin/lawyers', label: 'Lawyers', Icon: Scale },
  { to: '/admin/users', label: 'Users', Icon: Users },
  { to: '/admin/cases', label: 'Cases', Icon: FileText },
];

const COLORS = ['#2847f5','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ caseStats: [], locationStats: [], lawyerPerformance: [], monthlyGrowth: [] });

  const fetchData = async () => {
    try {
      const [dbRes, csRes, lsRes, lpRes, mgRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/case-stats'),
        api.get('/admin/location-stats'),
        api.get('/admin/lawyer-performance'),
        api.get('/admin/monthly-growth')
      ]);
      setData(dbRes.data);
      setAnalytics({
        caseStats: csRes.data.map((d, i) => ({ name: d._id || 'General', value: d.count, color: COLORS[i % COLORS.length] })),
        locationStats: lsRes.data.map(d => ({ name: d._id || 'Unknown', count: d.count })),
        lawyerPerformance: lpRes.data,
        monthlyGrowth: mgRes.data
      });
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePreload = async () => {
    if(!window.confirm('Preload 10 lawyers from Andhra Pradesh?')) return;
    try {
      const res = await api.post('/admin/preload-lawyers');
      toast.success(res.data.message);
      fetchData(); // refresh dashboard
    } catch (err) {
      toast.error(err.response?.data?.message || 'Preload failed');
    }
  };

  if (loading) return <Layout links={links} title="Admin Dashboard"><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div></Layout>;

  const { stats, casesByStatus, recentCases, recentUsers } = data || {};
  const pieData = casesByStatus?.map((c, i) => ({ name: c._id, value: c.count, color: COLORS[i % COLORS.length] })) || [];
  const barData = [
    { name: 'Lawyers', value: stats?.totalLawyers || 0 },
    { name: 'Clients', value: stats?.totalClients || 0 },
    { name: 'Cases', value: stats?.totalCases || 0 },
    { name: 'Appointments', value: stats?.totalAppointments || 0 },
  ];

  return (
    <Layout links={links} title="Admin Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Lawyers', value: stats?.totalLawyers || 0, Icon: Scale, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Clients', value: stats?.totalClients || 0, Icon: Users, color: 'bg-purple-50 text-purple-600' },
          { label: 'Total Cases', value: stats?.totalCases || 0, Icon: FileText, color: 'bg-green-50 text-green-600' },
          { label: 'Appointments', value: stats?.totalAppointments || 0, Icon: Clock, color: 'bg-amber-50 text-amber-600' },
          { label: 'Pending Lawyers', value: stats?.pendingLawyers || 0, Icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending Alert & Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {stats?.pendingLawyers > 0 && (
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <p className="text-amber-800 font-medium">{stats.pendingLawyers} lawyer(s) awaiting approval</p>
            </div>
            <Link to="/admin/lawyers" className="text-amber-700 font-semibold text-sm hover:underline flex items-center gap-1">Review <ArrowRight className="w-4 h-4" /></Link>
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-sm flex-1 md:flex-none">
          <p className="text-gray-700 font-medium mr-4">Quick Actions</p>
          <button onClick={handlePreload} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
            <DownloadCloud className="w-4 h-4" /> Preload Lawyers
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Cases By Type */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Cases by Type</h2>
          {analytics.caseStats.length === 0 ? <p className="text-gray-400 text-sm text-center py-10">No cases yet</p> :
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={analytics.caseStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {analytics.caseStats.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
          }
        </div>

        {/* Cases by Location */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Cases by Location</h2>
          {analytics.locationStats.length === 0 ? <p className="text-gray-400 text-sm text-center py-10">No lawyers yet</p> :
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.locationStats} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
          }
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Case Growth */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Monthly Case Growth</h2>
          {analytics.monthlyGrowth.length === 0 ? <p className="text-gray-400 text-sm text-center py-10">No cases yet</p> :
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
          }
        </div>

        {/* Lawyer Performance */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Lawyer Performance</h2>
          {analytics.lawyerPerformance.length === 0 ? <p className="text-gray-400 text-sm text-center py-10">No cases yet</p> :
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.lawyerPerformance.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" name="Active Cases" stackId="a" fill="#3b82f6" barSize={30} />
              <Bar dataKey="closed" name="Closed Cases" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          }
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">Recent Cases</h2>
            <Link to="/admin/cases" className="text-primary-600 text-sm hover:underline flex items-center gap-1">All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-3">
            {recentCases?.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">No cases yet</p> :
              recentCases?.slice(0,5).map(c => (
                <div key={c._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{c.title}</p>
                    <p className="text-gray-500 text-xs">{c.clientId?.name} → {c.lawyerId?.name}</p>
                  </div>
                  <span className="badge-status text-xs bg-blue-100 text-blue-700">{c.status}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Recent Users */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">Recent Users</h2>
            <Link to="/admin/users" className="text-primary-600 text-sm hover:underline flex items-center gap-1">All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-3">
            {recentUsers?.length === 0 ? <p className="text-gray-400 text-sm text-center py-6">No users yet</p> :
              recentUsers?.slice(0,5).map(u => (
                <div key={u._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${u.role === 'lawyer' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{u.name}</p>
                    <p className="text-gray-500 text-xs capitalize">{u.role} · {u.status}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700' : u.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </Layout>
  );
}
