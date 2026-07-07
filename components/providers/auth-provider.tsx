'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';

export interface User {
  id: string | number;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isModalOpen: boolean;
  modalMode: 'login' | 'signup';
  isProfileModalOpen: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  updateProfile: (name: string) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'signup'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openLoginModal = useCallback(() => {
    setModalMode('login');
    setIsModalOpen(true);
  }, []);

  const openSignupModal = useCallback(() => {
    setModalMode('signup');
    setIsModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const openProfileModal = useCallback(() => {
    setIsProfileModalOpen(true);
  }, []);

  const closeProfileModal = useCallback(() => {
    setIsProfileModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('app-token');
    localStorage.removeItem('app-refresh-token');
    setToken(null);
    setUser(null);
    closeAuthModal();
    closeProfileModal();
  }, [closeAuthModal, closeProfileModal]);

  const updateProfile = useCallback(async (name: string) => {
    try {
      const updatedUser = await api.patch<User>('/auth/me', { name });
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      await api.post<void>('/auth/change-password', { old_password: oldPassword, new_password: newPassword });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  // Fetch current user details
  const fetchUser = useCallback(async (authToken: string) => {
    try {
      setIsLoading(true);
      // Calls GET /auth/me or similar profile endpoint
      const userData = await api.get<User>('/auth/me');
      setUser(userData);
      setToken(authToken);
    } catch (err) {
      console.error('Failed to verify session token:', err);
      // Clean up token if invalid
      localStorage.removeItem('app-token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const storedToken = localStorage.getItem('app-token');
    
    Promise.resolve().then(() => {
      if (storedToken) {
        fetchUser(storedToken);
      } else {
        setIsLoading(false);
      }
    });

    // Event listener to handle global 401 unauthorized calls from api-client
    const handleUnauthorized = () => {
      logout();
      openLoginModal();
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, [fetchUser, logout, openLoginModal]);

  // Login handler
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // POST /auth/login — expects JSON { email, password }, returns { access_token, refresh_token, user? }
      const response = await api.post<{ access_token: string; refresh_token: string; user?: User }>('/auth/login', { email, password });
      
      const tokenVal = response.access_token;
      localStorage.setItem('app-token', tokenVal);
      localStorage.setItem('app-refresh-token', response.refresh_token);
      setToken(tokenVal);
      
      // If response returns user object, set it, otherwise fetch profile details
      if (response.user) {
        setUser(response.user);
        setIsLoading(false);
      } else {
        await fetchUser(tokenVal);
      }
      closeAuthModal();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  // Register handler
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<{ access_token: string; refresh_token: string; user?: User }>('/auth/register', { name, email, password });
      
      const tokenVal = response.access_token;
      localStorage.setItem('app-token', tokenVal);
      localStorage.setItem('app-refresh-token', response.refresh_token);
      setToken(tokenVal);
      
      if (response.user) {
        setUser(response.user);
        setIsLoading(false);
      } else {
        await fetchUser(tokenVal);
      }
      closeAuthModal();
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isModalOpen,
        modalMode,
        isProfileModalOpen,
        login,
        register,
        logout,
        openLoginModal,
        openSignupModal,
        closeAuthModal,
        openProfileModal,
        closeProfileModal,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
