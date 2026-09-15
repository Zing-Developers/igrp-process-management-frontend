import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getEmailAccessMappings } from "@/app/(myapp)/functions/email-access-mappings";

export const EMAIL_ACCESS_MAPPINGS_QUERY_KEY = [
  "email-access-mappings",
] as const;

const PAGE_SIZE = 10;

export function useEmailAccessMappings() {
  const [page, setPage] = useState(0);
  const mappingsQuery = useQuery({
    queryKey: [...EMAIL_ACCESS_MAPPINGS_QUERY_KEY, page, PAGE_SIZE],
    queryFn: () => getEmailAccessMappings({ page, size: PAGE_SIZE }),
  });
  const mappingsResult = mappingsQuery.data;
  const mappingsPage = mappingsResult?.success
    ? mappingsResult.data
    : undefined;
  const mappings = useMemo(() => mappingsPage?.content ?? [], [mappingsPage]);

  return {
    mappings,
    mappingsPage,
    mappingsQuery,
    mappingsResult,
    page,
    setPage,
  };
}
