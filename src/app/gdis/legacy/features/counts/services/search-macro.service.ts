import { Injectable } from '@angular/core';

import { Log } from '@infor-up/m3-odin';

import { DemoUserContextService } from '../../../services/usercontext/usercontext.service';

@Injectable({
  providedIn: 'root',
})
export class DemoSearchMacroService {
  public SearchTypeGlobal = 'global';
  public SearchTypeField = 'field';
  public SearchTypeFieldAndTable = 'table';
  public DateMacroName = 'DATE';
  public WeekMacroName = 'WEEK';
  public MonthMacroName = 'MONTH';
  public YearMacroName = 'YEAR';
  public RangeStart = '[';
  public RangeSeparator = ' TO ';
  public RangeEnd = ']';
  public FirstDayOfWeek!: any;
  public DateFormat = '';
  public ManualDateFormat = '';

  constructor(private userContextService: DemoUserContextService) {}

  ngAfterInit() {
    if (navigator.language === 'en-US') {
      this.FirstDayOfWeek = 0;
    } else {
      this.FirstDayOfWeek = 1;
    }
  }

  public processSearchMacros(url: string, manualDateFormat?: string) {
    if (manualDateFormat) {
      this.ManualDateFormat = manualDateFormat;
    } else {
      this.ManualDateFormat = '';
    }
    try {
      let substitution: string;
      let macroResult = {
        macro: '',
        value: 0,
      };
      while (this.findMacroAndValue(url, this.DateMacroName, macroResult)) {
        substitution = this.getDateSubstitution(macroResult.value) as string;
        url = url.replace(macroResult.macro, substitution);
      }
      while (this.findMacroAndValue(url, this.WeekMacroName, macroResult)) {
        substitution = this.getWeekSubstitution(macroResult.value);
        url = url.replace(macroResult.macro, substitution);
      }
      while (this.findMacroAndValue(url, this.MonthMacroName, macroResult)) {
        substitution = this.getMonthSubstitution(macroResult.value);
        url = url.replace(macroResult.macro, substitution);
      }
      while (this.findMacroAndValue(url, this.YearMacroName, macroResult)) {
        substitution = this.getYearSubstitution(macroResult.value);
        url = url.replace(macroResult.macro, substitution);
      }
      // Company
      url = url.replace(
        '<CONO>',
        this.userContextService.userContext.currentCompany as string
      );
      url = url.replace(
        '<cono>',
        this.userContextService.userContext.currentCompany as string
      );
      // Division
      url = url.replace(
        '<DIVI>',
        this.userContextService.userContext.currentDivision as string
      );
      url = url.replace(
        '<divi>',
        this.userContextService.userContext.currentDivision as string
      );
      // Facility
      url = url.replace(
        '<FACI>',
        this.userContextService.userContext.FACI as string
      );
      url = url.replace(
        '<faci>',
        this.userContextService.userContext.FACI as string
      );
      // Language
      url = url.replace(
        '<LANG>',
        this.userContextService.userContext.currentLanguage as string
      );
      url = url.replace(
        '<lang>',
        this.userContextService.userContext.currentLanguage as string
      );
      // Name
      url = url.replace(
        '<NAME>',
        this.userContextService.userContext.NAME as string
      );
      url = url.replace(
        '<name>',
        this.userContextService.userContext.NAME as string
      );
      // User
      url = url.replace(
        '<USID>',
        this.userContextService.userContext.USID as string
      );
      url = url.replace(
        '<usid>',
        this.userContextService.userContext.USID as string
      );
      // Warehouse
      url = url.replace(
        '<WHLO>',
        this.userContextService.userContext.WHLO as string
      );
      url = url.replace(
        '<whlo>',
        this.userContextService.userContext.WHLO as string
      );
    } catch (error) {
      Log.warning(JSON.stringify(error));
    }
    return url;
  }

  private convertToSearchDateFormat(dateFormatM3: string) {
    let dateFormat: string;
    switch (dateFormatM3) {
      case 'YMD':
      case 'YYMMDD':
      case 'YYYYMMDD':
        dateFormat = 'yyyyMMdd';
        break;
      case 'MDY':
      case 'MMDDYY':
      case 'MMDDYYYY':
        dateFormat = 'MMddyyyy';
        break;
      case 'DMY':
      case 'DDMMYY':
      case 'DDMMYYYY':
        dateFormat = 'ddMMyyyy';
        break;
      default:
        dateFormat = 'MMddyyyy';
    }
    return dateFormat;
  }

  private findMacroAndValue(url: string, macroName: string, macroResult: any) {
    macroResult.macro = '';
    macroResult.value = 0;
    try {
      let tempString = macroName + '(';
      let index1 = url.indexOf(tempString);
      if (index1 < 0) {
        return false;
      }
      let index2 = url.indexOf(')', index1 + tempString.length);
      if (index2 < 0) {
        return false;
      }
      macroResult.macro = url.substring(index1, index2 + 1);
      let l = index1 + macroName.length + 1;
      let k = url.substring(l, index2);
      if (k) {
        macroResult.value = parseInt(k);
        if (isNaN(macroResult.value)) {
          return false;
        }
      }
      return true;
    } catch (error) {}
    return false;
  }

  private getDateSubstitution(value: any) {
    let date = new Date();
    return this.formatDate(this.addDays(date, value));
  }

  private formatDate(date: Date) {
    let stringdate;

    let year = date.getFullYear();
    let month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    if (this.ManualDateFormat) {
      this.DateFormat = this.convertToSearchDateFormat(this.ManualDateFormat);
    } else {
      this.DateFormat = this.convertToSearchDateFormat(
        this.userContextService.userContext.DTFM as string
      );
    }

    this.DateFormat = this.DateFormat.toUpperCase();

    switch (this.DateFormat) {
      case 'YYYYMMDD':
        stringdate = '' + year + month + day;
        break;
      case 'MMDDYYYY':
        stringdate = '' + month + day + year;
        break;
      case 'DDMMYYYY':
        stringdate = '' + day + month + year;
        break;
    }
    return stringdate;
  }

  private getWeekSubstitution(week: any) {
    let date = new Date();
    if (week != 0) {
      date = this.addDays(date, week * 7);
    }
    let day = new Date().getDay();
    let day2 = 0;
    if (this.FirstDayOfWeek == 0) {
      day2 = -1 * day;
    } else {
      if (day == 0) {
        day2 = -6;
      } else {
        day2 = 1 - day;
      }
    }
    let fromDt = this.addDays(date, day2);
    let toDt = this.addDays(fromDt, 6);
    return this.formatRange(this.formatDate(fromDt), this.formatDate(toDt));
  }

  private addDays(date: any, days: any) {
    let dt = new Date(date);
    dt.setDate(dt.getDate() + days);
    return dt;
  }

  private addMonths(date: any, months: any) {
    let dt = new Date(date);
    dt.setDate(1);
    dt.setMonth(dt.getMonth() + months);
    return dt;
  }

  private formatRange(fromDate: any, toDate: any) {
    return (
      this.RangeStart + fromDate + this.RangeSeparator + toDate + this.RangeEnd
    );
  }

  private getMonthSubstitution(months: any) {
    let date = new Date();
    if (months != 0) {
      date = this.addMonths(date, months);
    }
    date.setDate(1);
    let date2 = this.addDays(this.addMonths(date, 1), -1);
    return this.formatRange(this.formatDate(date), this.formatDate(date2));
  }

  private getYearSubstitution(years: any) {
    let date = new Date();
    date.setDate(1);
    if (years != 0) {
      date.setFullYear(date.getFullYear() + years);
    }
    date.setMonth(0, 1);
    let f = this.addDays(this.addMonths(date, 12), -1);
    return this.formatRange(this.formatDate(date), this.formatDate(f));
  }
}
