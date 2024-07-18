export interface PagedData<T> {
  items: T[];
  newOffset: number | null;
  total: number;
}
