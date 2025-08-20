// src/contexts/BreadcrumbContext.tsx
'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

// 定义面包屑项类型
export interface BreadcrumbItem {
  label: string; // 显示文本
  path?: string; // 跳转路径（可选）
}

// 定义上下文类型
type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: Dispatch<SetStateAction<BreadcrumbItem[]>>;
};

// 创建上下文
const BreadcrumbsContext = createContext<BreadcrumbContextType | undefined>(undefined);

// 上下文提供者组件
export function BreadcrumbsProvider({
  children,
  defaultBreadcrumbs = [],
}: {
  children: ReactNode;
  defaultBreadcrumbs?: BreadcrumbItem[];
}) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>(defaultBreadcrumbs);


  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}

// 自定义Hook简化调用
export function useBreadcrumbs() {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
}
