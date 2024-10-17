import { useCallback, useEffect, useMemo, useState } from "react";

const emptyFilter = {
  operator: undefined,
  property: "",
  value: undefined,
};

const validateFilter = (filter: {
  property: string;
  operator: string;
  value: string;
}) => {
  // Filters need an operator and a property
  if (!filter.operator || !filter.property) {
    return false;
  }

  // isBlank and isPresent operators cannot have a value
  if (filter.operator === "isBlank" || filter.operator === "isPresent") {
    return typeof filter.value === "undefined";
  }

  // Other operators require a value
  if (typeof filter.value === "undefined") {
    return false;
  }

  return true;
};

export const useFilters = (
  operators: { name: string }[] = [],
  properties: { name: string }[] = [],
  initialFilters:unknown[] = []
) => {
  const [filters, setFilters] = useState<unknown[]>([]);

  useEffect(() => {
    setFilters(initialFilters.length > 0 ? initialFilters : [emptyFilter]);
  }, [initialFilters]);

  const valid = useMemo(() => {
    let passedAll = true;

    for (let i = 0; i < filters.length; i++) {
      const passed = validateFilter(filters[i] as {property:string,operator:string,value:string});

      if (!passed) {
        passedAll = false;
        break;
      }
    }

    return passedAll;
  }, [filters]);

  const handleFilterAdd = useCallback((index: number) => {
    setFilters((prevState: unknown[]) => {
      const filters = [...prevState];

      filters.splice(index, 0, emptyFilter);

      return filters;
    });
  }, []);

  const handleOperatorChange = useCallback(
    (index: number, name: string) => {
      // Ensure operator is allowed

      const operator = operators.find((operator) => operator.name === name);

      if (!operator) {
        return;
      }

      setFilters((prevState: unknown[]) => {
        const filters = [...prevState];

        filters[index] = {
          ...filters[index] as {property:string,operator:string,value:string},
          operator: name,
        };

        return filters;
      });
    },
    [operators]
  );

  const handlePropertyChange = useCallback(
    (index: number, name: string) => {
      // Ensure property is allowed

      const property = properties.find((property) => property.name === name);

      if (!property) {
        return;
      }

      setFilters((prevState: unknown[]) => {
        const filters = [...prevState];

        filters[index] = {
          operator: undefined,
          property: name,
          value: undefined,
        };

        return filters;
      });
    },
    [properties]
  );

  const handleValueChange = useCallback((index: number, value: string) => {
    setFilters((prevState: unknown[]) => {
      const filters = [...prevState];

      filters[index] = {
        ...filters[index] as {property:string,operator:string,value:string},
        value,
      };

      return filters;
    });
  }, []);

  const handleFiltersClear = useCallback(() => {
    setFilters([emptyFilter]);
  }, []);

  const handleFilterRemove = useCallback(
    (index: number) => {
      if (filters.length === 1) {
        setFilters([emptyFilter]);
        return;
      }

      setFilters((prevState: unknown[]) => {
        return prevState.filter((filter, _index: number) => _index !== index);
      });
    },
    [filters]
  );

  return {
    filters,
    handleFilterAdd,
    handleFilterRemove,
    handleFiltersClear,
    handleOperatorChange,
    handlePropertyChange,
    handleValueChange,
    valid,
  };
};
