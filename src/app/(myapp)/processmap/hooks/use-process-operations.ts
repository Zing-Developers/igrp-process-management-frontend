import { useState, useCallback } from 'react';
import { startProcess } from '../../external/client/services/process.service';
import { getTasksByProcessInstance, claimTask } from '../../external/client/services/task.service';
import { Process, ProcessInstance } from '@igrp/platform-process-management-types';
import { urlConfig } from '../../utils/url-config';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function useProcessOperations(igrpToast?: any, router?: AppRouterInstance) {
  const [selectedProcess, setSelectedProcess] = useState<Process | undefined>();

  const selectProcess = useCallback((process: Process) => {
    setSelectedProcess(process);
  }, []);

  const startProcessAction = useCallback(
    async (
      processDefinitionId: string,
      processKey: string,
      businessKey?: string,
      variables?: Array<{ name: string; value: string }>,
    ): Promise<ProcessInstance | null> => {
      try {
        const instance = await startProcess(
          processDefinitionId,
          processKey,
          businessKey,
          variables,
        );

        // Show success toast
        if (igrpToast) {
          igrpToast({
            type: 'success',
            title: 'Processo Iniciado',
            description: processKey
              ? `O processo ${processKey} foi iniciado com sucesso.`
              : 'O processo foi iniciado com sucesso.',
          });
        }

        // Redirect to process instance URL if router is available
        if (router && instance) {
          try {
            // Fetch tasks for the process instance to get task execution info
            const tasksResponse = await getTasksByProcessInstance(instance.id);
            console.log('instance', instance);
            console.log('tasksResponse', tasksResponse);
            // Check if there are active tasks available
            if (tasksResponse.content && tasksResponse.content.length > 0) {
              const firstTask = tasksResponse.content[0];
              
              try {
                // Claim the task before redirecting
                await claimTask(firstTask.id, 'current-user'); // You may want to get the actual user from context/session
                
                // Build task execution URL using the first available task
                const taskUrl = urlConfig.buildTaskExecutionUrl(
                  instance.procReleaseKey,
                  firstTask.processInstanceId,
                  firstTask.taskKey,
                  firstTask.id,
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
                const taskUrl = urlConfig.buildTaskExecutionUrl(
                  instance.procReleaseKey,
                  firstTask.processInstanceId,
                  firstTask.taskKey,
                  firstTask.id,
                );
                router.push(taskUrl);
              }
            } else {
              // Fallback to process instance URL if no tasks are available
              const processUrl = urlConfig.buildProcessInstanceUrl(
                instance.procReleaseKey || processKey,
                instance.id,
              );
              router.push(processUrl);
            }
          } catch (taskError) {
            console.warn('Error fetching tasks for process instance:', taskError);

            // Fallback to process instance URL if task fetching fails
            const processUrl = urlConfig.buildProcessInstanceUrl(
              instance.procReleaseKey || processKey,
              instance.id,
            );
            router.push(processUrl);
          }
        }

        return instance;
      } catch (err) {
        console.error('Error starting process:', err);

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
    [igrpToast, router],
  );

  return {
    selectedProcess,
    selectProcess,
    startProcess: startProcessAction,
  };
}
