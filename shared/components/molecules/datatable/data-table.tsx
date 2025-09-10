'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  SortDirection,
  useReactTable,
} from '@tanstack/react-table';

import { DataTablePagination } from '@/shared/components/molecules/datatable/data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTableToolbar } from '../../../../features/products/components/organisms/crud/data-table-toolbar';
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: {
    total: number;
    totalPages: number;
  };
  search: string | null;
  sortBy: string | null;
  sortDir: SortDirection | null;
  page: number;
  pageSize: number;
  filter?: ColumnFiltersState | null;
  onSearchChange: (search: string | null) => void;
  onSortByChange: (sort: string | null) => void;
  onSortDirChange: (sort: SortDirection | null) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onFilterChange?: (filters: ColumnFiltersState) => void;
  onDateRangeChange?: (startDate: string | null, endDate: string | null) => void;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta,
  search,
  sortBy,
  sortDir,
  page,
  pageSize,
  filter,
  onSearchChange,
  onSortByChange,
  onSortDirChange,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  onDateRangeChange,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const sort: ColumnSort[] = sortBy && sortDir ? [{ id: sortBy, desc: sortDir === 'desc' }] : [];
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Pour afficher les erreurs

  const handleDateFilter = useCallback(() => {
    if (startDate && endDate) {
      if (dayjs(startDate).isAfter(dayjs(endDate))) {
        setError('La date de début ne peut pas être après la date de fin');
        return;
      } else {
        setError(null);
      }

      const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
      const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
      onDateRangeChange?.(formattedStartDate, formattedEndDate);
    }
  }, [startDate, endDate, onDateRangeChange]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: search ?? '',
      sorting: sort ?? [],
      columnFilters: filter ?? [],
      pagination: {
        pageIndex: (page ?? 1) - 1,
        pageSize: pageSize ?? 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount: meta.totalPages,
    rowCount: meta.total,
    onGlobalFilterChange: (updater) => {
      const value = typeof updater === 'function' ? updater(search || '') : updater;
      onSearchChange(value);
    },
    onSortingChange: (updater) => {
      const value = typeof updater === 'function' ? updater(sort || []) : updater;
      onSortByChange(value.length ? value[0].id : null);
      onSortDirChange(value.length ? (value[0].desc ? 'desc' : 'asc') : null);
    },
    onColumnFiltersChange: (updater) => {
      const value = typeof updater === 'function' ? updater(filter || []) : updater;
      onFilterChange?.(value);
    },
    onPaginationChange: (updater) => {
      const value =
        typeof updater === 'function' ? updater({ pageIndex: page - 1, pageSize }) : updater;
      onPageChange(value.pageIndex + 1);
      onPageSizeChange(value.pageSize);
    },
    debugAll: false,
  });

  return (
    <div className="space-y-4">
      <div className="flex md:flex-row flex-col justify-between items-center gap-4">
        {search != null ? <DataTableToolbar table={table} /> : (<div></div>)}
        <div className="flex justify-center items-center gap-2">
          {onDateRangeChange && (
            <>
              <div className="flex items-end gap-2">
                <div className="flex flex-col">
                  <label className="text-muted-foreground text-sm">Start date</label>
                  <Input
                    type="date"
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={dayjs().format('YYYY-MM-DD')}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-muted-foreground text-sm">End date</label>
                  <Input
                    type="date"
                    value={endDate || ''}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={dayjs().format('YYYY-MM-DD')}
                  />
                </div>
                <Button  variant="outline" onClick={handleDateFilter}>Filter by date</Button>
              </div>
              {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
            </>
          )}
          <Button
            variant="outline"
            className='mt-4'
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              onDateRangeChange?.(null, null);
              onSearchChange?.(null);
              onFilterChange?.([]);
            }}
          >
            Reset filters
          </Button>
        </div>

      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No result.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
