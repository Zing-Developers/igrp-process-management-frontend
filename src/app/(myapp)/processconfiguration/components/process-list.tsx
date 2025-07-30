import { IGRPButton } from '@igrp/igrp-framework-react-design-system';
import { Process } from '../../external/types/process';

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
        <p className="text-gray-500 text-center py-8">
          {availableProcesses && availableProcesses.length === 0
            ? 'Todos os processos já estão associados a esta área'
            : 'Nenhum processo encontrado'}
        </p>
      ) : (
        <div className="space-y-2">
          {processes.map((process) => (
            <div
              key={process.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{process.processKey}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Versão: {process.version}</p>
                  <p>Status: {process.statusDesc}</p>
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