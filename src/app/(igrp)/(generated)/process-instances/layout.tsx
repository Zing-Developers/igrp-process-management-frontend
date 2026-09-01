import { requirePagePermission } from "@/lib/page-permissions";
import { isPreviewMode } from "@/lib/utils";

const PROCESS_INSTANCES_VIEW_PERMISSION = "PROCESS_INSTANCES:visualizar";

export const dynamic = "force-dynamic";

export default async function ProcessInstancesAccessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isPreviewMode()) {
    await requirePagePermission(PROCESS_INSTANCES_VIEW_PERMISSION);
  }

  return children;
}
