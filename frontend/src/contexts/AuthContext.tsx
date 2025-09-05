'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { LoginRequest, LoginResponse } from '@/types';
import { apiClient } from '@/lib/api';
import { getAuthState, setAuthState, clearAuthState, AuthState } from '@/lib/auth';
import { useCookies } from '@/hooks/useCookies';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthStateValue] = useState<AuthState>({ user: null, token: null, isAuthenticated: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from storage
    const state = getAuthState();
    setAuthStateValue(state);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const response: LoginResponse = await apiClient.login(credentials);
      
      setAuthState(response.user, response.access_token);
      setAuthStateValue({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    clearAuthState();
    setAuthStateValue({ user: null, token: null, isAuthenticated: false });
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const user = await apiClient.getProfile();
      setAuthStateValue(prev => ({ ...prev, user }));
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
