import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, FileText, Calendar, Settings, Plus, Search, User, ChevronRight } from 'lucide-react';

const links = [
  { to: '/lawyer', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/lawyer/cases', label: 'Cases', Icon: FileText },
  { to: '/lawyer/appointments', label: 'Appointments', Icon: Calendar },
  { to: '/lawyer/settings', label: 'Settings', Icon: Settings },
];

const statusColors = {
  'Filed':'bg-blue-100 text-blue-700','In Progress':'bg-yellow-100 text-yellow-700',
  'Hearing':'bg-purple-100 text-purple-700','Closed':'bg-gray-100 text-gray-600',
  'Won':'bg-green-100 text-green-700','Lost':'bg-red-100 text-red-700'
};

export default function LawyerCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ clientEmail:'', title:'', description:'', caseType:'Criminal Law', court:'' });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/cases').then(r => setCases(r.data)).finally(() => setLoading(false));
  }, []);

  const createCase = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data: userData } = await api.get('/admin/users', { params: { role:'client' } }).catch(() => ({ data: { users: [] } }));
      // For demo: post with clientEmail
      const { data } = await api.post('/cases', form);
      setCases([data, ...cases]);
      setShowModal(false);
      toast.success('Case created!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create case'); }
    finally { setSubmitting(false); }
  };

  const filtered = cases.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.clientId?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout links={links} title="Case Management">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="w-4 h-4" />New Case</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl font-semibold">No cases yet</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-4 mx-auto"><Plus className="w-4 h-4" />Create First Case</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <Link to={`/lawyer/cases/${c._id}`} key={c._id} className="card p-5 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className={`badge-status text-xs ${statusColors[c.status]}`}>{c.status}</span>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{c.title}</h3>
              <p className="text-xs text-gray-400 mb-3">#{c.caseNumber?.slice(-8)}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" /> {c.clientId?.name || 'Unknown Client'}
              </div>
              <p className="text-xs text-gray-400 mt-2">{new Date(c.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="font-display text-2xl font-bold mb-6">New Case</h2>
            <form onSubmit={createCase} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Client ID</label>
                <input placeholder="Client User ID" value={form.clientEmail} onChange={e => setForm({...form, clientEmail: e.target.value, clientId: e.target.value})} className="input-field" required />
                <p className="text-xs text-gray-400 mt-1">Enter the client's User ID from the system</p>
              </div>
              <input placeholder="Case Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required />
              <select value={form.caseType} onChange={e => setForm({...form, caseType: e.target.value})} className="input-field">
                {['Criminal Law','Civil Law','Family Law','Corporate Law','Real Estate Law','Immigration Law'].map(t => <option key={t}>{t}</option>)}
              </select>
              <input placeholder="Court Name" value={form.court} onChange={e => setForm({...form, court: e.target.value})} className="input-field" />
              <textarea placeholder="Case Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field resize-none" rows={3} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50">
                  {submitting ? 'Creating...' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
