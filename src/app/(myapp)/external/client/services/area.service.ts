import { httpClient } from './http-client';
import { Area, CreateAreaRequest, UpdateAreaRequest } from '../../types/area';
import { PaginatedResponse } from '../../types/response';
import {
  createDummyArea,
  createDummyUpdatedArea,
  getDummyAreaById,
  getDummySubareas,
  getDummyAreasPaginated,
} from '../dummy-data/areas';
import { apiConfig } from '../config/api.config';
import { buildUrlWithParams } from '../utils/url-builder';
import { shouldUseDummyData, logDummyDataFallback } from '../dummy-data/utils';

// Area Management
export const createArea = async (areaData: CreateAreaRequest): Promise<Area> => {
  try {
    areaData.applicationBase = apiConfig.applicationBase;
    console.log('createArea', areaData);
    return await httpClient.post<Area>(apiConfig.endpoints.areas, areaData);
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
    areaData.applicationBase = apiConfig.applicationBase;
    return await httpClient.put<Area>(`${apiConfig.endpoints.areas}/${id}`, areaData);
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
    await httpClient.delete(`${apiConfig.endpoints.areas}/${id}`);
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
  applicationBase: string,  
  page = 0,
  size = 20,
  parentId?: string,
): Promise<PaginatedResponse<Area>> => {
  try {
    const url = buildUrlWithParams(apiConfig.endpoints.areas, {
      name,
      applicationBase,
      page,
      size,
      parentId
    });
    console.log('getAreas url:', url);
    return await httpClient.get<PaginatedResponse<Area>>(url);
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
    return await httpClient.get<Area>(`${apiConfig.endpoints.areas}/${id}`);
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
    const response = await getAreas('', '', 0, 100, parentAreaId);
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
