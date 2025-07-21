// src/contexts/AuthContext/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notifications } from '@mantine/notifications';
import {login ,register} from '@/api/auth/api';
import {loginRequest,registerRequest} from '@/api/auth/request';

interface User {
  id: string; // id
  username: string; // 用户名
  name?: string; // 昵称
  email: string; // 邮箱
  mobile: string; // 手机号
  avatar?: string; // 头像
}

interface LoginParams {
  username?: string;
  mobile?: string;
  email?: string;
  password?: string;
  captcha?: string;
}

interface RegisterParams {
  mobile: string;
  email: string;
  password: string;
  captcha: string;
  authCode: string;
}


interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<string>;
  logout: () => void;
  register: (params: RegisterParams) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 从本地存储加载用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (params:LoginParams) => {
    try {
      // 模拟登录API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 实际项目中应替换为真实的API调用
      const mockUser: User = {
        id: '1',
        username,
        avatar: 'https://picsum.photos/id/237/40/40'
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      notifications.show({ message: 'Login successful', color: 'green' });
      return true;
    } catch (error) {
      notifications.show({ message: 'Login failed', color: 'red' });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    notifications.show({ message: 'Logged out', color: 'blue' });
  };

  const register = (params:RegisterParams) => {

  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };

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
