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
            <Logo size={32} textProps={{gradient: { from: 'pink', to: 'yellow' },verticalAlign:"bottom"}} />
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
