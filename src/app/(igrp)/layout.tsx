import { IGRPLayout } from '@igrp/framework-next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { configLayout } from '@/actions/igrp/layout';
import { createConfig } from '@igrp/template-config';
import { updateClientToken } from '@/app/(myapp)/external/client/config/client.config';

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const layoutConfig = await configLayout();
  const config = await createConfig(layoutConfig);

  /*** use this when use session from next-auth and use login ***/

  const { layout, previewMode, loginUrl, logoutUrl } = config;
  const { session } = layout ?? {};

  const headersList = await headers();
  const currentPath =
    headersList.get('x-pathname') ||
    headersList.get('x-next-url') ||
    headersList.get('referer') ||
    '';

  const baseUrl = process.env.NEXTAUTH_URL;

  if (previewMode) {
    return <IGRPLayout config={config}>{children}</IGRPLayout>;
  }

  const loginPath = new URL(loginUrl || '/', baseUrl).pathname;
  const isAlreadyOnLogin = currentPath.startsWith(loginPath);

  if (!previewMode && session === null && loginUrl && !isAlreadyOnLogin) {
    redirect(logoutUrl || loginUrl);
  }

  // Update the client token if session is available
  if (session?.accessToken) {
    updateClientToken(session.accessToken);
  }

  return <IGRPLayout config={config}>{children}</IGRPLayout>;
}
