import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { LayoutDashboard, Search, Calendar, FileText, Star, Clock, CheckCircle, AlertCircle, ArrowRight, Users } from 'lucide-react';

const links = [
  { to: '/client', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/client/lawyers', label: 'Find Lawyers', Icon: Search },
  { to: '/client/cases', label: 'My Cases', Icon: FileText },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-600'
};

export default function ClientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/appointments/client').then(r => setAppointments(r.data)),
      api.get('/cases').then(r => setCases(r.data))
    ]).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Appointments', value: appointments.length, Icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Cases', value: cases.filter(c => !['Closed','Won','Lost'].includes(c.status)).length, Icon: FileText, color: 'bg-purple-50 text-purple-600' },
    { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, Icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, Icon: Clock, color: 'bg-amber-50 text-amber-600' },
  ];

  if (loading) return <Layout links={links} title="Dashboard"><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div></Layout>;

  return (
    <Layout links={links} title="Client Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-gray-900">Recent Appointments</h2>
            <Link to="/client/lawyers" className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1">Book New <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No appointments yet</p>
              <Link to="/client/lawyers" className="text-primary-600 text-sm mt-2 block hover:underline">Find a lawyer →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map(apt => (
                <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{apt.lawyerId?.name || 'Lawyer'}</p>
                    <p className="text-gray-500 text-xs">{new Date(apt.date).toLocaleDateString()} · {apt.timeSlot}</p>
                  </div>
                  <span className={`badge-status ${statusColors[apt.status]}`}>{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Cases */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-gray-900">My Cases</h2>
            <Link to="/client/cases" className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {cases.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No cases assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cases.slice(0,5).map(c => (
                <div key={c._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{c.title}</p>
                    <p className="text-gray-500 text-xs">#{c.caseNumber?.slice(-8)} · {c.lawyerId?.name}</p>
                  </div>
                  <span className={`badge-status text-xs px-2 py-1 rounded-full font-semibold ${c.status === 'Closed' || c.status === 'Won' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{c.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-bold mb-1">Need Legal Help?</h3>
          <p className="text-primary-200 text-sm">Browse our verified lawyers and book a consultation today.</p>
        </div>
        <Link to="/client/lawyers" className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all flex items-center gap-2 whitespace-nowrap">
          <Users className="w-4 h-4" /> Find Lawyers
        </Link>
      </div>
    </Layout>
  );
}
