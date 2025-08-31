// src/app/(user-center)/layout.tsx
import '@/app/globals.css';
import React from 'react';
import { listGroup } from '@/api/ssr/navbar';
import { me } from '@/api/ssr/me';
import { listGroupData } from '@/api/navbar/response';
import { AppShellWrapper } from './_components/AppShellWrapper/AppShellWrapper';
import { UserProvider} from '@/contexts/UserContext/UserContext';


const defaultNavbarData: listGroupData = {
  Account: [],
  System: [],
};

// 在布局中获取数据（App Router 支持布局中的异步数据获取）

// 获取侧边栏数据
async function getNavbarData() {
  try {
    const response = await listGroup();
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

  // 获取导航栏数据
  const navbarData = await getNavbarData();
  const user = await geMe();


  return (
    <UserProvider user={user}>
    <AppShellWrapper navbarData={navbarData} user={user} >
      {children}
    </AppShellWrapper>
      </UserProvider>
  );
}
