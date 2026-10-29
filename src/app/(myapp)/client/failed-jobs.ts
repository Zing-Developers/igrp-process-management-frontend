"use server";

import type {
  FailedJob,
  FailedJobQuery,
  PaginatedResponse,
} from "@irn/platform-process-management-types";
import { getIGRPProcessClient } from "@/lib/api-client";

const FAILED_JOBS_PAGE_SIZE = 100;

export async function getFailedJobs(
  processInstanceId?: string,
  page = 0,
  size = FAILED_JOBS_PAGE_SIZE,
  businessKey?: string,
): Promise<PaginatedResponse<FailedJob>> {
  const client = await getIGRPProcessClient();
  const query: FailedJobQuery = {
    processInstanceId: processInstanceId || undefined,
    businessKey: businessKey || undefined,
    page,
    size,
  };
  const response = await client.failedJobs.getFailedJobs(query);

  return response.data;
}

export async function getFailedJobStacktrace(jobId: string): Promise<string> {
  const client = await getIGRPProcessClient();
  return (await client.failedJobs.getFailedJobStacktrace(jobId)).data;
}

export async function retryFailedJob(
  jobId: string,
  retries?: number,
): Promise<void> {
  const client = await getIGRPProcessClient();
  await client.failedJobs.retryFailedJob(
    jobId,
    retries === undefined ? undefined : { retries },
  );
}
