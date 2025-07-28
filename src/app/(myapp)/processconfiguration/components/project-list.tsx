import { IGRPButton } from '@igrp/igrp-framework-react-design-system';
import { Project } from '../../external/types/area';

export function ProjectList({
  projects,
  availableProjects,
  onAssociate,
}: {
  projects: Project[];
  availableProjects: Project[];
  onAssociate: (projectId: string) => void;
}) {
  return (
    <div className="overflow-y-auto max-h-96">
      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {availableProjects.length === 0
            ? 'Todos os projetos já estão associados a esta área'
            : 'Nenhum projeto encontrado'}
        </p>
      ) : (
        <div className="space-y-2">
          {projects.map((project) => (
            <div
              key={project.projectId}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                )}
              </div>
              <IGRPButton
                name={`button1`}
                variant={`default`}
                size={`sm`}
                showIcon={true}
                iconName={`ArrowRightLeft`}
                onClick={() => onAssociate(project.projectId)}
              >
                Associar
              </IGRPButton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
