// src/utils/request.ts
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

import apiConfig from '@/config/api.config';

// 创建 axios 实例
const instance = axios.create({
  timeout: 10000,
  withCredentials: true,
  ...apiConfig,
});

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (window.location.pathname !== '/auth/login') {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }
          break;
        case 403:
          break;
        case 404:
          break;
        case 500:
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);



// 核心 request 方法
// async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
//   const response = await instance.request<T>(config);
//   return response.data;
// }

// 核心 request 方法 - 修改为返回完整的响应对象
// async function request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
//   return instance.request<T, R>(config);
// }
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  // 注意这里直接返回 instance.request 的结果，由于响应拦截器的处理，实际返回的是 response.data
  return instance.request<T, T>(config);
}

export default request;
