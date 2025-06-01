// components/auth/RoleGuard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleGuard = ({ 
  children, 
  requiredRole, 
  fallback = null,
  showFallback = true 
}) => {
  const { hasRole } = useAuth();

  // Check if user has required role
  if (!hasRole(requiredRole)) {
    if (showFallback && fallback) {
      return fallback;
    }
    
    if (showFallback) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            You don't have permission to access this content.
          </p>
        </div>
      );
    }
    
    return null;
  }

  return children;
};

// Helper components for common role checks
export const PatientOnly = ({ children, fallback }) => (
  <RoleGuard requiredRole="patient" fallback={fallback}>
    {children}
  </RoleGuard>
);

export const DoctorOnly = ({ children, fallback }) => (
  <RoleGuard requiredRole="doctor" fallback={fallback}>
    {children}
  </RoleGuard>
);

export const AdminOnly = ({ children, fallback }) => (
  <RoleGuard requiredRole="admin" fallback={fallback}>
    {children}
  </RoleGuard>
);

export const SuperAdminOnly = ({ children, fallback }) => (
  <RoleGuard requiredRole="super_admin" fallback={fallback}>
    {children}
  </RoleGuard>
);

export default RoleGuard;