import { useState, useMemo } from "react";
import { ProcessTreeNode } from "../types";
import { searchNodes } from "../utils/tree-utils";

export function useTreeSearch(treeNodes: ProcessTreeNode[]) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNodes = useMemo(() => {
    return searchTerm.trim() ? searchNodes(treeNodes, searchTerm) : treeNodes;
  }, [treeNodes, searchTerm]);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredNodes,
    clearSearch,
  };
}
