import {
  IGRPBadgePrimitive,
  IGRPButtonPrimitive,
  IGRPCombobox,
  IGRPIcon,
  IGRPInputPrimitive,
  IGRPLabelPrimitive,
  IGRPOptionsProps,
  IGRPPopoverContentPrimitive,
  IGRPPopoverPrimitive,
  IGRPPopoverTriggerPrimitive,
} from "@igrp/igrp-framework-react-design-system";
import { useState } from "react";

export interface VariableFilter {
  id: string;
  name: string;
  operator: string;
  value: string;
}

const operatorOptions: IGRPOptionsProps[] = [
  { label: "Igual", value: "EQUALS" },
  { label: "Igual (Ignorar Maiúsculas/Minúsculas)", value: "EQUALS_IGNORE_CASE" },
  { label: "Diferente", value: "NOT_EQUALS" },
  { label: "Diferente (Ignorar Maiúsculas/Minúsculas)", value: "NOT_EQUALS_IGNORE_CASE" },
  { label: "Maior Que", value: "GREATER_THAN" },
  { label: "Maior ou Igual", value: "GREATER_THAN_OR_EQUAL" },
  { label: "Menor Que", value: "LESS_THAN" },
  { label: "Menor ou Igual", value: "LESS_THAN_OR_EQUAL" },
  { label: "Contém", value: "LIKE" },
  { label: "Contém (Ignorar Maiúsculas/Minúsculas)", value: "LIKE_IGNORE_CASE" },
];

function FilterData({
  availableVariableNames,
  onChange,
}: {
  availableVariableNames?: string[];
  onChange: (filters: VariableFilter[]) => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [variableFilters, setVariableFilters] = useState<VariableFilter[]>([]);

  const addVariableFilter = () => {
    const newFilter = {
      id: crypto.randomUUID(),
      name: "", //availableVariableNames[0] || "",
      operator: "EQUALS",
      value: "",
    };
    setVariableFilters([...variableFilters, newFilter]);
    onChange([...variableFilters, newFilter]);
  };

  const updateVariableFilter = (
    id: string,
    updates: Partial<VariableFilter>
  ) => {
    const updatedFilters = variableFilters.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );
    setVariableFilters(updatedFilters);
    onChange(updatedFilters);
    console.log(updatedFilters);
  };

  const removeVariableFilter = (id: string) => {
    setVariableFilters(variableFilters.filter((f) => f.id !== id));
    onChange(variableFilters);
  };

  const clearAllFilters = () => {
    setVariableFilters([]);
    onChange([]);
  };

  return (
    <IGRPPopoverPrimitive open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <IGRPPopoverTriggerPrimitive asChild>
        <IGRPButtonPrimitive
          variant="outline"
          size="default"
          className={`bg-secondary border-border gap-2 ${variableFilters && variableFilters.length > 0 ? "border-primary" : ""}`}
        >
          <IGRPIcon iconName="Funnel" />
          <span>Filtrar por Dados</span>
          {variableFilters.length > 0 && (
            <IGRPBadgePrimitive
              variant="secondary"
              className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {variableFilters.length}
            </IGRPBadgePrimitive>
          )}
        </IGRPButtonPrimitive>
      </IGRPPopoverTriggerPrimitive>
      <IGRPPopoverContentPrimitive className="w-[480px] p-4" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filtrar por Variáveis do Processo</h4>
            {variableFilters.length > 0 && (
              <IGRPButtonPrimitive
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs"
              >
                Limpar tudo
              </IGRPButtonPrimitive>
            )}
          </div>

          {variableFilters.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum filtro de variável aplicado. Adicione um filtro para reduzir
              os processos.
            </p>
          ) : (
            <div className="space-y-3">
              {variableFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-end gap-2 p-3 rounded-lg border border-border bg-secondary/50"
                >
                  <div className="flex-1 space-y-1.5">
                    <IGRPLabelPrimitive className="text-xs text-muted-foreground">
                      Variável
                    </IGRPLabelPrimitive>
                    {availableVariableNames &&
                    availableVariableNames.length > 0 ? (
                      <IGRPCombobox
                        value={filter.name}
                        onChange={(v) =>
                          updateVariableFilter(filter.id, {
                            name: v as string,
                          } as VariableFilter)
                        }
                        options={availableVariableNames.map((name) => ({
                          label: name,
                          value: name,
                        }))}
                      />
                    ) : (
                      <IGRPInputPrimitive
                        className="h-8 text-sm"
                        placeholder="Digite o nome da variável..."
                        value={filter.name}
                        onChange={(e) =>
                          updateVariableFilter(filter.id, {
                            name: e.target.value,
                          } as VariableFilter)
                        }
                      />
                    )}
                  </div>

                  <div className="w-[120px] space-y-1.5">
                    <IGRPLabelPrimitive className="text-xs text-muted-foreground">
                      Operador
                    </IGRPLabelPrimitive>
                    <IGRPCombobox
                      value={filter.operator}
                      onChange={(v) =>
                        updateVariableFilter(filter.id, {
                          operator: v as VariableFilter["operator"],
                        } as VariableFilter)
                      }
                      options={operatorOptions}
                    />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <IGRPLabelPrimitive className="text-xs text-muted-foreground">
                      Valor
                    </IGRPLabelPrimitive>
                    <IGRPInputPrimitive
                      className="h-8 text-sm"
                      placeholder="Digite o valor..."
                      value={filter.value}
                      onChange={(e) =>
                        updateVariableFilter(filter.id, {
                          ...filter,
                          value: e.target.value,
                        } as VariableFilter)
                      }
                    />
                  </div>

                  <IGRPButtonPrimitive
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeVariableFilter(filter.id)}
                  >
                    <IGRPIcon iconName="X" />
                  </IGRPButtonPrimitive>
                </div>
              ))}
            </div>
          )}

          <IGRPButtonPrimitive
            variant="outline"
            size="sm"
            onClick={addVariableFilter}
            className="w-full gap-2 bg-transparent"
          >
            <IGRPIcon iconName="Plus" />
            Adicionar Filtro
          </IGRPButtonPrimitive>
        </div>
      </IGRPPopoverContentPrimitive>
    </IGRPPopoverPrimitive>
  );
}

export { FilterData };
