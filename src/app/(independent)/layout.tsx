// 继承根布局的大部分配置，但移除Footer
import {
  MantineProvider,
  AppShell,
  AppShellHeader,
  AppShellMain,
} from "@mantine/core";
import theme from "@/app/theme";
import { Notifications } from '@mantine/notifications';
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { AuthProvider } from '@/contexts/AuthContext/AuthContext';

export default function NoFooterLayout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <AuthProvider>
        <AppShell header={{ height: 60 }} padding="md">
          <AppShellHeader>
            <HeaderMegaMenu />
          </AppShellHeader>
          <AppShellMain>
            {children}
          </AppShellMain>
          {/* 这里不渲染Footer */}
        </AppShell>
      </AuthProvider>
    </MantineProvider>
  );
}
