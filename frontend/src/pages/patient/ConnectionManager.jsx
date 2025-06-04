
import { useState, useCallback } from 'react';

export const useConnectionManager = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchToken = useCallback(async () => {
    try {
      setIsConnecting(true);
      setConnectionError(null);
      
      // Fetch the token from the backend service
      const response = await fetch('http://localhost:8000/api/livekit-token');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.token) {
        throw new Error('No token received from server');
      }

      setToken(data.token);
      setIsConnected(true);
      setConnectionError(null);
      
    } catch (err) {
      console.error("Connection error:", err);
      setConnectionError(
        err.message.includes('fetch') 
          ? "Unable to reach medical service. Please check your connection and try again."
          : "Failed to establish secure connection. Please try again."
      );
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setToken(null);
    setConnectionError(null);
  }, []);

  const retry = useCallback(() => {
    setConnectionError(null);
    fetchToken();
  }, [fetchToken]);

  return {
    isConnected,
    token,
    connectionError,
    isConnecting,
    connect: fetchToken,
    disconnect,
    retry
  };
};