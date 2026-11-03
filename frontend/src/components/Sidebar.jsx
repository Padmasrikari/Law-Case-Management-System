import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scale, LayoutDashboard, Users, Calendar, FileText, Settings, LogOut, Menu, X, Shield, UserCheck, Briefcase } from 'lucide-react';

const clientLinks = [
  { to: '/client', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/lawyers', icon: Users, label: 'Find Lawyers' },
  { to: '/client/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/client/cases', icon: FileText, label: 'My Cases' },
];

const lawyerLinks = [
  { to: '/lawyer', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/lawyer/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/lawyer/cases', icon: Briefcase, label: 'Cases' },
  { to: '/lawyer/profile', icon: Settings, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/lawyers', icon: UserCheck, label: 'Lawyers' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/cases', icon: FileText, label: 'All Cases' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = user?.role === 'client' ? clientLinks : user?.role === 'lawyer' ? lawyerLinks : adminLinks;
  const roleIcon = user?.role === 'admin' ? Shield : user?.role === 'lawyer' ? Scale : Users;
  const RoleIcon = roleIcon;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Mobile Toggle */}
      <button onClick={() => setOpen(!open)} className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg p-2.5 rounded-xl border border-gray-100">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/20 z-40 lg:hidden" />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 flex flex-col shadow-xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <Scale size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-lg text-gray-900 leading-none">LexNova</div>
              <div className="text-xs text-gray-400 capitalize">{user?.role} Portal</div>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 mx-3 mt-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border border-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-gray-900 truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 mt-2 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`sidebar-link ${location.pathname === to ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
