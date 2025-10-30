import { useState, useCallback } from 'react';
import { getTasksByProcessInstance, claimTask } from '../../external/client/services/task.service';
import { Process, ProcessInstance } from '@igrp/platform-process-management-types';
import { urlConfig } from '../../utils/url-config';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { startProcess } from '../../external/client/services/process.service';
import { useIGRPToast } from '@igrp/igrp-framework-react-design-system';

export function useProcessOperations(router?: AppRouterInstance) {
  const [selectedProcess, setSelectedProcess] = useState<Process | undefined>();
  const [pendingProcessStart, setPendingProcessStart] = useState<{
    processDefinitionId: string;
    processKey: string;
    applicationBase: string;
    businessKey?: string;
    variables?: Array<{ name: string; value: string }>;
  } | null>(null);

  const { igrpToast } = useIGRPToast();

  const selectProcess = useCallback((process: Process) => {
    setSelectedProcess(process);
  }, []);

  // Store process start parameters for later execution with priority
  const prepareProcessStart = useCallback(
    (
      processDefinitionId: string,
      processKey: string,
      applicationBase: string,
      businessKey?: string,
      variables?: Array<{ name: string; value: string }>,
    ) => {
      setPendingProcessStart({
        processDefinitionId,
        processKey,
        applicationBase,
        businessKey,
        variables,
      });
    },
    [],
  );

  const startProcessWithPriority = useCallback(
    async (priority: number): Promise<ProcessInstance | null> => {
      if (!pendingProcessStart) {
        console.error('No pending process start found');
        return null;
      }

      try {
        const instance = await startProcess(
          pendingProcessStart.processDefinitionId,
          pendingProcessStart.processKey,
          pendingProcessStart.applicationBase,
          priority, // Add priority parameter
          pendingProcessStart.businessKey,
          pendingProcessStart.variables,
        );

        // Clear pending process start
        setPendingProcessStart(null);

        // Show success toast
        if (igrpToast) {
          igrpToast({
            type: 'success',
            title: 'Processo Iniciado',
            description: pendingProcessStart.processKey
              ? `O processo ${pendingProcessStart.processKey} foi iniciado com sucesso.`
              : 'O processo foi iniciado com sucesso.',
          });
        }

        // Redirect to process instance URL if router is available
        if (router && instance) {
          try {
            // Fetch tasks for the process instance to get task execution info
            const tasksResponse = await getTasksByProcessInstance(instance.id);
            // Check if there are active tasks available
            if (tasksResponse.content && tasksResponse.content.length > 0) {
              const firstTask = tasksResponse.content[0];

              try {
                // Claim the task before redirecting
                await claimTask(firstTask.id); // You may want to get the actual user from context/session

                // Build task execution URL using the first available task
                const taskUrl = await urlConfig.buildTaskExecutionUrl(
                  instance.procReleaseKey,
                  firstTask.processInstanceId,
                  firstTask.taskKey,
                  firstTask.id,
                  firstTask.applicationBase ?? '',
                );
                router.push(taskUrl);
              } catch (claimError) {
                console.warn('Error claiming task:', claimError);

                // Show warning toast but still redirect
                if (igrpToast) {
                  igrpToast({
                    type: 'warning',
                    title: 'Aviso',
                    description: 'Não foi possível assumir a tarefa automaticamente.',
                  });
                }

                // Still redirect to task execution URL even if claiming fails
                const taskUrl = await urlConfig.buildTaskExecutionUrl(
                  instance.procReleaseKey,
                  firstTask.processInstanceId,
                  firstTask.taskKey,
                  firstTask.id,
                  firstTask.applicationBase ?? '',
                );
                router.push(taskUrl);
              }
            } else {
              // Fallback to process instance URL if no tasks are available
              const processUrl = urlConfig.buildProcessInstanceUrl(
                instance.procReleaseKey || pendingProcessStart.processKey,
                instance.id,
              );
              router.push(processUrl);
            }
          } catch (taskError) {
            console.warn('Error fetching tasks for process instance:', taskError);

            // Fallback to process instance URL if task fetching fails
            const processUrl = urlConfig.buildProcessInstanceUrl(
              instance.procReleaseKey || pendingProcessStart.processKey,
              instance.id,
            );
            router.push(processUrl);
          }
        }

        return instance;
      } catch (err) {
        console.error('Error starting process:', err);

        // Clear pending process start on error
        setPendingProcessStart(null);

        // Show error toast
        if (igrpToast) {
          igrpToast({
            type: 'error',
            title: 'Erro ao Iniciar Processo',
            description: 'Ocorreu um erro ao tentar iniciar o processo.',
          });
        }

        return null;
      }
    },
    [pendingProcessStart, igrpToast, router],
  );

  return {
    selectedProcess,
    selectProcess,
    prepareProcessStart,
    startProcessWithPriority,
    pendingProcessStart,
  };
}
