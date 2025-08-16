// web/apps/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, phone?: string) => Promise<void>;
}

export const useAuth = (): AuthState & AuthActions => {
  // Mock implementation - replace with Firebase later
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false, // Set to true for testing admin routes
    isLoading: false
  });

  // Mock login function
  const login = async (email: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    const mockUser: User = {
      id: 'mock-user-123',
      email,
      name: 'John Doe',
      phone: '+57 300 123 4567',
      isAdmin: email === 'admin@kingsman.com' // Mock admin check
    };
    
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: mockUser.isAdmin,
      isLoading: false
    });
  };

  // Mock logout function
  const logout = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false
    });
  };

  // Mock register function
  const register = async (email: string, password: string, phone?: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful registration and auto-login
    const mockUser: User = {
      id: 'mock-user-' + Date.now(),
      email,
      name: email.split('@')[0],
      phone,
      isAdmin: false
    };
    
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isAdmin: false,
      isLoading: false
    });
  };

  // Simulate checking auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate checking stored session
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For testing, you can uncomment to auto-login as admin:
      // setAuthState({
      //   user: {
      //     id: 'admin-123',
      //     email: 'admin@kingsman.com',
      //     name: 'Admin User',
      //     isAdmin: true
      //   },
      //   isAuthenticated: true,
      //   isAdmin: true,
      //   isLoading: false
      // });
      
      // Default: not authenticated
      setAuthState(prev => ({ ...prev, isLoading: false }));
    };
    
    checkAuth();
  }, []);

  return {
    ...authState,
    login,
    logout,
    register
  };
};