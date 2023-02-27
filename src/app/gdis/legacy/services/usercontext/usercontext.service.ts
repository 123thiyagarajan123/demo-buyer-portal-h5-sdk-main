import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UserService } from '@infor-up/m3-odin-angular';
import { IUserContext, Log } from '@infor-up/m3-odin';
import { MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoUserContextService contains user related methods
 */
export class DemoUserContextService {
  userContext!: IUserContext;

  constructor(private userService: UserService) {
    this.userService.getUserContext().subscribe((userContext: IUserContext) => {
      this.userContext = userContext;
    });
  }

  /**
   * Set userContext manually. The new template handles this already se we can just pass it in here.
   */
  setUserContext(userContext: IUserContext) {
    this.userContext = userContext;
  }

  /**
   * Returns the usercontext as an observable
   */
  getUserContext(): Observable<IUserContext> {
    return this.userService.getUserContext();
  }

  /**
   * Takes the usercontext dateformat (DTFM) and returns it in an xx/yy/zz format. Used
   * to initialize the date format for Soho datepickers
   */
  getDateFormat(): string {
    let dateFormat: string;
    const dtfm = this.userContext.DTFM;
    switch (dtfm) {
      case 'YMD':
        dateFormat = 'yy/MM/dd';
        break;
      case 'MDY':
        dateFormat = 'MM/dd/yy';
        break;
      case 'DMY':
        dateFormat = 'dd/MM/yy';
        break;
      default:
        dateFormat = 'yy/MM/dd';
    }
    return dateFormat;
  }

  /**
   * Takes a date string as input (in the user's dateformat) and returns a date object
   * @param date
   */
  getDate(date: string): Date {
    try {
      let year: number;
      let month: number;
      let day: number;
      const dtfm = this.userContext.DTFM;
      switch (dtfm) {
        case 'YMD':
          year = parseInt('20' + date.substr(0, 2));
          month = parseInt(date.substr(3, 2)) - 1;
          day = parseInt(date.substr(6, 2));
          break;
        case 'MDY':
          year = parseInt('20' + date.substr(6, 2));
          month = parseInt(date.substr(0, 2)) - 1;
          day = parseInt(date.substr(3, 2));
          break;
        case 'DMY':
          year = parseInt('20' + date.substr(6, 2));
          month = parseInt(date.substr(3, 2)) - 1;
          day = parseInt(date.substr(0, 2));
          break;
      }
      // @ts-expect-error: TODO
      return new Date(year, month, day);
    } catch (err) {
      Log.debug(err as any);
      // @ts-expect-error: TODO
      return null;
    }
  }

  /**
   * Takes a date string as input (in the user's dateformat) and returns a date string in
   * yyyyMMdd format
   * @param date
   */
  getDateFormatted(date: string): string {
    try {
      let year: number;
      let month: number;
      let day: number;
      const dtfm = this.userContext.DTFM;
      const dateArray = date.split(/[/-]+/g);
      if (dateArray.length === 3) {
        switch (dtfm) {
          case 'YMD':
            year = parseInt(dateArray[0]);
            month = parseInt(dateArray[1]) - 1;
            day = parseInt(dateArray[2]);
            break;
          case 'MDY':
            year = parseInt(dateArray[2]);
            month = parseInt(dateArray[0]) - 1;
            day = parseInt(dateArray[1]);
            break;
          case 'DMY':
            year = parseInt(dateArray[2]);
            month = parseInt(dateArray[1]) - 1;
            day = parseInt(dateArray[0]);
            break;
        }
      }
      // @ts-expect-error: TODO
      return MIUtil.getDateFormatted(new Date(year, month, day));
    } catch (err) {
      Log.debug(err as any);
      // @ts-expect-error: TODO
      return null;
    }
  }

  /**
   * Takes an enterprise search date string (in the user's dateformat) and returns a date string in
   * yyyyMMdd format
   * @param date
   */
  getDateFormattedForEnterpriseSearch(date: string): string {
    try {
      let yearString: string;
      let monthString: string;
      let dayString: string;
      let dateString: string;
      const dtfm = this.userContext.DTFM;
      switch (dtfm) {
        case 'YMD':
          yearString = date.substr(0, 2);
          monthString = date.substr(3, 2);
          dayString = date.substr(6, 2);
          break;
        case 'MDY':
          yearString = date.substr(6, 2);
          monthString = date.substr(0, 2);
          dayString = date.substr(3, 2);
          break;
        case 'DMY':
          yearString = date.substr(6, 2);
          monthString = date.substr(3, 2);
          dayString = date.substr(0, 2);
          break;
      }
      // @ts-expect-error: TODO
      monthString = monthString < '10' ? '0' + monthString : monthString;
      switch (dtfm) {
        case 'YMD':
          // @ts-expect-error: TODO
          dateString = yearString + monthString + dayString;
          break;
        case 'MDY':
          // @ts-expect-error: TODO
          dateString = monthString + dayString + yearString;
          break;
        case 'DMY':
          // @ts-expect-error: TODO
          dateString = dayString + monthString + yearString;
          break;
      }
      // @ts-expect-error: TODO
      return dateString;
    } catch (err) {
      Log.debug(err as any);
      // @ts-expect-error: TODO
      return null;
    }
  }

  /**
   * Takes an enterprise search date string (in the user's dateformat) and returns a date string in
   * yyyyMMdd format
   * @param date
   */
  getDateFormattedFromEnterpriseSearch(date: string): string {
    try {
      let yearString = '';
      let monthString = '';
      let dayString = '';
      let dateString = '';
      const dtfm = this.userContext.DTFM;
      if (date.length == 6) {
        switch (dtfm) {
          case 'YMD':
            yearString = date.substr(0, 2);
            monthString = date.substr(2, 2);
            dayString = date.substr(4, 2);
            break;
          case 'MDY':
            yearString = date.substr(4, 2);
            monthString = date.substr(0, 2);
            dayString = date.substr(2, 2);
            break;
          case 'DMY':
            yearString = date.substr(4, 2);
            monthString = date.substr(2, 2);
            dayString = date.substr(0, 2);
            break;
        }
      }
      if (date.length == 8) {
        switch (dtfm) {
          case 'YMD':
            yearString = date.substr(0, 4);
            monthString = date.substr(4, 2);
            dayString = date.substr(6, 2);
            break;
          case 'MDY':
            yearString = date.substr(4, 4);
            monthString = date.substr(0, 2);
            dayString = date.substr(2, 2);
            break;
          case 'DMY':
            yearString = date.substr(4, 4);
            monthString = date.substr(2, 2);
            dayString = date.substr(0, 2);
            break;
        }
      }

      dateString = yearString + monthString + dayString;
      return dateString;
    } catch (err) {
      Log.debug(err as any);
      // @ts-expect-error: TODO
      return null;
    }
  }

  /**
   * Takes a date and returns a date string in date picker format
   * @param date
   */
  getDateFormattedForDatepicker(date: Date): string {
    let year: number;
    let month: number;
    let day: number;
    let yearString: string;
    let monthString: string;
    let dayString: string;
    let dateString: string;

    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();

    yearString = (year - 2000).toString();
    monthString = month.toString();
    monthString = month < 10 ? '0' + monthString : monthString;
    dayString = day.toString();
    dayString = day < 10 ? '0' + dayString : dayString;

    const dtfm = this.userContext.DTFM;
    switch (dtfm) {
      case 'YMD':
        dateString = yearString + '/' + monthString + '/' + dayString;
        break;
      case 'MDY':
        dateString = monthString + '/' + dayString + '/' + yearString;
        break;
      case 'DMY':
        dateString = dayString + '/' + monthString + '/' + yearString;
        break;
    }
    // @ts-expect-error: TODO
    return dateString;
  }
}
