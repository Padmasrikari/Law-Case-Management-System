import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { LayoutDashboard, FileText, Calendar, Settings, Upload, Plus, Clock, ChevronDown } from 'lucide-react';

const links = [
  { to: '/lawyer', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/lawyer/cases', label: 'Cases', Icon: FileText },
  { to: '/lawyer/appointments', label: 'Appointments', Icon: Calendar },
  { to: '/lawyer/settings', label: 'Settings', Icon: Settings },
];

const statusOptions = ['Filed','In Progress','Hearing','Closed','Won','Lost'];
const statusColors = { 'Filed':'bg-blue-100 text-blue-700','In Progress':'bg-yellow-100 text-yellow-700','Hearing':'bg-purple-100 text-purple-700','Closed':'bg-gray-100 text-gray-600','Won':'bg-green-100 text-green-700','Lost':'bg-red-100 text-red-700' };

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hearingForm, setHearingForm] = useState({ date:'', description:'', court:'' });
  const [showHearing, setShowHearing] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    const { data } = await api.get(`/cases/${id}`);
    setCaseData(data.case);
    setTimeline(data.timeline);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status) => {
    try {
      await api.put(`/cases/${id}`, { status });
      load(); toast.success('Status updated');
    } catch (err) { toast.error('Failed to update'); }
  };

  const addHearing = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/cases/${id}/hearings`, hearingForm);
      load(); setShowHearing(false); toast.success('Hearing scheduled');
    } catch (err) { toast.error('Failed'); }
  };

  const uploadDocs = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('documents', f));
    try {
      await api.post(`/cases/${id}/documents`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      load(); toast.success('Documents uploaded');
    } catch (err) { toast.error('Upload failed'); }
  };

  if (loading) return <Layout links={links} title="Case Detail"><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div></Layout>;

  return (
    <Layout links={links} title={caseData?.title || 'Case Detail'}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">{caseData?.title}</h1>
              <p className="text-gray-500 text-sm">#{caseData?.caseNumber?.slice(-10)} · {caseData?.caseType}</p>
              <p className="text-gray-600 mt-3 text-sm">{caseData?.description}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className={`badge-status text-sm ${statusColors[caseData?.status]}`}>{caseData?.status}</span>
              <div className="relative group">
                <select onChange={e => updateStatus(e.target.value)} value={caseData?.status} className="input-field text-sm py-2">
                  {statusOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
            <div><p className="text-xs text-gray-400">Client</p><p className="font-medium text-gray-800">{caseData?.clientId?.name}</p></div>
            <div><p className="text-xs text-gray-400">Court</p><p className="font-medium text-gray-800">{caseData?.court || '—'}</p></div>
            <div><p className="text-xs text-gray-400">Filed On</p><p className="font-medium text-gray-800">{new Date(caseData?.createdAt).toLocaleDateString()}</p></div>
            <div><p className="text-xs text-gray-400">Next Hearing</p><p className="font-medium text-purple-600">{caseData?.nextHearingDate ? new Date(caseData.nextHearingDate).toLocaleDateString() : '—'}</p></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hearings */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-gray-900">Hearings</h2>
              <button onClick={() => setShowHearing(!showHearing)} className="btn-primary text-sm py-2"><Plus className="w-4 h-4" />Add</button>
            </div>
            {showHearing && (
              <form onSubmit={addHearing} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                <input type="date" value={hearingForm.date} onChange={e => setHearingForm({...hearingForm, date: e.target.value})} className="input-field" required />
                <input placeholder="Court" value={hearingForm.court} onChange={e => setHearingForm({...hearingForm, court: e.target.value})} className="input-field" />
                <textarea placeholder="Description" value={hearingForm.description} onChange={e => setHearingForm({...hearingForm, description: e.target.value})} className="input-field resize-none" rows={2} />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowHearing(false)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm">Cancel</button>
                  <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-xl text-sm font-semibold">Schedule</button>
                </div>
              </form>
            )}
            {caseData?.hearings?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No hearings scheduled</p>
            ) : (
              <div className="space-y-3">
                {caseData.hearings.map((h, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-3">
                    <p className="font-semibold text-gray-800 text-sm">{new Date(h.date).toLocaleDateString()}</p>
                    {h.court && <p className="text-gray-500 text-xs">{h.court}</p>}
                    {h.description && <p className="text-gray-600 text-xs mt-1">{h.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-gray-900">Documents</h2>
              <button onClick={() => fileRef.current?.click()} className="btn-secondary text-sm py-2"><Upload className="w-4 h-4" />Upload</button>
              <input ref={fileRef} type="file" multiple className="hidden" onChange={uploadDocs} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
            </div>
            {caseData?.documents?.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 transition-all" onClick={() => fileRef.current?.click()}>
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Click to upload documents</p>
              </div>
            ) : (
              <div className="space-y-2">
                {caseData.documents.map((d, i) => (
                  <a key={i} href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-50 transition-all group">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 text-xs font-bold">PDF</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-primary-600">{d.name}</p>
                      <p className="text-xs text-gray-400">{new Date(d.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold text-gray-900 mb-5">Case Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-4">
              {timeline.map((t, i) => (
                <div key={i} className="pl-12 relative">
                  <div className="absolute left-0 w-8 h-8 bg-primary-100 border-2 border-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-900 text-sm">{t.activity}</p>
                    {t.description && <p className="text-gray-600 text-xs mt-1">{t.description}</p>}
                    <p className="text-gray-400 text-xs mt-2 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(t.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
