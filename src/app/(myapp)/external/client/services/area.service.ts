'use server';
import {
  createDummyArea,
  createDummyUpdatedArea,
  getDummyAreaById,
  getDummySubareas,
  getDummyAreasPaginated,
} from '../dummy-data/areas';

import { shouldUseDummyData, logDummyDataFallback } from '../dummy-data/utils';
import { ProcessManagementClient } from '@igrp/platform-process-management-client-ts';
import {
  Area,
  CreateAreaRequest,
  PaginatedResponse,
  UpdateAreaRequest,
} from '@igrp/platform-process-management-types';

const applicationBase = process.env.IGRP_APPLICATION_BASE || 'igrp-app';
const baseUrl = process.env.PROCESS_MANAGEMENT_CLIENT_BASE_URL || 'http://localhost:8080';

const httpClient = ProcessManagementClient.create({
  baseUrl: baseUrl,
  timeout: 30000, // optional, defaults to 30000 (30 seconds)
  headers: {
    // optional
    //Authorization: 'Bearer your-token-here',
  },
});

// Area Management
export const createArea = async (areaData: CreateAreaRequest): Promise<Area> => {
  try {
    areaData.applicationBase = applicationBase;
    console.log('createArea', areaData);
    return await httpClient.areas.createArea(areaData).then((response) => response.data as Area);
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('createArea', error);
      return createDummyArea(areaData);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

export const updateArea = async (id: string, areaData: UpdateAreaRequest): Promise<Area> => {
  try {
    areaData.applicationBase = applicationBase;
    return await httpClient.areas
      .updateArea(id, areaData)
      .then((response) => response.data as Area);
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('updateArea', error);
      return createDummyUpdatedArea(id, areaData);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

export const deleteArea = async (id: string): Promise<void> => {
  try {
    await httpClient.areas.deleteArea(id);
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('deleteArea', error);
      // For demo purposes, just log the action
      return;
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

export const getAreas = async (
  name: string,
  page = 0,
  size = 20,
  parentId?: string,
): Promise<PaginatedResponse<Area>> => {
  try {
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
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getAreas', error, `parentId: ${parentId}`);
      // Pass parentId to getDummyAreasPaginated so it can filter correctly
      return getDummyAreasPaginated(page, size, parentId);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

export const getAreaById = async (id: string): Promise<Area | null> => {
  try {
    return await httpClient.areas.getAreaById(id).then((response) => response.data as Area);
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getAreaById', error);
      return getDummyAreaById(id);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};

export const getSubareas = async (parentAreaId: string): Promise<Area[]> => {
  try {
    // Use the same getAreas API with parentId parameter
    const response = await getAreas('', 0, 100, parentAreaId);
    return response.content || [];
  } catch (error) {
    if (shouldUseDummyData()) {
      logDummyDataFallback('getSubareas', error);
      return getDummySubareas(parentAreaId);
    }
    // Re-throw the error if dummy data is not allowed
    throw error;
  }
};
