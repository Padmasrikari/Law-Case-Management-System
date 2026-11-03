import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, FileText, Calendar, Settings, Plus, Trash2, Save } from 'lucide-react';

const links = [
  { to: '/lawyer', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/lawyer/cases', label: 'Cases', Icon: FileText },
  { to: '/lawyer/appointments', label: 'Appointments', Icon: Calendar },
  { to: '/lawyer/settings', label: 'Settings', Icon: Settings },
];

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function LawyerSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ specialization:'', experience:'', bio:'', consultationFee:'', location:'', education:'', barNumber:'' });
  const [slots, setSlots] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/lawyers/${user._id}`).then(r => {
      if (r.data.profile) {
        const p = r.data.profile;
        setProfile({ specialization:p.specialization||'', experience:p.experience||'', bio:p.bio||'', consultationFee:p.consultationFee||'', location:p.location||'', education:p.education||'', barNumber:p.barNumber||'' });
        setSlots(p.timeSlots || []);
      }
    }).catch(() => {});
  }, []);

  const addSlot = () => setSlots([...slots, { day:'Monday', startTime:'09:00 AM', endTime:'05:00 PM', isAvailable:true }]);
  const removeSlot = (i) => setSlots(slots.filter((_,idx)=>idx!==i));
  const updateSlot = (i, field, val) => setSlots(slots.map((s,idx)=>idx===i?{...s,[field]:val}:s));

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/lawyers/profile', profile);
      await api.put('/lawyers/timeslots', { timeSlots: slots });
      toast.success('Profile updated!');
    } catch (err) { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const inp = (key) => ({ value: profile[key], onChange: e => setProfile({...profile, [key]: e.target.value}) });

  const specializations = ['Criminal Law','Civil Law','Family Law','Corporate Law','Real Estate Law','Immigration Law','Intellectual Property','Tax Law','Labor Law','Constitutional Law','Environmental Law','Cyber Law'];

  return (
    <Layout links={links} title="Profile Settings">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card p-6">
          <h2 className="font-display text-xl font-bold text-gray-900 mb-5">Professional Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
              <select {...inp('specialization')} className="input-field">
                {specializations.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
              <input type="number" {...inp('experience')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Consultation Fee (₹)</label>
              <input type="number" {...inp('consultationFee')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input placeholder="City, State" {...inp('location')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Education</label>
              <input placeholder="LLB, NLU Delhi" {...inp('education')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bar Number</label>
              <input placeholder="BAR-12345" {...inp('barNumber')} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
              <textarea {...inp('bio')} className="input-field resize-none" rows={4} placeholder="Tell clients about yourself..." />
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-bold text-gray-900">Available Time Slots</h2>
            <button onClick={addSlot} className="btn-secondary text-sm py-2"><Plus className="w-4 h-4" />Add Slot</button>
          </div>
          {slots.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-400">No slots yet. Add your availability.</p>
              <button onClick={addSlot} className="btn-primary mt-3 mx-auto"><Plus className="w-4 h-4" />Add First Slot</button>
            </div>
          ) : (
            <div className="space-y-3">
              {slots.map((slot, i) => (
                <div key={i} className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <select value={slot.day} onChange={e => updateSlot(i, 'day', e.target.value)} className="input-field flex-1 min-w-32 py-2">
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <input value={slot.startTime} onChange={e => updateSlot(i,'startTime',e.target.value)} className="input-field flex-1 min-w-24 py-2" placeholder="09:00 AM" />
                  <input value={slot.endTime} onChange={e => updateSlot(i,'endTime',e.target.value)} className="input-field flex-1 min-w-24 py-2" placeholder="05:00 PM" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={slot.isAvailable} onChange={e => updateSlot(i,'isAvailable',e.target.checked)} className="rounded" />
                    Available
                  </label>
                  <button onClick={() => removeSlot(i)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={saveProfile} disabled={saving} className="btn-primary w-full justify-center py-3">
          <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </Layout>
  );
}
