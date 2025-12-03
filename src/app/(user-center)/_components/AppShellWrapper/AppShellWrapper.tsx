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
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <NavbarProvider navbarData={navbarData}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: desktopOpened ? 300 : 80,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShellHeader>
          <HeaderMegaMenu
            user={user}
            navbarCollapsed={!desktopOpened}
            onNavbarToggle={toggleDesktop}
          />
        </AppShellHeader>
        <AppShellNavbar>
          <NavbarSegmented data={navbarData} collapsed={!desktopOpened} />
        </AppShellNavbar>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </NavbarProvider>
  );
}
