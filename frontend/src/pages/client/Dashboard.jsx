import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';
import { Calendar, FileText, Scale, ArrowRight, Clock } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/clients/dashboard').then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 mt-1">Here's an overview of your legal matters.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'Total Cases', value: data?.stats?.totalCases || 0, icon: FileText, color: 'bg-blue-50 text-blue-600', link: '/client/cases' },
            { label: 'Active Cases', value: data?.stats?.activeCases || 0, icon: Scale, color: 'bg-primary-50 text-primary-600', link: '/client/cases' },
            { label: 'Appointments', value: data?.stats?.totalAppointments || 0, icon: Calendar, color: 'bg-emerald-50 text-emerald-600', link: '/client/appointments' },
          ].map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <p className="font-display text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
              <Link to="/client/appointments" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
            </div>
            {data?.upcomingAppointments?.length > 0 ? (
              <div className="space-y-3">
                {data.upcomingAppointments.map(appt => (
                  <div key={appt._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                      {appt.lawyerId?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{appt.lawyerId?.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={11} /> {new Date(appt.date).toLocaleDateString()} · {appt.timeSlot}</p>
                    </div>
                    <StatusBadge status={appt.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No upcoming appointments</p>
                <Link to="/lawyers" className="text-primary-600 text-sm font-medium hover:underline mt-2 inline-block">Find a lawyer</Link>
              </div>
            )}
          </div>

          {/* Recent Cases */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-lg font-semibold text-gray-900">Recent Cases</h2>
              <Link to="/client/cases" className="text-sm text-primary-600 hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
            </div>
            {data?.recentCases?.length > 0 ? (
              <div className="space-y-3">
                {data.recentCases.map(c => (
                  <div key={c._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><FileText size={16} className="text-blue-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{c.title}</p>
                      <p className="text-xs text-gray-500">#{c.caseNumber}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No cases yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-gradient-to-r from-primary-600 to-primary-800 border-0 text-white">
          <h2 className="font-display text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/lawyers" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
              <Scale size={16} /> Find a Lawyer
            </Link>
            <Link to="/client/appointments" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
              <Calendar size={16} /> My Appointments
            </Link>
            <Link to="/client/cases" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
              <FileText size={16} /> Track Cases
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
