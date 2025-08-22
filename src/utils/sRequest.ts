import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { headers } from 'next/headers';
import { parse } from 'cookie'; // 用于解析 Cookie 中的 token

import apiConfig from '@/config/api.config';

// 创建服务端 axios 实例
const instance = axios.create({
  timeout: 10000,
  withCredentials: true,
  ...apiConfig,
});


// 从请求头获取语言参数（服务端版本）
const getLangFromHeaders = (headers: Record<string, string>): string => {
  return headers['Accept-language'] || headers['X-lang'] || 'en';
};

// 请求拦截器（服务端专用）
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => { // 改为异步函数
    config.headers = config.headers || {};

    // 正确处理可能为 Promise 的 headers()
    const requestHeaders = await headers(); // 使用 await 处理可能的 Promise
    const cookieHeader = requestHeaders.get('cookie');
    const cookies = cookieHeader ? parse(cookieHeader) : {};

    // 添加 token 到请求头
    const token = cookies.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 从请求头获取语言信息（服务端版本）
    const lang = getLangFromHeaders(Object.fromEntries(requestHeaders.entries()));
    config.headers['Accept-Language'] = lang;
    config.headers['X-Lang'] = lang;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（服务端专用）
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    // 可以在这里统一处理服务端请求错误
    return Promise.reject(error);
  }
);

// 服务端请求函数
async function sRequest<T = any>(config: AxiosRequestConfig): Promise<T> {
  return instance.request<T, T>(config);
}

export default sRequest;
