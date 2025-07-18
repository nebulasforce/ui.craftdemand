// config/api.config.ts
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
}

// 根据不同环境导出不同配置
const env = process.env.NODE_ENV || 'development';

const configs: Record<string, ApiConfig> = {
  development: {
    baseURL: 'http://localhost:50000',
    timeout: 10000,
    withCredentials: false,
  },
  test: {
    baseURL: 'https://test-api.yourdomain.com',
    timeout: 10000,
    withCredentials: false,
  },
  production: {
    baseURL: 'https://api.yourdomain.com',
    timeout: 15000,
    withCredentials: false,
  },
};

// 导出当前环境配置
export default configs[env];
