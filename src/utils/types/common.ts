export interface IResponse {
  success: boolean;
  message: string;
  data?: Record<string, any>;
  error?: any;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginationQuery {
  query: Record<string, any>;
  page: number;
  limit: number;
  skip: number;
  sort: string;
  populate?:any
}

export interface PaginationResponse<T> {
  totalDocs: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  docs: T[];
}