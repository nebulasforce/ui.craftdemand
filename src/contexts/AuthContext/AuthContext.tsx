"use client"

// src/contexts/AuthContext/AuthContext.tsx

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // 用于App Router
// 如果你使用Pages Router，导入方式为：
// import { useRouter } from 'next/router';
import { login, logout, register } from '@/api/auth/api';
import { loginRequest, registerRequest } from '@/api/auth/request';
import { loginResponse, registerResponse } from '@/api/auth/response';
import { me } from '@/api/me/api';
import { User } from '@/api/me/typings';
import notify from '@/utils/notify';
import Cookies from 'js-cookie';


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

const removeStored = ()=> {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  Cookies.remove('token');
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Pages Router获取查询参数的方式不同，需要在loginFunc中使用router.query

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

  // loginFunc 登录方法，支持传入redirectPath或从URL参数获取 - 登录方法只设置存储以及返回响应信息【需要调用方自行做跳转以及提示】
  const loginFunc = async (params: loginRequest) => {
    try {
      const response = await login(params);
      if (response.success && response.data?.accessToken) {
        const accessToken = response.data?.accessToken;
        localStorage.setItem('token', accessToken);
        Cookies.set('token', accessToken, {
          expires: 24
        });

        // 获取当前用户信息
        const resp = await me();
        if (resp.success && resp.data) {
          const loggingInUser = resp.data;
          setUser(loggingInUser);
          localStorage.setItem('user', JSON.stringify(loggingInUser));
          setIsAuthenticated(true);


          return response;
        }

        // 如果获取用户信息失败，清理已存储的数据
        removeStored()
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

  // logoutFunc 退出方法 - 退出方法比较特殊，直接在这里提示和跳转
  const logoutFunc = async () => {
    try {
      await logout();

      // 清除本地存储和状态
      setUser(null);
      setIsAuthenticated(false);
      removeStored()

      notify('Logged out Successfully', 'success');
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      }
      notify('Logout Failed', 'error');
    }
  };

  // registerFunc 注册方法
  const registerFunc = async (params: registerRequest) => {
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
