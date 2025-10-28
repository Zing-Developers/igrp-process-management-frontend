'use server';

import { ApplicationDTO } from '@igrp/platform-access-management-client-ts';
import { getClientAccess } from './access-client';

export async function getApplications(): Promise<ApplicationDTO[]> {
  const client = await getClientAccess();

  console.log('client', client);

  try {
    const result = await client.applications.getApplications();
    console.log('result', result);
    return result.data as ApplicationDTO[];
  } catch (error) {
    console.error('[apps] Não foi possível obter os dados:', error);
    throw error;
  }
}
