// config/api.config.ts
export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
  websocket?: {
    endpoint: string;
    authMessageTypeKey: string;
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
      endpoint: 'ws://localhost:50000/api/v1/ws',
      authMessageTypeKey:'authenticate', // 定义在服务端internal/application/objects/dto/ws/ws.go
    }
  },
  test: {
    baseURL: 'https://test-api.yourdomain.com',
    timeout: 10000,
    withCredentials: false,
    websocket: {
      endpoint: 'ws://test-api.yourdomain.com/api/v1/ws',
      authMessageTypeKey:'authenticate', // 定义在服务端internal/application/objects/dto/ws/ws.go
    }
  },
  production: {
    baseURL: 'https://api.yourdomain.com',
    timeout: 15000,
    withCredentials: false,
    websocket: {
      endpoint: 'ws://api.yourdomain.com/api/v1/ws',
      authMessageTypeKey:'authenticate', // 定义在服务端internal/application/objects/dto/ws/ws.go
    }
  },
};

// 导出当前环境配置
export default configs[env];
