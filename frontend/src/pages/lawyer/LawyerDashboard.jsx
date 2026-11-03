import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, FileText, Calendar, Settings, Star, Users, Briefcase, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const links = [
  { to: '/lawyer', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/lawyer/cases', label: 'Cases', Icon: FileText },
  { to: '/lawyer/appointments', label: 'Appointments', Icon: Calendar },
  { to: '/lawyer/settings', label: 'Settings', Icon: Settings },
];

const aptColors = { pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-green-100 text-green-700', rejected:'bg-red-100 text-red-700', completed:'bg-blue-100 text-blue-700' };

export default function LawyerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/lawyers/dashboard').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout links={links} title="Dashboard"><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div></Layout>;

  const { stats, appointments, recentCases } = data || {};
  const pieData = [
    { name: 'Active', value: stats?.activeCases || 0, color: '#2847f5' },
    { name: 'Closed', value: stats?.closedCases || 0, color: '#10b981' },
  ];
  const barData = recentCases?.slice(0,5).map((c,i) => ({ name: `Case ${i+1}`, value: 1 })) || [];

  return (
    <Layout links={links} title="Lawyer Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Cases', value: stats?.totalCases || 0, Icon: Briefcase, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active Cases', value: stats?.activeCases || 0, Icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
          { label: 'Closed Cases', value: stats?.closedCases || 0, Icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Rating', value: (stats?.rating || 0).toFixed(1), Icon: Star, color: 'bg-amber-50 text-amber-600' },
          { label: 'Reviews', value: stats?.totalReviews || 0, Icon: Users, color: 'bg-pink-50 text-pink-600' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-4">Cases Overview</h2>
          {stats?.totalCases === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400">No cases yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex gap-4 justify-center mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ background: d.color }}></div>
                <span className="text-gray-600">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">Recent Appointments</h2>
            <Link to="/lawyer/appointments" className="text-primary-600 text-sm hover:underline flex items-center gap-1">All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {appointments?.length === 0 ? (
            <div className="text-center py-8 text-gray-400"><Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>No appointments</p></div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0,5).map(apt => (
                <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">{apt.clientId?.name?.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{apt.clientId?.name}</p>
                      <p className="text-gray-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(apt.date).toLocaleDateString()} · {apt.timeSlot}</p>
                    </div>
                  </div>
                  <span className={`badge-status text-xs ${aptColors[apt.status]}`}>{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Cases */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-gray-900">Recent Cases</h2>
          <Link to="/lawyer/cases" className="text-primary-600 text-sm hover:underline flex items-center gap-1">All Cases <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {recentCases?.length === 0 ? (
          <div className="text-center py-8 text-gray-400"><FileText className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>No cases yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-semibold">Case</th>
                <th className="pb-3 font-semibold">Client</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {recentCases.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="py-3"><Link to={`/lawyer/cases/${c._id}`} className="font-medium text-primary-600 hover:underline">{c.title}</Link></td>
                    <td className="py-3 text-gray-600">{c.clientId?.name}</td>
                    <td className="py-3 text-gray-600">{c.caseType}</td>
                    <td className="py-3"><span className={`badge-status text-xs px-2 py-1 rounded-full ${c.status === 'Won' ? 'bg-green-100 text-green-700' : c.status === 'Closed' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>{c.status}</span></td>
                    <td className="py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
