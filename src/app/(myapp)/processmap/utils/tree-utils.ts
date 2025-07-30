import { Process } from '../../external/types/process';
import { ExtendedArea } from '../../processconfiguration/types';
import { ProcessTreeNode } from '../types';

/**
 * Converts flat areas with processes into a hierarchical tree structure
 * Now works with ExtendedArea instead of ProcessMapArea
 */
export function buildProcessTree(areas: ExtendedArea[]): ProcessTreeNode[] {
  const treeNodes: ProcessTreeNode[] = [];

  function processArea(area: ExtendedArea, level: number = 0, parentId?: string): ProcessTreeNode {
    const areaNode: ProcessTreeNode = {
      id: area.id,
      name: area.name,
      type: level === 0 ? 'area' : 'subarea',
      level,
      parentId,
      data: area,
      children: [],
      hasChildren: true, // Assume areas can have children (subareas or processes)
      isLoaded: false, // Will be set to true when children are loaded
    };

    // Add processes as children (processes are always loaded with the area)
    const areaProcesses = area.process || [];
    if (areaProcesses && areaProcesses.length > 0) {
      const processNodes: ProcessTreeNode[] = areaProcesses.map((process: Process) => ({
        id: `process-${process.id}`,
        name: process.name || process.statusDesc || 'Unnamed Process',
        type: 'process',
        level: level + 1,
        parentId: area.id,
        data: process,
        hasChildren: false,
        isLoaded: true,
      }));
      areaNode.children = [...processNodes];
    }

    // Add subareas as children (if they exist in the hierarchy)
    if (area.subareas && area.subareas.length > 0) {
      const subareaNodes = area.subareas.map((subarea) => processArea(subarea, level + 1, area.id));
      areaNode.children = [...(areaNode.children || []), ...subareaNodes];
      areaNode.isLoaded = true; // Mark as loaded if subareas are present
    }

    return areaNode;
  }

  areas.forEach((area) => {
    treeNodes.push(processArea(area));
  });

  return treeNodes;
}

/**
 * Flattens tree nodes for rendering with proper indentation
 */
export function flattenTreeNodes(
  nodes: ProcessTreeNode[],
  expandedNodes: Set<string>,
): ProcessTreeNode[] {
  const flattened: ProcessTreeNode[] = [];

  function traverse(node: ProcessTreeNode) {
    flattened.push(node);

    if (expandedNodes.has(node.id) && node.children) {
      node.children.forEach((child) => traverse(child));
    }
  }

  nodes.forEach((node) => traverse(node));
  return flattened;
}

/**
 * Finds a node by ID in the tree
 */
export function findNodeById(nodes: ProcessTreeNode[], id: string): ProcessTreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Gets all process nodes from the tree
 */
export function getAllProcessNodes(nodes: ProcessTreeNode[]): ProcessTreeNode[] {
  const processes: ProcessTreeNode[] = [];

  function traverse(node: ProcessTreeNode) {
    if (node.type === 'process') {
      processes.push(node);
    }
    if (node.children) {
      node.children.forEach((child) => traverse(child));
    }
  }

  nodes.forEach((node) => traverse(node));
  return processes;
}

/**
 * Searches nodes by name (case-insensitive)
 */
export function searchNodes(nodes: ProcessTreeNode[], searchTerm: string): ProcessTreeNode[] {
  if (!searchTerm.trim()) return nodes;

  const results: ProcessTreeNode[] = [];
  const lowerSearchTerm = searchTerm.toLowerCase();

  function traverse(node: ProcessTreeNode) {
    if (node.name.toLowerCase().includes(lowerSearchTerm)) {
      results.push(node);
    }
    if (node.children) {
      node.children.forEach((child) => traverse(child));
    }
  }

  nodes.forEach((node) => traverse(node));
  return results;
}
