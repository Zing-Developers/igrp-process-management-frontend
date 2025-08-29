'use server';
import { getHttpClient, getApplicationBase } from '../config/client.config';
import {
  Area,
  CreateAreaRequest,
  PaginatedResponse,
  UpdateAreaRequest,
} from '@igrp/platform-process-management-types';

const httpClient = getHttpClient();
const applicationBase = getApplicationBase();

// Area Management
export const createArea = async (areaData: CreateAreaRequest): Promise<Area> => {
  areaData.applicationBase = applicationBase;
  console.log('createArea', areaData);
  return await httpClient.areas.createArea(areaData).then((response) => response.data as Area);
};

export const updateArea = async (id: string, areaData: UpdateAreaRequest): Promise<Area> => {
  areaData.applicationBase = applicationBase;
  return await httpClient.areas
    .updateArea(id, areaData)
    .then((response) => response.data as Area);
};

export const deleteArea = async (id: string): Promise<void> => {
  await httpClient.areas.deleteArea(id);
};

export const getAreas = async (
  name: string,
  page = 0,
  size = 20,
  parentId?: string,
): Promise<PaginatedResponse<Area>> => {
  const response = await httpClient.areas
    .getAreas({
      name,
      applicationBase: applicationBase,
      page,
      size,
      parentId,
    })
    .then((response) => response.data as PaginatedResponse<Area>);
    
  console.log('getAreas', response);
  return response;
};

export const getAreaById = async (id: string): Promise<Area | null> => {
  return await httpClient.areas.getAreaById(id).then((response) => response.data as Area);
};

export const getSubareas = async (parentAreaId: string): Promise<Area[]> => {
  // Use the same getAreas API with parentId parameter
  const response = await getAreas('', 0, 1000, parentAreaId);
  return response.content || [];
};
