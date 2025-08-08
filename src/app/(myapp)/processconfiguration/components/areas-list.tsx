import { InfoCard } from '../../components/info-card';
import { Area } from '../../external/types/area';
import { Process } from '../../external/types/process';
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
  areaProcesses, // Add areaProcesses prop
}: {
  areas: ExtendedArea[];
  expandedAreas: ExpandedAreas;
  onToggleExpansion: (areaId: string) => Promise<void>;
  onEdit: (area: Area) => void;
  onDelete: (areaId: string) => void;
  onAddSubarea: (parentAreaId: string) => void;
  onAddProcess: (areaId: string) => void;
  onRemoveProcess: (areaId: string, processId: string) => void;
  areaProcesses: { [key: string]: Process[] }; // Add areaProcesses type
}) {
  // Filter to show only top-level areas (areas without parent)
  const topLevelAreas = areas.filter((area) => !area.areaId);

  if (topLevelAreas.length === 0) {
    return (
      <InfoCard
        iconName="SquareCheckBig"
        title="Nenhuma área encontrada"
        description="Nenhuma área foi encontrada. Clique no botão acima para adicionar uma nova área."
      />
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
          areaProcesses={areaProcesses} // Pass areaProcesses prop
        />
      ))}
    </div>
  );
}
