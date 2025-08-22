// /src/app/layout.tsx
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
} from "@mantine/core";

import "@/app/globals.css";
import {FooterLinks} from '@/components/FooterLinks/FooterLinks'
import React from 'react';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { me } from '@/api/ssr/me';

// 在布局中获取数据（App Router 支持布局中的异步数据获取）
async function geMe() {
  try {
    const response = await me();
    return response.data || null;
  } catch (error) {
    return null;
  }
}


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const user = await geMe();
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <HeaderMegaMenu user={user}  />
      </AppShellHeader>
      <AppShellMain>
        {children}
      </AppShellMain>
      <FooterLinks />
    </AppShell>
  );
}
