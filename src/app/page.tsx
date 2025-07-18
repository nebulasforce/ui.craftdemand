import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from '@/components/Welcome/Welcome';
import {
  Text,
  Title,
} from "@mantine/core";


export default function Home() {
  return (
    <>

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
    </>
  );
}
