// @/contexts/NavbarContext.tsx
'use client';
import { usePathname } from 'next/navigation'; // 用于获取当前路由
import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import type { SectionType } from '@/components/NavbarSegmented/NavbarSegmented'; // 导入SectionType类型
import { listGroupData as navbarGroupData } from '@/api/navbar/response';

type NavbarContextType = {
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
  section: SectionType;
  setSection: Dispatch<SetStateAction<SectionType>>;
  navbarData: navbarGroupData; // 接收导航数据用于路由匹配
};

// getInitialStateFromPath 辅助函数：根据当前路径匹配对应的 section 和 active
const getInitialStateFromPath = (
  pathname: string,
  navbarData: navbarGroupData
): { section: SectionType; active: string } => {
  // 遍历所有 section
  for (const [section, items] of Object.entries(navbarData) as [SectionType, any[]][]) {
    // 查找当前路径匹配的导航项
    const matchedItem = items.find((item) => pathname.startsWith(item.url));
    if (matchedItem) {
      return { section, active: matchedItem.name };
    }
  }
  // 默认 fallback（避免空值）
  return { section: 'Account' as SectionType, active: '' };
};

interface NavbarProviderProps {
  children: ReactNode;
  navbarData: navbarGroupData;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children,navbarData }: NavbarProviderProps) {
  const pathname = usePathname(); // 获取当前路由
  // 初始状态设为基于路由解析的结果（而非空值）
  const [section, setSection] = useState<SectionType>(() => {
    return getInitialStateFromPath(pathname, navbarData).section;
  });
  const [active, setActive] = useState<string>(() => {
    return getInitialStateFromPath(pathname, navbarData).active;
  });
  return (
    <NavbarContext.Provider value={{ active, setActive, section, setSection ,navbarData}}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}
