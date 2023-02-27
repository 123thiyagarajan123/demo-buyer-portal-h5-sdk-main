/* eslint-disable @angular-eslint/use-lifecycle-interface */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

import {
  CoreBase,
  IMIRequest,
  IMIResponse,
  MIRecord,
  ArrayUtil,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoMessageService } from 'ids-enterprise-ng';

type CustomMIRecord = MIRecord & { [key: string]: string };

@Component({
  selector: 'm3-mi-dropdown',
  templateUrl: './mi-dropdown.component.html',
  styleUrls: ['./mi-dropdown.component.css'],
})

/**
 * The MiDropdownComponent is used to display M3 data in a dropdown. It contains
 * several input decorators that are used to initialize the component, retrieve the
 * M3 data, and display it in the dropdown.
 */
export class MiDropdownComponent extends CoreBase implements OnInit {
  // Additional info such as description or name
  // Additional info such as description or name
  @Input()
  additionalInfoField!: string;

  // MIRecord that is used to retrieve the data for the dropdown
  // MIRecord that is used to retrieve the data for the dropdown

  @Input()
  apiInputRecord!: MIRecord;

  // The API program used to retrieve the data for the dropdown
  // The API program used to retrieve the data for the dropdown

  @Input()
  apiProgram!: string;

  // The API transaction used to retrieve the data for the dropdown
  // The API transaction used to retrieve the data for the dropdown

  @Input()
  apiTransaction!: string;

  // Field to be displayed in the dropdown
  // Field to be displayed in the dropdown

  @Input()
  field!: string;

  // Field used to filter the returned data
  // Field used to filter the returned data

  @Input()
  filterField!: string;

  // Value used to filter the returned data
  // Value used to filter the returned data

  @Input()
  filterValue!: string;

  // Heading
  // Heading

  @Input()
  heading!: string;

  // Disabled / readonly
  // Disabled / readonly

  @Input()
  disabled!: boolean;

  /**
   *    Selected parent record
   */
  /**
   *    Selected parent record
   */

  @Input()
  selectedParentRecord!: MIRecord;

  /**
   *    Selected parent value
   */
  /**
   *    Selected parent value
   */

  @Input()
  selectedParentValue!: string;

  /**
   *    Show only the additional field in the dropdown
   */
  /**
   *    Show only the additional field in the dropdown
   */

  @Input()
  showAdditionalFieldOnly!: boolean;

  // Event emitter when the selected value changes
  @Output() recordChanged: EventEmitter<MIRecord> =
    new EventEmitter<MIRecord>();

  isBusy = false;
  isReady = false;
  record!: MIRecord;
  records: CustomMIRecord[] = [];
  selectedIndex!: number;

  private maxRecords = 999;

  constructor(
    private miService: MIService,
    private messageService: SohoMessageService
  ) {
    super('MiDropdownComponent');
  }

  /**
   *    Loads data when selectedParentRecord has been loaded / changed
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.apiInputRecord) {
      if (this.apiProgram && this.apiTransaction && this.apiInputRecord) {
        this.clear();
        this.callApi(this.apiProgram, this.apiTransaction, this.apiInputRecord);
      }
    } else if (changes.selectedParentRecord) {
      // When the selected parent record changes, check for a match in records array
      if (this.selectedParentRecord) {
        this.clear();
        if (
          ArrayUtil.containsByProperty(
            this.records,
            this.field,
            // @ts-expect-error: TODO
            this.selectedParentRecord[this.field]
          )
        ) {
          this.record = ArrayUtil.itemByProperty(
            this.records,
            this.field,
            // @ts-expect-error: TODO
            this.selectedParentRecord[this.field]
          );
          this.onChange();
        }
      }
    } else if (changes.selectedParentValue) {
      // When the selected parent value changes, check for a match in records array
      if (this.selectedParentValue) {
        this.clear();
        if (
          ArrayUtil.containsByProperty(
            this.records,
            this.field,
            this.selectedParentValue
          )
        ) {
          this.record = ArrayUtil.itemByProperty(
            this.records,
            this.field,
            this.selectedParentValue
          );
          this.onChange();
        }
      }
    }
  }

  ngOnInit(): void {
    this.callApi(this.apiProgram, this.apiTransaction, this.apiInputRecord);
  }

  /**
   * Calls an M3 Api transaction.
   * @param program
   * @param transaction
   * @param record
   */
  private callApi(program: string, transaction: string, record?: MIRecord) {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;

    const request: IMIRequest = {
      includeMetadata: true,
      program: program,
      transaction: transaction,
      record: record,
      maxReturnedRecords: this.maxRecords,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError('Failed to list transaction data');
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
        if (error.errorCode != 'XRE0103') {
          this.onError('Failed to list transaction data', error);
        }
      }
    );
  }

  /**
   * Clears the selected record.
   */
  clear() {
    // @ts-expect-error: TODO
    this.record = null;
  }

  /**
   * Emits the recordChange event.
   */
  onChange() {
    this.recordChanged.emit(this.record);
  }

  /**
   * An error handling method.
   * @param message
   * @param error
   */
  private onError(message: string, error?: any) {
    this.logError(message, error ? '- Error: ' + JSON.stringify(error) : '');
    const buttons = [
      {
        text: 'Ok',
        click: (e: any, modal: { close: () => void }) => {
          modal.close();
        },
      },
    ];
    this.messageService
      .error()
      .title('An error occured')
      .message(
        message + '. More details might be available in the browser console.'
      )
      .buttons(buttons)
      .open();
  }

  /**
   * Handles the response from the API transaction.
   * @param response
   */
  private onResponse(response: IMIResponse) {
    // Filter returned data
    if (this.filterField && this.filterValue) {
      // @ts-expect-error: TODO
      for (let item of response.items) {
        if (item[this.filterField] == this.filterValue) {
          this.records.push(item);
        }
      }
    } else {
      // @ts-expect-error: TODO
      this.records = response.items;
    }

    // Select record
    if (this.selectedParentRecord) {
      if (
        ArrayUtil.containsByProperty(
          this.records,
          this.field,
          // @ts-expect-error: TODO
          this.selectedParentRecord[this.field]
        )
      ) {
        this.record = ArrayUtil.itemByProperty(
          this.records,
          this.field,
          // @ts-expect-error: TODO
          this.selectedParentRecord[this.field]
        );
        this.onChange();
      }
    }
    if (this.selectedParentValue) {
      if (
        ArrayUtil.containsByProperty(
          this.records,
          this.field,
          this.selectedParentValue
        )
      ) {
        this.record = ArrayUtil.itemByProperty(
          this.records,
          this.field,
          this.selectedParentValue
        );
        this.onChange();
      }
    }

    this.isReady = true;
  }
}
