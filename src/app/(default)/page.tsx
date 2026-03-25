import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";
import { Welcome } from '@/components/Welcome/Welcome';
import {
  Text,
  Title,
} from "@mantine/core";
import { ThreeDMarquee } from "@/components/Marquee3D/Marquee3D";

const images = [
  "/aceternity-images/3d-card.png",
  "/aceternity-images/animated-modal.png",
  "/aceternity-images/animated-testimonials.webp",
  "/aceternity-images/Tooltip_luwy44.png",
  "/aceternity-images/github-globe.png",
  "/aceternity-images/glare-card.png",
  "/aceternity-images/layout-grid.png",
  "/aceternity-images/flip-text.png",
  "/aceternity-images/hero-highlight.png",
  "/aceternity-images/carousel.webp",
  "/aceternity-images/placeholders-and-vanish-input.png",
  "/aceternity-images/shooting-stars-and-stars-background.png",
  "/aceternity-images/signup-form.png",
  "/aceternity-images/stars_sxle3d.png",
  "/aceternity-images/spotlight-new.webp",
  "/aceternity-images/Spotlight_ar5jpr.png",
  "/aceternity-images/Parallax_Scroll_pzlatw_anfkh7.png",
  "/aceternity-images/tabs.png",
  "/aceternity-images/Tracing_Beam_npujte.png",
  "/aceternity-images/typewriter-effect.png",
  "/aceternity-images/glowing-effect.webp",
  "/aceternity-images/hover-border-gradient.png",
  "/aceternity-images/Infinite_Moving_Cards_evhzur.png",
  "/aceternity-images/Lamp_hlq3ln.png",
  "/aceternity-images/macbook-scroll.png",
  "/aceternity-images/Meteors_fye3ys.png",
  "/aceternity-images/Moving_Border_yn78lv.png",
  "/aceternity-images/multi-step-loader.png",
  "/aceternity-images/vortex.png",
  "/aceternity-images/wobble-card.png",
  "/aceternity-images/world-map.webp",
];

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ThreeDMarquee
        className="pointer-events-none fixed inset-0 h-full w-full z-0"
        images={images}
      />
      <div className="fixed inset-0 z-10 h-full w-full bg-white/60 dark:bg-black/60" />
      <div className="relative z-20">
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
      </div>
    </div>
  );
}
