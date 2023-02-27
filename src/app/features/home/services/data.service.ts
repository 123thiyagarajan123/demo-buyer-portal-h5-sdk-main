import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IMIRequest, Log, MIRecord } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';

import { IBuyer, IPackaging, ISupplier, IWarehouse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private readonly miService: MIService) {}

  listWarehouses() {
    const request: IMIRequest = {
      includeMetadata: true,
      program: 'MMS005MI',
      transaction: 'LstWarehouses',
      maxReturnedRecords: 9999,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        if (response.items) {
          return response.items as IWarehouse[];
        } else {
          return [];
        }
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }

  listUsers() {
    const request: IMIRequest = {
      includeMetadata: true,
      program: 'MNS150MI',
      transaction: 'LstUserData',
      maxReturnedRecords: 9999,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        if (response.items) {
          return response.items as IBuyer[];
        } else {
          return [];
        }
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }

  /**
   * Planned purchase orders aggregated by supplier POSUNO
   */
  listPlannedOrders(
    POBUYE: string,
    F_RELD: string,
    T_RELD: string,
    F_WHLO: string,
    T_WHLO: string,
    F_ACTP: string,
    T_ACTP: string
  ) {
    const record = new MIRecord({
      POBUYE,
      F_RELD,
      T_RELD,
      F_WHLO,
      T_WHLO,
      F_ACTP,
      T_ACTP,
    });

    const request: IMIRequest = {
      includeMetadata: true,
      program: 'CMS100MI',
      record,
      transaction: 'LstZBP_MPOPLP',
      maxReturnedRecords: 9999,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        if (response.items && response.items.length > 0) {
          response.items.forEach((record: ISupplier, index) => {
            if (!record.POSUNO) {
              response.items?.splice(index, 1);
            }
          });
        }
        if (response.items) {
          return response.items as ISupplier[];
        } else {
          return [];
        }
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }

  listPackaging() {
    const request: IMIRequest = {
      includeMetadata: true,
      program: 'MMS050MI',
      transaction: 'LstPackaging',
      maxReturnedRecords: 9999,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        if (response.items) {
          return response.items as IPackaging[];
        } else {
          return [];
        }
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }

  createPOP(
    WHLO: string,
    ITNO: string,
    SUNO: string,
    PLDT: string,
    PPQT: string,
    PSTS: string
  ) {
    const record = {
      WHLO,
      ITNO,
      SUNO,
      PLDT,
      PPQT,
      PSTS,
    };
    const request: IMIRequest = {
      includeMetadata: true,
      record,
      program: 'PPS170MI',
      transaction: 'CrtPOP',
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        return response;
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }

  deletePlannedPO(PLPN: string) {
    const record = {
      PLPN,
    };
    const request: IMIRequest = {
      includeMetadata: true,
      record,
      program: 'PPS170MI',
      transaction: 'DelPlannedPO',
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        return response;
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }

  updatePOP(PLPN: string, PLPS: string, PLP2: string, PSTS: string) {
    const record = {
      PLPN,
      PLPS,
      PLP2,
      PSTS,
    };
    const request: IMIRequest = {
      includeMetadata: true,
      record,
      program: 'PPS170MI',
      transaction: 'UpdPOP',
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        return response;
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }

  updatePOPSupplier(
    PLPN: string,
    PLPS: string,
    PLP2: string,
    SUNO: string,
    PUPR: number,
    AGNB: string
  ) {
    const record = {
      PLPN,
      PLPS,
      PLP2,
      SUNO,
      PUPR,
      OURR: AGNB,
      OURT: 1,
    };
    const request: IMIRequest = {
      includeMetadata: true,
      record,
      program: 'PPS170MI',
      transaction: 'UpdPOP',
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        return response;
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }

  releasePOP(SUNO: string) {
    const record = {
      FSUN: SUNO,
      TSUN: SUNO,
    };
    const request: IMIRequest = {
      includeMetadata: true,
      record,
      program: 'PPS170MI',
      transaction: 'RelPOP',
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error('Failed to list transaction data');
        }
        return response;
      }),
      catchError((error) => {
        Log.error(`${JSON.stringify(error)}`);
        return throwError(error);
      })
    );
  }
}
