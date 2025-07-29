// config/app.config.ts
import type { Metadata } from "next";

export interface AppConfig {
  metadata: Metadata;
}

const appConfig: AppConfig = {
  metadata: {
    title: "CraftDemand.com",
    description: "Next App Mantine Tailwind Template",
  }
}

export default appConfig;
