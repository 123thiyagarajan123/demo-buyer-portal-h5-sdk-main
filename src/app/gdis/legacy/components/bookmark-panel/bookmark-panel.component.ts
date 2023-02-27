/* eslint-disable @angular-eslint/use-lifecycle-interface */

import {
  Component,
  Input,
  DoCheck,
  SimpleChange,
  ViewChild,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  CoreBase,
  IBookmark,
  IFormControlInfo,
  IFormResponse,
  ArrayUtil,
  IFormRequest,
  Log,
} from '@infor-up/m3-odin';
import { FormService } from '@infor-up/m3-odin-angular';
import { Bookmark } from '@infor-up/m3-odin/dist/form/base';

import { SohoMessageService, SohoMessageRef } from 'ids-enterprise-ng';

import {
  IDetailPanelMessage,
  IPersonalization,
  IXmlCustomization,
  PanelResult,
} from '../..';
import { DemoUserContextService } from '../..';
import { DemoBrowseService } from '../..';
import { DemoLaunchService } from '../..';
import { DemoUtilService } from '../..';
import { DemoPersonalizationService } from '../..';
import { BookmarkPanelBuilderComponent } from '../bookmark-panel-builder/bookmark-panel-builder.component';

// tslint:disable-next-line: no-conflicting-lifecycle
@Component({
  selector: 'm3-bookmark-panel',
  templateUrl: './bookmark-panel.component.html',
  styleUrls: ['./bookmark-panel.component.css'],
})

/**
 * The GdisBookmarkPanelComponent is used to make a bookmark call to an M3 detail panel and
 * to show the returned fields. Decorators are used to define which bookmark to call
 * as well as to define what functionality that should be enabled in the component.
 */
export class BookmarkPanelComponent extends CoreBase implements DoCheck {
  @Input() header!: string;
  @Input() bookmark!: IBookmark;
  /**
   * Fields that are editable
   */
  /**
   * Fields that are editable
   */
  @Input() editableFields!: string[];

  /**
   * Fields that are part of the bookmark but that should not be displayed
   */
  /**
   * Fields that are part of the bookmark but that should not be displayed
   */

  @Input() hiddenFields!: string[];
  /**
   * Set whether all fields in the bookmark should be editable
   */
  /**
   * Set whether all fields in the bookmark should be editable
   */
  @Input() isEditable!: boolean;
  /**
   * Is the demo panel drillable. If so, the user can use the bookmark to drillback to
   * M3 with option 5. The default value us true.
   */
  @Input() isDrillEnabled = true;
  /**
   * Is the demo panel drillable. If so, the user can use the bookmark to drillback to
   * M3 with option 2. The default value us true.
   */
  @Input() isDrillEditEnabled = true;
  @Input() isUsedInDialog!: boolean;
  /**
   * Are the panel fields sorted alphabetically. The default value is false
   */
  @Input() isSort = false;
  /**
   * Should negative numbers be highlighted in red. Default false
   */
  @Input() highlightNegativeNumbers = false;
  @Input() searchField!: string;
  @Input() showAdditionalInfo!: string;
  @Output() bookmarkLoading: EventEmitter<Bookmark> = new EventEmitter();
  @Output() bookmarkLoaded: EventEmitter<Bookmark> = new EventEmitter();
  @Output()
  updateCompleteEmitter: EventEmitter<IDetailPanelMessage> = new EventEmitter();

  @ViewChild('PanelBuilder') panelBuilder!: BookmarkPanelBuilderComponent;

  private canExecute = true;
  private personalization!: IPersonalization;
  private originalControlInfos!: IFormControlInfo[];
  private commandCounter!: number;
  private currentMsgid!: string;
  controlInfos!: IFormControlInfo[];

  isBusy = false;
  isDirty = false;
  isError = false;
  isHideHeader = false;

  // Error dialog variables
  // Error dialog variables
  dialog!: SohoMessageRef;

  constructor(
    private formService: FormService,
    private userContextService: DemoUserContextService,
    private messageService: SohoMessageService,
    private demoBrowseService: DemoBrowseService,
    private personalizationService: DemoPersonalizationService,
    private launchService: DemoLaunchService,
    private utilService: DemoUtilService
  ) {
    super('BookmarkPanelComponent');
  }

  /**
   * Responsible for dirty checking.
   */
  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngDoCheck(): void {
    if (
      JSON.stringify(this.controlInfos) !==
      JSON.stringify(this.originalControlInfos)
    ) {
      this.isDirty = true;
    } else {
      this.isDirty = false;
    }
  }

  /**
   * Calls the openBookmark method when the bookmark is set.
   * @param changes
   */
  // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes.bookmark) {
      if (this.bookmark) {
        this.isError = false;
        this.openBookmark();
      }
    }
  }

  /**
   * Clears the controlInfo variables.
   */
  clearControl() {
    // @ts-expect-error: TODO
    this.originalControlInfos = null;
    // @ts-expect-error: TODO
    this.controlInfos = null;
  }

  /**
   * Returns the index of a controlInfo in an array.
   * @param tmpInfos
   * @param name
   */
  indexOfControlName(tmpInfos: IFormControlInfo[], name: string): number {
    for (let i = 0; i < tmpInfos.length; i++) {
      // @ts-expect-error: TODO
      if (tmpInfos[i].control.name === name) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Returns a boolean indicating if the panel is edit enabled
   */
  isEnabled(): boolean {
    return this.canExecute;
  }

  /**
   * Closes an M3 program by pressing F3. Any panel response is handled by the
   * processPanelResponse method.
   * @param response
   * @param bookmark
   */
  public cancelUpdate(response: IFormResponse, bookmark: IBookmark) {
    const sid = response.sessionId;
    const iid = response.instanceId;

    const request: IFormRequest = {
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
      const fieldsToUpdate: string[] = [];
      if (response.panel) {
        // @ts-expect-error: TODO
        for (const field of bookmark.fieldNames.split(',')) {
          const panelField = response.panel.controls[field];
          if (panelField) {
            fieldsToUpdate.push(field);
          }
        }
      }
      return fieldsToUpdate;
    } catch (err) {
      this.logError(err as any);
      return [];
    }
  }

  /**
   * Called by the onSave method. It gets the infoControl field values
   * @param _bookmark
   */
  private getFieldValues(_bookmark: IBookmark): string {
    const fieldValues: string[] = [];
    // @ts-expect-error: TODO
    for (const fieldName of this.bookmark.fieldNames.split(',')) {
      for (const info of this.controlInfos) {
        // @ts-expect-error: TODO
        if (info.control.name === fieldName) {
          // @ts-expect-error: TODO
          fieldValues.push(info.control.value);
          break;
        }
      }
    }
    return fieldValues.join('|');
  }

  /**
   * Retrieves the personalizations.
   * @param response
   */
  private getPersonalization(response: IFormResponse) {
    try {
      // Get customization from document
      const xmlCustomization: IXmlCustomization = {
        xmlConditionalStyles: [],
        xmlHyperLinks: [],
        xmlReplacementTexts: [],
      };

      const custElements: any[] = [].slice.call(
        // @ts-expect-error: TODO
        response.document.getElementsByTagName('Cust')
      );
      if (custElements.length > 0) {
        for (const custElement of custElements) {
          if (custElement.hasChildNodes()) {
            for (const custString of custElement.childNodes) {
              const custXml = new DOMParser().parseFromString(
                custString.data,
                'text/xml'
              );
              xmlCustomization.xmlConditionalStyles = [].slice.call(
                custXml.getElementsByTagName('ConditionalStyle')
              );
              xmlCustomization.xmlHyperLinks = [].slice.call(
                custXml.getElementsByTagName('HyperLink')
              );
              xmlCustomization.xmlReplacementTexts = [].slice.call(
                custXml.getElementsByTagName('ReplacementText')
              );
            }
          }
        }
      }

      // Parse customization
      this.personalization = this.personalizationService.parseCustomization(
        // @ts-expect-error: TODO
        this.bookmark.program,
        xmlCustomization
      );
    } catch (err) {
      this.logError(err as any);
    }
  }

  /**
   * Makes a drillback to M3 using the detail panel bookmark.
   */
  onDrillClick(option?: number) {
    const bookmark = JSON.parse(JSON.stringify(this.bookmark));
    bookmark.fieldNames = bookmark.fieldNames;
    bookmark.option = option ? option.toString() : '5';
    bookmark.includeStartPanel = false;
    bookmark.requirePanel = false;
    bookmark.panelSequence = bookmark.panelSequence
      ? bookmark.panelSequence
      : bookmark.panel;
    this.launchService.launchBookmark(bookmark);
  }

  /**
   * An error handling method.
   * @param response
   */
  private onError(response: IFormResponse): void {
    const message = response.message || 'Unable to open bookmark';
    this.isError = true;

    // const buttons = [{ text: 'OK', click: (e, modal) => { modal.close(); } }];
    // this.messageService.error()
    //    .title('Bookmark error')
    //    .message(message)
    //    .buttons(buttons)
    //    .open()
    //    .beforeClose(() => {
    //       this.updateCompleteEmitter.emit({
    //          type: PanelResult.Exit,
    //          message: "High level M3 BE error message. Bookmark processing cancelled"
    //       });
    //       return true;
    //    });

    this.canExecute = true;
  }

  /**
   * Handles the response from the bookmark. It takes the returned panel(s) and stores
   * the included panel fields in an IFormControlInfo array
   * @param response
   */
  private onResponse(response: IFormResponse): void {
    if (response.result !== 0) {
      this.onError(response);
      return;
    }

    // Get personalization
    this.getPersonalization(response);

    // Clear arrays
    this.controlInfos = this.originalControlInfos = [];

    let tempInfos: IFormControlInfo[] = [];

    const panels = response.panels;
    // @ts-expect-error: TODO
    for (const panel of panels) {
      if (panel) {
        tempInfos = tempInfos.concat(
          // @ts-expect-error: TODO
          panel.getControlInfos(this.bookmark.fieldNames.split(','))
        );
      }
    }

    /**
     *    Readonly - use isEnabled from the form control object
     */
    for (const info of tempInfos) {
      // @ts-expect-error: TODO
      if (ArrayUtil.contains(this.hiddenFields, info.control.name)) {
        // @ts-expect-error: TODO
        info.control.isVisible = false;
      }

      /**
       *    Check personalizations
       */
      if (this.personalization) {
        // Get conditional style and replacement texts
        // @ts-expect-error: TODO
        const keyName: string = info.control.name;
        const cssClass = this.personalizationService.getConditionalStyle(
          this.personalization,
          keyName,
          // @ts-expect-error: TODO
          info.control.value
        );
        const replacementText = this.personalizationService.getReplacementText(
          this.personalization,
          keyName,
          // @ts-expect-error: TODO
          info.control.value
        );
        if (cssClass) {
          (info.control as any).cssClass = cssClass;
        }
        if (replacementText) {
          // @ts-expect-error: TODO
          info.control.value = replacementText;
        }
      }

      /**
       *    Option 5 - display mode. All fields should be readonly
       */
      if (this.bookmark.option === '5') {
        try {
          // Add right alignment class to read-only inputs
          // @ts-expect-error: TODO
          if (info.control.type === 2 && (info.control as any).isRightAligned) {
            let newClass = `right-align`;

            // Highlight negative numbers in red
            if (this.highlightNegativeNumbers) {
              // Check if exactly 1 negative sign exists
              const negative: boolean =
                // @ts-expect-error: TODO
                info.control.value.split('-').length === 2;
              if (negative) {
                // Remove negative sign (usually far right)
                // @ts-expect-error: TODO
                const scrubbedNumberString = info.control.value
                  .split('-')
                  .join('');
                const parsedNumber = parseFloat(scrubbedNumberString);
                // Check if value is a number
                if (!isNaN(parsedNumber)) {
                  // Add negative sign to far left
                  // @ts-expect-error: TODO
                  info.control.value = `-${scrubbedNumberString}`;
                  // Add negative number class for highlighting
                  newClass += ` negative-number`;
                }
              }
            }

            // Update CSS classes
            if ((info.control as any).cssClass) {
              (info.control as any).cssClass += ` ` + newClass;
            } else {
              (info.control as any).cssClass = newClass;
            }
          }
        } catch (error) {}

        // @ts-expect-error: TODO
        info.control.isEnabled = false;
        continue;
      }

      /**
       *    Option 2 - edit mode
       */
      if (this.bookmark.option === '2') {
        /**
         *    If option 2 is used in the bookmark and
         *
         *    1. The component is editable, or
         *    2. The utilService.isEditEnabled() method returns true
         *
         *    then exit the for-loop, meaning the controls will use their
         *    default value from the panel
         */
        if (this.isEditable || this.utilService.isEditEnabled()) {
          break;
        }

        /**
         *    if editable fields have been provided, set non-applicable fields to readonly
         */
        // @ts-expect-error: TODO
        if (!ArrayUtil.contains(this.editableFields, info.control.name)) {
          // @ts-expect-error: TODO
          info.control.isEnabled = false;
        }
      }
    }

    // Sort alphabetically by label...
    if (this.isSort) {
      tempInfos.sort((a, b) => {
        try {
          // @ts-expect-error: TODO
          if (a.label.value < b.label.value) {
            return -1;
            // @ts-expect-error: TODO
          } else if (a.label.value > b.label.value) {
            return 1;
          } else {
            return 0;
          }
        } catch (err) {
          return 0;
        }
      });
      this.controlInfos = tempInfos;
    } else {
      // ...else sort by bookmark fieldName
      // @ts-expect-error: TODO
      for (const name of this.bookmark.fieldNames.split(',')) {
        const index = this.indexOfControlName(tempInfos, name);
        if (index > -1) {
          this.controlInfos.push(tempInfos[index]);
        }
      }
    }

    this.originalControlInfos = JSON.parse(JSON.stringify(this.controlInfos));
    this.canExecute = true;
  }

  /**
   * Called when you have changed a value on the panel and you want to update the
   * value in M3.
   */
  onSave() {
    if (true) {
      this.commandCounter = 0;
      this.currentMsgid = '';
      const bookmark = JSON.parse(JSON.stringify(this.bookmark));
      bookmark.fields = this.getFieldValues(bookmark);
      this.updateViaBookmark(bookmark);
    }
  }

  /**
   * Called when filtering fields on a detail panel
   * @param count
   */
  onVisibleElementChanged(count: number) {
    if (count) {
      this.isHideHeader = false;
    } else {
      this.isHideHeader = true;
    }
  }

  /**
   * Executes the bookmark. The current configuration determines if
   * the bookmark will be executed with option 2 or option 5
   */
  private openBookmark(): void {
    this.clearControl();

    // Check if edit mode has been enabled on the mashup level.
    if (this.utilService.isEditEnabled()) {
      this.bookmark.option = '2';
    } else if (this.isEditable) {
      // Check if isEditable property has been set on the component in the HTML
      this.bookmark.option = '2';
    } else if (this.editableFields && this.editableFields.length > 0) {
      // Check if editableFields property has been set on the component in the HTML
      this.bookmark.option = '2';
    } else {
      // Open bookmark as readonly
      this.bookmark.option = '5';
    }

    this.bookmarkLoading.emit(this.bookmark);

    this.formService.executeBookmark(this.bookmark).subscribe(
      (r) => {
        this.bookmarkLoaded.emit(this.bookmark);
        this.onResponse(r);
      },
      (r) => {
        this.bookmarkLoaded.emit(this.bookmark);
        this.onError(r);
      }
    );
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
     * 1. M3 error/warning message. Show message in dialog.
     * 2. M3 dialog. Show dialog message with action buttons.
     * 3. All went well. Press enter again
     *
     */

    try {
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
       *    If other programs are being called (i.e. ATS101), cancel update (i.e press F3)
       */
      if (!response.isDialog) {
        // @ts-expect-error: TODO
        if (response.panel.header.indexOf(bookmark.program) === -1) {
          // Special handling for program PPS170, which opens program PPS171 in detail mode
          if (bookmark.program !== 'PPS170') {
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
        this.isBusy = false;

        // @ts-expect-error: TODO
        const msg: string = response.message;
        const msgid: string = response.messageId;

        /**
         *    If msgid equals currentMsgid it means that the same message is being
         *    displayed again. Cancel processing and wait for user to provide more
         *    input to the panel
         */
        if (msgid === this.currentMsgid) {
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
         *    Show error message and cancel
         */
        if (
          // @ts-expect-error: TODO
          response.messageLevel > '10' ||
          this.utilService.isErrorMessage(msgid)
        ) {
          const buttons = [
            {
              text: 'OK',
              click: (_e: any, modal: { close: (arg0: boolean) => void }) => {
                modal.close(true);
                // @ts-expect-error: TODO
                this.dialog = null;
                this.cancelUpdate(response, bookmark);
                this.updateCompleteEmitter.emit({
                  type: PanelResult.Exit,
                  message:
                    'High level M3 BE error message. Bookmark processing cancelled',
                });
              },
              isDefault: true,
            },
          ];
          const options: SohoMessageOptions = {
            title: 'Error',
            message: msg,
            buttons,
          };
          // Show error / warning message
          this.messageService.message(options).open();
        } else {
          /**
           *    Show warning message and process user response
           */

          const buttons = [
            {
              text: 'OK',
              click: (_e: any, modal: { close: (arg0: boolean) => void }) => {
                this.isBusy = true;
                modal.close(true);
                // @ts-expect-error: TODO
                this.dialog = null;
                this.updatePressNext(response, bookmark);
              },
              isDefault: false,
            },
            {
              text: 'Cancel',
              click: (_e: any, modal: { close: (arg0: boolean) => void }) => {
                this.isBusy = true;
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
          const options: SohoMessageOptions = {
            title: 'Warning',
            message: msg,
            buttons,
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

        this.isBusy = false;

        let dialogMessage: string;

        if (response.dialogType === '1') {
          // Parse dialog message
          try {
            const panel: HTMLCollectionOf<Element> =
              // @ts-expect-error: TODO
              response.document.getElementsByTagName('Panel');
            if (panel.length > 0) {
              const caption: HTMLCollectionOf<Element> =
                panel[0].getElementsByTagName('Cap');
              if (caption.length > 0) {
                // @ts-expect-error: TODO
                dialogMessage = caption[0].textContent;
              } else {
                dialogMessage =
                  'Unable to parse dialog message, please contact your developer to investigate';
              }

              // Buttons
              const buttons: any[] = [];

              // OK
              // @ts-expect-error: TODO
              if (response.panel.controls.dbtnok) {
                buttons.push({
                  text: 'Ok',
                  click: (
                    _e: any,
                    modal: { close: (arg0: boolean) => void }
                  ) => {
                    this.isBusy = true;
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
                  click: (
                    _e: any,
                    modal: { close: (arg0: boolean) => void }
                  ) => {
                    this.isBusy = true;
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
                  click: (
                    _e: any,
                    modal: { close: (arg0: boolean) => void }
                  ) => {
                    this.isBusy = true;
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
                  click: (
                    _e: any,
                    modal: { close: (arg0: boolean) => void }
                  ) => {
                    this.isBusy = true;
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

              const options: SohoMessageOptions = {
                title: 'M3',
                message: dialogMessage,
                buttons,
              };
              // Show dialog message
              this.messageService.message(options).open();
            }
          } catch (ignore) {}
        } else {
          // Unsupported dialog type
          const msg =
            'Dialog not supported. Please implement functionality for dialog type ' +
            response.dialogType;
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
    } catch (err) {
      this.logError(err as any);
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
    const sid = response.sessionId;
    const iid = response.instanceId;

    const request: IFormRequest = {
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
        this.updateCompleteEmitter.emit({
          type: PanelResult.Finished,
          message: 'Bookmark processing finished successfully',
        });
        this.originalControlInfos = JSON.parse(
          JSON.stringify(this.controlInfos)
        );
        this.isDirty = false;
        this.isBusy = false;
      }
    });
  }

  /**
   * This method is responsible for setting the form panel with the corresponding
   * values from the component. After doing so, it "presses Enter" on the bookmark
   * panel.
   * If there is another panel in the panel sequence the processPanelResponse method
   * is called, otherwise the originalControlInfos array is updated, and the isDirty
   * variable is reset.
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
    const sid = response.sessionId;
    const iid = response.instanceId;

    const request: IFormRequest = {
      commandType: cType ? cType : 'KEY',
      commandValue: cValue ? cValue : 'ENTER',
      params: {
        SID: sid,
        IID: iid,
      },
      sessionId: sid,
    };

    const fieldsToUpdate: string[] = this.getCurrentPanelFields(
      response,
      bookmark
    );
    // @ts-expect-error: TODO
    const fields: string[] = bookmark.fields.split('|');
    // @ts-expect-error: TODO
    const fieldNames: string[] = bookmark.fieldNames.split(',');

    for (const field of fieldsToUpdate) {
      const index: number = fieldNames.indexOf(field);
      request.params[field] = fields[index];
    }

    this.formService.executeRequest(request).subscribe((response) => {
      if (response.panel) {
        this.processPanelResponse(response, bookmark);
      } else {
        this.updateCompleteEmitter.emit({
          type: PanelResult.Finished,
          message: 'Bookmark processing finished successfully',
        });
        this.originalControlInfos = JSON.parse(
          JSON.stringify(this.controlInfos)
        );
        this.isDirty = false;
        this.isBusy = false;
      }
    });
  }

  /**
   * This method is called by the onSave method. It starts the bookmark update
   * sequence. It works as follows
   *
   * 1. The bookmark is executed with option 2.
   * 2. The returned program (and panel is) is processed by programatically
   *    pressing Enter through the bookmark panel sequence, updating the panel
   *    form fields with the changed values.
   * @param bookmark
   */
  private updateViaBookmark(bookmark: IBookmark) {
    this.isBusy = true;
    // @ts-expect-error: TODO
    const keys = bookmark.keyNames.split(',');
    const values = bookmark.values;

    /**
     *
     * Need good validation of bookmark and fields. Must:
     * 1. Be able to handle typos
     * 2. Duplicate fields
     * 3.
     *
     */

    bookmark.option = '2';
    bookmark.includeStartPanel = false;
    bookmark.requirePanel = false;
    bookmark.panelSequence = bookmark.panelSequence
      ? bookmark.panelSequence
      : bookmark.panel;

    let keyFields = '';
    for (const key of keys) {
      keyFields += key;
      keyFields += ',';
      if (key.indexOf('CONO') > -1) {
        keyFields += this.userContextService.userContext.currentCompany;
      } else {
        keyFields += values[key];
      }
      keyFields += ',';
    }

    let startPanelFields = '';
    if ((bookmark as any).startPanelFieldNames) {
      const spfNames = (bookmark as any).startPanelFieldNames.split(',');
      const spfValues = (bookmark as any).startPanelFieldValues.split(',');
      for (const j in spfNames) {
        startPanelFields += spfNames[j];
        startPanelFields += ',';
        startPanelFields += spfValues[j];
        startPanelFields += ',';
      }
    }

    const request: IFormRequest = {
      commandType: 'RUN',
      commandValue: 'BOOKMARK',
      params: {
        BM_PROGRAM: bookmark.program,
        BM_TABLE_NAME: bookmark.table,
        BM_OPTION: bookmark.option,
        BM_KEY_FIELDS: keyFields,
        BM_SOURCE: 'H5',
        BM_REQUIRE_PANEL: bookmark.requirePanel.toString(),
        BM_INCLUDE_START_PANEL: bookmark.includeStartPanel.toString(),
        BM_PANEL: bookmark.panel,
        BM_PANEL_SEQUENCE: bookmark.panelSequence,
        // BM_START_PANEL: bookmark.startPanel,
        // BM_START_PANEL_FIELDS: startPanelFields
      },
    };

    this.formService.executeRequest(request).subscribe((response) => {
      if (response.panel) {
        this.processPanelResponse(response, bookmark);
      }
    });
  }
}
