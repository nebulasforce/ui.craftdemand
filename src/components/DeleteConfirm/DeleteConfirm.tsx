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
    ? `Are you sure you want to delete "${itemName}"?`
    : "Are you sure you want to delete this？";

  return (
    <PopConfirm
      title={title}
      description={description}
      confirmText="Delete"
      confirmColor="red"
      onConfirm={onConfirm}
      {...props}
    >
      {children}
    </PopConfirm>
  );
}
