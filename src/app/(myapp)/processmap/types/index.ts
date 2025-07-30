import { Area } from '../../external/types/area';
import { Process, ProcessInstance } from '../../external/types/process';
import { ExtendedArea } from '../../processconfiguration/types';


// Use the same structure as process configuration - no need for ProcessMapArea
export interface ProcessTreeNode {
  id: string;
  name: string;
  type: 'area' | 'subarea' | 'process';
  children?: ProcessTreeNode[];
  data?: Area | Process;
  isExpanded?: boolean;
  level: number;
  parentId?: string;
  hasChildren?: boolean; // Indicates if node has children that can be loaded
  isLoaded?: boolean; // Indicates if children have been loaded
}

export interface ProcessMapState {
  areas: ExtendedArea[]; // Use ExtendedArea instead of ProcessMapArea
  expandedNodes: Set<string>;
  loadedNodes: Set<string>; // Track which nodes have loaded their children
  selectedProcess?: Process;
  loading: boolean;
  error?: string;
}

export interface ProcessMapActions {
  toggleNode: (nodeId: string) => Promise<void>; // Async for the main hook
  loadSubareas: (parentAreaId: string) => Promise<void>; // On-demand loading
  selectProcess: (process: Process) => void;
  startProcess: (processDefinitionId: string, businessKey?: string, variables?: Record<string, any>) => Promise<ProcessInstance>;
  startProcessWithToast: (processDefinitionId: string, processKey?: string, businessKey?: string, variables?: Record<string, any>) => Promise<ProcessInstance | null>;
  refreshData: () => Promise<void>;
}

export interface ProcessMapHookReturn extends ProcessMapState, ProcessMapActions {
  treeNodes: ProcessTreeNode[];
  flatNodes: ProcessTreeNode[];
  filteredNodes: ProcessTreeNode[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
  totalProcesses: number;
  totalAreas: number;
  detailModal: {
    isOpen: boolean;
    process?: Process;
    open: (process: Process) => void;
    close: () => void;
    setOpen: (open: boolean) => void; // Add this for the generated component
  };
}