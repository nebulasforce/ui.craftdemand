'use client';

import React from 'react';
import { AppShell, AppShellHeader, AppShellMain, AppShellNavbar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { User } from '@/api/my/typings';
import { listGroupData as NavbarListGroupData } from '@/api/navbar/response';
import { listGroupData as HeadDropdownListGroupData } from '@/api/headDropdown/response';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { NavbarSegmented } from '@/components/NavbarSegmented/NavbarSegmented';
import { NavbarProvider } from '@/contexts/NavbarContext/NavbarContext';

interface AppShellWrapperProps {
  navbarData: NavbarListGroupData;
  headerDropdownData: HeadDropdownListGroupData;
  children: React.ReactNode;
  user: User | null;
}

export function AppShellWrapper({ navbarData, headerDropdownData, children, user }: AppShellWrapperProps) {
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
            headerDropdownData={headerDropdownData}
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
