import "@/styles/globals.css";

import { IGRPRootLayout } from "@igrp/framework-next";
import type { IGRPLayoutConfigArgs } from "@igrp/framework-next-types";
import { IGRP_META_THEME_COLORS } from "@igrp/igrp-framework-react-design-system";

import type { Metadata, Viewport } from "next";

import { configLayout } from "@/actions/igrp/layout";
import { createConfig } from "@/igrp.template.config";
import { withBasePath } from "@/lib/url";

export const metadata: Metadata = {
  title: {
    default: "Home - PIR | Gestão de Processos",
    template: "%s - PIR | Gestão de Processos",
  },
  description: "PIR | Gestão de Processos",
  manifest: withBasePath("/site.webmanifest"),
  icons: {
    icon: [
      { url: withBasePath("/favicon.ico") },
      {
        url: withBasePath("/favicon-16x16.png"),
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: withBasePath("/favicon-32x32.png"),
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: withBasePath("/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [withBasePath("/favicon.ico")],
  },
};

export const viewport: Viewport = {
  themeColor: IGRP_META_THEME_COLORS.light,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const layoutConfig = await configLayout();
  const config = await createConfig(layoutConfig as IGRPLayoutConfigArgs);

  return <IGRPRootLayout config={config}>{children}</IGRPRootLayout>;
}
