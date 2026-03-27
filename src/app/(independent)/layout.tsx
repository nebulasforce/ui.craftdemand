;
// 继承根布局的大部分配置，但移除Footer
import { AppShell, AppShellHeader, AppShellMain, MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import theme from "@/app/theme";
import { HeaderMegaMenu } from '@/components/HeaderMegaMenu/HeaderMegaMenu';
import { listGroupData as HeadDropdownListGroupData } from '@/api/headDropdown/response';


export default function NoFooterLayout({ children }: { children: React.ReactNode }) {
  const defaultHeadDropdownData: HeadDropdownListGroupData = {};
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-center" />
      <AppShell header={{ height: 60 }} padding="md">
        <AppShellHeader>
          <HeaderMegaMenu user={null} headerDropdownData={defaultHeadDropdownData} />
        </AppShellHeader>
        <AppShellMain>{children}</AppShellMain>
        {/* 这里不渲染Footer */}
      </AppShell>
    </MantineProvider>
  );
}
