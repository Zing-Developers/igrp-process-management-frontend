import Dashboard from '@/components/dashboard';
import { redirect } from 'next/navigation';

export default function Home() {
  const root = process.env.IGRP_APP_HOME_SLUG ? process.env.IGRP_APP_HOME_SLUG : '/';

  if (!root.startsWith('/')) throw new Error('Root redirect must be a valid path');
  if (root === '/') {
    return <Dashboard></Dashboard>;
  }
  redirect(root);
}
