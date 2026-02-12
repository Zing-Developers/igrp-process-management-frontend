import { Process } from "@igrp/platform-process-management-types";
import { ExtendedArea } from "../types";

/**
 * Converts flat areas with processes into a hierarchical tree structure
 * Now works with ExtendedArea instead of ProcessMapArea
 */
export function buildProcessTree(areas: ExtendedArea[]): ExtendedArea[] {
  const treeNodes: ExtendedArea[] = [];

  function processArea(
    area: ExtendedArea,
    applicationBase: string,
    level: number = 0,
    parentId?: string,
  ): ExtendedArea {
    const areaNode: ExtendedArea = {
      ...area,
      type: level === 0 ? "area" : "subarea",
      level,
      parentId,
      data: area,
      children: [],
      hasChildren: true, // Assume areas can have children (subareas or processes)
      isLoaded: false, // Will be set to true when children are loaded
      applicationBase: applicationBase,
    };

    // Add processes as children (processes are always loaded with the area)
    const areaProcesses = area.process || [];
    if (areaProcesses && areaProcesses.length > 0) {
      // Filter only active processes
      const activeProcesses = areaProcesses.filter(
        (process: Process) => process.status === "ACTIVE",
      );

      const processNodes: ExtendedArea[] = activeProcesses.map(
        (process: Process) => ({
          ...process,
          id: `process-${process.id}`,
          name: process.name || process.processKey || "Unnamed Process",
          type: "process",
          level: level + 1,
          parentId: area.id,
          data: process,
          hasChildren: false,
          isLoaded: true,
          applicationBase: applicationBase,
          code: "",
        }),
      );
      areaNode.children = [...processNodes];
    }

    // Add subareas as children (if they exist in the hierarchy)
    if (area.subareas && area.subareas.length > 0) {
      const subareaNodes = area.subareas.map((subarea) =>
        processArea(subarea, subarea.applicationBase, level + 1, area.id),
      );
      areaNode.children = [...(areaNode.children || []), ...subareaNodes];
      areaNode.isLoaded = true; // Mark as loaded if subareas are present
    }

    return areaNode;
  }

  areas.forEach((area) => {
    treeNodes.push(processArea(area, area.applicationBase, 0));
  });

  return treeNodes;
}

/**
 * Flattens tree nodes for rendering with proper indentation
 */
export function flattenTreeNodes(
  nodes: ExtendedArea[],
  expandedNodes: Set<string>,
): ExtendedArea[] {
  const flattened: ExtendedArea[] = [];

  function traverse(node: ExtendedArea) {
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
export function findNodeById(
  nodes: ExtendedArea[],
  id: string,
): ExtendedArea | undefined {
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
export function getAllProcessNodes(nodes: ExtendedArea[]): ExtendedArea[] {
  const processes: ExtendedArea[] = [];

  function traverse(node: ExtendedArea) {
    if (node.type === "process") {
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
export function searchNodes(
  nodes: ExtendedArea[],
  searchTerm: string,
): ExtendedArea[] {
  if (!searchTerm.trim()) return nodes;

  const results: ExtendedArea[] = [];
  const lowerSearchTerm = searchTerm.toLowerCase();

  function traverse(node: ExtendedArea) {
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
