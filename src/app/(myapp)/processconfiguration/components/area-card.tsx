import { 
  ChevronRight,
  ChevronDown,
  Building,
  FolderPlus,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react'


import { Area } from '../../external/types/area'
import { ProcessesList } from './areas-processes-list'

interface ExtendedArea extends Area {
  subareas?: ExtendedArea[]
}

interface AreaCardProps {
  area: ExtendedArea
  isExpanded: boolean
  expandedAreas: { [key: string]: boolean }
  onToggleExpansion: (areaId: string) => Promise<void>
  onEdit: (area: Area) => void
  onDelete: (areaId: string) => void
  onAddSubarea: (parentAreaId: string) => void
  onAddProcess: (areaId: string) => void
  onRemoveProcess: (areaId: string, processId: string) => void
  level?: number
}

export function AreaCard({ 
  area, 
  isExpanded, 
  expandedAreas,
  onToggleExpansion,
  onEdit, 
  onDelete, 
  onAddSubarea, 
  onAddProcess,
  onRemoveProcess,
  level = 0
}: AreaCardProps) {
  const areaProcesses = area.process || []
  const hasSubareas = area.subareas && area.subareas.length > 0
  const hasProcesses = areaProcesses.length > 0
  
  // For top-level areas, we assume they might have subareas even if not loaded yet
  // For subareas, we only show expansion if they actually have subareas loaded
  const canHaveSubareas = level === 0 || hasSubareas
  const hasContent = hasSubareas || hasProcesses || (level === 0 && !isExpanded)

  const handleToggleExpansion = async () => {
    console.log("Toggling expansion for area:", area.id);
    await onToggleExpansion(area.id);
  };

  return (
    <div className={`border border-gray-200 rounded-lg bg-white shadow-sm ${level > 0 ? 'ml-6 mt-2' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {(hasContent || canHaveSubareas) && (
              <button
                onClick={handleToggleExpansion}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
            )}
            <Building className={`w-5 h-5 ${level === 0 ? 'text-blue-600' : 'text-purple-600'}`} />
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-900 ${level > 0 ? 'text-sm' : ''}`}>
                {level > 0 ? `Subárea: ${area.name}` : area.name}
              </h3>
              {area.description && (
                <p className="text-sm text-gray-600 mt-1">{area.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Only show "Add Subarea" button for top-level areas (level === 0) */}
            {level === 0 && (
              <button
                onClick={() => onAddSubarea(area.id)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                title="Adicionar Subárea"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onAddProcess(area.id)}
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
              title="Adicionar Processo"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(area)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(area.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
              title="Excluir"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {/* Processes for this area */}
            {hasProcesses && (
              <div className="pl-8">
                <ProcessesList 
                  processes={areaProcesses}
                  onRemoveProcess={(processId) => onRemoveProcess(area.id, processId)}
                />
              </div>
            )}
            
            {/* Subareas with their own processes */}
            {hasSubareas && (
              <div className="space-y-2">
                {area.subareas!.map((subarea) => (
                  <AreaCard
                    key={subarea.id}
                    area={subarea}
                    isExpanded={expandedAreas[subarea.id] || false}
                    expandedAreas={expandedAreas}
                    onToggleExpansion={onToggleExpansion}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddSubarea={onAddSubarea}
                    onAddProcess={onAddProcess}
                    onRemoveProcess={onRemoveProcess}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
            
            {/* Show message when expanded but no content loaded yet (only for top-level areas) */}
            {level === 0 && !hasSubareas && !hasProcesses && (
              <div className="pl-8 text-sm text-gray-500">
                Nenhuma subárea ou processo encontrado
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}