import type { Metadata } from "next";
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

import {DoubleHeader} from '@/components/DoubleHeader/DoubleHeader'
import {FooterLinks} from '@/components/FooterLinks/FooterLinks'

export const metadata: Metadata = {
  title: "Next App Mantine Tailwind Template",
  description: "Next App Mantine Tailwind Template",
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
    <head>
      <ColorSchemeScript />
    </head>
    <body className="antialiased">
    <MantineProvider theme={theme}>
      <AppShell header={{ height: 85 }} padding="md">
        <AppShellHeader>
          <DoubleHeader />
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
