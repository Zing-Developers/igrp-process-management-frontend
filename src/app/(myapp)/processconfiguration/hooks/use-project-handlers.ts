import { useProjectForm } from './projects/use-project-form';
import { useProjectOperations } from './projects/use-project-operations';
import { AreaProjectsMap } from '../types';
import { Project } from '@/app/(myapp)/external/types/area';

export function useProjectHandlers(
  areaProjects: AreaProjectsMap,
  setAreaProjects: React.Dispatch<React.SetStateAction<AreaProjectsMap>>,
  projects: Project[],
  igrpToast?: any // Add igrpToast parameter
) {
  const projectForm = useProjectForm();
  const projectOperations = useProjectOperations(areaProjects, setAreaProjects);

  const handleAssociateProject = async (projectId: string) => {
    if (!projectForm.modalState.selectedAreaId) return;

    try {
      await projectOperations.handleAssociateProject(
        projectForm.modalState.selectedAreaId,
        projectId,
      );
      projectForm.closeModal();
      
      // Show success toast
      if (igrpToast) {
        igrpToast({
          type: 'success',
          title: 'Sucesso',
          description: 'Projeto associado com sucesso!',
        });
      }
    } catch (error) {
      console.error('Error associating project:', error);
      
      // Show error toast
      if (igrpToast) {
        igrpToast({
          type: 'error',
          title: 'Erro',
          description: 'Erro ao associar projeto. Tente novamente.',
        });
      }
      
      throw error;
    }
  };

  const getAvailableProjects = (areaId: string) => {
    const associatedProjectIds = areaProjects[areaId]?.map((ap) => ap.project_id) || [];
    return projects.filter((project) => !associatedProjectIds.includes(project.projectId));
  };

  return {
    projectForm,
    projectOperations,
    handleAssociateProject,
    getAvailableProjects,
  };
}