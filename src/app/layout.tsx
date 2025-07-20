// /src/app/layout.tsx
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
  AppShell,
  AppShellHeader,
  AppShellMain,
} from "@mantine/core";
import theme from "@/app/theme";
import "./globals.css";
import '@mantine/core/styles.css';

import {FooterLinks} from '@/components/FooterLinks/FooterLinks'
import React from 'react';

import appConfig from "../../config/app.config"
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';


export const metadata= appConfig.metadata


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
    <head>
      <ColorSchemeScript />
    </head>
    <body className="antialiased">
    <MantineProvider theme={theme}>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShellHeader>
          <HeaderMegaMenu />
        </AppShellHeader>
        <AppShellMain>
          {children}
        </AppShellMain>
        <FooterLinks />
      </AppShell>
    </MantineProvider>
    </body>
    </html>
  );
}
