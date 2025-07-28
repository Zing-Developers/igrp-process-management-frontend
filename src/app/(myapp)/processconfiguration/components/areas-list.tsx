import { Area, AreaProject, Project } from '../../external/types/area';
import { AreaCard } from './area-card';

interface ExtendedArea extends Area {
  subareas?: ExtendedArea[];
}

interface ExpandedAreas {
  [key: string]: boolean;
}
interface AreaProjects {
  [areaId: string]: AreaProject[];
}

export function AreasList({
  areas,
  expandedAreas,
  areaProjects,
  projects,
  onToggleExpansion,
  onEdit,
  onDelete,
  onAddSubarea,
  onAddProject,
  onRemoveProject,
}: {
  areas: ExtendedArea[];
  expandedAreas: ExpandedAreas;
  areaProjects: AreaProjects;
  projects: Project[];
  onToggleExpansion: (areaId: string) => void;
  onEdit: (area: Area) => void;
  onDelete: (areaId: string) => void;
  onAddSubarea: (parentAreaId: string) => void;
  onAddProject: (areaId: string) => void;
  onRemoveProject: (areaId: string, projectId: string) => void;
}) {
  // Filter to show only top-level areas (areas without parent)
  const topLevelAreas = areas.filter((area) => !area.area_fk);

  if (topLevelAreas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma área encontrada</p>
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
          allAreaProjects={areaProjects}
          projects={projects}
          onToggleExpansion={onToggleExpansion}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddSubarea={onAddSubarea}
          onAddProject={onAddProject}
          onRemoveProject={onRemoveProject}
        />
      ))}
    </div>
  );
}
