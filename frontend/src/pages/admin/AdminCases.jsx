import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { LayoutDashboard, Users, FileText, Scale, Search, Calendar } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/admin/lawyers', label: 'Lawyers', Icon: Scale },
  { to: '/admin/users', label: 'Users', Icon: Users },
  { to: '/admin/cases', label: 'Cases', Icon: FileText },
];

const statusColors = { 'Filed':'bg-blue-100 text-blue-700','In Progress':'bg-yellow-100 text-yellow-700','Hearing':'bg-purple-100 text-purple-700','Closed':'bg-gray-100 text-gray-600','Won':'bg-green-100 text-green-700','Lost':'bg-red-100 text-red-700' };

export default function AdminCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    api.get('/admin/cases').then(r => setCases(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = cases.filter(c => {
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.clientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.lawyerId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Layout links={links} title="Case Monitoring">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input placeholder="Search by case title, client, or lawyer..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto min-w-40">
          <option value="">All Status</option>
          {['Filed','In Progress','Hearing','Closed','Won','Lost'].map(s => <option key={s}>{s}</option>)}
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
                  {['Case', 'Case Number', 'Client', 'Lawyer', 'Type', 'Status', 'Next Hearing', 'Filed'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">No cases found</td></tr>
                ) : filtered.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900 max-w-48 truncate">{c.title}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs font-mono">#{c.caseNumber?.slice(-8)}</td>
                    <td className="px-4 py-4 text-gray-600">{c.clientId?.name || '—'}</td>
                    <td className="px-4 py-4 text-gray-600">{c.lawyerId?.name || '—'}</td>
                    <td className="px-4 py-4 text-gray-600 text-xs">{c.caseType}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs">
                      {c.nextHearingDate ? (
                        <span className="flex items-center gap-1 text-purple-600"><Calendar className="w-3 h-3" />{new Date(c.nextHearingDate).toLocaleDateString()}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            Showing {filtered.length} of {cases.length} cases
          </div>
        </div>
      )}
    </Layout>
  );
}
