import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import {
  IBookmark,
  IMIRequest,
  IMIResponse,
  Log,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoToastService } from 'ids-enterprise-ng';

import { IDrillBack, IRelatedInformation } from '../types';

import { BookmarkService } from './bookmark.service';

@Injectable({
  providedIn: 'root',
})
export class DrillbackService {
  constructor(
    private readonly miService: MIService,
    private readonly toastService: SohoToastService,
    private readonly bookmarkService: BookmarkService
  ) {}

  executeDrillBack(
    drillBack: IDrillBack,
    relatedInformation: IRelatedInformation
  ) {
    // Stop execution if a) an option has been provided and b) no record has been selected
    const selectedRecord = relatedInformation.record;
    if (typeof drillBack.bookmark.option != 'undefined' && !selectedRecord) {
      return this.toastService.show({
        title: 'No record selected',
        message: 'Please select a record before clicking on the link',
        position: SohoToastService.TOP_RIGHT,
      });
    }

    this.getParByTable(drillBack.bookmark.table).subscribe({
      next: (response) => {
        const keyNames = this.getKeyNames(response);
        const bookmarkValues = this.getBookmarkValues(keyNames, selectedRecord);
        const bookmark = this.createBookmark(
          bookmarkValues,
          drillBack,
          keyNames
        );

        this.bookmarkService.launchBookmark(bookmark);
      },
      error: (error) => {},
    });
  }

  private createBookmark(
    values: MIRecord,
    drillBack: IDrillBack,
    keyNames: string[]
  ) {
    const { bookmark } = drillBack;

    const startPanel = bookmark.startPanel ? bookmark.startPanel : 'B';

    const includeStartPanel = bookmark.includeStartPanel ? true : false;

    const sortingOrder = bookmark.sortingOrder ? bookmark.sortingOrder : '1';

    const view = bookmark.view ? bookmark.view : null;

    return {
      program: bookmark.program,
      table: bookmark.table,
      keyNames: keyNames.toString(),
      startPanel,
      includeStartPanel,
      sortingOrder,
      option: bookmark.option,
      view,
      values,
    } as IBookmark;
  }

  /**
   * Get record
   * @param fields
   * @returns
   */
  private getParByTable(table: string | undefined) {
    const request: IMIRequest = {
      program: 'BOOKMKMI',
      transaction: 'GetParByTable',
      record: {
        FILE: table,
      },
      maxReturnedRecords: 1,
      typedOutput: true,
      includeMetadata: true,
    };

    return this.miService.execute(request).pipe(
      map((response) => {
        if (response.hasError()) {
          throw new Error(`Error: ${request.program}${request.transaction}`);
        }

        return response;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  /**
   * Loop trough response and return list with where key that start with KF has a value
   */
  private getKeyNames(response: IMIResponse) {
    const result: string[] = [];
    for (let [key, value] of Object.entries(response.item)) {
      if (key.startsWith('KF') && value) {
        result.push(value as string);
      }
    }
    return result;
  }

  /**
   * Get bookmark values
   */
  private getBookmarkValues(keyNames: string[], selectedRecord: MIRecord) {
    const values: MIRecord = new MIRecord();
    for (let key of keyNames) {
      const exists = (selectedRecord as any)[key];

      if (exists) {
        // Selected record has key
        (values as any)[key] = exists;
        if (MIUtil.isDate(exists)) {
          (values as any)[key] = MIUtil.getDateFormatted(exists);
        }
      } else {
        // Check shortkey (For example, IBPUNO <-> PUNO)
        const shortKey = key.substr(key.length - 4);
        const record = (selectedRecord as any)[shortKey];
        if (record) {
          (values as any)[key] = record;
          if (MIUtil.isDate(record)) {
            (values as any)[key] = MIUtil.getDateFormatted(record);
          }
        } else if (record === 0) {
          (values as any)[key] = record;
        } else {
          /**
           * Special check for alias fields. For example, if you want to drillback
           * to MMS001 (ITNO), but the selected record which you want to use as
           * data contains a product record (PRNO)
           */
          const aliasField = this.getAliasField(shortKey, selectedRecord);
          if (aliasField) {
            (values as any)[key] = (selectedRecord as any)[aliasField];
          } else {
            Log.warning('Bookmark key value not found, setting value to blank');
            (values as any)[key] = ' ';
          }
        }
      }
    }

    return values;
  }

  /**
   * Returns the alias value for a field. For example, if you want to drillback
   * to MMS001 (ITNO), but the selected record which you want to use as data
   * contains a product record (PRNO)
   * @param key
   * @param record
   */
  private getAliasField(key: string, record: MIRecord): string {
    const aliases = [
      {
        field: 'ITNO',
        aliasFields: ['PRNO', 'MTNO'],
      },
      {
        field: 'CUNO',
        aliasFields: ['PYNO'],
      },
      {
        field: 'PYNO',
        aliasFields: ['CUNO'],
      },
    ];

    for (let alias of aliases) {
      if (alias.field == key) {
        for (let aliasField of alias.aliasFields) {
          if ((record as any)[aliasField]) {
            return aliasField;
          }
        }
      }
    }

    return '';
  }

  /**
   * Handle error
   */
  private handleError(error: any) {
    Log.error(`${JSON.stringify(error)}`);
    return throwError(error);
  }
}
