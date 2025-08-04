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

// 从当前URL中获取lang参数
const getLangFromUrl = (): string | null => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('lang');
};

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 从本地存储获取语言（关键修正）
    const storedLang = localStorage.getItem('lang');
    if (storedLang) {
      config.headers = config.headers || {}; // 确保headers存在
      config.headers['Accept-Language'] = storedLang;
      config.headers['X-Lang'] = storedLang;
    }

    // 获取URL中的lang参数
    const lang = getLangFromUrl();
    if (lang) {
      config.headers = config.headers || {}; // 确保headers存在
      config.headers['Accept-Language'] = storedLang;
      config.headers['X-Lang'] = storedLang;
      localStorage.setItem('lang', lang);
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
            localStorage.removeItem('user');
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

async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  // 注意这里直接返回 instance.request 的结果，由于响应拦截器的处理，实际返回的是 response.data
  return instance.request<T, T>(config);
}

export default request;
