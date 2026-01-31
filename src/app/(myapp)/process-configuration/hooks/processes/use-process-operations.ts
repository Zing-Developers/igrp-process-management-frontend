import { ProcessData } from "@igrp/platform-process-management-types";
import { AreaProcessesMap } from "../../types";
import { useAlertDialog } from "../shared/use-alert-dialog";
import { useIGRPToast } from "@igrp/igrp-framework-react-design-system";
import { associateProcessToArea, getAreaProcesses, removeProcessFromArea } from "@/app/(myapp)/client/area-process";

export function useProcessOperations(
  setAreaProcesses: React.Dispatch<React.SetStateAction<AreaProcessesMap>>,
) {
  const { igrpToast } = useIGRPToast();
  const alertDialog = useAlertDialog();

  // Extract common logic for reloading area processes
  const reloadAreaProcesses = async (areaId: string) => {
    const updatedProcessesResponse =
      await getAreaProcesses(areaId);

    // Extract the content array from the paginated response
    const updatedProcesses = updatedProcessesResponse.content;
    setAreaProcesses((prev) => ({ ...prev, [areaId]: updatedProcesses || [] }));
  };

  const handleAssociateProcess = async (
    areaId: string,
    processData: ProcessData,
  ) => {
    try {
      await associateProcessToArea(areaId, processData);

      // Reload area processes for this area
      await reloadAreaProcesses(areaId);
    } catch (error) {
      console.error("Error associating process:", error);
      throw error;
    }
  };

  const handleRemoveProcess = async (
    areaId: string,
    processDefinitionId: string,
  ) => {
    alertDialog.showAlert(
      "Confirmar remoção",
      "Tem certeza que deseja remover este processo da área?",
      async () => {
        try {
          await removeProcessFromArea(
            areaId,
            processDefinitionId,
          );

          // Reload area processes for this area
          await reloadAreaProcesses(areaId);
          igrpToast({
            type: "success",
            title: "Sucesso",
            description: "Processo removido com sucesso!",
          });
        } catch (error) {
          console.error("Error removing process:", error);
          igrpToast({
            type: "error",
            title: "Erro",
            description: "Erro ao remover processo. Tente novamente.",
          });
          throw error;
        }
      },
    );
  };

  return {
    handleAssociateProcess,
    handleRemoveProcess,
    alertDialog,
  };
}
