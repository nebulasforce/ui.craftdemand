// src/components/PopConfirm/PopConfirm.tsx

import { Popover, Button, Text, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';

interface PopConfirmProps {
  // 触发元素
  children: ReactNode;
  // 确认回调
  onConfirm: () => void;
  // 取消回调（可选）
  onCancel?: () => void;
  // 标题
  title?: string;
  // 描述内容
  description?: string;
  // 确认按钮文字
  confirmText?: string;
  // 取消按钮文字
  cancelText?: string;
  // 确认按钮颜色
  confirmColor?: string;
  // 触发方式
  trigger?: 'click' | 'hover';
  // 位置
  position?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  // 宽度
  width?: number;
  // 是否显示箭头
  withArrow?: boolean;
}

export function PopConfirm({
                             children,
                             onConfirm,
                             onCancel,
                             title,
                             description = "Are you sure you want to do this？",
                             confirmText = "Confirm",
                             cancelText = "Cancel",
                             confirmColor = "red",
                             trigger = "click",
                             position = "bottom",
                             width = 300,
                             withArrow = true
                           }: PopConfirmProps) {
  const [opened, { close, open, toggle }] = useDisclosure(false);

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  const handleCancel = () => {
    onCancel?.();
    close();
  };

  // 根据触发方式设置事件处理器
  const triggerProps = {
    ...(trigger === 'click' ? { onClick: toggle } : {}),
    ...(trigger === 'hover' ? { onMouseEnter: open, onMouseLeave: close } : {})
  };

  return (
    <Popover
      width={width}
      position={position}
      withArrow={withArrow}
      shadow="md"
      opened={opened}
      onChange={close}
    >
      <Popover.Target {...triggerProps}>
        {children}
      </Popover.Target>
      <Popover.Dropdown>
        <>
          {title && (
            <Text size="sm" fw={500} mb={description ? 4 : 0}>
              {title}
            </Text>
          )}
          {description && (
            <Text size="sm" c="dimmed" mb="md">
              {description}
            </Text>
          )}
          <Group justify="flex-end" gap="xs">
            <Button
              variant="default"
              size="xs"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
            <Button
              color={confirmColor}
              size="xs"
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </Group>
        </>
      </Popover.Dropdown>
    </Popover>
  );
}
