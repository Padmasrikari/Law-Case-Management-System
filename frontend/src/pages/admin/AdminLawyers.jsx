import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, Users, FileText, Scale, CheckCircle, XCircle, Shield, Clock, Eye, Briefcase } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/admin/lawyers', label: 'Lawyers', Icon: Scale },
  { to: '/admin/users', label: 'Users', Icon: Users },
  { to: '/admin/cases', label: 'Cases', Icon: FileText },
];

export default function AdminLawyers() {
  const [pending, setPending] = useState([]);
  const [allLawyers, setAllLawyers] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, aRes] = await Promise.all([
        api.get('/admin/pending-lawyers'),
        api.get('/admin/users', { params: { role: 'lawyer' } })
      ]);
      setPending(pRes.data);
      setAllLawyers(aRes.data.users?.filter(u => u.status === 'active') || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      await api.put(`/admin/approve-lawyer/${id}`);
      toast.success('Lawyer approved!');
      setSelectedLawyer(null);
      load();
    } catch { toast.error('Failed'); }
  };

  const reject = async (id) => {
    try {
      await api.put(`/admin/reject-lawyer/${id}`);
      toast.success('Lawyer rejected');
      setSelectedLawyer(null);
      load();
    } catch { toast.error('Failed'); }
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <Layout links={links} title="Lawyer Management">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('pending')} className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${tab === 'pending' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
          Pending Approval {pending.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending.length}</span>}
        </button>
        <button onClick={() => setTab('active')} className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${tab === 'active' ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
          Active Lawyers ({allLawyers.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>
      ) : tab === 'pending' ? (
        pending.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30 text-green-500" />
            <p className="text-xl font-semibold">All caught up!</p>
            <p className="mt-2">No pending lawyer approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((item) => {
              const { user, profile } = item;
              return (
                <div key={user._id} className="card p-6 border-l-4 border-amber-400 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                        {profile && (
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{profile.specialization}</span>
                            <span>{profile.experience} yrs exp.</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedLawyer(item)} className="flex items-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-xl font-medium text-sm transition-all">
                        <Eye className="w-4 h-4" /> View Profile & Review
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allLawyers.length === 0 ? (
            <div className="col-span-3 text-center py-20 text-gray-400">
              <Scale className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No active lawyers yet</p>
            </div>
          ) : allLawyers.map(lawyer => (
            <div key={lawyer._id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  {lawyer.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{lawyer.name}</h3>
                    <span className="badge-verified text-xs"><Shield className="w-3 h-3" />Active</span>
                  </div>
                  <p className="text-gray-500 text-sm">{lawyer.email}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">Joined: {new Date(lawyer.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Profile Review Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-900">Review Lawyer Profile</h2>
              <button onClick={() => setSelectedLawyer(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <XCircle className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {selectedLawyer.user.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{selectedLawyer.user.name}</h3>
                  <p className="text-gray-500 text-lg">{selectedLawyer.user.email}</p>
                  <p className="text-gray-500">Phone: {selectedLawyer.user.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Specialization</p>
                  <p className="text-gray-900 font-semibold flex items-center gap-2 text-lg">
                    <Briefcase className="w-5 h-5 text-primary-500" /> {selectedLawyer.profile?.specialization}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Experience</p>
                  <p className="text-gray-900 font-semibold flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-primary-500" /> {selectedLawyer.profile?.experience} Years
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-gray-900 font-semibold text-lg">{selectedLawyer.profile?.location || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Consultation Fee</p>
                  <p className="text-gray-900 font-semibold text-lg">₹{selectedLawyer.profile?.consultationFee || 0}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Professional Bio</p>
                <div className="bg-primary-50/50 p-5 rounded-2xl border border-primary-100 italic text-gray-700 leading-relaxed">
                  "{selectedLawyer.profile?.bio || 'No bio provided'}"
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Verification Documents</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedLawyer.profile?.documents && Object.entries(selectedLawyer.profile.documents).map(([key, doc]) => (
                    doc && (
                      <a key={key} href={`${API_URL}${doc.url}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-primary-400 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate w-32 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="text-xs text-gray-500 truncate w-32">{doc.name}</p>
                          </div>
                        </div>
                        <Eye className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-4">
              <button onClick={() => approve(selectedLawyer.user._id)} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 transition-all active:scale-[0.98]">
                <CheckCircle className="w-6 h-6" /> Approve Lawyer
              </button>
              <button onClick={() => reject(selectedLawyer.user._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 transition-all active:scale-[0.98]">
                <XCircle className="w-6 h-6" /> Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
