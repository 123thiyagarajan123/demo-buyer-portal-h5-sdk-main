import { Injectable } from '@angular/core';

import { MIRecord } from '@infor-up/m3-odin';

import { DemoUserContextService } from '../usercontext/usercontext.service';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoUtilService contains different kind of utility methods
 */
export class DemoUtilService {
  // Fields
  amountFields: string[] = [
    'BIDB',
    'BRAM',
    'BRLA',
    'BUAM',
    'CEAM',
    'CDC1',
    'CDC2',
    'CDC3',
    'CEVA',
    'CUAM',
    'DIA1',
    'DIA2',
    'DIA3',
    'DIA4',
    'DIA5',
    'DIA6',
    'FEAM',
    'GRSA',
    'IPIV',
    'IVAM',
    'IVLA',
    'IVNA',
    'LNAM',
    'LNA2',
    'NEPR',
    'NTAM',
    'NTLA',
    'ONET',
    'OTDA',
    'OTDB',
    'ORVA',
    'PUPR',
    'RPIV',
    'SAPR',
    'SAAM',
    'SDIA',
    'TDIN',
    'TOTA',
    'TOAM',
    'TOPY',
    'UCOS',
  ];
  dateFields: string[] = [
    'AGDT',
    'AMDT',
    'ATDT',
    'AVDT',
    'CODT',
    'CODZ',
    'CUDT',
    'DLDT',
    'DMDT',
    'DSDT',
    'DUDT',
    'DWDT',
    'DWDZ',
    'FDDT',
    'FUDT',
    'FVDT',
    'LEDT',
    'LMDT',
    'LRED',
    'LVDT',
    'ORDT',
    'PLDT',
    'PRDT',
    'PUDT',
    'RCDT',
    'RELD',
    'RGDT',
    'RLDT',
    'RLDZ',
    'RPDT',
    'STDT',
    'TODT',
    'TRDT',
    'VDDT',
  ];
  orderLineFields: string[] = [
    'PONR',
    'POSX',
    'PNLI',
    'PNLS',
    'PLPS',
    'PLP2',
    'RIDL',
  ];
  quantityFields: string[] = [
    'ADQA',
    'ADQT',
    'ALQA',
    'ALQT',
    'CAQA',
    'CAQT',
    'CFQA',
    'CFQT',
    'DLQA',
    'DLQT',
    'IVQA',
    'IVQT',
    'ORQA',
    'ORQT',
    'PLQA',
    'PLQT',
    'PPQA',
    'PPQT',
    'REQA',
    'REQT',
    'RJQA',
    'RJQT',
    'RVQA',
    'RVQT',
    'SDQA',
    'SDQT',
    'TNQA',
    'TNQT',
  ];

  // Messages
  errorMessages: string[] = ['PP00001'];
  warningMessages: string[] = [''];

  // Edit mode
  // @ts-expect-error: TODO
  editEnabled: boolean;

  constructor(private userContextService: DemoUserContextService) {}

  /**
   * Takes an MIRecord as input and returns it as a new MIRecord object
   * @param inRecord
   */
  getDuplicateRecord(inRecord: MIRecord): MIRecord {
    let fields: string[];
    let outRecord: any;
    outRecord = new MIRecord();
    outRecord.CONO = this.userContextService.userContext.currentCompany;
    fields = Object.keys(inRecord);
    for (const field of fields) {
      // @ts-expect-error: TODO
      outRecord[field] = inRecord[field];
    }
    return outRecord;
  }

  /**
   * Takes an MIRecord and removes the field prefixes
   * @param inRecord
   */
  getTrimmedRecord(inRecord: MIRecord): MIRecord {
    let fields: string[];
    let outRecord: any;
    outRecord = new MIRecord();
    outRecord.CONO = this.userContextService.userContext.currentCompany;
    fields = Object.keys(inRecord);
    for (const field of fields) {
      if (field.length === 6) {
        const shortField = field.substring(2);
        // @ts-expect-error: TODO
        outRecord[shortField] = inRecord[field];
      } else {
        // @ts-expect-error: TODO
        outRecord[field] = inRecord[field];
      }
    }
    return outRecord;
  }

  /**
   * Checks if a field is an amount. The validation is made against the amountFields array
   * defined in this service
   * @param field
   */
  isAmount(field: string) {
    if (this.amountFields.indexOf(field) >= 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a field is a date. The validation is made against the dateFields array
   * defined in this service
   * @param field
   */
  isDate(field: string) {
    if (this.dateFields.indexOf(field) >= 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks if the mashup application is edit enabled. Used by the panel component when building
   * the detail panel fields returned by a bookmark
   */
  isEditEnabled() {
    if (this.editEnabled) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Checks if a value is an error message. The validation is made against the errorMessages array
   * defined in this service. Used by the panel component when processing a bookmark panel response
   * @param message
   */
  isErrorMessage(message: string) {
    if (this.errorMessages.indexOf(message) >= 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a field is an order line field. The validation is made against the orderLineFields
   * array defined in this service. Used by the list component when processing an IMIResponse
   * @param field
   */
  isOrderLine(field: string) {
    if (this.orderLineFields.indexOf(field) >= 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a field is a quantity field. The validation is made against the quantityFields
   * array defined in this service. Used by the list component when processing an IMIResponse
   * @param field
   */
  isQuantity(field: string) {
    if (this.quantityFields.indexOf(field) >= 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks if a value is an warning message. The validation is made against the warningMessages
   * array defined in this service.
   * @param message
   */
  isWarningMessage(message: string) {
    if (this.warningMessages.indexOf(message) >= 0) {
      return true;
    }
    return false;
  }
}
