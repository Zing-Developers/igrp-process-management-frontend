import { Area } from '../../external/types/area';
import { AreaCard } from './area-card';

interface ExtendedArea extends Area {
  subareas?: ExtendedArea[];
}

interface ExpandedAreas {
  [key: string]: boolean;
}

export function AreasList({
  areas,
  expandedAreas,
  onToggleExpansion,
  onEdit,
  onDelete,
  onAddSubarea,
  onAddProcess,
  onRemoveProcess,
}: {
  areas: ExtendedArea[];
  expandedAreas: ExpandedAreas;
  onToggleExpansion: (areaId: string) => Promise<void>;
  onEdit: (area: Area) => void;
  onDelete: (areaId: string) => void;
  onAddSubarea: (parentAreaId: string) => void;
  onAddProcess: (areaId: string) => void;
  onRemoveProcess: (areaId: string, processId: string) => void;
}) {
  // Filter to show only top-level areas (areas without parent)
  const topLevelAreas = areas.filter((area) => !area.areaId);

  if (topLevelAreas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma área encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topLevelAreas.map((area) => (
        <AreaCard
          key={area.id}
          area={area}
          isExpanded={expandedAreas[area.id] || false}
          expandedAreas={expandedAreas}
          onToggleExpansion={onToggleExpansion}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubarea={onAddSubarea}
          onAddProcess={onAddProcess}
          onRemoveProcess={onRemoveProcess}
        />
      ))}
    </div>
  );
}
