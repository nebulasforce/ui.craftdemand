// src/contexts/AuthContext/AuthContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notifications } from '@mantine/notifications';
import {login ,register,logout} from '@/api/auth/api';
import {me} from '@/api/me/api'
import {loginRequest,registerRequest} from '@/api/auth/request';
import {User} from '@/api/me/typings';
import notify from '@/utils/notify';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (params: loginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (params: registerRequest) => Promise<boolean>;
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
        setIsAuthenticated(true);
      } catch (error) {
        if (error instanceof Error) {
          notify(error.message, 'error');
        } else {
          notify('Login failed', 'error');
        }
      }
    }
    setIsLoading(false);
  }, []);

  // loginFunc 登录方法
  const loginFunc = async (params:loginRequest) => {
    try {
      const response = await login(params);
      if (response.success) {
        const accessToken = response.data.accessToken;
        localStorage.setItem('token', accessToken); // 在请求拦截器中会使用
        // 获取当前用户信息
        const resp = await me();
        if (resp.success) {
          const loggingInUser = resp.data
          setUser(loggingInUser)
          localStorage.setItem('user', JSON.stringify(loggingInUser));
          setIsAuthenticated(true);
          notify('Login successfully');
          return true;
        }
        notify('Login failed', 'error');
        return false;
      }
      notify('Login failed', 'error');
      return false;
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('Login failed', 'error');
      }
      return false;
    }
  };

  // logoutFunc 退出方法
  const logoutFunc = async () => {
    try {
      // 异步执行，忽略执行结果
      logout().catch((err) => {
        if (err instanceof Error) {
          notify(err.message, 'error');
        }
      });
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      notifications.show({ message: 'Logged out', color: 'green' });
      notify('Logged out');
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('Logout failed', 'error');
      }
    }
  };

  // registerFunc 注册方法
  const registerFunc = async (params:registerRequest) => {
    try {
      const response = await register(params);
      if (response.success) {
        const result = response.data.result;
        if (result) {
          notify('Register successfully');
        } else {
          notify('Register failed', 'error');
        }
        return result;
      }
      notify('Register failed', 'error');
      return false;
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('Register failed', 'error');
      }
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
