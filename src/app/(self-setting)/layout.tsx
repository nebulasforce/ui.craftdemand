// /src/app/layout.tsx
"use client"
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
} from "@mantine/core";

import "@/app/globals.css";
import React from 'react';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { NavbarSegmented } from '@/components/NavbarSegmented/NavbarSegmented';


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
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
  );
}
