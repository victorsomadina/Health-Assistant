// services/auth.js
import { storage } from './storage';
import { api } from './api';

class AuthService {
  constructor() {
    this.tokenKey = 'wehelp_token';
    this.refreshTokenKey = 'wehelp_refresh_token';
    this.userKey = 'wehelp_user';
  }

  // Login user and store tokens
  async login(email, password) {
    try {
      console.log('🔄 Starting login process...');
      console.log('📧 Email:', email.trim().toLowerCase());

      const loginEndpoint = import.meta.env.VITE_LOGIN_ENDPOINT || '/login';
      console.log('🔗 Using login endpoint:', loginEndpoint);
      
      const response = await api.post(loginEndpoint, {
        email: email.trim().toLowerCase(),
        password
      });

      console.log('✅ Login response received:', response);
      console.log('📦 Raw response data:', response.data);

      const responseData = response.data;
      console.log('🔍 Response data keys:', Object.keys(responseData));
      console.log('🔍 Response.role value:', responseData.role);
      console.log('🔍 Response.message:', responseData.message);

      // Extract token and user data based on your backend structure
      let token, refreshToken, user, userRole;

      console.log('🔍 Checking for token in response...');
      if (responseData.token) {
        token = responseData.token;
        refreshToken = responseData.refreshToken || responseData.refresh_token;
        console.log('✅ Token found:', token.substring(0, 20) + '...');
        
        // Get the role from the root level of response
        userRole = responseData.role;
        console.log('🎭 Role extracted from response.role:', userRole);
        
        // Your backend uses different field names for user data
        console.log('🔍 Looking for user data in response...');
        console.log('🔍 responseData.user:', responseData.user);
        console.log('🔍 responseData.patientData:', responseData.patientData);
        console.log('🔍 responseData.doctorData:', responseData.doctorData);
        console.log('🔍 responseData.adminData:', responseData.adminData);
        
        user = responseData.user || 
               responseData.patientData || 
               responseData.doctorData || 
               responseData.adminData || 
               responseData.superAdminData ||
               responseData.data;
               
        console.log('👤 Selected user data source:', user);
      } else {
        throw new Error('No token received from server');
      }

      if (!user) {
        console.warn('⚠️ No user data received, creating minimal user object');
        user = {
          email: email.trim().toLowerCase(),
          role: userRole || 'patient'
        };
      }

      // Set the role from the root level response (not from user data)
      console.log('🔧 Setting user role...');
      console.log('🔧 userRole from response:', userRole);
      console.log('🔧 user.role before assignment:', user.role);
      
      user.role = userRole || user.role || 'patient';
      
      console.log('🔧 user.role after assignment:', user.role);

      console.log('🔑 Final token:', token.substring(0, 20) + '...');
      console.log('👤 Final user data:', user);
      console.log('🎭 Final role:', user.role);
      console.log('📋 Full response for debugging:', responseData);

      // Store authentication data
      storage.setToken(token);
      if (refreshToken) {
        storage.setRefreshToken(refreshToken);
      }
      storage.setUser(user);

      console.log('✅ Login data stored successfully');
      return { success: true, user };

    } catch (error) {
      console.error('❌ Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  // Logout user and clear all data
  logout() {
    console.log('🚪 Logging out user...');
    storage.clearAuth();
    window.location.href = '/login';
  }

  // Get current user from storage
  getCurrentUser() {
    return storage.getUser();
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = storage.getToken();
    const user = storage.getUser();
    
    if (!token || !user) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  // Check user role - EXACT MATCH ONLY (no hierarchy)
  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Exact role match - no hierarchy
    return user.role === requiredRole;
  }

  // // Get user's dashboard route based on role
  // getDashboardRoute(role) {
  //   const userRole = role || this.getCurrentUser()?.role;
  //   console.log('🚪 Getting dashboard route for role:', userRole);
    
  //   const routes = {
  //     'patient': '/dashboard/patient',
  //     'doctor': '/dashboard/doctor',
  //     'admin': '/dashboard/admin',
  //     'super_admin': '/dashboard/super-admin',
  //     // Handle your backend's role format
  //     'superadmin': '/dashboard/super-admin'
  //   };
    
  //   const dashboardRoute = routes[userRole] || '/dashboard/patient';
  //   console.log('🚪 Dashboard route determined:', dashboardRoute);
    
  //   return dashboardRoute;
  // }

  getDashboardRoute(role) {
    const userRole = role || this.getCurrentUser()?.role;
    console.log('🚪 Getting dashboard route for role:', userRole);
    
    // Simple mapping - each role gets their own path
    const routes = {
      'patient': '/patient/dashboard',
      'doctor': '/doctor/dashboard', 
      'admin': '/admin/dashboard',
      'superadmin': '/superadmin/dashboard'
    };
    
    const dashboardRoute = routes[userRole] || '/patient/dashboard';
    console.log('🚪 Dashboard route determined:', dashboardRoute);
    
    return dashboardRoute;
  }

  // Refresh access token
  async refreshToken() {
    try {
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/refresh', {
        refreshToken
      });

      const { token } = response.data;
      storage.setToken(token);

      return token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      throw error;
    }
  }

  // Check if token is expired
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

export const authService = new AuthService();