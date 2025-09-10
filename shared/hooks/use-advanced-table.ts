import { ColumnFiltersState } from '@tanstack/react-table';
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

interface UseTableStateProps<T> {
  queryKey: (params: QueryParams) => readonly string[];
  queryFn: (params: QueryParams) => Promise<T>;
}

interface QueryParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  status?: string[];
  startDate?: string | null;
  endDate?: string | null;
}

interface UseTableStateReturn<T> {
  // State
  search: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: string;
  status: string[] | null;
  startDate: string | null;
  endDate: string | null;
  data: T | undefined | null;
  isPending: boolean;
  isError: boolean;

  setSearch: (value: string | null) => void;
  setPage: (value: number | null) => void;
  setPageSize: (value: number | null) => void;
  setSortBy: (value: string | null) => void;
  setSortDir: (value: string | null) => void;
  setStatus: (value: string[] | null) => void;
  handleFilterChange: (filters: ColumnFiltersState) => void;
  setStartDate: (value: string | null) => void;
  setEndDate: (value: string | null) => void;
  handleDateRangeChange: (startDate: string | null, endDate: string | null) => void;
}

export function useAdvancedTable<T>({ queryKey, queryFn }: UseTableStateProps<T>): UseTableStateReturn<T> {
  const [search, setSearch] = useQueryState('q', { defaultValue: '' });
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));
  const [sortBy, setSortBy] = useQueryState('sortBy', { defaultValue: '' });
  const [sortDir, setSortDir] = useQueryState('sortDir', { defaultValue: '' });
  const [status, setStatus] = useQueryState('status', parseAsArrayOf(parseAsString));
  const [startDate, setStartDate] = useQueryState('startDate', parseAsString.withDefault(null));
  const [endDate, setEndDate] = useQueryState('endDate', parseAsString.withDefault(null));

  const queryParams = {
    ...(search ? { search } : {}),
    ...(page !== 1 ? { page } : {}),
    ...(pageSize !== 10 ? { pageSize } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortDir ? { sortDir } : {}),
    ...(status && status.length > 0 ? { status } : {}),
    ...(startDate ? { startDate } : {}),
    ...(endDate ? { endDate } : {})
  };

  const queryP = [...queryKey, queryParams];
  const { data, isPending, isError } = useQuery({
    queryKey: queryP,
    queryFn: () => queryFn(queryParams),
    placeholderData: keepPreviousData,
  });

  const handleFilterChange = (filters: ColumnFiltersState) => {
    const statusFilter = filters.find((f) => f.id === 'status')?.value as string[] | undefined;
    setStatus(statusFilter || null);
  };
  
  const handleDateRangeChange = (startDate: string | null, endDate: string | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  return {
    search,
    page,
    pageSize,
    sortBy,
    sortDir,
    status,
    data,
    startDate,
    endDate,
    isPending,
    isError,
    setSearch,
    setPage,
    setPageSize,
    setSortBy,
    setSortDir,
    setStatus,
    setStartDate,
    setEndDate,
    handleFilterChange,
    handleDateRangeChange
  };
}