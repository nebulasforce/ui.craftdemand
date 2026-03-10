// src/app/(user-center)/layout.tsx
import '@/app/globals.css';
import React from 'react';
import { listGroup as navbarListGroup } from '@/api/ssr/navbar';
import { listGroup as headDropdownListGroup } from '@/api/ssr/headDropdown';
import { me } from '@/api/ssr/me';
import { listGroupData as NavbarListGroupData } from '@/api/navbar/response';
import { listGroupData as HeadDropdownListGroupData } from '@/api/headDropdown/response';
import { AppShellWrapper } from './_components/AppShellWrapper/AppShellWrapper';
import { UserProvider } from '@/contexts/UserContext/UserContext';


const defaultNavbarData: NavbarListGroupData = {
  Account: [],
  System: [],
};

const defaultHeadDropdownData: HeadDropdownListGroupData = {};

// 在布局中获取数据（App Router 支持布局中的异步数据获取）

// 获取侧边栏数据
async function getNavbarData() {
  try {
    const response = await navbarListGroup();
    return response.data || defaultNavbarData;
  } catch (error) {
    return defaultNavbarData;
  }
}

// 在布局中获取数据（App Router 支持布局中的异步数据获取）
async function geMe() {
  try {
    const response = await me();
    return response.data || null;
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  // 获取导航栏和头部下拉数据、当前用户
  const [navbarData, headDropdownData, user] = await Promise.all([
    getNavbarData(),
    (async () => {
      try {
        const response = await headDropdownListGroup();
        return response.data || defaultHeadDropdownData;
      } catch (error) {
        return defaultHeadDropdownData;
      }
    })(),
    geMe(),
  ]);
  return (
    <UserProvider initialUser={user}>
      <AppShellWrapper navbarData={navbarData} headerDropdownData={headDropdownData} user={user} >
        {children}
      </AppShellWrapper>
    </UserProvider>
  );
}
