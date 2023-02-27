import { Injectable } from '@angular/core';

import { IMIRequest, MIRecord } from '@infor-up/m3-odin';

@Injectable({
  providedIn: 'root',
})
export class DemoBrowseService {
  private apiProgram!: string;
  private apiTransaction!: string;

  constructor() {}

  /**
   *    This method initializes the variables that used for the MIRequest. It returns an MIRequest
   *    object. The returned MIRequest is used by the infinite paging service
   */
  getMIRequest(
    record: MIRecord,
    searchFilter?: string,
    maxReturnedRecords?: number
  ): IMIRequest {
    this.apiProgram = 'BROWSEMI';
    if (!searchFilter) {
      this.apiTransaction = 'LstValues';
    } else {
      this.apiTransaction = 'SearchValues';
    }

    let request: IMIRequest = {
      program: this.apiProgram,
      transaction: this.apiTransaction,
      maxReturnedRecords: maxReturnedRecords ? maxReturnedRecords : 50,
      typedOutput: true,
      record: record,
    };

    return request;
  }
}
