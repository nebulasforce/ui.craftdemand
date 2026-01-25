// src/components/DeleteConfirm/DeleteConfirm.tsx

// components/DeleteConfirm.tsx

import { ReactNode } from 'react';
import { PopConfirm } from '@/components/PopConfirm/PopConfirm';

interface DeleteConfirmProps {
  title?: string;
  children: ReactNode;
  onConfirm: () => void;
  itemName?: string;
  [key: string]: any;
}

export function DeleteConfirm({
                                title,
                                children,
                                onConfirm,
                                itemName,
                                ...props
                              }: DeleteConfirmProps) {
  const description = itemName
    ? `确定要删除 "${itemName}" 吗？`
    : "确定要删除此项吗？";

  return (
    <PopConfirm
      title={title}
      description={description}
      confirmText="删除"
      confirmColor="red"
      onConfirm={onConfirm}
      {...props}
    >
      {children}
    </PopConfirm>
  );
}
