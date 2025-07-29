// src/contexts/AuthContext/AuthContext.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { login, logout, register } from '@/api/auth/api';
import { loginRequest, registerRequest } from '@/api/auth/request';
import { loginResponse, registerResponse } from '@/api/auth/response';
import { me } from '@/api/me/api';
import { User } from '@/api/me/typings';
import notify from '@/utils/notify';


interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (params: loginRequest) => Promise<loginResponse>;
  logout: () => Promise<void>;
  register: (params: registerRequest) => Promise<registerResponse>;
}

// baseErrLoginResponse 默认错误响应
const baseErrLoginResponse: loginResponse = {
  success: false,
  code: 500500,
  message: 'Login failed',
};

const baseErrRegisterResponse: registerResponse = {
  success: false,
  code: 500400,
  message: 'Register failed',
};

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
      if (response.success && response.data?.accessToken) {
        const accessToken = response.data?.accessToken;
        localStorage.setItem('token', accessToken); // 在请求拦截器中会使用
        // 获取当前用户信息
        const resp = await me();
        if (resp.success && resp.data) {
          const loggingInUser = resp.data
          setUser(loggingInUser)
          localStorage.setItem('user', JSON.stringify(loggingInUser));
          setIsAuthenticated(true);
          return response;
        }
        localStorage.removeItem('token');
        return {
          ...baseErrLoginResponse,
          message: resp.message,
        };
      }
      return {
        ...baseErrLoginResponse,
        message: response.message,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          ...baseErrLoginResponse,
          message: error.message
        };
      }
      return baseErrLoginResponse;
    }
  };

  // logoutFunc 退出方法
  const logoutFunc = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      }
      notify('Logout Failed', 'error');
    }
  };

  // registerFunc 注册方法
  const registerFunc = async (params:registerRequest) => {
    try {
      return await register(params);
    } catch (error) {
      if (error instanceof Error) {
        return {
          ...baseErrRegisterResponse,
          message: error.message
        }
      }
      return baseErrRegisterResponse
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
