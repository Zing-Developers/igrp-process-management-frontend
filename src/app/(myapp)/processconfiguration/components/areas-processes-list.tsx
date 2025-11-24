
import { IGRPButton, IGRPIcon } from '@igrp/igrp-framework-react-design-system';
import { cn } from '@/lib/utils';
import { Process } from '@igrp/platform-process-management-types';

interface ProcessesListProps {
  processes: Process[];
  onRemoveProcess: (processId: string) => void;
}

export function ProcessesList({ processes, onRemoveProcess }: ProcessesListProps) {
  if (processes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Nenhum processo associado a esta área
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground mb-2">Processos:</h4>
      {processes.map((process) => (
        <div
          key={process.id}
          className="flex items-center justify-between p-2 rounded border border-border"
        >
          <div className="flex items-center gap-2">
            <IGRPIcon
              name={`icon1`}
              iconName={'Settings'}
              size={18}
              className={cn('text-muted-foreground')}
            ></IGRPIcon>
            <div>
              <span className="text-sm font-medium text-foreground">
                {process.name || process.processKey}
              </span>
              <div className="text-xs text-muted-foreground">
                <span>v{process.version}</span>
                <span className="mx-1">•</span>
                <span>{process.statusDesc}</span>
              </div>
            </div>
          </div>
          
            <IGRPButton
              onClick={() => onRemoveProcess(process.id)}
              variant="ghost"
              size="icon"
              iconName="Trash2"
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
              iconClassName="w-4 h-4"
              title="Remover processo"
            />
        </div>
      ))}
    </div>
  );
}
