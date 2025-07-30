import { Area } from '../../external/types/area';
import { Process } from '../../external/types/process';

// Extended interfaces for UI components
export interface ExtendedArea extends Area {
  subareas?: ExtendedArea[];
}

export interface AreaFormData {
  code: string;
  name: string;
  description: string;
  applicationBase: string;
  parentId?: string; // Changed from area_fk to area_id
}

export interface ExpandedAreas {
  [key: string]: boolean;
}

export interface AreaProcessesMap {
  [areaId: string]: Process[];
}

// Modal states
export interface AreaModalState {
  isOpen: boolean;
  editingArea: Area | null;
  parentAreaId?: string;
}

export interface ProcessModalState {
  isOpen: boolean;
  selectedAreaId: string | null;
}
