import { Injectable } from '@angular/core';

import { Log } from '@infor-up/m3-odin';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { environment } from '@environments/environment';

import { CusextmiService } from './cusextmi.service';

@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  private readonly FILE = `${environment.analyticsFILE}`;
  private readonly PK01 = `${environment.analyticsPK01}`;
  private readonly PK02 = `${environment.title}`;

  constructor(private readonly cusextmiService: CusextmiService) {}

  /**
   * Increase number by 1 in CUSEXTMI for FILE and PK01 when application is started in production
   */
  async ping() {
    try {
      if (!environment.production) {
        return;
      }

      const FILE = this.FILE;
      const PK01 = this.PK01;
      const PK02 = this.PK02;

      // Get current ping
      const response = await this.cusextmiService
        .getFieldValue({ FILE, PK01, PK02 })
        .toPromise()
        .catch((error) => {
          if (error instanceof MIResponse && error.errorCode === 'XRE0103') {
            return error;
          }
          throw error;
        });

      // "Record does not exist" set starting ping
      if (response.errorCode === 'XRE0103') {
        await this.cusextmiService
          .addFieldValue({ FILE, PK01, PK02, N096: 1 })
          .toPromise();
      } else {
        // Update current ping
        const N096 = response.item.N096 + 1;
        await this.cusextmiService
          .chgFieldValue({ FILE, PK01, PK02, N096 })
          .toPromise();
      }
    } catch (error) {
      Log.error(`${JSON.stringify(error)}`);
    }
  }
}
