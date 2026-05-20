import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44Client } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoadingAuth(true);
        
        // Check if token exists
        const token = localStorage.getItem('auth_token');
        
        // In development, allow access without token
        if (!token && import.meta.env.PROD) {
          setAuthError({ type: 'auth_required' });
          return;
        }

        // Verify token is still valid
        if (token) {
          base44Client.setToken(token);
        }
        
        // Optionally, you can verify the token with an API call here
        // const userData = await base44Client.get('/auth/me');
        // setUser(userData);

        setAuthError(null);
      } catch (error) {
        console.error('Auth check failed:', error);
        // In development, don't block on auth errors
        if (import.meta.env.PROD) {
          setAuthError({ type: 'auth_required' });
        } else {
          setAuthError(null);
        }
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Check public settings
  useEffect(() => {
    const checkPublicSettings = async () => {
      try {
        setIsLoadingPublicSettings(true);
        // You can add API calls here to fetch public settings
        // const settings = await base44Client.get('/settings/public');
        // Handle settings if needed
      } catch (error) {
        console.error('Failed to load public settings:', error);
      } finally {
        setIsLoadingPublicSettings(false);
      }
    };

    checkPublicSettings();
  }, []);

  const navigateToLogin = () => {
    setAuthError({ type: 'auth_required' });
    navigate('/login');
  };

  const login = async (credentials) => {
    try {
      setIsLoadingAuth(true);
      // Implement your login logic here
      // const response = await base44Client.post('/auth/login', credentials);
      // base44Client.setToken(response.token);
      // setUser(response.user);
      setAuthError(null);
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError({ type: 'auth_error', message: error.message });
      throw error;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = () => {
    base44Client.setToken(null);
    setUser(null);
    setAuthError({ type: 'auth_required' });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        user,
        navigateToLogin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
