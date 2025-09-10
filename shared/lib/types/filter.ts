export interface Filter {
  [key: string]: unknown;
  search?: string;
  category?: string[];
  userId?: string;
  subCategory?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate: string | null;
  endDate: string | null;
}
