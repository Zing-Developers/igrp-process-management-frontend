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

// Area Management
export const createArea = async (areaData: CreateAreaRequest): Promise<Area> => {
  try {
    areaData.applicationBase = apiConfig.applicationBase;
    console.log('createArea', areaData);
    return await httpClient.post<Area>(apiConfig.endpoints.areas, areaData);
  } catch (error) {
    console.warn('API call failed, using fallback data for createArea');
    return createDummyArea(areaData);
  }
};

export const updateArea = async (id: string, areaData: UpdateAreaRequest): Promise<Area> => {
  try {
    areaData.applicationBase = apiConfig.applicationBase;
    return await httpClient.put<Area>(`${apiConfig.endpoints.areas}/${id}`, areaData);
  } catch (error) {
    console.warn('API call failed, using fallback data for updateArea');
    return createDummyUpdatedArea(id, areaData);
  }
};

export const deleteArea = async (id: string): Promise<void> => {
  try {
    await httpClient.delete(`${apiConfig.endpoints.areas}/${id}`);
  } catch (error) {
    console.warn('API call failed for deleteArea');
    // For demo purposes, just log the action
  }
};

export const getAreas = async (
  page = 0,
  size = 20,
  parentId?: string,
): Promise<PaginatedResponse<Area>> => {
  try {
    const url = parentId
      ? `${apiConfig.endpoints.areas}?page=${page}&size=${size}&parentId=${parentId}`
      : `${apiConfig.endpoints.areas}?page=${page}&size=${size}`;
    console.log('getAreas url:', url);
    return await httpClient.get<PaginatedResponse<Area>>(url);
  } catch (error) {
    console.warn('API call failed, using fallback data for getAreas with parentId:', parentId);
    // Pass parentId to getDummyAreasPaginated so it can filter correctly
    return getDummyAreasPaginated(page, size, parentId);
  }
};

export const getAreaById = async (id: string): Promise<Area | null> => {
  try {
    return await httpClient.get<Area>(`${apiConfig.endpoints.areas}/${id}`);
  } catch (error) {
    console.warn('API call failed, using fallback data for getAreaById');
    return getDummyAreaById(id);
  }
};

export const getSubareas = async (parentAreaId: string): Promise<Area[]> => {
  try {
    console.log('Fetching subareas for parent area:', parentAreaId);
    // Use the same getAreas API with parentId parameter
    const response = await getAreas(0, 100, parentAreaId);
    console.log('Subareas response:', response);
    return response.content || [];
  } catch (error) {
    console.warn('API call failed, using fallback data for getSubareas');
    return getDummySubareas(parentAreaId);
  }
};
