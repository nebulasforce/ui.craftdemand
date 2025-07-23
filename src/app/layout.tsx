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
import "@/app/globals.css";

import { Notifications } from '@mantine/notifications';


import {FooterLinks} from '@/components/FooterLinks/FooterLinks'
import React from 'react';

import appConfig from "../../config/app.config"
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';

import { AuthProvider } from '@/contexts/AuthContext/AuthContext';


export const metadata= appConfig.metadata


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {


  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
          <MantineProvider theme={theme}>
            <Notifications position="top-center" />
            <AuthProvider>
              <AppShell header={{ height: 60 }} padding="md">
                <AppShellHeader>
                  <HeaderMegaMenu  />
                </AppShellHeader>
                <AppShellMain>
                  {children}
                </AppShellMain>
                <FooterLinks />
              </AppShell>
            </AuthProvider>
          </MantineProvider>
      </body>
    </html>
  );
}
