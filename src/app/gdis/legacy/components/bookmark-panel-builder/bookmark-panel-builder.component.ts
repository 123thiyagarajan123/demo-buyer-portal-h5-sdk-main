import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';

import {
  CoreBase,
  IFormControlInfo,
  IBookmark,
  IMIRequest,
  IMIResponse,
} from '@infor-up/m3-odin';
import { MIUtil, MIRecord } from '@infor-up/m3-odin/dist/mi/runtime';
import { MIService } from '@infor-up/m3-odin-angular';

import {
  SohoLookupComponent,
  SohoDatePickerComponent,
} from 'ids-enterprise-ng';

import { DemoBrowseService } from '../..';
import { DemoUserContextService } from '../..';

@Component({
  selector: 'm3-bookmark-panel-builder',
  templateUrl: './bookmark-panel-builder.component.html',
  styleUrls: ['./bookmark-panel-builder.component.css'],
  //   encapsulation: ViewEncapsulation.None,
})

/**
 * The BookmarkPanelBuilderComponent displays detail fields from M3 retrieved with
 * a bookmark.
 */
export class BookmarkPanelBuilderComponent extends CoreBase implements OnInit {
  @ViewChild('PanelBuilder') panelBuilder!: ElementRef;
  @ViewChildren(SohoLookupComponent) lookups!: QueryList<SohoLookupComponent>;
  @ViewChildren(SohoDatePickerComponent)
  datePickers!: QueryList<SohoDatePickerComponent>;
  @Input() bookmark!: IBookmark;
  @Input() columns!: number;
  @Input() formControls!: IFormControlInfo[];
  @Input() searchField!: string;
  @Input() showAdditionalInfo!: string;
  @Output() visibleElementChanged: EventEmitter<any> = new EventEmitter();

  currentBrowseField!: string;
  savedBrowseRecords: MIRecord[] = [];
  dateFormat!: string;
  isBusy!: boolean;
  // @ts-expect-error: TODO
  visibleChildren: number = null;

  // @Input('info') detailData: any = {};

  constructor(
    private miService: MIService,
    private demoBrowseService: DemoBrowseService,
    private userContextService: DemoUserContextService
  ) {
    super('BookmarkPanelBuilderComponent');
  }

  /**
   * Initializes IDS lookup components and IDS datePicker components.
   */
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    try {
      this.lookups.forEach((lookup) => {
        this.initGrid(lookup);
      });
      this.datePickers.forEach((datePicker) => this.initDatePicker(datePicker));
    } catch (err) {
      this.logError(err as any);
    }
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnChanges(): void {
    setTimeout(() => {
      this.visibleChildren = $(this.panelBuilder.nativeElement).children(
        ':visible'
      ).length;
      if (this.searchField && this.searchField.length > 0) {
        this.visibleElementChanged.emit(this.visibleChildren);
      }
    });
  }

  /**
   * Sets the dateformat based on the user settings.
   */
  ngOnInit(): void {
    this.dateFormat = this.userContextService.getDateFormat();
  }

  /**
   * Check if search field exists
   */
  hasSearchField() {
    return this.searchField?.length > 0;
  }

  /**
   * Get FormControlInfo value
   */
  getInfoControlValue(info: IFormControlInfo) {
    return info.control?.value;
  }

  /**
   * Get FormControlInfo value
   */
  getInfoControlSelectedText(info: IFormControlInfo) {
    return (info.control as any)['selected'].text;
  }

  /**
   * Get FormControlInfo items
   */
  getInfoControlItems(info: IFormControlInfo) {
    return (info.control as any)['items'];
  }

  /**
   * Get FormControlInfo isBrowsable
   */
  getInfoControlIsBrowsable(info: IFormControlInfo) {
    return (info.control as any)['isBrowsable'];
  }

  /**
   * This method returns the columns that is to be used in the datagrid when
   * browsing a lookup field.
   * @param lookup
   * @param browseFields
   * @param formControl
   */
  public getColumnFields(
    lookup: SohoLookupComponent,
    formControl: IFormControlInfo
  ): SohoDataGridColumn[] {
    let columns: SohoDataGridColumn[] = [];
    // for (let browseField of browseFields) {
    //    columns.push({
    //       width: 'auto',
    //       id: 'col-key',
    //       field: browseField.field,
    //       name: browseField["isAdditionalInfo"] ? browseField.displayName : formControl.label.value,
    //       resizable: false,
    //       filterType: 'text',
    //       sortable: false
    //    })
    //    if (browseField.isReturnValue) {
    //       lookup["lookup"].settings.field = browseField.field;
    //    }
    // }

    columns.push({
      width: 'auto',
      id: 'col-keyf',
      field: 'KEYF',
      // @ts-expect-error: TODO
      name: formControl.label.value,
      resizable: false,
      filterType: 'text',
      sortable: false,
    });

    columns.push({
      width: 'auto',
      id: 'col-fld1',
      field: 'FLD1',
      name: 'Name',
      resizable: false,
      filterType: 'text',
      sortable: false,
    });

    return columns;
  }

  /**
   * This method gets a string date and returns a Date object. It is used by
   * the initDatePicker method which initializes the datepicker object
   * @param val
   * @param dtfm
   */
  public getDate(val: string, dtfm: string): Date {
    let year: string;
    let month: string;
    let day: string;

    switch (dtfm.toLocaleLowerCase()) {
      case 'yymmdd':
        year = val.substr(0, 2);
        month = val.substr(2, 2);
        day = val.substr(4, 2);
        break;
      case 'mmddyy':
        month = val.substr(0, 2);
        day = val.substr(2, 2);
        year = val.substr(4, 2);
        break;
      case 'ddmmyy':
        day = val.substr(0, 2);
        month = val.substr(2, 2);
        year = val.substr(4, 2);
        break;
    }

    // Return date
    // @ts-expect-error: TODO
    return MIUtil.getDate('20' + year + month + day);
  }

  /**
   * This method retrieves a specific formControl by name.
   * @param name
   */
  private getFormControl(name: string): IFormControlInfo {
    try {
      for (let form of this.formControls) {
        // @ts-expect-error: TODO
        if (form.control.name == name) {
          return form;
        }
      }
      // @ts-expect-error: TODO
      return null;
    } catch (err) {
      this.logError(err as any);
    }
    // @ts-expect-error: TODO
    return null;
  }

  /**
   * This method initializes date picker fields.
   * @param datePicker
   */
  private initDatePicker(datePicker: SohoDatePickerComponent) {
    let bookmark: IBookmark = this['bookmark'];
    let id = datePicker['element'].nativeElement.id;
    let info: IFormControlInfo;

    // Find control
    for (let i = 0; i < this.formControls.length; i++) {
      const item = this.formControls[i];
      if (item) {
        // @ts-expect-error: TODO
        if (item['control'].id === id) {
          info = item;
          break;
        }
      }
    }

    // Set date
    // @ts-expect-error: TODO
    if (info) {
      // @ts-expect-error: TODO
      const dtfm: string = info.control['dateFormat'];
      // @ts-expect-error: TODO
      const val: string = info.control.value;

      // Get date
      if (val) {
        let date: Date = this.getDate(val, dtfm);
        datePicker.setValue(date);
      }
      // @ts-expect-error: TODO
      datePicker.readonly = !info.control.isEnabled;
    }
  }

  /**
   * This method initializes the browse datagrid for lookup fields.
   * @param lookup
   */
  private initGrid(lookup: SohoLookupComponent) {
    try {
      // let bookmark: IBookmark = this["bookmark"];
      let field = lookup.name;
      if (field) {
        let formControl = this.getFormControl(field);
        // Create columns
        let columns: SohoDataGridColumn[] = this.getColumnFields(
          lookup,
          formControl
        );
        // Set datagrid options
        const options: SohoDataGridOptions = {
          alternateRowShading: false,
          cellNavigation: false,
          // clickToSelect: false,
          columns: columns,
          dataset: [],
          emptyMessage: {
            title: 'No records available',
            icon: 'icon-empty-no-data',
          },
          idProperty: 'col-keyf',
          indeterminate: true,
          paging: true, // Must be true for source to be called
          pagesize: 50,
          rowHeight: 'short' as SohoDataGridRowHeight,
          selectable: 'single',
          showPageSizeSelector: false,
          toolbar: {
            actions: true,
            advancedFilter: false,
            dateFilter: false,
            keywordFilter: true,
            results: true,
            rowHeight: true,
            views: false,
          },
          source: (
            request: SohoDataGridSourceRequest,
            response: SohoDataGridResponseFunction
          ) => {
            // @ts-expect-error: TODO
            this.onBrowse(request, response, field);
          },
        };
        // Update lookup settings
        lookup['lookup'].settings.options = options;
        lookup['lookup'].settings.field = 'KEYF';
        lookup['lookup'].settings.autoApply = false;
      }
    } catch (err) {
      this.logError(err as any);
    }
  }

  onBeforeSelect(event?: any) {
    if (true) {
    }
  }

  /**
   * This method is called when browsing a lookup field.
   * @param request
   * @param response
   * @param field
   */
  onBrowse(
    request: SohoDataGridSourceRequest,
    response: SohoDataGridResponseFunction,
    field: string
  ) {
    // Check browse field, clear array if we have a different field
    if (this.currentBrowseField != field) {
      this.savedBrowseRecords = [];
    }

    /**
     *    Set current browse field so we can update additionalInfo later on
     */
    this.currentBrowseField = field;
    const shortField = this.currentBrowseField.substr(
      this.currentBrowseField.length - 4
    );

    // Define variables
    let searchString: string;
    let maxReturnedRecords: number;
    let record: MIRecord = new MIRecord();
    let value = '';

    /**
     *    Check and set search variables
     */
    if (request.type == 'searched') {
      // @ts-expect-error: TODO
      searchString = request.filterExpr[0].value;
    }

    // Get field form control
    let formControl = this.getFormControl(this.currentBrowseField);
    if (formControl) {
      // @ts-expect-error: TODO
      value = formControl.control.value;
    }

    // Set reference field
    // @ts-expect-error: TODO
    record['RFLD'] = shortField;

    /**
     * When launching the dialog we may already have retrieved the data. Check if
     * we can get the records from savedBrowseRecords array
     */

    let arr: MIRecord[] = [];
    let fromIndex: number;
    let toIndex: number;

    let hasSavedRecords: boolean;
    let useFromIndex: boolean;
    let useToIndex: boolean;
    let doGetMoreRecords: boolean;
    let doSearchRecords: boolean;

    // Calculate indexes
    // @ts-expect-error: TODO
    toIndex = request.activePage * request.pagesize;
    // @ts-expect-error: TODO
    fromIndex = toIndex - request.pagesize;

    // Check saved records
    hasSavedRecords = this.savedBrowseRecords.length > 0 ? true : false;
    if (hasSavedRecords) {
      useFromIndex = this.savedBrowseRecords.length > fromIndex ? true : false;
      useToIndex = this.savedBrowseRecords.length >= toIndex ? true : false;
    }

    switch (request.type) {
      case 'first':
        /**
         * When the request type is "first", the user has pressed the "go-to-first-page"
         * button. We know we have already retrieved the data, take the records from
         * savedBrowseRecords array starting from 0 index.
         */
        if (hasSavedRecords) {
          // @ts-expect-error: TODO
          if (useToIndex) {
            arr = this.savedBrowseRecords.slice(0, toIndex);
          }
        }
        break;
      case 'initial':
        /**
         * When the request type is "initial", the user is browsing for the first time. We may
         * have already retrieved the data previously, check the savedBrowseRecords array.
         */
        if (hasSavedRecords) {
          // @ts-expect-error: TODO
          if (useToIndex) {
            arr = this.savedBrowseRecords.slice(0, toIndex);
          } else {
            arr = this.savedBrowseRecords;
          }
        } else {
          doGetMoreRecords = true;
        }
        break;
      case 'last':
        /**
         * When the request type is "last", the user has pressed the "go-to-last-page"
         * we will position to the last data retrieved. Check the savedBrowseRecords
         * array to calculate which data to display.
         */
        if (hasSavedRecords) {
          const fromPage: number = Math.ceil(
            // @ts-expect-error: TODO
            this.savedBrowseRecords.length / request.pagesize
          );
          // const remainder: number = this.savedBrowseRecords.length % request.pagesize;
          // @ts-expect-error: TODO
          fromIndex = (fromPage - 1) * request.pagesize;
          // Set active page
          request.activePage = fromPage > 0 ? fromPage : 1;
          arr = this.savedBrowseRecords.slice(fromIndex);
        }
        break;
      case 'next':
        /**
         * When the request type is "next", the user has pressed the "go-to-next-page" button.
         * We may have already retrieved the data previously, check the savedBrowseRecords
         * array.
         */
        // @ts-expect-error: TODO
        if (hasSavedRecords && useFromIndex && useToIndex) {
          arr = this.savedBrowseRecords.slice(fromIndex, toIndex);
          // @ts-expect-error: TODO
        } else if (hasSavedRecords && useFromIndex) {
          arr = this.savedBrowseRecords.slice(fromIndex);
        } else if (
          hasSavedRecords &&
          // @ts-expect-error: TODO
          this.savedBrowseRecords.length < request.pagesize
        ) {
          arr = this.savedBrowseRecords.slice(0);
        } else {
          doGetMoreRecords = true;
        }
        break;
      case 'prev':
        /**
         * When the request is "prev", the user has pressed the "go-to-previous-page" button.
         * We know we have already retrieved the data previously, check the savedBrowseRecords
         * array
         */
        arr = this.savedBrowseRecords.slice(fromIndex, toIndex);
        break;
      case 'searched':
        /**
         * When the request type is "searched", the user is searching in the datagrid.
         * Do an enterprise search API call. Do not update the savedBrowseRecords
         */
        doSearchRecords = true;
        break;
    }
    // @ts-expect-error: TODO
    if (doSearchRecords) {
      // @ts-expect-error: TODO
      record['SQRY'] = searchString;
      // @ts-expect-error: TODO
    } else if (doGetMoreRecords) {
      if (hasSavedRecords) {
        maxReturnedRecords = 51;
        const rcd: MIRecord =
          this.savedBrowseRecords[this.savedBrowseRecords.length - 1];
        // @ts-expect-error: TODO
        record['KEYF'] = rcd['KEYF'];
      } else {
        maxReturnedRecords = 50;
        // @ts-expect-error: TODO
        record['KEYF'] = '';
      }
    } else {
      response(arr, request);
      return;
    }

    /**
     *    Browse
     */
    const miRequest: IMIRequest = this.demoBrowseService.getMIRequest(
      record,
      // @ts-expect-error: TODO
      searchString,
      // @ts-expect-error: TODO
      maxReturnedRecords
    );

    this.miService.execute(miRequest).subscribe((miResponse: IMIResponse) => {
      let arr: MIRecord[] = [];
      switch (request.type) {
        case 'initial':
          // @ts-expect-error: TODO
          arr = miResponse.items;
          this.savedBrowseRecords.push.apply(this.savedBrowseRecords, arr);
          break;
        case 'next':
          // @ts-expect-error: TODO
          arr = miResponse.items.slice(1);
          this.savedBrowseRecords.push.apply(this.savedBrowseRecords, arr);
          if (arr.length < 50) {
            request.lastPage = true;
          }
          break;
        case 'searched':
          // @ts-expect-error: TODO
          arr = miResponse.items;
          break;
      }

      // Check last page
      // @ts-expect-error: TODO
      if (arr.length < request.pagesize) {
        request.lastPage = true;
      } else {
        request.lastPage = false;
      }

      // Send response
      response(arr, request);
    });
  }

  /**
   * This method is called when a date field has changed value.
   * @param event
   */
  onDateChange(event: SohoDatePickerEvent) {
    let formControl = this.getFormControl(event.currentTarget['name']);
    if (formControl) {
      const dateString = event.data;
      const date = new Date(dateString);
      // @ts-expect-error: TODO
      formControl.control.value = this.setDate(date);
    }
  }

  /**
   * This method is called when a lookup field has changed value. It updates the
   * corresponding form control value
   * @param event
   */
  onChange(event?: SohoLookupChangeEvent[]) {
    for (let formControl of this.formControls) {
      // @ts-expect-error: TODO
      if (formControl.control.name == this.currentBrowseField) {
        if (formControl['additionalInfo']) {
          // @ts-expect-error: TODO
          formControl.additionalInfo.value = event[0].data['FLD1'];
        }
        break;
      }
    }
  }

  /**
   * This method is called by the onDateChange method.
   * @param date
   */
  setDate(date: Date): string {
    let dateString: string;
    let day: string =
      date.getDate() < 10
        ? ('0' + date.getDate()).toString()
        : date.getDate().toString();
    let month: string =
      date.getMonth() + 1 < 10
        ? ('0' + (date.getMonth() + 1)).toString()
        : (date.getMonth() + 1).toString();
    let year: string = (date.getFullYear() - 2000).toString();
    switch (this.userContextService.userContext.DTFM) {
      case 'YMD':
        dateString = year + month + day;
        break;
      case 'DMY':
        dateString = day + month + year;
        break;
      case 'MDY':
        dateString = month + day + year;
        break;
    }
    // @ts-expect-error: TODO
    return dateString;
  }

  /**
   * This method method returns an MIRecord containing browse data dependency
   * fields. Said fields are retrieved from the FormControl array.
   * @param dependencyFields
   */
  public setDependencyRecord(dependencyFields: string[]): MIRecord {
    let record: MIRecord = new MIRecord();
    // @ts-expect-error: TODO
    const bookmarkFieldNames: string[] = this.bookmark.fieldNames.split(',');
    for (let df of dependencyFields) {
      for (let bfn of bookmarkFieldNames) {
        if (bfn.indexOf(df) > -1) {
          // @ts-expect-error: TODO
          record[df] = this.getFormControl(bfn).control.value;
        }
      }
    }
    return record;
  }
}
