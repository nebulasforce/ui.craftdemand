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
import { myInfo } from '@/api/ssr/my';
import { listGroup as headDropdownListGroup } from '@/api/ssr/headDropdown';
import { listGroupData as HeadDropdownListGroupData } from '@/api/headDropdown/response';
import { ScrollToTop } from './_components/ScrollToTop/ScrollToTop';

// 在布局中获取数据（App Router 支持布局中的异步数据获取）
async function geMyInfo() {
  try {
    const response = await myInfo();
    return response.data || null;
  } catch (error) {
    return null;
  }
}

async function getHeadDropdownData() {
  const defaultHeadDropdownData: HeadDropdownListGroupData = {};
  try {
    const response = await headDropdownListGroup();
    return response.data || defaultHeadDropdownData;
  } catch {
    return defaultHeadDropdownData;
  }
}


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [user, headDropdownData] = await Promise.all([geMyInfo(), getHeadDropdownData()]);
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <HeaderMegaMenu user={user} headerDropdownData={headDropdownData} />
      </AppShellHeader>
      <AppShellMain>
        {children}
      </AppShellMain>
      <FooterLinks />
      <ScrollToTop />
    </AppShell>
  );
}
