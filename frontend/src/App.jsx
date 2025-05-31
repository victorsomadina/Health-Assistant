// App.jsx - Simple and Clean
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public pages
import Home from './pages/Home/Home';
import Login from './components/auth/Login';
import UserSignup from './components/auth/UserSignup';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientChat from './pages/patient/PatientChat';
import PatientRecords from './pages/patient/PatientRecords';
import PatientSettings from './pages/patient/PatientSettings';
import PatientDoctors from './pages/patient/PatientDoctors';

// Doctor pages  
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorChat from './pages/doctor/DoctorChat';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorSettings from './pages/doctor/DoctorSettings';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';
import ManageDoctors from './pages/admin/ManageDoctors';

// Super Admin pages
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import SuperAdminHospitals from './pages/superadmin/SuperAdminHospitals';
import SuperAdminSettings from './pages/superadmin/SuperAdminSettings';
import SuperAdminAnalytics from './pages/superadmin/SuperAdminAnalytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/login" element={<Login />} />
          
          {/* PATIENT ROUTES - All separate */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute exactRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/chat" element={
            <ProtectedRoute exactRole="patient">
              <PatientChat />
            </ProtectedRoute>
          } />
          <Route path="/patient/records" element={
            <ProtectedRoute exactRole="patient">
              <PatientRecords />
            </ProtectedRoute>
          } />
          <Route path="/patient/settings" element={
            <ProtectedRoute exactRole="patient">
              <PatientSettings />
            </ProtectedRoute>
          } />
          <Route 
          path="/patient/doctors" element={
            <ProtectedRoute exactRole="patient">
              <PatientDoctors />
            </ProtectedRoute>
          } />

          {/* DOCTOR ROUTES - All separate */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute exactRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/chat" element={
            <ProtectedRoute exactRole="doctor">
              <DoctorChat />
            </ProtectedRoute>
          } />
          <Route path="/doctor/patients" element={
            <ProtectedRoute exactRole="doctor">
              <DoctorPatients />
            </ProtectedRoute>
          } />
          <Route path="/doctor/settings" element={
            <ProtectedRoute exactRole="doctor">
              <DoctorSettings />
            </ProtectedRoute>
          } />

          {/* ADMIN ROUTES - All separate */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute exactRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute exactRole="admin">
              <AdminDoctors />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute exactRole="admin">
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute exactRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          } />
          <Route path="/admin/manage-doctors" element={
            <ProtectedRoute exactRole="admin">
              <ManageDoctors />
            </ProtectedRoute>
          } />

          {/* SUPER ADMIN ROUTES - All separate */}
          <Route path="/superadmin/dashboard" element={
            <ProtectedRoute exactRole="superadmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/superadmin/hospitals" element={
            <ProtectedRoute exactRole="superadmin">
              <SuperAdminHospitals />
            </ProtectedRoute>
          } />
          <Route path="/superadmin/analytics" element={
            <ProtectedRoute exactRole="superadmin">
              <SuperAdminAnalytics />
            </ProtectedRoute>
          } />
          <Route path="/superadmin/settings" element={
            <ProtectedRoute exactRole="superadmin">
              <SuperAdminSettings />
            </ProtectedRoute>
          } />

          {/* DEFAULT REDIRECTS */}
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}


// Simple redirect based on role
const DashboardRedirect = () => {
  const { user } = useAuth();
  const role = user?.role;

  if (role === 'patient') return <Navigate to="/patient/dashboard" replace />;
  if (role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'superadmin') return <Navigate to="/superadmin/dashboard" replace />;
  
  return <Navigate to="/login" replace />;
};

export default App;