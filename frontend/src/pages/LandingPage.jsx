import { Link } from 'react-router-dom';
import { Scale, Shield, Users, Star, ArrowRight, CheckCircle, Briefcase } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-primary-950 to-gray-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-2xl font-bold">LegalEase</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">Sign In</Link>
          <Link to="/register" className="bg-primary-500 hover:bg-primary-400 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 px-4 py-2 rounded-full text-primary-300 text-sm font-medium mb-8">
          <Shield className="w-4 h-4" /> Trusted Legal Platform
        </div>
        <h1 className="font-display text-6xl md:text-7xl font-bold leading-tight mb-6">
          Justice Made<br />
          <span className="text-primary-400">Accessible</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-body">
          Connect with verified lawyers, manage your cases, and track legal proceedings — all in one powerful platform.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="bg-primary-500 hover:bg-primary-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-2">
            Start as Client <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/register?role=lawyer" className="border border-gray-600 hover:border-primary-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-2">
            Join as Lawyer <Briefcase className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <h2 className="font-display text-4xl font-bold text-center mb-4">Everything You Need</h2>
        <p className="text-gray-400 text-center mb-16">A complete ecosystem for legal services</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'Client Portal', color: 'bg-blue-500', items: ['Find verified lawyers', 'Book appointments', 'Track case progress', 'Rate & review lawyers'] },
            { icon: Scale, title: 'Lawyer Portal', color: 'bg-purple-500', items: ['Manage client cases', 'Schedule hearings', 'Upload documents', 'View analytics dashboard'] },
            { icon: Shield, title: 'Admin Portal', color: 'bg-green-500', items: ['Verify lawyer credentials', 'Monitor all activity', 'Manage users & cases', 'Platform analytics'] }
          ].map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-6`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">{f.title}</h3>
              <ul className="space-y-3">
                {f.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['500+', 'Verified Lawyers'], ['10k+', 'Cases Resolved'], ['98%', 'Client Satisfaction'], ['4.9', 'Average Rating']].map(([num, label], i) => (
            <div key={i}>
              <div className="font-display text-5xl font-bold text-primary-400 mb-2">{num}</div>
              <div className="text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-gray-500 border-t border-white/10 max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-primary-400" />
          <span className="font-display text-lg font-semibold text-white">LegalEase</span>
        </div>
        <p>© 2024 LegalEase. All rights reserved.</p>
      </footer>
    </div>
  );
}
