'use server';
import { getIGRPProcessClient } from '@/lib/api-client';
import {
  Area,
  CreateAreaRequest,
  PaginatedResponse,
  UpdateAreaRequest,
} from '@igrp/platform-process-management-types';

// Area Management
export const createArea = async (areaData: CreateAreaRequest): Promise<Area> => {
  const httpClient = await getIGRPProcessClient();
  return await httpClient.areas.createArea(areaData).then((response) => response.data as Area);
};

export const updateArea = async (id: string, areaData: UpdateAreaRequest): Promise<Area> => {
  const httpClient = await getIGRPProcessClient();
  return await httpClient.areas.updateArea(id, areaData).then((response) => response.data as Area);
};

export const deleteArea = async (id: string): Promise<void> => {
  const httpClient = await getIGRPProcessClient();
  await httpClient.areas.deleteArea(id);
};

export const getAreas = async (
  name: string,
  page = 0,
  size = 20,
  parentId?: string,
): Promise<PaginatedResponse<Area>> => {
  const httpClient = await getIGRPProcessClient();
  const response = await httpClient.areas
    .getAreas({
      name,
      page,
      size,
      parentId,
    })
    .then((response) => response.data as PaginatedResponse<Area>);

  return response;
};

export const getAreaById = async (id: string): Promise<Area | null> => {
  const httpClient = await getIGRPProcessClient();
  return await httpClient.areas.getAreaById(id).then((response) => response.data as Area);
};

export const getSubareas = async (parentAreaId: string): Promise<Area[]> => {
  // Use the same getAreas API with parentId parameter
  const response = await getAreas('', 0, 1000, parentAreaId);
  return response.content || [];
};
