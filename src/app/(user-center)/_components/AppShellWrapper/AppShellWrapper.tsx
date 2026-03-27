'use client';

import React, { useEffect } from 'react';
import { AppShell, AppShellHeader, AppShellMain, AppShellNavbar, Center, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { User } from '@/api/my/typings';
import { listGroupData as NavbarListGroupData } from '@/api/navbar/response';
import { listGroupData as HeadDropdownListGroupData } from '@/api/headDropdown/response';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { NavbarSegmented } from '@/components/NavbarSegmented/NavbarSegmented';
import { SidebarHoverToggle } from '@/components/SidebarHoverToggle/SidebarHoverToggle';
import { NavbarProvider } from '@/contexts/NavbarContext/NavbarContext';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

interface AppShellWrapperProps {
  navbarData: NavbarListGroupData;
  headerDropdownData: HeadDropdownListGroupData;
  children: React.ReactNode;
  user: User | null;
}

export function AppShellWrapper({ navbarData, headerDropdownData, children, user }: AppShellWrapperProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

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
        style={{ position: 'relative' }}
      >
        <AppShellHeader>
          <HeaderMegaMenu user={user} headerDropdownData={headerDropdownData} />
        </AppShellHeader>
        <SidebarHoverToggle collapsed={!desktopOpened} onToggle={toggleDesktop} />
        <AppShellNavbar>
          <NavbarSegmented data={navbarData} collapsed={!desktopOpened} />
        </AppShellNavbar>
        <AppShellMain>{children}</AppShellMain>
      </AppShell>
    </NavbarProvider>
  );
}