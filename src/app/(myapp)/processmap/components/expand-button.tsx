import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface ExpandButtonProps {
  hasChildren: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ExpandButton({ hasChildren, isExpanded, onToggle }: ExpandButtonProps) {
  console.log('ExpandButton hasChildren', hasChildren);
  if (!hasChildren) {
    return <div className="w-6 h-6" />; // Placeholder for alignment
  }

  return (
    <div className="w-6 h-6 flex items-center justify-center mr-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="p-1 hover:bg-muted rounded"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
