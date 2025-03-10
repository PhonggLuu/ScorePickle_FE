export interface Pagination<T> {
  tournaments: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
