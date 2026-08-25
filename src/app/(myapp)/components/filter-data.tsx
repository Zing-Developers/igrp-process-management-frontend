import {
  IGRPButtonPrimitive,
  IGRPCombobox,
  IGRPIcon,
  IGRPInputPrimitive,
  IGRPLabelPrimitive,
} from "@igrp/igrp-framework-react-design-system";
import { useEffect, useState } from "react";
import { OperatorOptions } from "./types";

export interface VariableFilter {
  id: string;
  name: string;
  operator: string;
  value: string;
}

function FilterData({
  availableVariableNames,
  value,
  onChange,
}: {
  availableVariableNames?: string[];
  value?: VariableFilter[];
  onChange: (filters: VariableFilter[]) => void;
}) {
  const [variableFilters, setVariableFilters] = useState<VariableFilter[]>(
    value ?? [],
  );

  useEffect(() => {
    setVariableFilters(value ?? []);
  }, [value]);

  const addVariableFilter = () => {
    const nextFilters = [
      ...variableFilters,
      {
        id: crypto.randomUUID(),
        name: "",
        operator: "EQUALS",
        value: "",
      },
    ];
    setVariableFilters(nextFilters);
    onChange(nextFilters);
  };

  const updateVariableFilter = (
    id: string,
    updates: Partial<VariableFilter>,
  ) => {
    const nextFilters = variableFilters.map((filter) =>
      filter.id === id ? { ...filter, ...updates } : filter,
    );
    setVariableFilters(nextFilters);
    onChange(nextFilters);
  };

  const removeVariableFilter = (id: string) => {
    const nextFilters = variableFilters.filter((filter) => filter.id !== id);
    setVariableFilters(nextFilters);
    onChange(nextFilters);
  };

  const clearAllFilters = () => {
    setVariableFilters([]);
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Filtrar por Dados</h4>
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

      {variableFilters.length > 0 && (
        <div className="space-y-3">
          {variableFilters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-end gap-2 rounded-lg border border-border p-3"
            >
              <div className="flex-1 space-y-1.5">
                <IGRPLabelPrimitive className="text-xs text-muted-foreground">
                  Variável
                </IGRPLabelPrimitive>
                {availableVariableNames && availableVariableNames.length > 0 ? (
                  <IGRPCombobox
                    value={filter.name}
                    onChange={(selected) =>
                      updateVariableFilter(filter.id, {
                        name: selected as string,
                      })
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
                    onChange={(event) =>
                      updateVariableFilter(filter.id, {
                        name: event.target.value,
                      })
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
                  onChange={(selected) =>
                    updateVariableFilter(filter.id, {
                      operator: selected as VariableFilter["operator"],
                    })
                  }
                  options={OperatorOptions}
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
                  onChange={(event) =>
                    updateVariableFilter(filter.id, {
                      value: event.target.value,
                    })
                  }
                />
              </div>

              <IGRPButtonPrimitive
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                aria-label="Remover filtro"
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
  );
}

export { FilterData };
