import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, Search, FileText, Calendar, Clock, CheckCircle } from 'lucide-react';

const links = [
  { to: '/client', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/client/lawyers', label: 'Find Lawyers', Icon: Search },
  { to: '/client/cases', label: 'My Cases', Icon: FileText },
];

const defaultSlots = ['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'];

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ date: '', timeSlot: '', reason: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/lawyers/${id}`).then(r => setProfile(r.data.profile));
  }, [id]);

  const availableSlots = profile?.timeSlots?.length > 0
    ? profile.timeSlots.filter(s => s.isAvailable).map(s => `${s.startTime} – ${s.endTime}`)
    : defaultSlots;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.timeSlot) { toast.error('Please select date and time'); return; }
    setLoading(true);
    try {
      await api.post('/appointments', { lawyerId: id, ...form });
      toast.success('Appointment booked successfully!');
      navigate('/client');
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed'); }
    finally { setLoading(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Layout links={links} title="Book Appointment">
      <div className="max-w-2xl mx-auto">
        {profile && (
          <div className="card p-5 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              {profile.userId?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{profile.userId?.name}</h2>
              <p className="text-primary-600 text-sm">{profile.specialization}</p>
              {profile.consultationFee > 0 && <p className="text-gray-500 text-sm">₹{profile.consultationFee} per session</p>}
            </div>
          </div>
        )}

        <div className="card p-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Schedule Your Consultation</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2"><Calendar className="w-4 h-4 inline mr-1" />Select Date</label>
              <input type="date" min={today} value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3"><Clock className="w-4 h-4 inline mr-1" />Select Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableSlots.map(slot => (
                  <button key={slot} type="button" onClick={() => setForm({...form, timeSlot: slot})}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all ${form.timeSlot === slot ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Consultation</label>
              <textarea value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
                placeholder="Briefly describe your legal issue..." className="input-field resize-none" rows={4} />
            </div>

            <button type="submit" disabled={loading || !form.date || !form.timeSlot} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" /> {loading ? 'Booking...' : 'Confirm Appointment'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
