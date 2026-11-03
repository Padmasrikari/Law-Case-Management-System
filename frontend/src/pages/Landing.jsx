import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Shield, Clock, Star, ArrowRight, CheckCircle, Users, Briefcase } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-body">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">LexNova</span>
          </div>
          <div className="flex gap-3">
            <Link to="/lawyers" className="text-gray-600 hover:text-primary-600 px-4 py-2 text-sm font-medium transition-colors">Find Lawyers</Link>
            <Link to="/login" className="btn-secondary text-sm py-2 px-5">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-5">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-400/30 text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield size={14} /> Trusted by 10,000+ clients
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Expert Legal Help,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-blue-300">Just a Click Away</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified lawyers, book consultations, and track your legal cases — all in one secure platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="bg-primary-500 hover:bg-primary-400 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary-500/30">
                Find a Lawyer <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=lawyer" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold transition-all">
                Register as Lawyer
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
            {[['500+', 'Verified Lawyers'], ['10k+', 'Cases Resolved'], ['4.9★', 'Average Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-display font-bold text-white">{num}</div>
                <div className="text-slate-400 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">One platform for clients, lawyers, and administrators to manage legal matters efficiently.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, color: 'bg-blue-50 text-blue-600', title: 'For Clients', items: ['Search verified lawyers', 'Book appointments online', 'Track case progress', 'Give ratings & reviews'] },
              { icon: Scale, color: 'bg-primary-50 text-primary-600', title: 'For Lawyers', items: ['Build your profile', 'Manage appointments', 'Handle multiple cases', 'Upload case documents'] },
              { icon: Shield, color: 'bg-emerald-50 text-emerald-600', title: 'For Admins', items: ['Approve lawyer profiles', 'Monitor all cases', 'User management', 'Analytics dashboard'] },
            ].map(({ icon: Icon, color, title, items }) => (
              <div key={title} className="card hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">{title}</h3>
                <ul className="space-y-2.5">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-gray-600 text-sm">
                      <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-primary-100 mb-8 text-lg">Join thousands of clients who trust LexNova for their legal needs.</p>
          <Link to="/register" className="bg-white text-primary-700 hover:bg-primary-50 px-10 py-3.5 rounded-xl font-semibold inline-flex items-center gap-2 transition-all shadow-lg">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Scale size={16} className="text-primary-400" />
          <span className="font-display font-semibold text-white">LexNova</span>
        </div>
        <p>© 2025 LexNova Legal Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
