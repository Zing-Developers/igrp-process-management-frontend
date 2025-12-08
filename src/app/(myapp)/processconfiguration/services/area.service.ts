import {
  Area,
  CreateAreaRequest,
  PaginatedResponse,
  UpdateAreaRequest,
} from "@igrp/platform-process-management-types";
import {
  createArea,
  deleteArea,
  getAreas,
  getSubareas,
  updateArea,
} from "../../external/client/services/area";

export class AreaService {
  static async createArea(areaData: CreateAreaRequest): Promise<Area> {
    return await createArea(areaData);
  }

  static async updateArea(
    areaId: string,
    areaData: UpdateAreaRequest,
  ): Promise<Area> {
    return await updateArea(areaId, areaData);
  }

  static async deleteArea(areaId: string): Promise<void> {
    return await deleteArea(areaId);
  }

  static async getAreas(
    name: string,
    page: number = 0,
    size: number = 1000,
    parentId?: string,
  ): Promise<PaginatedResponse<Area>> {
    return await getAreas(name, page, size, parentId);
  }

  static async getSubareas(parentAreaId: string): Promise<Area[]> {
    return await getSubareas(parentAreaId);
  }
}
