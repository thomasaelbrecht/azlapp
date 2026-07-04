import { type AnyColumn, asc, desc, type SQL, type SQLWrapper } from "drizzle-orm";

interface PaginationParamsToSQLOptions {
  page?: number;
  pageSize?: number;
  defaultPage?: number;
  defaultPageSize?: number;
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
  defaultPage = 0,
  defaultPageSize = 25,
}: PaginationParamsToSQLOptions) {
  // Pages are 0-based: page 0 is the first page
  const validPage = Math.max(0, page ?? defaultPage);
  const validPageSize = Math.max(1, pageSize || defaultPageSize);

  return {
    limit: validPageSize,
    offset: validPage * validPageSize,
  };
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
