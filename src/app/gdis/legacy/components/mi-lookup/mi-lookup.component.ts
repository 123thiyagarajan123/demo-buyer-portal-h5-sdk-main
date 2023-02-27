import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ViewEncapsulation,
  SimpleChanges,
} from '@angular/core';

import { filter } from 'rxjs/operators';

import {
  CoreBase,
  IMIRequest,
  IMIResponse,
  MIRecord,
  Log,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoMessageService, SohoLookupComponent } from 'ids-enterprise-ng';

type CustomMIRecord = MIRecord & { [key: string]: string };

/**
 * The GdisMiLookupComponent is used to display M3 data in a lookup. It contains
 * several input decorators that are used to initialize the component, retrieve the
 * M3 data, and display it in the dropdown.
 */

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'm3-mi-lookup',
  templateUrl: './mi-lookup.component.html',
  styleUrls: ['./mi-lookup.component.css'],
})
export class MiLookupComponent extends CoreBase implements AfterViewInit {
  // Additional info such as description or name
  // Additional info such as description or name
  @Input()
  additionalInfoField!: string;

  /**
   *  Field to be used as input in the apiTransaction call. This is especially useful for
   *  transactions where the input field is different than the field displayed in the
   *  lookup (i.e. MMS005MI_LstWarehouses uses FWHL and TWHL as input and WHLO as output).
   */
  /**
   *  Field to be used as input in the apiTransaction call. This is especially useful for
   *  transactions where the input field is different than the field displayed in the
   *  lookup (i.e. MMS005MI_LstWarehouses uses FWHL and TWHL as input and WHLO as output).
   */

  @Input()
  apiInputField!: string;

  // MIRecord that is used to retrieve the data for the dropdown
  // MIRecord that is used to retrieve the data for the dropdown

  @Input()
  apiInputRecord!: MIRecord;

  // The API program used to retrieve the data for the dropdown
  // The API program used to retrieve the data for the dropdown

  @Input()
  apiProgram!: string;

  // The API program used to retrieve the data for the dropdown
  // The API program used to retrieve the data for the dropdown

  @Input()
  apiSearchProgram!: string;

  // The API transaction used to retrieve the data for the dropdown
  // The API transaction used to retrieve the data for the dropdown

  @Input()
  apiTransaction!: string;

  // The API transaction used to retrieve the data for the dropdown
  // The API transaction used to retrieve the data for the dropdown

  @Input()
  apiSearchTransaction!: string;

  // Sort by. Used by the enterprise search transaction
  // Sort by. Used by the enterprise search transaction

  @Input()
  apiSearchSortByField!: string;

  // Field to be displayed in the lookup
  // Field to be displayed in the lookup

  @Input()
  field!: string;

  // Heading
  // Heading

  @Input()
  heading!: string;

  // MIRecord that can be set at startup
  // MIRecord that can be set at startup

  @Input()
  initialRecord!: MIRecord;

  // Readonly
  // Readonly

  @Input()
  readonly!: boolean;

  /**
   *    Value that can be set at startup (for example default user warehouse). An API call
   *    will be done to retrieve any additional info (for example warehouse name).
   */
  /**
   *    Value that can be set at startup (for example default user warehouse). An API call
   *    will be done to retrieve any additional info (for example warehouse name).
   */

  @Input()
  initialValue!: string;

  // Event emitter when the selected value changes
  @Output() recordChanged: EventEmitter<MIRecord> =
    new EventEmitter<MIRecord>();

  @ViewChild(SohoLookupComponent)
  lookup!: SohoLookupComponent;

  // Local variables
  // Local variables
  _value!: string;
  currentBrowseField!: string;
  isBusy = false;
  isReady = false;
  record!: CustomMIRecord;
  private maxRecords = 200;

  constructor(
    private miService: MIService,
    private messageService: SohoMessageService
  ) {
    super('MiLookupComponent');
  }

  ngAfterViewInit() {
    this.initGrid(this.lookup);

    /**
     *    Set initial record or value
     */

    if (this.initialRecord) {
      this.initRecord();
    } else if (this.initialValue) {
      this.initValue();
    }

    // Don't set focus
    this.lookup['element'].nativeElement.blur();
  }

  /**
   * A method for browsing M3 data.
   */
  onBrowse(
    request: SohoDataGridSourceRequest,
    response: SohoDataGridResponseFunction,
    field: string
  ) {
    // Initialize variables
    let currentValue: string;
    let filterValue: string;
    let isSearch: boolean;
    let rcd: MIRecord = new MIRecord();

    // Validate search
    try {
      if (request.type == 'filtered' || request.type == 'searched') {
        // @ts-expect-error: TODO
        if (request.filterExpr[0].value.length > 0) {
          isSearch = true;
          // } else if (this.lookup["element"].nativeElement.value.length > 0 && !$(this.lookup["lookup"].grid).is(":visible")) {
          //    isSearch = true;
        }
      }
    } catch (error) {
      isSearch = false;
    }

    if (
      request.type == 'initial' &&
      this.lookup['element'].nativeElement.value.length > 0
    ) {
      response([], request);
      return;
    }

    // Set current browse field so we can update additionalInfo later on
    this.currentBrowseField = field;

    // Check and set search variables
    // @ts-expect-error: TODO
    if (isSearch) {
      if (request.type == 'filtered' || request.type == 'searched') {
        // isSearch = true;
        // Check if we have an existing filter value
        if (request.filterExpr[0].value) {
          filterValue = request.filterExpr[0].value.toLocaleUpperCase();
          // Else check if we have a value in the input field that we should filter on
          // } else if (this.lookup["element"].nativeElement.value.length > 0) {
          //    filterValue = this.lookup["element"].nativeElement.value;
          //    request.filterExpr[0].value = filterValue
        }
        let searchFilter = '';
        // @ts-expect-error: TODO
        searchFilter += this.field + ':' + filterValue;
        searchFilter += '*';
        if (this.additionalInfoField) {
          searchFilter += ' OR ';
          // @ts-expect-error: TODO
          searchFilter += this.additionalInfoField + ':' + filterValue;
          searchFilter += '*';
        }
        if (this.apiSearchSortByField) {
          searchFilter += ' SortBy:' + this.apiSearchSortByField;
        }
        // @ts-expect-error: TODO
        rcd['SQRY'] = searchFilter;
      }
    } else if (this.apiInputRecord) {
      rcd = this.apiInputRecord;
    }

    if (this.isBusy) {
      return;
    }

    this.isBusy = true;

    // @ts-expect-error: TODO
    let program: string = isSearch ? this.apiSearchProgram : this.apiProgram;
    // @ts-expect-error: TODO
    let transaction: string = isSearch
      ? this.apiSearchTransaction
      : this.apiTransaction;

    const miRequest: IMIRequest = {
      includeMetadata: true,
      program: program,
      transaction: transaction,
      record: rcd,
      maxReturnedRecords: this.maxRecords,
      typedOutput: true,
    };

    this.miService.execute(miRequest).subscribe(
      (miResponse: IMIResponse) => {
        if (!miResponse.hasError()) {
          // Set total items found
          // @ts-expect-error: TODO
          request.total = miResponse.items.length;

          // Save current value
          try {
            currentValue = this.lookup['element'].nativeElement.value;
            // ...and clear current value to avoid autoselect in Soho datagrid
            this.lookup['element'].nativeElement.value = '';
          } catch (err) {
            Log.error(err);
          }

          // Handle lookup datagrid
          // @ts-expect-error: TODO
          response(miResponse.items, request);

          // Restore current value
          setTimeout(() => {
            try {
              this.lookup['element'].nativeElement.value = currentValue;
            } catch (err) {
              Log.error(err);
            }
          }, 100);
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
   * Called when the selected value in the lookup changes
   * @param event
   */
  onChange(event: any) {
    // Initialize variables
    let currentValue: string;
    let rcd: MIRecord = new MIRecord();

    try {
      if (event.length) {
        if (event[0].data) {
          /**
           *    If we have selected a record in the lookup browse datagrid we will
           *    get an object back. Set the record and exit method.
           */

          if (typeof event[0].data == 'object') {
            this.record = event[0].data;
            this.recordChanged.emit(this.record);
            return;
          } else {
            currentValue = event[0].data;
          }
        }
      } else {
        /**
         *    If we have keyed in a value manually in the lookup we end up here. Set
         *    the value and then make an API call below to retrieve the record
         */

        currentValue = event.target.value.toLocaleUpperCase();
      }

      /**
       *    If value is blank, then clear record and exit method
       */
      // @ts-expect-error: TODO
      if (currentValue == '') {
        // @ts-expect-error: TODO
        this.record = null;
        this.recordChanged.emit(this.record);
        return;
      }

      /**
       *    Get MI record
       */

      if (this.apiInputRecord) {
        rcd = this.apiInputRecord;
      }

      // @ts-expect-error: TODO
      if (currentValue) {
        if (this.apiInputField) {
          // @ts-expect-error: TODO
          rcd[this.apiInputField] = currentValue;
        } else {
          // @ts-expect-error: TODO
          rcd[this.field] = currentValue;
        }
      }

      const request: IMIRequest = {
        includeMetadata: true,
        program: this.apiProgram,
        transaction: this.apiTransaction,
        record: rcd,
        maxReturnedRecords: 1,
        typedOutput: true,
      };

      this.miService.execute(request).subscribe(
        (response: IMIResponse) => {
          if (!response.hasError()) {
            if (response.item) {
              let responseValue = response.item[this.field];

              /**
               *    If we have match then set the record
               */

              if (responseValue == currentValue) {
                this.record = response.item;
                this.recordChanged.emit(this.record);
              } else {
                // Trigger browse window if no matching record found
                let e = $.Event('keyup');
                e.which = 40;
                $(this.lookup['element'].nativeElement).trigger(e);
              }
            } else {
              const message = this.heading + ' ' + currentValue + ' not found';
              this.showErrorMessage(message);
            }
          }
        },
        (errorResponse: MIResponse) => {
          this.showErrorMessage(errorResponse.errorMessage);
        }
      );
    } catch (err) {
      Log.error(err);
    }
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
   * Sets the intitial record
   */
  private initRecord() {
    const event: SohoLookupChangeEvent = {
      // @ts-expect-error: TODO
      elem: null,
      data: this.initialRecord,
      // @ts-expect-error: TODO
      idx: null,
      // @ts-expect-error: TODO
      value: null,
    };
    const events: SohoLookupChangeEvent[] = [event];
    this.lookup.setValue(events);
  }

  /**
   * Sets the intitial record
   */
  private initValue() {
    const event: SohoLookupChangeEvent = {
      // @ts-expect-error: TODO
      elem: null,
      data: this.initialValue,
      // @ts-expect-error: TODO
      idx: null,
      // @ts-expect-error: TODO
      value: null,
    };
    const events: SohoLookupChangeEvent[] = [event];
    this.lookup.setValue(events);
  }

  /**
   * Initializes the datagrid used when browsing
   * @param lookup
   */
  private initGrid(lookup: SohoLookupComponent) {
    let columns: SohoDataGridColumn[] = [];

    // Field
    columns.push({
      width: 'auto',
      id: 'col-key',
      field: this.field,
      name: this.heading,
      resizable: false,
      filterType: 'text',
      sortable: false,
    });

    // Additional Information
    columns.push({
      width: 'auto',
      id: 'col-' + this.additionalInfoField,
      field: this.additionalInfoField,
      name: 'Description',
      resizable: false,
      filterType: 'text',
      sortable: false,
    });

    // Set lookup field
    lookup['lookup'].settings.field = this.field;

    // Set datagrid options
    const options: SohoDataGridOptions = {
      alternateRowShading: false,
      cellNavigation: false,
      clickToSelect: true,
      columns: columns,
      dataset: [],
      disableRowDeactivation: true,
      emptyMessage: {
        title: 'No records available',
        icon: 'icon-empty-no-data',
      },
      idProperty: 'col-key',
      indeterminate: true,
      paging: true,
      pagesize: 50,
      rowHeight: 'medium' as SohoDataGridRowHeight,
      selectable: 'single',
      showPageSizeSelector: false,
      toolbar: {
        keywordFilter: true,
      },
      source: (
        request: SohoDataGridSourceRequest,
        response: SohoDataGridResponseFunction
      ) => {
        this.onBrowse(request, response, this.field);
      },
    };
    // Update lookup settings
    lookup['lookup'].settings.options = options;

    // Apply css class
    lookup['lookup'].settings.attributes = [
      { name: 'id', value: 'demo-lookup' },
    ];
  }

  /**
   * A method to show error messages
   */
  private showErrorMessage(message: string) {
    const buttons = [
      {
        text: 'OK',
        click: (e: any, modal: { close: () => void }) => {
          modal.close();
        },
      },
    ];
    this.messageService
      .error()
      .title('Error')
      .message(message)
      .buttons(buttons)
      .open();
  }
}
