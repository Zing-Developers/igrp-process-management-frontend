import { Process, ProcessInstance } from '@igrp/platform-process-management-types';
import { ExtendedArea } from '../../processconfiguration/types';

// Use the same structure as process configuration - no need for ProcessMapArea

export interface ProcessTreeNode {
  id: string;
  name: string;
  type: 'area' | 'subarea' | 'process';
  data: ExtendedArea | Process;
  children?: ProcessTreeNode[];
  level: number;
  parentId?: string;
  isExpanded?: boolean;
  hasChildren?: boolean;
  isLoaded?: boolean;
}

export interface ProcessMapState {
  areas: ExtendedArea[]; // Use ExtendedArea instead of ProcessMapArea
  expandedNodes: Set<string>;
  loadedNodes: Set<string>;
  selectedProcess?: Process;
  loading: boolean;
  error?: string;
}

export interface ProcessMapActions {
  toggleNode: (nodeId: string) => void;
  loadSubareas: (areaId: string) => Promise<void>;
  selectProcess: (process: Process) => void;
  startProcess: (
    processDefinitionId: string,
    processKey: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => Promise<ProcessInstance>;
  refreshData: () => Promise<void>;
}

export interface ProcessMapHookReturn extends ProcessMapState, ProcessMapActions {
  // Computed values
  treeNodes: ProcessTreeNode[];
  flatNodes: ProcessTreeNode[];
  filteredNodes: ProcessTreeNode[];
  totalProcesses: number;
  totalAreas: number;

  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;

  // Modals
  detailModal: {
    isOpen: boolean;
    process?: Process;
    open: (process: Process) => void;
    close: () => void;
    setOpen: (open: boolean) => void;
  };
}
