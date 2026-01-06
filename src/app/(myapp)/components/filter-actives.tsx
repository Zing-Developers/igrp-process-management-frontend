import { FilterState } from "./processtaksfilter/hooks/use-dropdown-data";
import {
  IGRPBadgePrimitive,
  IGRPIcon,
} from "@igrp/igrp-framework-react-design-system";
import { useFilterData } from "./processtaksfilter/hooks/use-filter-data";

function FilterActives({ filters }: { filters: FilterState }) {
  const { variables, dateFrom, dateTo } = filters;
  const { updateFilters } = useFilterData();

  const clearDateRange = () => {
    updateFilters({ dateFrom: null, dateTo: null });
  };

  const removeVariableFilter = (id: string) => {
    updateFilters({ variables: variables.filter((f) => f.id !== id) });
  };

  const getSymbol = (operator: string) => {
    switch (operator) {
      case "EQUALS":
        return "=";
      case "LIKE":
        return "~";
      case "GREATER_THAN":
        return ">";
      case "LESS_THAN":
        return "<";
      case "GREATER_THAN_OR_EQUAL":
        return ">=";
      case "LESS_THAN_OR_EQUAL":
        return "<=";
      case "NOT_EQUALS":
        return "!=";
      case "NOT_EQUALS_IGNORE_CASE":
        return "!=";
      case "EQUALS_IGNORE_CASE":
        return "=";
      case "LIKE_IGNORE_CASE":
        return "~";
      default:
        return "";
    }
  };

  return (
    <>
      {(variables.length > 0 || dateFrom) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {dateFrom && (
            <IGRPBadgePrimitive variant="secondary" className="gap-1.5 pr-1.5">
              <IGRPIcon iconName="Calendar" />
              <span>
                {dateFrom}
                {dateTo && ` / ${dateTo}`}
              </span>
              <button
                onClick={clearDateRange}
                className="ml-1 hover:bg-muted rounded p-0.5"
              >
                <IGRPIcon iconName="X" />
              </button>
            </IGRPBadgePrimitive>
          )}
          {variables
            .filter((f) => f.value !== "")
            .map((filter) => (
              <IGRPBadgePrimitive
                key={filter.id}
                variant="secondary"
                className="gap-1.5 pr-1.5"
              >
                <span className="font-mono text-xs">{filter.name}</span>
                <span className="text-muted-foreground">
                  {getSymbol(filter.operator)}
                </span>
                <span className="font-medium">{filter.value}</span>
                <button
                  onClick={() => removeVariableFilter(filter.id)}
                  className="ml-1 hover:bg-muted rounded p-0.5"
                >
                  <IGRPIcon iconName="X" />
                </button>
              </IGRPBadgePrimitive>
            ))}
        </div>
      )}
    </>
  );
}

export { FilterActives };
