import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Scale, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg) toast.error(msg, { id: 'auth-msg' });
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const demoLogin = async (role) => {
    const demos = {
      admin: { email: 'admin@legal.com', password: '987654' },
      client: { email: 'client@demo.com', password: 'demo123' },
      lawyer: { email: 'lawyer@demo.com', password: 'demo123' }
    };
    setForm(demos[role]);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-primary-950 to-gray-900">
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 text-white">
        <Link to="/" className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center"><Scale className="w-6 h-6" /></div>
          <span className="font-display text-2xl font-bold">LegalEase</span>
        </Link>
        <h1 className="font-display text-5xl font-bold leading-tight mb-6">Welcome Back to <span className="text-primary-400">Justice</span></h1>
        <p className="text-gray-400 text-lg">Your trusted platform for legal services and case management.</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">Access your legal dashboard</p>

          <div className="flex gap-2 mb-6">
            {['admin', 'client', 'lawyer'].map(role => (
              <button key={role} onClick={() => demoLogin(role)} className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all capitalize font-medium text-gray-600">
                {role}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mb-6">↑ Demo accounts (click to fill)</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type="email" placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field !pl-10" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input type={show ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field !pl-10 !pr-10" required />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500">Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
