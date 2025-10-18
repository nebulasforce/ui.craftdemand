// src/contexts/NotificationContext.tsx
'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { myUnreadMessageCount } from '@/api/my/api';
import apiConfig from '@/config/api.config';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext/WebSocketContext';
import notify from '@/utils/notify';
import ws from '@/utils/websocket';
import { myUnreadMessageCountData } from '@/api/my/response';


interface NotificationContextType {
  unreadCount: number;
  markAsRead: () => void;
  isLoading: boolean; // 标记是否正在加载未读数量
  updateUnreadCount: (count: number) => void;
}

interface NotificationProviderProps {
  children: ReactNode;
}

async function fetchUnreadMessageCount() {
  try {
    const response = await myUnreadMessageCount();
    if (response.success && response.data) {
      return response.data.count || 0;
    }
    return 0;
  } catch (error) {
    if (error instanceof Error) {
      notify(error.message, 'error');
    }
    return 0;
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider( { children }: NotificationProviderProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth(); // 获取登录状态
  const { isConnected } = useWebSocket();

  const updateUnreadCount = (count: number ) => {
    if (count >= 0){
      setUnreadCount(count);
    }
  }


  // 监听登录状态变化：登录后自动获取
  useEffect( () => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetchUnreadMessageCount().then((n) => {
        setUnreadCount(n);
      });
      setIsLoading(false);
    } else {
      setUnreadCount(0); // 退出登录时重置为0
    }
  }, [isAuthenticated]); // 仅当登录状态变化时触发

  // handleNotification 处理通知消息 - 消息来源于src/utils/websocket.tsx 根据类型分发的事件
  const handleNotification = (data: myUnreadMessageCountData) => {
    console.log('NotificationProvider', data);
    // 根据收到的data中的数量处理
    if(data.count >= 0 && isAuthenticated){
      setUnreadCount(data.count);
    }
  };

  useEffect(() => {
    // 处理通知
    const key = apiConfig.websocket?.notificationTypeKey || 'notification'

    // 订阅WebSocket通知事件
    ws.on(key, handleNotification);
    return () => {
      ws.off(key, handleNotification);
    };
  }, [isConnected, isAuthenticated]);

  const markAsRead = async () => {
    try {
      // await fetch('/api/notifications/read', { method: 'POST' }); // 通知后端
      setUnreadCount(0);
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('Mark Ask Message Read Failed', 'error');
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, markAsRead, isLoading,updateUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
