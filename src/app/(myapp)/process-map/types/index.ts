import { Area, Process, ProcessDefinition } from "@igrp/platform-process-management-types";
import { AreaFormData, AreaModalState, ExtendedArea } from "../../process-configuration/types";

// Use the same structure as process configuration - no need for ProcessMapArea

export interface ProcessTreeNode {
  id: string;
  name: string;
  type: "area" | "subarea" | "process";
  data: ExtendedArea | Process;
  children?: ProcessTreeNode[];
  level: number;
  parentId?: string;
  isExpanded?: boolean;
  hasChildren?: boolean;
  isLoaded?: boolean;
  applicationBase: string;
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
    process: Process,
    processDefinitionId: string,
    processKey: string,
    applicationBase: string,
    businessKey?: string,
    variables?: Array<{ name: string; value: string }>,
  ) => void; // Updated signature to match implementation
  refreshData: () => void;
}

export interface ProcessMapHookReturn
  extends ProcessMapState,
  ProcessMapActions {
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

  allProcesses: any;

  // Modals
  priorityModal: {
    isOpen: boolean;
    process: Process | null;
    modalTitle: string;
    modalSubTitle: string;
    open: (process: Process) => void;
    close: () => void;
    setOpen: (open: boolean) => void;
    onSave: (data: { priority: string }) => Promise<void>;
  };

  manageAreas: {
    areas: ExtendedArea[];
    expandedNodes: Set<string>;
    options: {
      applications: {
        label: string;
        value: string;
      }[];
      areas: {
        label: string;
        value: string;
      }[];
    };
    handleCreateArea: (formData: AreaFormData) => Promise<void>;
    handleUpdateArea: (areaId: string, formData: AreaFormData) => Promise<void>;
    handleDeleteArea: (areaId: string) => Promise<void>;
    handleRemoveProcess: (areaId: string, processId: string) => Promise<void>;
    areaForm: {
      modalState: AreaModalState;
      openModal: (area?: ExtendedArea, parentAreaId?: string) => void;
      closeModal: () => void;
      setFormData: (formData: AreaFormData) => void;
      formData: AreaFormData;
    };
  };
}
