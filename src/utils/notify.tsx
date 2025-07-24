// utils/notify.tsx
import { NotificationData, notifications } from '@mantine/notifications';
import {ReactNode} from 'react';
import { IconX, IconCheck, IconAlertTriangle, IconInfoCircle, IconBell } from '@tabler/icons-react';

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default';
type NotificationColor = 'green' | 'red' | 'yellow' | 'blue' | 'dark';


const notify = (message: ReactNode, type: NotificationType = 'success') => {
  // const icon :ReactNode = <I
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
  const iconMap: Record<NotificationType, ReactNode> = {
    success: <IconCheck size={18} />,
    error: <IconX size={18} />,
    warning: <IconAlertTriangle size={18} />,
    info: <IconInfoCircle size={18} />,
    default: <IconBell size={18} />,
  };



  // 修正类型断言方式
  const config = {
    ...baseConfig,
    color: colorMap[type],
    icon: iconMap[type],
  };

  return notifications.show(config);
};

export default notify;
