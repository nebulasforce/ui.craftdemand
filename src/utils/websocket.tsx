// src/utils/websocketService.tsx
import apiConfig from '@/config/api.config';

class Websocket {
  private static instance: Websocket;
  private socket: WebSocket | null = null;
  private listeners = new Map<string, ((data: any) => void)[]>();
  private isAuthenticated: boolean = false;

  // 私有构造函数，防止直接实例化
  private constructor() {
    this.isAuthenticated = false;
  }

  // 获取单例模式获取实例
  public static getInstance(): Websocket {
    if (!Websocket.instance) {
      Websocket.instance = new Websocket();
    }
    return Websocket.instance;
  }

  // 连接WebSocket
  public connect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return; // 已连接则直接返回
    }
    let endpoint = apiConfig.websocket?.default || 'ws://localhost:50000/api/v1/ws';
    const token = localStorage.getItem('token');
    if (token) {
      endpoint = `${endpoint}?token=${token}`;
    }
    this.socket = new WebSocket(endpoint);

    // 连接打开时
    this.socket.onopen = () => {
      this.dispatchEvent('open', null);
    };

    // 接收消息时
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.dispatchEvent('message', data);
        // 可以根据消息类型分发到不同的事件
        if (data.type) {
          this.dispatchEvent(data.type, data);
        }
      } catch (error) {
        this.dispatchEvent('error', error);
      }
    };

    // 连接关闭时
    this.socket.onclose = (event) => {
      this.dispatchEvent('close', event);
      // 自动重连
      setTimeout(() => this.connect(), 3000);
    };

    // 连接错误时
    this.socket.onerror = (error) => {
      this.dispatchEvent('error', error);
    };
  }
  // 主动重连方法 - 登录成功后调用
  public reconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
    this.connect(); // 调用connect会自动使用最新的token
  }

  // 发送消息
  public send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  // 关闭连接
  public close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // 订阅事件
  public on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // 取消订阅
  public off(event: string, callback: (data: any) => void): void {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        this.listeners.set(
          event,
          callbacks.filter(cb => cb !== callback)
        );
      }
    }
  }

  // public authenticate() {
  //   return new Promise((resolve, reject) => {
  //     let endpoint = apiConfig.websocket?.default || 'ws://localhost:50000/api/v1/ws';
  //     const token = localStorage.getItem('token');
  //
  //     // TODO
  //   })
  //
  // }

  // 分发事件
  private dispatchEvent(event: string, data: any): void {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      callbacks?.forEach(callback => callback(data));
    }
  }
}

export default Websocket.getInstance();
