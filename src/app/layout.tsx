// /src/app/layout.tsx
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import theme from '@/app/theme';
import '@/app/globals.css';
import { AuthProvider } from '@/contexts/AuthContext/AuthContext';
import React from 'react';
import { Notifications } from '@mantine/notifications';
import appConfig from '../../config/app.config';

export const metadata = appConfig.metadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <MantineProvider theme={theme}>
          <Notifications position="top-center" />
          <AuthProvider>{children}</AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
