import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IFormRequest, IFormResponse, Panel } from '@infor-up/m3-odin';
import { FormService } from '@infor-up/m3-odin-angular';

@Injectable({
  providedIn: 'root',
})

/**
 * The Program service contains methods to call M3
 */
export class ProgramService {
  constructor(private formService: FormService) {}

  /**
   * Closes a program in M3
   * @param sid
   * @param iid
   * @param program
   */
  closeProgram(sid: string, iid: string): Observable<IFormResponse> {
    const programrequest = {
      commandType: 'FNC',
      commandValue: 'ENDPGM',
      params: {
        SID: sid,
        IID: iid,
      },
      sessionId: sid,
    };
    const request: IFormRequest = programrequest;
    return this.formService.executeRequest(request);
  }

  /**
   * Starts a program in M3
   * @param program
   * @param isLoadCst
   */
  runProgram(program: string, isLoadCst?: boolean): Observable<IFormResponse> {
    const cstload = isLoadCst ? 1 : 2;
    const programrequest = {
      commandType: 'RUN',
      commandValue: program,
      params: {
        CSTLOAD: cstload,
      },
    };
    const request: IFormRequest = programrequest;
    return this.formService.executeRequest(request);
  }

  /**
   * Executes an Enterprise Search in an M3 program
   * @param sid
   * @param iid
   * @param panel
   * @param url
   * @param sortingOrder
   * @param view
   * @returns
   */
  searchProgram(
    sid: string,
    iid: string,
    panel: Panel,
    url: string,
    sortingOrder?: string,
    view?: string
  ): Observable<IFormResponse> {
    let searchrequest = {
      commandType: 'SEARCH',
      commandValue: url,
      params: {
        SID: sid,
        IID: iid,
        WOPAVR: view ? view : '',
        WWQTTP: sortingOrder ? sortingOrder : '1',
      },
      sessionId: sid,
    };

    // Dynamically add properties from response.panel.list.columns.ListColumn.positionfield
    try {
      for (let column of panel.list.columns) {
        if (column.positionField) {
          if (!(column.positionField.name in searchrequest.params)) {
            //searchrequest.params[column.positionField.name] = '';
            (searchrequest.params as any).column.positionField.name = '';
          }
        }
      }
    } catch (err) {
      // Do nothing for now
    }

    // Dynamically add properties from response.panel.controls
    try {
      for (let control of panel.controls) {
        if (control.isEnabled && control.isVisible) {
          if (!(control.name in searchrequest.params)) {
            if (
              control.getTypeName() === 'TextBox' ||
              control.getTypeName() === 'CheckBox'
            ) {
              //   searchrequest.params[control.name] = '';
              (searchrequest.params as any).control.name = '';
            } else if (control.getTypeName() === 'ComboBox') {
              if (control.name.endsWith('PAVR')) {
                //  searchrequest.params[control.name] = view ? view : '';
                (searchrequest.params as any).control.name = view ? view : '';
              } else {
                //  searchrequest.params[control.name] = control.items[0].value;
                (searchrequest.params as any).control.name =
                  control.items[0].value;
              }
            }
          }
        }
      }
    } catch (err) {
      // Do nothing for now
    }

    const request: IFormRequest = searchrequest;
    return this.formService.executeRequest(request);
  }

  /**
   * Sets the inquiry type in an M3 program
   * @param sid
   * @param iid
   * @param panel
   * @param program
   * @param sortingOrder
   * @param view
   * @returns
   */
  setInquiryType(
    sid: string,
    iid: string,
    sortingOrder?: string,
    view?: string
  ): Observable<IFormResponse> {
    let searchrequest = {
      commandType: 'KEY',
      commandValue: 'ENTER',
      params: {
        SID: sid,
        IID: iid,
        WOPAVR: view ? view : '',
        WWQTTP: sortingOrder ? sortingOrder : '1',
      },
      sessionId: sid,
    };

    const request: IFormRequest = searchrequest;
    return this.formService.executeRequest(request);
  }
}
