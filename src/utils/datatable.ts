import { type AnyColumn, asc, desc, type SQL, type SQLWrapper } from "drizzle-orm";

interface PaginationParamsToSQLOptions {
  page?: number;
  pageSize?: number;
  defaultPage?: number;
  defaultPageSize?: number;
}

interface SearchFiltersToSQLOptions {
  /**
   * An object that maps a query parameter to function. The function should return the SQL filter.
   */
  filterMap: Record<string, (value: string) => SQL | undefined>;

  // biome-ignore lint/suspicious/noExplicitAny: We will allow any type for filter values
  filters?: Record<string, any>;
}

interface SortParamsToSQLOptions {
  sortQuery?: string | null;
  sortColumnMapping: Record<string, AnyColumn | SQLWrapper>;
  defaultSortColumn: keyof SortParamsToSQLOptions["sortColumnMapping"];
  defaultSortDirection: "ASC" | "DESC";
}

export function paginationParamsToSQL({
  page,
  pageSize,
  defaultPage = 1,
  defaultPageSize = 10,
}: PaginationParamsToSQLOptions) {
  const validPage = Math.max(1, page || defaultPage);
  const validPageSize = Math.max(1, pageSize || defaultPageSize);

  return {
    limit: validPageSize,
    offset: (validPage - 1) * validPageSize,
  };
}

export function searchFiltersToSQL({ filters, filterMap }: SearchFiltersToSQLOptions): (SQL | undefined)[] {
  if (!filters) return [];

  return Object.keys(filters)
    .reduce(
      (queryFilters, key) => {
        const value = filters[key];
        if (value && filterMap[key]) {
          queryFilters.push(filterMap[key](value));
        }
        return queryFilters;
      },
      [] as (SQL | undefined)[],
    )
    .filter(Boolean);
}

export function sortParamsToSQL({
  sortQuery,
  sortColumnMapping,
  defaultSortColumn,
  defaultSortDirection,
}: SortParamsToSQLOptions): SQL {
  const [sortColumn = defaultSortColumn, sortDirection = defaultSortDirection] = sortQuery ? sortQuery.split(":") : [];

  if (!sortColumnMapping[sortColumn]) {
    throw new Error(`Invalid sort column: ${sortColumn}`);
  }

  const sortFn = sortDirection.toUpperCase() === "DESC" ? desc : asc;

  return sortFn(sortColumnMapping[sortColumn]);
}
