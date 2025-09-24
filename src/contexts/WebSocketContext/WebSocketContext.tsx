'use client';

// 使用方法
//  const { isConnected, messages, send } = useWebSocket();

import wsService from '@/utils/websocket';
import { ReactNode,createContext, useContext, useEffect, useState } from 'react';

// 创建上下文存储WebSocket状态和方法
const WebSocketContext = createContext<{
  isConnected: boolean;
  messages: any[];
  send: (data: any) => void;
} | undefined>(undefined);

// 提供者组件 - 所有WebSocket逻辑在这里处理
export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    // 连接状态变化处理
    const handleOpen = () => setIsConnected(true);
    const handleClose = () => setIsConnected(false);

    // 消息处理
    const handleMessage = (data: any) => {
      setMessages(prev => [...prev, data]);
    };

    // 订阅事件
    wsService.on('open', handleOpen);
    wsService.on('close', handleClose);
    wsService.on('message', handleMessage);

    // 初始化连接
    wsService.connect();

    // 清理函数
    return () => {
      wsService.off('open', handleOpen);
      wsService.off('close', handleClose);
      wsService.off('message', handleMessage);
      // 可选：页面卸载时关闭连接
      wsService.close();
    };
  }, []);

  // 发送消息方法
  const send = (data: any) => {
    if (isConnected) {
      wsService.send(data);
    }
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, messages, send }}>
      {children}
    </WebSocketContext.Provider>
  );
}

// 自定义Hook方便组件使用
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

