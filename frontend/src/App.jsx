import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/client/ClientDashboard';
import LawyersList from './pages/client/LawyersList';
import LawyerProfile from './pages/client/LawyerProfile';
import BookAppointment from './pages/client/BookAppointment';
import CaseTracking from './pages/client/CaseTracking';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import LawyerCases from './pages/lawyer/LawyerCases';
import CaseDetail from './pages/lawyer/CaseDetail';
import LawyerAppointments from './pages/lawyer/LawyerAppointments';
import LawyerSettings from './pages/lawyer/LawyerSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLawyers from './pages/admin/AdminLawyers';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCases from './pages/admin/AdminCases';
import LandingPage from './pages/LandingPage';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading, logout } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div></div>;
  if (!user) return <Navigate to="/login" />;
  
  if (user.role === 'lawyer' && user.status === 'pending') {
    return <Navigate to="/login?message=Account pending approval" />;
  }

  if (roles && !roles.includes(user.role)) return <Navigate to={`/${user.role}`} />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontFamily: 'DM Sans' } }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Client */}
          <Route path="/client" element={<ProtectedRoute roles={['client']}><ClientDashboard /></ProtectedRoute>} />
          <Route path="/client/lawyers" element={<ProtectedRoute roles={['client']}><LawyersList /></ProtectedRoute>} />
          <Route path="/client/lawyers/:id" element={<ProtectedRoute roles={['client']}><LawyerProfile /></ProtectedRoute>} />
          <Route path="/client/book/:id" element={<ProtectedRoute roles={['client']}><BookAppointment /></ProtectedRoute>} />
          <Route path="/client/cases" element={<ProtectedRoute roles={['client']}><CaseTracking /></ProtectedRoute>} />
          
          {/* Lawyer */}
          <Route path="/lawyer" element={<ProtectedRoute roles={['lawyer']}><LawyerDashboard /></ProtectedRoute>} />
          <Route path="/lawyer/cases" element={<ProtectedRoute roles={['lawyer']}><LawyerCases /></ProtectedRoute>} />
          <Route path="/lawyer/cases/:id" element={<ProtectedRoute roles={['lawyer']}><CaseDetail /></ProtectedRoute>} />
          <Route path="/lawyer/appointments" element={<ProtectedRoute roles={['lawyer']}><LawyerAppointments /></ProtectedRoute>} />
          <Route path="/lawyer/settings" element={<ProtectedRoute roles={['lawyer']}><LawyerSettings /></ProtectedRoute>} />
          
          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/lawyers" element={<ProtectedRoute roles={['admin']}><AdminLawyers /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/cases" element={<ProtectedRoute roles={['admin']}><AdminCases /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
