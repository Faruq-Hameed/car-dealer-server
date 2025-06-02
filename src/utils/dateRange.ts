import { BadRequestException } from '../exceptions/BadRequestException';
import { type DateRange } from './types/common';

/** Date validator */
export const isValidDate = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};
/** a function that returns validated dates if specified if not default date(s) will be return */
export const dateRangeValidator = (dateData: {
  startDate?: string;
  endDate?: string;
}): DateRange => {
  const { startDate, endDate } = dateData;

  // check if the query parameters are valid date types
  if (
    (startDate && !isValidDate(startDate)) ??
    (endDate && !isValidDate(endDate))
  ) {
    throw new BadRequestException('Invalid date format');
  }

  // set the default end date to now
  const currentDate = new Date();

  /* Set the default start date to the epoch start date (January 1, 1970) */
  const defaultStartDate = new Date(0); // Epoch start date

  return {
    startDate: startDate ? new Date(startDate) : defaultStartDate,
    endDate: endDate ? new Date(endDate) : currentDate,
  };
};
