"use client"
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import "@/app/globals.css";
import React from 'react';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { NavbarSegmented } from '@/components/NavbarSegmented/NavbarSegmented';
import { NavbarProvider } from '@/contexts/NavbarContext/NavbarContext'; // 引入Context

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  const [opened] = useDisclosure();

  return (
    <NavbarProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShellHeader>
          <HeaderMegaMenu  />
        </AppShellHeader>
        <AppShellNavbar>
          <NavbarSegmented />
        </AppShellNavbar>
        <AppShellMain>
          {children}
        </AppShellMain>
      </AppShell>
    </NavbarProvider>
  );
}
