// services/api.js
import { storage } from './storage';

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Process failed requests queue
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Make HTTP request with automatic token handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('🌐 Making API request to:', url);
    console.log('📤 Request options:', options);
    
    // Get current token
    let token = storage.getToken();

    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add auth header if token exists and not login/refresh endpoints
    if (token && !endpoint.includes('/login') && !endpoint.includes('/refresh')) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log('📋 Request headers:', headers);

    // Make request
    let response;
    try {
      response = await fetch(url, {
        ...options,
        headers
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
    } catch (error) {
      console.error('🌐 Network error:', error);
      throw new Error('Network error. Please check your connection.');
    }

    // Handle token expiration
    if (response.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/refresh')) {
      console.log('🔐 Token expired, attempting refresh...');
      return this.handleTokenExpiration(endpoint, options);
    }

    // Get response text first to see what we're dealing with
    let responseText;
    try {
      responseText = await response.text();
      console.log('📄 Raw response text:', responseText);
    } catch (error) {
      console.error('❌ Failed to read response text:', error);
      throw new Error('Failed to read server response');
    }

    // Parse response as JSON
    let data;
    try {
      // Only try to parse as JSON if we have content
      if (responseText.trim()) {
        data = JSON.parse(responseText);
        console.log('📦 Parsed response data:', data);
      } else {
        console.log('📦 Empty response body');
        data = {};
      }
    } catch (error) {
      console.error('❌ JSON parsing error:', error);
      console.error('📄 Response text that failed to parse:', responseText);
      
      // If it's an HTML response (common with 404/500 errors)
      if (responseText.includes('<html') || responseText.includes('<!DOCTYPE')) {
        throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
      }
      
      throw new Error('Invalid response format from server');
    }

    // Handle non-success status codes
    if (!response.ok) {
      console.error('❌ Request failed with status:', response.status);
      console.error('❌ Error data:', data);
      
      const errorMessage = data?.message || 
                          data?.error || 
                          data?.details || 
                          `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return { data, status: response.status };
  }

  // Handle token expiration and retry
  async handleTokenExpiration(originalEndpoint, originalOptions) {
    if (this.isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(token => {
        return this.request(originalEndpoint, {
          ...originalOptions,
          headers: {
            ...originalOptions.headers,
            Authorization: `Bearer ${token}`
          }
        });
      });
    }

    this.isRefreshing = true;

    try {
      // Try to refresh token
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      const response = await fetch(`${this.baseURL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newToken = data.token;

      // Update stored token
      storage.setToken(newToken);

      // Process queued requests
      this.processQueue(null, newToken);

      // Retry original request
      return this.request(originalEndpoint, originalOptions);

    } catch (error) {
      // Clear auth data and redirect to login
      storage.clearAuth();
      this.processQueue(error, null);
      window.location.href = '/login';
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // HTTP methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options
    });
  }

  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options
    });
  }

  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options
    });
  }
}

export const api = new ApiService();