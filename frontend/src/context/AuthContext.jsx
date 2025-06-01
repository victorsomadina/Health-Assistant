// context/AuthContext.jsx - Add updateUser function
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { storage } from '../services/storage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // New updateUser function
  const updateUser = async (updatedData) => {
    try {
      // Update user data in state
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      
      // Update user data in storage
      storage.setUser(updatedUser);
      
      console.log('✅ User updated in context and storage');
      return updatedUser;
    } catch (error) {
      console.error('❌ Failed to update user in context:', error);
      throw error;
    }
  };

  const hasRole = (role) => {
    return authService.hasRole(role);
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    return authService.getDashboardRoute(user.role);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser, // Add updateUser to the context
    hasRole,
    getDashboardRoute
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};