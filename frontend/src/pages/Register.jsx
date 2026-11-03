import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Scale, User, Mail, Lock, Phone, Briefcase, BookOpen, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'client');
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', specialization:'', experience:'', bio:'', consultationFee:'', location:'' });
  const [files, setFiles] = useState({ degreeCertificate: null, barCertificate: null, experienceProof: null, idProof: null });
  const [loading, setLoading] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const { register, logout } = useAuth();
  const navigate = useNavigate();

  const specializations = ['Criminal Law','Civil Law','Family Law','Corporate Law','Real Estate Law','Immigration Law','Intellectual Property','Tax Law','Labor Law','Constitutional Law','Environmental Law','Cyber Law'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let dataToSubmit = { ...form, role };
      if (role === 'lawyer') {
        if (!files.degreeCertificate || !files.barCertificate || !files.experienceProof || !files.idProof) {
          toast.error('All documents are mandatory for lawyers');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        Object.keys(form).forEach(k => formData.append(k, form[k]));
        formData.append('role', role);
        if (files.degreeCertificate) formData.append('degreeCertificate', files.degreeCertificate);
        if (files.barCertificate) formData.append('barCertificate', files.barCertificate);
        if (files.experienceProof) formData.append('experienceProof', files.experienceProof);
        if (files.idProof) formData.append('idProof', files.idProof);
        dataToSubmit = formData;
      }
      const user = await register(dataToSubmit);
      
      if (role === 'lawyer') {
        setShowPendingModal(true);
      } else {
        toast.success('Welcome to LegalEase!');
        navigate(`/${user.role}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleModalClose = () => {
    setShowPendingModal(false);
    logout();
    navigate('/login');
  };

  const inp = (key) => ({ value: form[key], onChange: e => setForm({...form, [key]: e.target.value}) });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-primary-950 to-gray-900">
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 text-white">
        <Link to="/" className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center"><Scale className="w-6 h-6" /></div>
          <span className="font-display text-2xl font-bold">LegalEase</span>
        </Link>
        <h1 className="font-display text-5xl font-bold leading-tight mb-6">Join the <span className="text-primary-400">Legal Network</span></h1>
        <p className="text-gray-400 text-lg mb-8">Whether you need legal help or provide it — we've got you covered.</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg relative overflow-hidden">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-6">Create Account</h2>

          <div className="flex gap-3 mb-8">
            {[{r:'client',label:'Client',Icon:User},{r:'lawyer',label:'Lawyer',Icon:Briefcase}].map(({r,label,Icon}) => (
              <button key={r} type="button" onClick={() => setRole(r)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-semibold transition-all ${role===r?'border-primary-500 bg-primary-50 text-primary-700':'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative col-span-2">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input placeholder="Full Name" {...inp('name')} className="input-field !pl-10" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input type="email" placeholder="Email" {...inp('email')} className="input-field !pl-10" required />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input placeholder="Phone" {...inp('phone')} className="input-field !pl-10" />
              </div>
              <div className="relative col-span-2">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input type="password" placeholder="Password (min 6 chars)" {...inp('password')} className="input-field !pl-10" required minLength={6} />
              </div>
            </div>

            {role === 'lawyer' && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-600 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Professional Information</p>
                <select {...inp('specialization')} className="input-field" required>
                  <option value="">Select Specialization</option>
                  {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Years of Experience" {...inp('experience')} className="input-field" required />
                  <input type="number" placeholder="Consultation Fee (₹)" {...inp('consultationFee')} className="input-field" />
                </div>
                <input placeholder="Location (City, State)" {...inp('location')} className="input-field" />
                <textarea placeholder="Brief Bio..." {...inp('bio')} className="input-field resize-none" rows={3} />
                
                <p className="text-sm font-semibold text-gray-600 mt-4 mb-2">Mandatory Documents</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-500 mb-1 block">Degree Certificate</label>
                    <input type="file" onChange={e => setFiles({...files, degreeCertificate: e.target.files[0]})} className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700" required />
                  </div>
                  <div>
                    <label className="text-gray-500 mb-1 block">Bar Council Proof</label>
                    <input type="file" onChange={e => setFiles({...files, barCertificate: e.target.files[0]})} className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700" required />
                  </div>
                  <div>
                    <label className="text-gray-500 mb-1 block">Experience Proof</label>
                    <input type="file" onChange={e => setFiles({...files, experienceProof: e.target.files[0]})} className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700" required />
                  </div>
                  <div>
                    <label className="text-gray-500 mb-1 block">ID Proof</label>
                    <input type="file" onChange={e => setFiles({...files, idProof: e.target.files[0]})} className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary-50 file:text-primary-700" required />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 mt-2">
              {loading ? 'Creating Account...' : (role === 'lawyer' ? 'Submit for Approval' : 'Create Account')}
            </button>
          </form>

          {role === 'lawyer' && <p className="text-xs text-amber-600 bg-amber-50 rounded-xl p-3 mt-4">⚠️ Your account will be reviewed by admin before activation.</p>}
          <p className="text-center mt-4 text-gray-500 text-sm">Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link></p>
        </div>
      </div>

      {/* Success Modal for Lawyers */}
      {showPendingModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your application has been submitted successfully. Our administrative team will review your profile and documents within 24-48 hours.
              <br /><br />
              <span className="font-semibold text-primary-600">You will be able to access your dashboard once your account is verified.</span>
            </p>
            <button 
              onClick={handleModalClose}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all group"
            >
              Understood, Back to Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
