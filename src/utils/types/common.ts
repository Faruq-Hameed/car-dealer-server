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
