import { Area, Process } from "@igrp/platform-process-management-types";
import { ProcessesList } from "./areas-processes-list";
import { cn, IGRPIcon } from "@igrp/igrp-framework-react-design-system";

interface ExtendedArea extends Area {
  subareas?: ExtendedArea[];
}

interface AreaCardProps {
  area: ExtendedArea;
  isExpanded: boolean;
  expandedAreas: { [key: string]: boolean };
  onToggleExpansion: (areaId: string) => Promise<void>;
  onEdit: (area: Area) => void;
  onDelete: (areaId: string) => void;
  onAddSubarea: (parentAreaId: string) => void;
  onAddProcess: (areaId: string) => void;
  onRemoveProcess: (areaId: string, processId: string) => void;
  areaProcesses: { [key: string]: Process[] }; // Add areaProcesses prop
  level?: number;
}

export function AreaCard({
  area,
  isExpanded,
  expandedAreas,
  onToggleExpansion,
  onEdit,
  onDelete,
  onAddSubarea,
  onAddProcess,
  onRemoveProcess,
  areaProcesses, // Use the areaProcesses prop
  level = 0,
}: AreaCardProps) {
  // Get processes from the areaProcesses state instead of area.process
  const processes = areaProcesses[area.id] || [];
  const hasSubareas = area.subareas && area.subareas.length > 0;
  const hasProcesses = processes.length > 0;

  const canHaveSubareas = level === 0 || hasSubareas;
  // Show toggle even when collapsed to allow lazy loading on subareas
  const hasContent = hasSubareas || hasProcesses || !isExpanded;

  const handleToggleExpansion = async () => {
    await onToggleExpansion(area.id);
  };

  const isLevelGTZero = level > 0;
  const isLevelZero = level === 0;

  return (
    <div
      className={cn(
        "border border-border rounded-lg",
        isLevelGTZero && "ml-6 mt-2",
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {(hasContent || canHaveSubareas || isLevelGTZero) && (
              <button
                onClick={handleToggleExpansion}
                className="p-1 hover:bg-muted rounded"
              >
                {isExpanded ? (
                  <IGRPIcon
                    iconName="ChevronDown"
                    className="text-muted-foreground"
                  />
                ) : (
                  <IGRPIcon
                    iconName="ChevronRight"
                    className="text-muted-foreground"
                  />
                )}
              </button>
            )}
            <IGRPIcon
              iconName="Building"
              className={cn(
                "w-5 h-5 text-secondary-foreground",
                isLevelZero && "text-primary",
              )}
            />
            <div className="flex-1">
              <h3
                className={cn(
                  "font-semibold text-foreground",
                  isLevelGTZero && "text-sm",
                )}
              >
                {isLevelGTZero ? `Subárea: ${area.name}` : area.name}
              </h3>
              {area.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {area.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Only show "Add Subarea" button for top-level areas (level === 0) */}
            {isLevelZero && (
              <button
                onClick={() => onAddSubarea(area.id)}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded"
                title="Adicionar Subárea"
              >
                <IGRPIcon iconName="FolderPlus" />
              </button>
            )}
            <button
              onClick={() => onAddProcess(area.id)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded"
              title="Adicionar Processo"
            >
              <IGRPIcon iconName="Plus" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(area)}
              className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded"
              title="Editar"
            >
              <IGRPIcon iconName="Pencil" />
            </button>
            <button
              onClick={() => onDelete(area.id)}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
              title="Excluir"
            >
              <IGRPIcon iconName="Trash2" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {/* Processes for this area */}
            {hasProcesses && (
              <div className="pl-8">
                <ProcessesList
                  processes={processes}
                  onRemoveProcess={(processId) =>
                    onRemoveProcess(area.id, processId)
                  }
                />
              </div>
            )}

            {/* Subareas with their own processes */}
            {hasSubareas && (
              <div className="space-y-2">
                {area.subareas!.map((subarea) => (
                  <AreaCard
                    key={subarea.id}
                    area={subarea}
                    isExpanded={expandedAreas[subarea.id] || false}
                    expandedAreas={expandedAreas}
                    onToggleExpansion={onToggleExpansion}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddSubarea={onAddSubarea}
                    onAddProcess={onAddProcess}
                    onRemoveProcess={onRemoveProcess}
                    areaProcesses={areaProcesses} // Pass areaProcesses to subareas
                    level={level + 1}
                  />
                ))}
              </div>
            )}

            {/* Show message when expanded but no content loaded yet (only for top-level areas) */}
            {isLevelZero && !hasSubareas && !hasProcesses && (
              <div className="pl-8 text-sm text-muted-foreground">
                Nenhuma subárea ou processo encontrado
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
