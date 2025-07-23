// utils/notify.tsx
import { NotificationData, notifications } from '@mantine/notifications';
import React from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default';
type NotificationColor = 'green' | 'red' | 'yellow' | 'blue' | 'dark';


const notify = (message: React.ReactNode, type: NotificationType = 'success') => {
  const baseConfig: NotificationData = {
    message,
    autoClose: 3000,
    position: 'top-right',
  };

  const colorMap: Record<NotificationType, NotificationColor> = {
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    default: 'dark',
  };

  // 修正类型断言方式
  const config = {
    ...baseConfig,
    color: colorMap[type],
  };

  return notifications.show(config);
};

export default notify;
