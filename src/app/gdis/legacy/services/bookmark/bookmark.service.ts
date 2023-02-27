import { Injectable, EventEmitter, Output, Directive } from '@angular/core';

import {
  IBookmark,
  IFormRequest,
  IFormResponse,
  Log,
  CoreBase,
} from '@infor-up/m3-odin';
import { FormService } from '@infor-up/m3-odin-angular';

import { SohoMessageRef, SohoMessageService } from 'ids-enterprise-ng';

import { IDetailPanelMessage, PanelResult } from '../..';
import { DemoUserContextService } from '../usercontext/usercontext.service';
import { DemoUtilService } from '../util/util.service';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoBookmarkService is used to execute bookmarks in edit mode. As such, it is a way
 * to update M3 data from the mashup.
 */
export class DemoBookmarkService {
  private commandCounter!: number;
  private currentMsgid!: string;

  componentRef!: CoreBase;

  // Completion event emitter
  @Output() updateCompleteEmitter: EventEmitter<IDetailPanelMessage> =
    new EventEmitter();

  // Error dialog variables
  // Error dialog variables
  dialog!: SohoMessageRef;
  closeResult!: string;

  constructor(
    private userContextService: DemoUserContextService,
    private formService: FormService,
    private messageService: SohoMessageService,
    private utilService: DemoUtilService
  ) {}

  /**
   * Closes an M3 program by pressing F3. Any panel response is handled by the
   * processPanelResponse method.
   * @param response
   * @param bookmark
   */
  public cancelUpdate(response: IFormResponse, bookmark: IBookmark) {
    let sid = response.sessionId;
    let iid = response.instanceId;

    this.setBusy(false);

    let request: IFormRequest = {
      commandType: 'KEY',
      commandValue: 'F3',
      params: {
        SID: sid,
        IID: iid,
      },
      sessionId: sid,
    };

    this.formService.executeRequest(request).subscribe((response) => {
      if (response.panel) {
        this.processPanelResponse(response, bookmark);
      }
    });
  }

  /**
   * Makes a bookmark call. Any fields to update are passed via a Bookmark object
   * using the fieldNames and values properties. The panel response is handled by
   * the processPanelResponse method.
   *
   * Bookmark example: Update PO Proposal status to 60
   *
   *    bookmark: {
   *       program: 'PPS170',
   *       table: 'MPOPLP',
   *       keyNames: 'POCONO,POPLPN,POPLPS,POPLP2',
   *       fieldNames: ['WEPSTS'].toString(),
   *       option: '2',
   *       panel: 'E',
   *       isStateless: true
   *    }
   *
   *    bookmark.values = {
   *        POPLPN: record["POPLPN"],
   *        POPLPS: record["POPLPS"],
   *        POPLP2: record["POPLP2"],
   *        WEPSTS: "60"
   *    }
   *
   * @param bm
   */
  public updateViaBookmark(bm: IBookmark) {
    this.commandCounter = 0;
    let bookmark = JSON.parse(JSON.stringify(bm));

    const keys = bookmark.keyNames.split(',');
    const values = bookmark.values;

    // Key fields
    let keyFields = '';
    for (let key of keys) {
      keyFields += key;
      keyFields += ',';
      if (key.indexOf('CONO') > -1) {
        keyFields += this.userContextService.userContext.currentCompany;
      } else {
        keyFields += values[key];
      }
      keyFields += ',';
    }

    // Startpanel fields
    let startPanelFields = '';
    if (bookmark['startPanelFieldNames']) {
      const spfNames = bookmark['startPanelFieldNames'].split(',');
      const spfValues = bookmark['startPanelFieldValues'].split(',');
      for (let j in spfNames) {
        startPanelFields += spfNames[j];
        startPanelFields += ',';
        startPanelFields += spfValues[j];
        startPanelFields += ',';
      }
    }

    let params: any = {};

    if (bookmark.program) {
      params.BM_PROGRAM = bookmark.program;
    }

    if (bookmark.table) {
      params.BM_TABLE_NAME = bookmark.table;
    }

    if (bookmark.option) {
      params.BM_OPTION = bookmark.option;
    }

    if (keyFields) {
      params.BM_KEY_FIELDS = keyFields;
    }

    params.BM_SOURCE = 'Web';

    if (bookmark.requirePanel) {
      params.BM_REQUIRE_PANEL = bookmark.requirePanel.toString();
    } else {
      params.BM_REQUIRE_PANEL = false;
    }

    if (bookmark.includeStartPanel) {
      params.BM_INCLUDE_START_PANEL = bookmark.includeStartPanel.toString();
    } else {
      params.BM_INCLUDE_START_PANEL = false;
    }

    if (bookmark.panel) {
      params.BM_PANEL = bookmark.panel;
    }

    if (bookmark.panelSequence) {
      params.BM_PANEL_SEQUENCE = bookmark.panelSequence;
    }

    if (bookmark.startPanel) {
      params.BM_START_PANEL = bookmark.startPanel;
    }

    let request: IFormRequest = {
      commandType: 'RUN',
      commandValue: 'BOOKMARK',
      params: params,
    };

    this.setBusy(true);

    this.formService.executeRequest(request).subscribe((response) => {
      if (response.panel) {
        this.processPanelResponse(response, bookmark);
      }
    });
  }

  /**
   * Makes a program call. Any fields to update are passed via a Bookmark object
   * using the fieldNames and values properties. The panel response is handled by
   * the processPanelResponse method.
   *
   * Bookmark example: Release PO proposals with PPS913
   *
   *    bookmark: {
   *       program: 'PPS913',
   *       fieldNames: ['WFBUYE', 'WTBUYE', 'WFSUNO', 'WTSUNO', 'WFFACI', 'WTFACI', 'WFPUNO', 'WTPUNO'].toString()
   *    }
   *
   *    bookmark.values = {
   *       WFBUYE: "",
   *       WTBUYE: "",
   *       WFSUNO: this.selectedParentRecord["SUNO"],
   *       WTSUNO: this.selectedParentRecord["SUNO"],
   *       WFFACI: "",
   *       WTFACI: "",
   *       WFPUNO: "",
   *       WTPUNO: ""
   *     }
   *
   * @param bm
   */
  public updateViaProgram(bm: IBookmark) {
    this.commandCounter = 0;
    let bookmark = JSON.parse(JSON.stringify(bm));

    const request: IFormRequest = {
      commandType: 'RUN',
      commandValue: bookmark.program,
    };

    this.setBusy(true);

    this.formService.executeRequest(request).subscribe((response) => {
      if (response.panel) {
        this.processPanelResponse(response, bookmark);
      }
    });
  }

  /**
   * Retrieves the current values from the M3 detail panel. Called by the updatePressNext
   * method.
   *
   * @param response
   * @param bookmark
   */
  private getCurrentPanelFields(
    response: IFormResponse,
    bookmark: IBookmark
  ): string[] {
    try {
      let fieldsToUpdate: string[] = [];
      if (response.panel) {
        // @ts-expect-error: TODO
        for (let field of bookmark.fieldNames.split(',')) {
          let panelField = response.panel.controls[field];
          if (panelField) {
            fieldsToUpdate.push(field);
          }
        }
      }
      return fieldsToUpdate;
    } catch (err) {
      Log.error(err);
      return [];
    }
  }

  /**
   * Processes a Bookmark panel response. The method is able to handle error and
   * warning messages as well as M3 dialogs of type 1.
   * @param response
   * @param bookmark
   */
  private processPanelResponse(response: IFormResponse, bookmark: IBookmark) {
    /**
     *
     * Below we are handling the possible responses from M3
     *
     * 1. M3 error/warning message. Show the message in a dialog.
     * 2. M3 dialog. Show dialog message with action buttons.
     * 3. All went well. Press enter again
     *
     */

    this.commandCounter++;

    // To avoid infinite loops, cancel update, in case we have missed to handle a scenario
    if (this.commandCounter > 10) {
      Log.error('Too many iterations. Closing bookmark program');
      this.cancelUpdate(response, bookmark);
      this.updateCompleteEmitter.emit({
        type: PanelResult.Exit,
        message:
          'A loop occurred. Please contact your developer. Bookmark processing cancelled',
      });
      return;
    }

    /**
     *    If other programs are being called (i.e. ATS101), cancel the update (i.e press F3)
     */
    if (!response.isDialog) {
      // @ts-expect-error: TODO
      if (response.panel.header.indexOf(bookmark.program) == -1) {
        // Special handling for program PPS170, which opens program PPS171 in detail mode
        if (bookmark.program != 'PPS170') {
          this.cancelUpdate(response, bookmark);
          this.updateCompleteEmitter.emit({
            type: PanelResult.Exit,
            message:
              'Another program was called. This is not supported by the component. Bookmark processing cancelled',
          });
          return;
        }
      }
    }

    /**
     *
     * Error / Warning messages
     *
     * */

    if (response.messageId) {
      // @ts-expect-error: TODO
      let msg: string = response.message;
      let msgid: string = response.messageId;

      /**
       *    If msgid equals currentMsgid it means that the same message is being
       *    displayed again. Cancel processing and wait for user to provide more
       *    input to the panel
       */
      if (msgid == this.currentMsgid) {
        this.cancelUpdate(response, bookmark);
        this.updateCompleteEmitter.emit({
          type: PanelResult.Input,
          message: 'Input required on the panel',
        });
        return;
      }

      // Set current message id
      this.currentMsgid = msgid;

      /**
       *    Show error message and cancel update
       */
      if (
        // @ts-expect-error: TODO
        response.messageLevel > '10' ||
        this.utilService.isErrorMessage(msgid)
      ) {
        this.cancelUpdate(response, bookmark);
        const buttons = [
          {
            text: 'OK',
            click: (e: any, modal: { close: (arg0: boolean) => void }) => {
              modal.close(true);
              // @ts-expect-error: TODO
              this.dialog = null;
            },
            isDefault: true,
          },
        ];
        let options: SohoMessageOptions = {
          title: 'Error',
          message: msg,
          buttons: buttons,
        };
        // Show error message
        this.messageService.message(options).open();
      } else {
        /**
         *    Show warning message and process user response
         */
        this.setBusy(false);

        const buttons = [
          {
            text: 'OK',
            click: (e: any, modal: { close: (arg0: boolean) => void }) => {
              modal.close(true);
              // @ts-expect-error: TODO
              this.dialog = null;
              this.updatePressNext(response, bookmark);
            },
            isDefault: false,
          },
          {
            text: 'Cancel',
            click: (e: any, modal: { close: (arg0: boolean) => void }) => {
              modal.close(true);
              // @ts-expect-error: TODO
              this.dialog = null;
              this.cancelUpdate(response, bookmark);
              this.updateCompleteEmitter.emit({
                type: PanelResult.Exit,
                message:
                  'Low level M3 BE error message, bookmark processing cancelled by the user',
              });
            },
            isDefault: false,
          },
        ];
        let options: SohoMessageOptions = {
          title: 'Warning',
          message: msg,
          buttons: buttons,
        };
        // Show warning message
        this.messageService.message(options).open();
      }
    } else if (response.isDialog) {
      /**
       *
       * Dialog
       *
       * */

      let dialogMessage: string;

      if (response.dialogType == '1') {
        // Parse dialog message
        try {
          let panel: HTMLCollectionOf<Element> =
            // @ts-expect-error: TODO
            response.document.getElementsByTagName('Panel');
          if (panel.length > 0) {
            let caption: HTMLCollectionOf<Element> =
              panel[0].getElementsByTagName('Cap');
            if (caption.length > 0) {
              // @ts-expect-error: TODO
              dialogMessage = caption[0].textContent;
            } else {
              dialogMessage =
                'Unable to parse dialog message, please contact your developer to investigate';
            }

            this.setBusy(false);

            // Buttons
            let buttons: any[] = [];

            // OK
            // @ts-expect-error: TODO
            if (response.panel.controls.dbtnok) {
              buttons.push({
                text: 'Ok',
                click: (e: any, modal: { close: (arg0: boolean) => void }) => {
                  modal.close(true);
                  // @ts-expect-error: TODO
                  this.dialog = null;
                  this.updatePressNext(response, bookmark);
                },
                isDefault: false,
              });
            }

            // Yes
            // @ts-expect-error: TODO
            if (response.panel.controls.dbtnyes) {
              buttons.push({
                text: 'Yes',
                click: (e: any, modal: { close: (arg0: boolean) => void }) => {
                  modal.close(true);
                  // @ts-expect-error: TODO
                  this.dialog = null;
                  this.updateFromDialog(response, bookmark, 'KEY', '1');
                },
                isDefault: false,
              });
            }

            // No
            // @ts-expect-error: TODO
            if (response.panel.controls.dbtnno) {
              buttons.push({
                text: 'No',
                click: (e: any, modal: { close: (arg0: boolean) => void }) => {
                  modal.close(true);
                  // @ts-expect-error: TODO
                  this.dialog = null;
                  this.updateFromDialog(response, bookmark, 'KEY', '0');
                },
                isDefault: false,
              });
            }

            // Cancel
            // @ts-expect-error: TODO
            if (response.panel.controls.dbtncnl) {
              buttons.push({
                text: 'Cancel',
                click: (e: any, modal: { close: (arg0: boolean) => void }) => {
                  modal.close(true);
                  // @ts-expect-error: TODO
                  this.dialog = null;
                  this.cancelUpdate(response, bookmark);
                  this.updateCompleteEmitter.emit({
                    type: PanelResult.Exit,
                    message:
                      'Dialog message, bookmark processing cancelled by the user',
                  });
                },
                isDefault: false,
              });
            }

            let options: SohoMessageOptions = {
              title: 'M3',
              message: dialogMessage,
              buttons: buttons,
            };
            // Show dialog message
            this.messageService.message(options).open();
          }
        } catch (ignore) {}
      } else {
        // Unsupported dialog type
        const msg =
          'Dialog not supported. Please implement functionality for dialog type ' +
          response['dialogType'];
        Log.error(msg);
        this.cancelUpdate(response, bookmark);
        this.updateCompleteEmitter.emit({
          type: PanelResult.Exit,
          message: msg,
        });
      }
    } else {
      /**
       *
       * All other responses
       *
       * */

      this.updatePressNext(response, bookmark);
    }
  }

  /**
   * Sets the busy indicator
   * @param busy
   */
  private setBusy(busy: boolean) {
    if (this.componentRef) {
      try {
        // @ts-expect-error: TODO
        this.componentRef['isBusy'] = busy;
      } catch (err) {
        // Do nothing
      }
    }
  }

  /**
   * Process an M3 dialog request. Any panel response is handled by the
   * processPanelResponse method.
   * @param response
   * @param bookmark
   * @param cType
   * @param cValue
   */
  private updateFromDialog(
    response: IFormResponse,
    bookmark: IBookmark,
    cType?: string,
    cValue?: string
  ) {
    let sid = response.sessionId;
    let iid = response.instanceId;

    let request: IFormRequest = {
      commandType: cType ? cType : 'KEY',
      commandValue: cValue ? cValue : 'ENTER',
      params: {
        SID: sid,
        IID: iid,
      },
      sessionId: sid,
    };

    this.formService.executeRequest(request).subscribe((response) => {
      if (response.panel) {
        this.processPanelResponse(response, bookmark);
      } else {
        this.setBusy(false);
        this.updateCompleteEmitter.emit({
          type: PanelResult.Finished,
          message: 'Bookmark processing finished successfully',
        });
      }
    });
  }

  /**
   * Presses next or Enter in an M3 panel. Contains logic to update the M3 panel fields
   * with values from the Bookmark object using the fieldNames and values properties.
   * @param response
   * @param bookmark
   * @param cType
   * @param cValue
   */
  private updatePressNext(
    response: IFormResponse,
    bookmark: IBookmark,
    cType?: string,
    cValue?: string
  ) {
    let sid = response.sessionId;
    let iid = response.instanceId;

    let request: IFormRequest = {
      commandType: cType ? cType : 'KEY',
      commandValue: cValue ? cValue : 'ENTER',
      params: {
        SID: sid,
        IID: iid,
      },
      sessionId: sid,
    };

    let fieldsToUpdate: string[] = this.getCurrentPanelFields(
      response,
      bookmark
    );

    for (let field of fieldsToUpdate) {
      request.params[field] = bookmark.values[field];
    }

    this.setBusy(true);

    this.formService.executeRequest(request).subscribe((response) => {
      if (response.panel) {
        this.processPanelResponse(response, bookmark);
      } else {
        this.setBusy(false);
        this.updateCompleteEmitter.emit({
          type: PanelResult.Finished,
          message: 'Bookmark processing finished successfully',
        });
      }
    });
  }
}
