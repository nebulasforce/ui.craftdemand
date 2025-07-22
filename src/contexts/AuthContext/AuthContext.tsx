// src/contexts/AuthContext/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notifications } from '@mantine/notifications';
import {login ,register} from '@/api/auth/api';
import {loginRequest,registerRequest} from '@/api/auth/request';
import {AccountDisplay} from '@/api/auth/typings';



interface AuthContextValue {
  user: AccountDisplay | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (params: loginRequest) => Promise<boolean>;
  logout: () => void;
  register: (params: registerRequest) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AccountDisplay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 从本地存储加载用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        notifications.show({ message: 'Login failed', color: 'red' });
      }
    }
    setIsLoading(false);
  }, []);

  const loginFunc = async (params:loginRequest) => {
    try {
     const response = await login(params);
     if (response.success) {
       //
     }
     // TODO
      return true;
    } catch (error) {
      notifications.show({ message: 'Login failed', color: 'red' });
      return false;
    }
  };

  const logoutFunc = () => {
    setUser(null);
    localStorage.removeItem('user');
    notifications.show({ message: 'Logged out', color: 'blue' });
  };

  const registerFunc = async (params:registerRequest) => {
    try {
      const response = await register(params);
      if (response.success) {
        //
      }
      // TODO
      return true;
    } catch (error) {
      notifications.show({ message: 'register failed', color: 'red' });
      return false;
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login: loginFunc,
    logout: logoutFunc,
    register: registerFunc
  };
  // user: AccountDisplay | null;
  // isLoading: boolean;
  // isAuthenticated: boolean;
  // login: (params: loginRequest) => Promise<string>;
  // logout: () => void;
  // register: (params: registerRequest) => Promise<string>;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {throw new Error('useAuth must be used within an AuthProvider');}
  return context;
};
