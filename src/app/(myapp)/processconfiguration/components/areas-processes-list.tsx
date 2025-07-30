import { Trash2, Settings } from 'lucide-react'
import { Process } from '../../external/types/process'

interface ProcessesListProps {
  processes: Process[]
  onRemoveProcess: (processId: string) => void
}

export function ProcessesList({ processes, onRemoveProcess }: ProcessesListProps) {
  if (processes.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Nenhum processo associado a esta área
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-foreground mb-2">Processos:</h4>
      {processes.map((process) => (
        <div
          key={process.id}
          className="flex items-center justify-between p-2 bg-muted rounded border border-border"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium text-foreground">
                {process.name}
              </span>
              <div className="text-xs text-muted-foreground">
                <span>v{process.version}</span>
                <span className="mx-1">•</span>
                <span>{process.statusDesc}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onRemoveProcess(process.id)}
            className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
            title="Remover processo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}