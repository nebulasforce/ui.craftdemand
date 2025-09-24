// config/api.config.ts
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  websocket?: {
    default: string
  }
}

// 根据不同环境导出不同配置
const env = process.env.NODE_ENV || 'development';

const configs: Record<string, ApiConfig> = {
  development: {
    baseURL: 'http://localhost:50000',
    timeout: 10000,
    withCredentials: false,
    websocket: {
      default: 'ws://localhost:50000/api/v1/ws',
    }
  },
  test: {
    baseURL: 'https://test-api.yourdomain.com',
    timeout: 10000,
    withCredentials: false,
    websocket: {
      default: 'ws://test-api.yourdomain.com/api/v1/ws',
    }
  },
  production: {
    baseURL: 'https://api.yourdomain.com',
    timeout: 15000,
    withCredentials: false,
    websocket: {
      default: 'ws://api.yourdomain.com/api/v1/ws',
    }
  },
};

// 导出当前环境配置
export default configs[env];
