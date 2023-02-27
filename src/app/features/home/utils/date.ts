import { SohoDateFormat, M3DateFormat } from '../enums';

export const formatDate = (
  date: Date,
  format: M3DateFormat,
  delimiter: string = '',
  short: boolean = false
): string => {
  try {
    let year: string = date.getFullYear().toString();
    const yearShort = date
      .getFullYear()
      .toString()
      .substr(2, 2)
      .padStart(2, '0');
    if (short) {
      year = yearShort;
    }
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const day: string = date.getDate().toString().padStart(2, '0');
    switch (format) {
      case M3DateFormat.MonthDayYear:
        return month + delimiter + day + delimiter + year;
      case M3DateFormat.DayMonthYear:
        return day + delimiter + month + delimiter + year;
      case M3DateFormat.YearMonthDay:
        return year + delimiter + month + delimiter + day;
      default:
        return day + delimiter + month + delimiter + year;
    }
  } catch (error) {
    let year = '2021';
    if (short) {
      year = '21';
    }
    const month = '01';
    const day = month;
    switch (format) {
      case M3DateFormat.MonthDayYear:
        return month + delimiter + day + delimiter + year;
      case M3DateFormat.DayMonthYear:
        return day + delimiter + month + delimiter + year;
      case M3DateFormat.YearMonthDay:
        return year + delimiter + month + delimiter + day;
      default:
        return day + delimiter + month + delimiter + year;
    }
  }
};

export const convertM3toSohoDateFormat = (m3Format: string): string => {
  switch (m3Format) {
    case M3DateFormat.DayMonthYear:
      return SohoDateFormat.DayMonthYear;
    case M3DateFormat.MonthDayYear:
      return SohoDateFormat.MonthDayYear;
    case M3DateFormat.YearMonthDay:
      return SohoDateFormat.YearMonthDay;
    default:
      return SohoDateFormat.MonthDayYear;
  }
};

export const getStartOfMonth = (year?: number, month?: number): Date => {
  const today = new Date();
  if (!year) {
    year = today.getFullYear();
  }
  if (!month) {
    month = today.getMonth();
  }
  return new Date(year, month, 1);
};

export const getEndOfMonth = (year?: number, month?: number): Date => {
  const today = new Date();
  if (!year) {
    year = today.getFullYear();
  }
  if (!month) {
    month = today.getMonth();
  }
  return new Date(year, month + 1, 0);
};

export const addMonths = (date: Date, months: number = 0): Date => {
  const day = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() !== day) {
    date.setDate(0);
  }
  return date;
};

export const addDays = (date: Date, days: number = 0): Date => {
  date.setDate(date.getDate() + days);
  return date;
};

export const parseDateFromString = (
  date: string,
  format: M3DateFormat,
  delimiter: string = ''
): Date => {
  try {
    date = date.split(delimiter).join('');
    let year, month, day;

    switch (format) {
      case M3DateFormat.MonthDayYear:
        month = date.substr(0, 2);
        day = date.substr(2, 2);
        year = date.slice(4);
        break;

      case M3DateFormat.DayMonthYear:
        day = date.substr(0, 2);
        month = date.substr(2, 2);
        year = date.slice(4);
        break;
      case M3DateFormat.YearMonthDay:
        year = date.slice(0, -4);
        month = date.slice(-4).substr(0, 2);
        day = date.slice(-2);
        break;
      default:
        return new Date();
    }
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } catch (error) {
    return new Date();
  }
};
