import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { LayoutDashboard, Search, FileText, ChevronDown, ChevronUp, Clock, Calendar, User } from 'lucide-react';

const links = [
  { to: '/client', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/client/lawyers', label: 'Find Lawyers', Icon: Search },
  { to: '/client/cases', label: 'My Cases', Icon: FileText },
];

const statusColors = {
  'Filed': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  'Hearing': 'bg-purple-100 text-purple-700',
  'Closed': 'bg-gray-100 text-gray-600',
  'Won': 'bg-green-100 text-green-700',
  'Lost': 'bg-red-100 text-red-700'
};

const statusSteps = ['Filed', 'In Progress', 'Hearing', 'Closed'];

export default function CaseTracking() {
  const [cases, setCases] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [timelines, setTimelines] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/cases').then(r => setCases(r.data)).finally(() => setLoading(false));
  }, []);

  const loadTimeline = async (caseId) => {
    if (expanded === caseId) { setExpanded(null); return; }
    setExpanded(caseId);
    if (!timelines[caseId]) {
      const { data } = await api.get(`/cases/${caseId}`);
      setTimelines(prev => ({ ...prev, [caseId]: data.timeline }));
    }
  };

  const getStepIndex = (status) => statusSteps.indexOf(status);

  if (loading) return <Layout links={links} title="My Cases"><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div></Layout>;

  return (
    <Layout links={links} title="Case Tracking">
      {cases.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-xl font-semibold">No cases found</p>
          <p className="mt-2">Your lawyer will create cases for you</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {cases.map(c => (
            <div key={c._id} className="card overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold text-gray-900">{c.title}</h3>
                      <span className={`badge-status text-xs ${statusColors[c.status]}`}>{c.status}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Case #{c.caseNumber?.slice(-10)}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><User className="w-4 h-4" /> {c.lawyerId?.name}</span>
                      {c.nextHearingDate && <span className="flex items-center gap-1 text-purple-600"><Calendar className="w-4 h-4" /> Next: {new Date(c.nextHearingDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <button onClick={() => loadTimeline(c._id)} className="text-gray-400 hover:text-gray-600 p-2">
                    {expanded === c._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-5">
                  <div className="flex items-center">
                    {statusSteps.map((step, i) => (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${i <= getStepIndex(c.status) ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {i + 1}
                        </div>
                        <div className={`flex-1 h-1 last:hidden ${i < getStepIndex(c.status) ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {statusSteps.map(step => <span key={step} className="text-xs text-gray-500">{step}</span>)}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {expanded === c._id && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <h4 className="font-semibold text-gray-700 mb-4">Case Timeline</h4>
                  {timelines[c._id]?.length === 0 ? (
                    <p className="text-gray-400 text-sm">No timeline entries yet</p>
                  ) : (
                    <div className="relative space-y-4">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      {timelines[c._id]?.map((t, i) => (
                        <div key={i} className="pl-10 relative">
                          <div className="absolute left-0 w-6 h-6 bg-primary-100 border-2 border-primary-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          </div>
                          <div className="bg-white rounded-xl p-3 border border-gray-100">
                            <p className="font-medium text-gray-800 text-sm">{t.activity}</p>
                            {t.description && <p className="text-gray-500 text-xs mt-0.5">{t.description}</p>}
                            <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />{new Date(t.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
