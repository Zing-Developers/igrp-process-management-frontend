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
  return await httpClient.areas
    .updateArea(id, areaData)
    .then((response) => response.data as Area);
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
  try {
    const httpClient = await getIGRPProcessClient();
    const response = await httpClient.areas
      .getAreas({
        name,
        page,
        size,
        parentId,
      })
      .then((response) => response.data as PaginatedResponse<Area>);
      
    console.log('getAreas', response);
    return response;
  } catch (error: unknown) {
    console.error('Error fetching areas:', error);
    
    // Handle authentication errors specifically
    if (
      (error && typeof error === 'object' && 'status' in error && error.status === 401) ||
      (error && typeof error === 'object' && 'message' in error && 
       typeof error.message === 'string' && 
       (error.message.includes('401') || error.message.includes('Unauthorized')))
    ) {
      throw new Error('Authentication failed. Please log in again to continue.');
    }
    
    // Handle other errors
    if (
      error && 
      typeof error === 'object' && 
      'message' in error && 
      typeof error.message === 'string' && 
      error.message.includes('Authentication required')
    ) {
      throw new Error('Authentication required. Please log in to access this feature.');
    }
    
    // Re-throw other errors
    throw error;
  }
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
