import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, Users, FileText, Scale, Ban, Trash2, Search, Filter } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/admin/lawyers', label: 'Lawyers', Icon: Scale },
  { to: '/admin/users', label: 'Users', Icon: Users },
  { to: '/admin/cases', label: 'Cases', Icon: FileText },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { role, limit: 100 } });
      setUsers(data.users || []);
    } catch { console.error('Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [role]);

  const blockUser = async (id) => {
    if (!confirm('Block this user?')) return;
    try { await api.put(`/admin/block-user/${id}`); toast.success('User blocked'); load(); }
    catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Permanently delete this user?')) return;
    try { await api.delete(`/admin/user/${id}`); toast.success('User deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = { active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', blocked: 'bg-red-100 text-red-700' };
  const roleStyle = { client: 'bg-blue-100 text-blue-700', lawyer: 'bg-purple-100 text-purple-700', admin: 'bg-gray-100 text-gray-700' };

  return (
    <Layout links={links} title="User Management">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={role} onChange={e => setRole(e.target.value)} className="input-field w-auto min-w-36">
          <option value="">All Roles</option>
          <option value="client">Clients</option>
          <option value="lawyer">Lawyers</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No users found</td></tr>
                ) : filtered.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.role === 'lawyer' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                          {user.name?.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${roleStyle[user.role]}`}>{user.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[user.status]}`}>{user.status}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {user.status !== 'blocked' && (
                          <button onClick={() => blockUser(user._id)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Block">
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => deleteUser(user._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}
    </Layout>
  );
}
