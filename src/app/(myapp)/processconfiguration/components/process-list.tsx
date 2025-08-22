import { IGRPButton } from '@igrp/igrp-framework-react-design-system';
import { Process } from '@igrp/platform-process-management-types';

export function ProcessList({
  processes,
  availableProcesses,
  onAssociate,
}: {
  processes: Process[];
  availableProcesses: Process[];
  onAssociate: (processKey: string) => void;
}) {
  return (
    <div className="overflow-y-auto max-h-96">
      {processes.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          {availableProcesses && availableProcesses.length === 0
            ? 'Todos os processos já estão associados a esta área'
            : 'Nenhum processo encontrado'}
        </p>
      ) : (
        <div className="space-y-2">
          {processes.map((process) => (
            <div
              key={process.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
            >
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{process.name}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  <p>Versão: {process.version}</p>
                  <p>key: {process.processKey}</p>
                </div>
              </div>
              <IGRPButton
                name={`button1`}
                variant={`default`}
                size={`sm`}
                showIcon={true}
                iconName={`ArrowRightLeft`}
                onClick={() => onAssociate(process.processKey)}
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