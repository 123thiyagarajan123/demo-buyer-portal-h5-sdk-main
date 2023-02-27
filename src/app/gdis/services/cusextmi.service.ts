import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IMIRequest, Log } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';

import {
  IGetFieldValueInboundFields,
  IAddFieldValueInboundFields,
  IChgFieldValueInboundFields,
  IDelFieldValueInboundFields,
} from '../types/cusextmi.type';

@Injectable({
  providedIn: 'root',
})
export class CusextmiService {
  private readonly PROGRAM = 'CUSEXTMI';

  constructor(private readonly miService: MIService) {}

  /**
   * Get record
   * @param fields
   * @returns
   */
  getFieldValue(fields: IGetFieldValueInboundFields) {
    const request: IMIRequest = {
      program: this.PROGRAM,
      transaction: 'GetFieldValue',
      record: fields,
      maxReturnedRecords: 1,
      typedOutput: true,
      includeMetadata: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error(`Error: ${this.PROGRAM}${request.transaction}`);
        }

        return response;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Add record
   * @param fields
   * @returns
   */
  addFieldValue(fields: IAddFieldValueInboundFields) {
    const request: IMIRequest = {
      program: this.PROGRAM,
      transaction: 'AddFieldValue',
      record: fields,
      maxReturnedRecords: 1,
      typedOutput: true,
      includeMetadata: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error(`Error: ${this.PROGRAM}${request.transaction}`);
        }

        return response;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Change record
   * @param fields
   * @returns
   */
  chgFieldValue(fields: IChgFieldValueInboundFields) {
    const request: IMIRequest = {
      program: this.PROGRAM,
      transaction: 'ChgFieldValue',
      record: fields,
      maxReturnedRecords: 1,
      typedOutput: true,
      includeMetadata: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error(`Error: ${this.PROGRAM}${request.transaction}`);
        }

        return response;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Delete record
   * @param fields
   * @returns
   */
  delFieldValue(fields: IDelFieldValueInboundFields) {
    const request: IMIRequest = {
      program: this.PROGRAM,
      transaction: 'DelFieldValue',
      record: fields,
      maxReturnedRecords: 1,
      typedOutput: true,
      includeMetadata: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error(`Error: ${this.PROGRAM}${request.transaction}`);
        }

        return response;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Handle error
   */
  private handleError(error: any) {
    Log.error(`${JSON.stringify(error)}`);
    return throwError(error);
  }
}
