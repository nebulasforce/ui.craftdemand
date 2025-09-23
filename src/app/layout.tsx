// /src/app/layout.tsx
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
//import { NavigationProgress } from '@mantine/nprogress';
import theme from '@/app/theme';
import '@/app/globals.css';
import { AuthProvider } from '@/contexts/AuthContext/AuthContext';
import React from 'react';
import { Notifications } from '@mantine/notifications';
import appConfig from '../../config/app.config';
// 引入NProgress监听器
//import { NProgressListener } from '@/components/NProgressListener/NProgressListener';

export const metadata = appConfig.metadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <title />
        <ColorSchemeScript />
      </head>
      <body className="antialiased">
        <MantineProvider theme={theme}>
          {/*<NavigationProgress />*/}
          <Notifications position="top-center" />
          {/* 添加路由监听器 */}
          {/*<NProgressListener />*/}
          <AuthProvider>{children}</AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
