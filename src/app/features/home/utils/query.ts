import { MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import { M3DateFormat } from '../enums';

import { formatDate } from '.';

export const createQueryDate = (
  YYYYMMDD: string,
  dateFormat: M3DateFormat
): string => {
  if (!YYYYMMDD) return '';
  return formatDate(MIUtil.getDate(YYYYMMDD), dateFormat);
};

export const createQueryDateRange = (
  fieldName: string,
  fromYYYYMMDD: string,
  toYYYYMMDD: string,
  dateFormat: M3DateFormat
): string => {
  const fromDate = createQueryDate(fromYYYYMMDD, dateFormat);
  const toDate = createQueryDate(toYYYYMMDD, dateFormat);
  return createQueryRange(fieldName, fromDate, toDate);
};

export const createQueryRange = (
  fieldName: string,
  from: string,
  to: string
): string => {
  if (!from) from = '*';
  if (!to) to = '*';
  if (to === '*' && from === '*') return '';
  if (to === from) return ` ${fieldName}:${to}`;
  return ` ${fieldName}:[${from} TO ${to}]`;
};
