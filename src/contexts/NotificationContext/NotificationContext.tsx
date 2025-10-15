// src/contexts/NotificationContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext/WebSocketContext';
import ws from '@/utils/websocket';

interface NotificationContextType {
  unreadCount: number;
  markAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const { isConnected } = useWebSocket();

  useEffect(() => {
    const handleNotification = () => {
      setUnreadCount(prev => prev + 1);
    };

    // 订阅WebSocket通知事件
    ws.on('notification', handleNotification);

    return () => {
      ws.off('notification', handleNotification);
    };
  }, [isConnected]);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, markAsRead }}>
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
