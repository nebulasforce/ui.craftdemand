// src/contexts/NotificationContext.tsx
'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { myUnreadMessageCount } from '@/api/my/api';
import apiConfig from '@/config/api.config';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useWebSocket } from '@/contexts/WebSocketContext/WebSocketContext';
import notify from '@/utils/notify';
import ws from '@/utils/websocket';
import { notificationResponseData } from '@/api/ws/response';

interface NotificationContextType {
  unreadCount: number;
  markAsRead: () => void;
  isLoading: boolean; // 标记是否正在加载未读数量
  updateUnreadCount: (count: number) => void;
  refreshUnreadCount: () => Promise<void>; // 手动刷新未读数量
}

interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * 从服务端获取未读消息数量
 */
async function fetchUnreadMessageCount(): Promise<number> {
  try {
    const response = await myUnreadMessageCount();
    if (response.success && response.data) {
      return response.data.count || 0;
    }
    return 0;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to fetch unread message count:', error.message);
      // 不显示错误通知，避免干扰用户体验
    }
    return 0;
  }
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth(); // 获取登录状态
  const { isConnected } = useWebSocket();
  
  // 使用 ref 存储最新的认证状态，避免闭包问题
  const isAuthenticatedRef = useRef(isAuthenticated);
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  /**
   * 更新未读消息数量
   */
  const updateUnreadCount = useCallback((count: number) => {
    if (count >= 0) {
      setUnreadCount(count);
    }
  }, []);

  /**
   * 手动刷新未读消息数量
   */
  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticatedRef.current) {
      return;
    }
    setIsLoading(true);
    try {
      const count = await fetchUnreadMessageCount();
      updateUnreadCount(count);
    } catch (error) {
      console.error('Failed to refresh unread count:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateUnreadCount]);

  /**
   * 处理 WebSocket 推送的未读消息通知
   */
  const handleNotification = useCallback((data: notificationResponseData) => {
    console.log('NotificationContext: Received notification data:', data);
    
    // 只有在已认证状态下才处理通知
    if (!isAuthenticatedRef.current) {
      console.warn('NotificationContext: Ignoring notification - user not authenticated');
      return;
    }

    // 验证数据格式
    if (typeof data === 'object' && typeof data.count === 'number') {
      const newCount = data.count;
      
      // 更新未读数量
      if (newCount >= 0) {
        setUnreadCount((prevCount) => {
          console.log('NotificationContext: Updating unread count from', prevCount, 'to', newCount);
          return newCount;
        });
      } else {
        console.warn('NotificationContext: Invalid count value (negative):', newCount);
      }
    } else {
      console.warn('NotificationContext: Invalid notification data format:', data, 'Expected: { count: number }');
    }
  }, []);

  /**
   * 处理 WebSocket 推送的 messageUnread 类型消息
   */
  const handleMessageUnread = useCallback((data: any) => {
    console.log('NotificationContext: Received messageUnread data:', data);
    
    // 只有在已认证状态下才处理通知
    if (!isAuthenticatedRef.current) {
      console.warn('NotificationContext: Ignoring messageUnread - user not authenticated');
      return;
    }

    // 验证数据格式：data.unreadCount 可能是字符串或数字
    if (typeof data === 'object' && data.unreadCount !== undefined) {
      // 将 unreadCount 转换为数字（支持字符串和数字格式）
      const unreadCountValue = typeof data.unreadCount === 'string' 
        ? parseInt(data.unreadCount, 10) 
        : Number(data.unreadCount);
      
      // 检查转换后的值是否有效
      if (!isNaN(unreadCountValue) && unreadCountValue >= 0) {
        setUnreadCount((prevCount) => {
          console.log('NotificationContext: Updating unread count from', prevCount, 'to', unreadCountValue);
          return unreadCountValue;
        });
      } else {
        console.warn('NotificationContext: Invalid unreadCount value:', data.unreadCount);
      }
    } else {
      console.warn('NotificationContext: Invalid messageUnread data format:', data, 'Expected: { unreadCount: string | number }');
    }
  }, []);

  /**
   * 监听登录状态变化：登录后自动获取初始未读数量
   */
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      fetchUnreadMessageCount()
        .then((count) => {
          updateUnreadCount(count);
        })
        .catch((error) => {
          console.error('Failed to fetch initial unread count:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // 退出登录时重置为0
      setUnreadCount(0);
    }
  }, [isAuthenticated, updateUnreadCount]);

  /**
   * 订阅 WebSocket 通知事件
   * 当 WebSocket 连接成功且用户已认证时，自动订阅通知
   */
  useEffect(() => {
    // 只有在连接成功且已认证时才订阅
    if (!isConnected || !isAuthenticated) {
      console.log('NotificationContext: Not subscribing - isConnected:', isConnected, 'isAuthenticated:', isAuthenticated);
      return;
    }

    const notificationTypeKey = apiConfig.websocket?.notificationTypeKey || 'notification';
    console.log('NotificationContext: Subscribing to notification event with key:', notificationTypeKey);

    // 订阅 WebSocket 通知事件
    ws.on(notificationTypeKey, handleNotification);

    // 订阅 messageUnread 类型消息
    ws.on('messageUnread', handleMessageUnread);

    // 清理函数：取消订阅
    return () => {
      console.log('NotificationContext: Unsubscribing from notification events');
      ws.off(notificationTypeKey, handleNotification);
      ws.off('messageUnread', handleMessageUnread);
    };
  }, [isConnected, isAuthenticated, handleNotification, handleMessageUnread]);

  /**
   * 标记所有消息为已读
   * 注意：这里只是前端更新，实际应该调用后端接口标记已读
   */
  const markAsRead = useCallback(async () => {
    try {
      // TODO: 调用后端接口标记所有消息为已读
      // await markAllMessagesAsRead();
      
      // 临时直接更新为0，实际应该等待后端确认后再更新
      setUnreadCount(0);
      
      // 可选：刷新一次确保数据同步
      // await refreshUnreadCount();
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      } else {
        notify('Mark messages as read failed', 'error');
      }
    }
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        unreadCount, 
        markAsRead, 
        isLoading, 
        updateUnreadCount,
        refreshUnreadCount 
      }}
    >
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
