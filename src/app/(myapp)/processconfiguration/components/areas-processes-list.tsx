import { Trash2, Settings } from 'lucide-react'
import { Process } from '../../external/types/process'

interface ProcessesListProps {
  processes: Process[]
  onRemoveProcess: (processId: string) => void
}

export function ProcessesList({ processes, onRemoveProcess }: ProcessesListProps) {
  if (processes.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        Nenhum processo associado a esta área
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700 mb-2">Processos:</h4>
      {processes.map((process) => (
        <div
          key={process.id}
          className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-900">
                {process.processKey}
              </span>
              <div className="text-xs text-gray-600">
                <span>v{process.version}</span>
                <span className="mx-1">•</span>
                <span>{process.statusDesc}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onRemoveProcess(process.id)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Remover processo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}