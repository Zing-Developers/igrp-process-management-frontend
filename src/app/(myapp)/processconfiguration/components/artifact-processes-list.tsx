import { IGRPButton, IGRPIcon } from '@igrp/igrp-framework-react-design-system';
import { cn } from '@/lib/utils';
import { Process } from '@igrp/platform-process-management-types';

export function ArtifactProcessesList({
  processes,
  onArtifactEdit,
  onProcessNumberEdit,
}: {
  processes: Process[];
  onArtifactEdit: (processId: string) => void;
  onProcessNumberEdit: (processId: string, processKey: string, processApplicationBase: string) => void;
}) {
  if (processes.length === 0) {
    return <div className="text-sm text-muted-foreground italic">Nenhum processo encontrado</div>;
  }

  return (
    <div className="space-y-2">
      {processes.map((process) => (
        <div
          key={process.id}
          className="flex items-center justify-between p-2 rounded-lg border border-border"
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
          <div className="flex items-center gap-2">
            <IGRPButton
              onClick={() => onProcessNumberEdit(process.id, process.processKey, process.applicationBase)}
              variant="ghost"
              size="icon"
              iconName="Hash"
              className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded"
              iconClassName="w-4 h-4"
              title="Configurar Número do Processo"
            />
            <IGRPButton
              onClick={() => onArtifactEdit(process.id)}
              variant="ghost"
              size="icon"
              iconName="ArrowRightLeft"
              className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded"
              iconClassName="w-4 h-4"
              title="Configurar Artifatos"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
