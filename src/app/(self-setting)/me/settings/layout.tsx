// /src/app/layout.tsx
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
} from "@mantine/core";

import "@/app/globals.css";
import React from 'react';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <HeaderMegaMenu  />
      </AppShellHeader>
      <AppShellMain>
        {children}
      </AppShellMain>
    </AppShell>
  );
}
