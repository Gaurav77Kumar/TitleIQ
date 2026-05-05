import React, { createContext, useContext, useState, ReactNode } from 'react';
import api from '../lib/api';
import type { 
  User, 
  AuthSendOtpRequest, 
  AuthVerifyOtpRequest, 
  AuthResponse 
} from '@titleiq/shared';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isPro: boolean;
  isLoading: boolean;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('titleiq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication status on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get<{ success: true, user: User }>('/auth/me');
        if (res.success) {
          setUser(res.user);
          localStorage.setItem('titleiq_user', JSON.stringify(res.user));
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem('titleiq_user');
      }
    };
    checkAuth();
  }, []);

  const sendOtp = async (email: string) => {
    setIsLoading(true);
    try {
      await api.post('/auth/send-otp', { email } as AuthSendOtpRequest);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/verify-otp', { email, code } as AuthVerifyOtpRequest);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('titleiq_user', JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (err) {
      console.warn('Server-side logout failed, clearing local state anyway');
    }
    setUser(null);
    localStorage.removeItem('titleiq_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: null, // Token is in HttpOnly cookie
        isAuthenticated: !!user,
        isPro: !!user, // Treat all logged in users as Pro for now
        isLoading,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
