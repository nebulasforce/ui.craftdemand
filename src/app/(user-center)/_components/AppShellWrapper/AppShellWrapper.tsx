'use client';

import React from 'react';
import { AppShell, AppShellHeader, AppShellMain, AppShellNavbar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { User } from '@/api/my/typings';
import { listGroupData } from '@/api/navbar/response';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { NavbarSegmented } from '@/components/NavbarSegmented/NavbarSegmented';
import { NavbarProvider } from '@/contexts/NavbarContext/NavbarContext';

interface AppShellWrapperProps {
  navbarData: listGroupData;
  children: React.ReactNode;
  user: User | null;
}

export function AppShellWrapper({ navbarData, children, user }: AppShellWrapperProps) {
  const [opened] = useDisclosure();

  return (
    <NavbarProvider navbarData={navbarData}>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShellHeader>
          {/*<HeaderMegaMenu />*/}
          <HeaderMegaMenu user={user} />
        </AppShellHeader>
        <AppShellNavbar>
          {/* 将数据传递给NavbarSegmented组件 */}
          <NavbarSegmented data={navbarData} />
        </AppShellNavbar>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </NavbarProvider>
  );
}
