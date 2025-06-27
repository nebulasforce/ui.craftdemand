import type { Metadata } from "next";
import {
  ColorSchemeScript,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import theme from "@/app/theme";
import "./globals.css";
import '@mantine/core/styles.css';

export const metadata: Metadata = {
  title: "Next App Mantine Tailwind Template",
  description: "Next App Mantine Tailwind Template",
};


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
    <head>
      <ColorSchemeScript />
    </head>
    <body className="antialiased">
    <MantineProvider theme={theme}>{children}</MantineProvider>
    </body>
    </html>
  );
}
