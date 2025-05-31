// services/storage.js
class StorageService {
  constructor() {
    this.tokenKey = 'wehelp_token';
    this.refreshTokenKey = 'wehelp_refresh_token';
    this.userKey = 'wehelp_user';
  }

  // Token management
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // Refresh token management
  setRefreshToken(refreshToken) {
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  removeRefreshToken() {
    localStorage.removeItem(this.refreshTokenKey);
  }

  // User data management
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUser() {
    try {
      const user = localStorage.getItem(this.userKey);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  removeUser() {
    localStorage.removeItem(this.userKey);
  }

  // Clear all auth data
  clearAuth() {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUser();
  }

  // Check if storage is available
  isStorageAvailable() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const storage = new StorageService();