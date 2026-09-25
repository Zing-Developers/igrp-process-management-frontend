import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { configLayout } from "@/actions/igrp/layout";
import IRNLayout from "@/components/irn-ui-commons/irn-layout";
import { QueryProvider } from "@/components/providers";
import { isPreviewMode as checkPreviewMode } from "@/lib/utils";

export default async function IGRPRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session } = await configLayout();

  const envPreviewMode = checkPreviewMode();
  const isPreviewMode = envPreviewMode;

  const headersList = await headers();
  const currentPath =
    headersList.get("x-pathname") ||
    headersList.get("x-next-url") ||
    headersList.get("referer") ||
    "";

  const baseUrl = process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL;

  const urlLogin = "/login";

  const resolvedBaseUrl = baseUrl || "http://localhost:3000";
  const loginPath = new URL(urlLogin || "/", resolvedBaseUrl).pathname;

  const isAlreadyOnLogin = currentPath.startsWith(loginPath);

  if (!isPreviewMode && session === null && urlLogin && !isAlreadyOnLogin) {
    redirect(urlLogin);
  }

  return (
    <IRNLayout>
      <main className="px-4">
        <QueryProvider>{children}</QueryProvider>
      </main>
    </IRNLayout>
  );
}
