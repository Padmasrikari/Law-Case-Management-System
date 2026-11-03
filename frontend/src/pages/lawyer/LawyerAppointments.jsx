import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, FileText, Calendar, Settings, CheckCircle, XCircle, Clock, User } from 'lucide-react';

const links = [
  { to: '/lawyer', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/lawyer/cases', label: 'Cases', Icon: FileText },
  { to: '/lawyer/appointments', label: 'Appointments', Icon: Calendar },
  { to: '/lawyer/settings', label: 'Settings', Icon: Settings },
];

const statusColors = { pending:'bg-yellow-100 text-yellow-700 border-yellow-200', confirmed:'bg-green-100 text-green-700 border-green-200', rejected:'bg-red-100 text-red-700 border-red-200', completed:'bg-blue-100 text-blue-700 border-blue-200', cancelled:'bg-gray-100 text-gray-600 border-gray-200' };

export default function LawyerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/appointments/lawyer').then(r => setAppointments(r.data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? {...a, status} : a));
      toast.success(`Appointment ${status}`);
    } catch (err) { toast.error('Failed to update'); }
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <Layout links={links} title="Appointments">
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all','pending','confirmed','completed','rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filter===f?'bg-primary-600 text-white':'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'}`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>No appointments</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(apt => (
            <div key={apt._id} className={`card p-5 border ${statusColors[apt.status]?.split(' ').slice(-1)[0] || 'border-gray-100'}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 font-bold text-lg flex-shrink-0">
                    {apt.clientId?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{apt.clientId?.name}</h3>
                    <p className="text-gray-500 text-sm">{apt.clientId?.email}</p>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(apt.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{apt.timeSlot}</span>
                    </div>
                    {apt.reason && <p className="text-gray-500 text-sm mt-1 italic">"{apt.reason}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge-status text-xs ${statusColors[apt.status]}`}>{apt.status}</span>
                  {apt.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(apt._id, 'confirmed')} className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-green-600 transition-all">
                        <CheckCircle className="w-4 h-4" /> Confirm
                      </button>
                      <button onClick={() => updateStatus(apt._id, 'rejected')} className="flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-red-600 transition-all">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  )}
                  {apt.status === 'confirmed' && (
                    <button onClick={() => updateStatus(apt._id, 'completed')} className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-all">
                      <CheckCircle className="w-4 h-4" /> Mark Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
