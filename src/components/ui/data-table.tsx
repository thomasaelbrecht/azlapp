"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount?: number;
  onRowClick?: (row: TData) => void;
}

const dataTableSearchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  sort: parseAsString.withDefault(""),
};

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  rowCount,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [params, setParams] = useQueryStates(dataTableSearchParams);

  const sorting = useMemo<SortingState>(() => {
    if (!params.sort) return [];
    const [id, direction] = params.sort.split(":");
    if (!id || !direction) return [];
    return [{ id, desc: direction === "desc" }];
  }, [params.sort]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    rowCount,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: params.pageSize,
        pageIndex: params.page - 1,
      },
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: table is intentionally excluded as it's recreated each render
  useEffect(() => {
    table.setPageIndex(params.page - 1);
    table.setPageSize(params.pageSize);
  }, [params.page, params.pageSize]);

  const totalPages = table.getPageCount();
  const total = rowCount ?? 0;
  const from = total === 0 ? 0 : (params.page - 1) * params.pageSize + 1;
  const to = Math.min(params.page * params.pageSize, total);

  return (
    <div className="rounded-xl border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/60">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={e => {
                  const target = e.target as HTMLElement;
                  const isWithinTable = target.closest("tr, td");
                  if (isWithinTable) {
                    onRowClick?.(row.original);
                  }
                }}
                className={onRowClick ? "cursor-pointer" : ""}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center">
                Geen resultaten gevonden.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {total === 0 ? "Geen resultaten" : `${from}–${to} van ${total}`}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" disabled={params.page <= 1} onClick={() => setParams({ page: 1 })}>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={params.page <= 1}
            onClick={() => setParams({ page: params.page - 1 })}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="text-sm px-2">
            {params.page} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={params.page >= totalPages}
            onClick={() => setParams({ page: params.page + 1 })}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={params.page >= totalPages}
            onClick={() => setParams({ page: totalPages })}
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
