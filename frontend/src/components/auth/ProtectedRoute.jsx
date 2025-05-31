// components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
  </div>
);

const ProtectedRoute = ({ children, exactRole = null }) => {
  const { isAuthenticated, isLoading, user, getDashboardRoute } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check exact role match if exactRole is specified
  if (exactRole && user?.role !== exactRole) {
    console.log(`🚫 Access denied: User role "${user?.role}" cannot access route requiring "${exactRole}"`);
    // Redirect to user's appropriate dashboard
    const userDashboard = getDashboardRoute();
    return <Navigate to={userDashboard} replace />;
  }

  return children;
};

export default ProtectedRoute;