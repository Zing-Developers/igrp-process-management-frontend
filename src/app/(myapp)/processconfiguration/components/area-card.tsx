import { Building } from 'lucide-react';

import { Area } from '../../external/types/area';
import { Process } from '../../external/types/process';
import { ProcessesList } from './areas-processes-list';
import { IGRPButton, IGRPIcon } from '@igrp/igrp-framework-react-design-system';
import { cn } from '@/lib/utils';

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

  // For top-level areas, we assume they might have subareas even if not loaded yet
  // For subareas, we only show expansion if they actually have subareas loaded
  const canHaveSubareas = level === 0 || hasSubareas;
  const hasContent = hasSubareas || hasProcesses || (level === 0 && !isExpanded);

  const handleToggleExpansion = async () => {
    console.log('Toggling expansion for area:', area.id);
    await onToggleExpansion(area.id);
  };

  return (
    <div
      className={`border border-border rounded-lg bg-card shadow-sm ${level > 0 ? 'ml-6 mt-2' : ''}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {(hasContent || canHaveSubareas) && (
              <IGRPButton
                onClick={handleToggleExpansion}
                variant="ghost"
                size="icon"
                iconName={isExpanded ? 'ChevronDown' : 'ChevronRight'}
                className="p-1 hover:bg-muted rounded w-6 h-6"
                iconClassName="w-4 h-4 text-muted-foreground"
              />
            )}

            <IGRPIcon
              name={`icon1`}
              iconName={'Building'}
              size={20}
              className={cn(`${level === 0 ? 'text-primary' : 'text-secondary-foreground'}`)}
            ></IGRPIcon>

            <div className="flex-1">
              <h3 className={`font-semibold text-foreground ${level > 0 ? 'text-sm' : ''}`}>
                {level > 0 ? `Subárea: ${area.name}` : area.name}
              </h3>
              {area.description && (
                <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Only show "Add Subarea" button for top-level areas (level === 0) */}
            {level === 0 && (
              <IGRPButton
                onClick={() => onAddSubarea(area.id)}
                variant="ghost"
                size="icon"
                iconName="FolderPlus"
                className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded"
                iconClassName="w-4 h-4"
                title="Adicionar Subárea"
              />
            )}
            <IGRPButton
              onClick={() => onAddProcess(area.id)}
              variant="ghost"
              size="icon"
              iconName="Plus"
              className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded"
              iconClassName="w-4 h-4"
              title="Adicionar Processo"
            />
            <IGRPButton
              onClick={() => onEdit(area)}
              variant="ghost"
              size="icon"
              iconName="Pen"
              className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded"
              iconClassName="w-4 h-4"
              title="Editar"
            />
            <IGRPButton
              onClick={() => onDelete(area.id)}
              variant="ghost"
              size="icon"
              iconName="Trash2"
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
              iconClassName="w-4 h-4"
              title="Excluir"
            />
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {/* Processes for this area */}
            {hasProcesses && (
              <div className="pl-8">
                <ProcessesList
                  processes={processes}
                  onRemoveProcess={(processId) => onRemoveProcess(area.id, processId)}
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
            {level === 0 && !hasSubareas && !hasProcesses && (
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
