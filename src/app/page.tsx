import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from '@/components/Welcome/Welcome';
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { Logo } from '@/components/Logo/Logo';


export default function Home() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <Group className="h-full px-md items-center">
          <div className="transform">
            <Logo src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAxNjMgMTYzIj48cGF0aCBmaWxsPSIjMzM5QUYwIiBkPSJNMTYyLjE2MiA4MS41YzAtNDUuMDExLTM2LjMwMS04MS41LTgxLjA4LTgxLjVDMzYuMzAxIDAgMCAzNi40ODkgMCA4MS41IDAgMTI2LjUxIDM2LjMwMSAxNjMgODEuMDgxIDE2M3M4MS4wODEtMzYuNDkgODEuMDgxLTgxLjV6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTY1Ljk4MyA0My4wNDlhNi4yMzQgNi4yMzQgMCAwMC0uMzM2IDYuODg0IDYuMTQgNi4xNCAwIDAwMS42MTggMS43ODZjOS40NDQgNy4wMzYgMTQuODY2IDE3Ljc5NCAxNC44NjYgMjkuNTIgMCAxMS43MjYtNS40MjIgMjIuNDg0LTE0Ljg2NiAyOS41MmE2LjE0NSA2LjE0NSAwIDAwLTEuNjE2IDEuNzg2IDYuMjEgNi4yMSAwIDAwLS42OTQgNC42OTMgNi4yMSA2LjIxIDAgMDAxLjAyOCAyLjE4NiA2LjE1MSA2LjE1MSAwIDAwNi40NTcgMi4zMTkgNi4xNTQgNi4xNTQgMCAwMDIuMTc3LTEuMDM1IDUwLjA4MyA1MC4wODMgMCAwMDcuOTQ3LTcuMzloMTcuNDkzYzMuNDA2IDAgNi4xNzQtMi43NzIgNi4xNzQtNi4xOTRzLTIuNzYyLTYuMTk0LTYuMTc0LTYuMTk0aC05LjY1NWE0OS4xNjUgNDkuMTY1IDAgMDA0LjA3MS0xOS42OSA0OS4xNjcgNDkuMTY3IDAgMDAtNC4wNy0xOS42OTJoOS42NmMzLjQwNiAwIDYuMTczLTIuNzcxIDYuMTczLTYuMTk0IDAtMy40MjItMi43NjItNi4xOTMtNi4xNzMtNi4xOTNIODIuNTc0YTUwLjExMiA1MC4xMTIgMCAwMC03Ljk1Mi03LjM5NyA2LjE1IDYuMTUgMCAwMC00LjU3OC0xLjE1MyA2LjE4OSA2LjE4OSAwIDAwLTQuMDU1IDIuNDM4aC0uMDA2eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTU2LjIzNiA3OS4zOTFhOS4zNDIgOS4zNDIgMCAwMS42MzItMy42MDggOS4yNjIgOS4yNjIgMCAwMTEuOTY3LTMuMDc3IDkuMTQzIDkuMTQzIDAgMDEyLjk5NC0yLjA2MyA5LjA2IDkuMDYgMCAwMTcuMTAzIDAgOS4xNDUgOS4xNDUgMCAwMTIuOTk1IDIuMDYzIDkuMjYyIDkuMjYyIDAgMDExLjk2NyAzLjA3NyA5LjMzOSA5LjMzOSAwIDAxLTIuMTI1IDEwLjAwMyA5LjA5NCA5LjA5NCAwIDAxLTYuMzg4IDIuNjMgOS4wOTQgOS4wOTQgMCAwMS02LjM5LTIuNjMgOS4zIDkuMyAwIDAxLTIuNzU1LTYuMzk1eiIgY2xpcC1ydWxlPSJldmVub2RkIi8+PC9zdmc+" size={32} textProps={{gradient: { from: 'pink', to: 'yellow' },verticalAlign:"bottom"}} />
          </div>
        </Group>
      </AppShellHeader>
      <AppShellMain>
        <Title className="text-center mt-20">
          Welcome to{" "}
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: "pink", to: "yellow" }}
          >
            Mantine
          </Text>{" "}
          +
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: "blue", to: "green" }}
          >
            TailwindCSS
          </Text>
        </Title>
        <Text
          className="text-center text-gray-700 dark:text-gray-300 max-w-[500px] mx-auto mt-xl"
          ta="center"
          size="lg"
          maw={580}
          mx="auto"
          mt="xl"
        >
          This starter Next.js project includes a minimal setup for Mantine with
          TailwindCSS. To get started edit page.tsx file.
        </Text>

        <div className="flex justify-center mt-10">
          <ColorSchemeToggle />
        </div>
        <Welcome />
      </AppShellMain>
    </AppShell>
  );
}
