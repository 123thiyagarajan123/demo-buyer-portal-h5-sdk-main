import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { MIService } from '@infor-up/m3-odin-angular';
import {
  ArrayUtil,
  CoreBase,
  IBookmark,
  IMIMetadataInfo,
  IMIRequest,
  IMIResponse,
  IUserContext,
  Log,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIResponse, MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import {
  SohoDataGridComponent,
  SohoDatePickerComponent,
  SohoMessageService,
} from 'ids-enterprise-ng';

import { DemoButtonLinkService } from '../../features/button-links/services/button-link.service';
import {
  IAction,
  ICustomAction,
  IDrillBack,
  IRelatedInformation,
  ShortcutService,
} from '../../../index';
import { IHyperLink, IPersonalization } from '../..';
import {
  DemoBookmarkService,
  DemoBusinessContextService,
  DemoInitService,
  DemoLaunchService,
  DemoPersonalizationService,
  DemoRelatedOptionService,
  DemoUserContextService,
  DemoUtilService,
} from '../..';

@Component({
  selector: 'm3-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css'],
})
export class DatagridComponent
  extends CoreBase
  implements OnDestroy, OnChanges, AfterViewInit
{
  @Input() apiProgram!: string;
  @Input() apiTransaction!: string;
  @Input() apiSearchProgram!: string;
  @Input() apiSearchTransaction!: string;
  @Input() header!: string;
  @Input() isAdvancedFiltering!: boolean;
  @Input() isDateRange!: boolean;
  @Input() isDrillable!: boolean;
  @Input() isMaxRecordCounter!: boolean;
  @Input() isQuickView!: boolean;
  @Input() isSearchable!: boolean;
  @Input() dateRangeField!: string;
  @Input() navigateTo!: string;
  @Input() personalizationProgram!: string;
  @Input() personalizationPrograms!: string[];
  @Input() selectedParentRecord: MIRecord | undefined | any;
  @Output() selectionChanged = new EventEmitter<MIRecord>();
  @ViewChild(SohoDataGridComponent) datagrid: any;
  @ViewChildren(SohoDatePickerComponent)
  datePickers: QueryList<SohoDatePickerComponent> | undefined;

  maxRecords = 100;
  pageSize = 25;
  columns: SohoDataGridColumn[] = [];
  datagridOptions!: SohoDataGridOptions;
  searchOptions!: SohoSearchFieldOptions;

  apiInputRecord: any;

  /**
   *  Variable used to control how many bookmarks that are being executed for detail
   *  components. Controls when to turn off the busy indicator.
   */
  bookmarkExecutionCounter = 0;

  dateFormat: string | undefined;
  fromDate: any;
  toDate: any;

  private intersectionObserver: IntersectionObserver | undefined;

  isBusy = false;
  isBookmarksBusy = false;
  isReady = false;
  isDataLoaded = false;
  isIntersecting = false;
  isOptionsLoaded = false;
  isPersonalizationReady = false;

  personalization: IPersonalization | undefined;
  personalizations: IPersonalization[] = [];
  personalizationFieldAlias: MIRecord = new MIRecord();
  personalizationCellTemplate: any;

  actions: IAction[] = [];
  customActions: ICustomAction[] = [];
  drillBacks: IDrillBack[] = [];
  related: IRelatedInformation | undefined;

  searchQuery = '';
  selectedRecord: MIRecord | null = new MIRecord();

  constructor(
    protected elementRef: ElementRef,
    protected miService: MIService,
    protected messageService: SohoMessageService,
    protected route: ActivatedRoute,
    protected router: Router,
    // protected translate: TranslateService,
    protected zone: NgZone,
    protected bookmarkService: DemoBookmarkService,
    protected businessContextService: DemoBusinessContextService,
    protected buttonLinkService: DemoButtonLinkService,
    protected initService: DemoInitService,
    protected launchService: DemoLaunchService,
    protected personalizationService: DemoPersonalizationService,
    protected relatedOptionService: DemoRelatedOptionService,
    protected userContextService: DemoUserContextService,
    protected utilService: DemoUtilService,

    protected readonly shortcutService: ShortcutService
  ) {
    super('DatagridComponent');
  }

  /**
   *    Unsubscribes observables and event emitters.
   */
  ngOnDestroy() {
    this.intersectionObserver?.unobserve(
      this.elementRef.nativeElement as Element
    );

    // Clear related actions, customActions and drillbacks
    if (this.related) {
      this.relatedOptionService.removeRelatedInformation(this.related);
      this.shortcutService.removeRelatedInformation(this.related);
    }
  }

  /**
   *    Loads data when selectedParentRecord has been loaded / changed
   */
  ngOnChanges(changes: SimpleChanges) {
    // When the selected parent record changes, load data via the onApply() method
    if (changes.selectedParentRecord) {
      this.clear();
      if (this.selectedParentRecord) {
        this.isDataLoaded = false;
        if (this.isIntersecting) {
          this.loadDataAndOptions();
        }
      }
    }
  }

  /**
   * Responsible for initializing IDS components.
   *
   * Also responsible for the handling of related information. Constructs the
   * RelatedInformation object. Loads and unloads the RelatedInformation object
   * based on the visibility of the component.
   */
  ngAfterViewInit() {
    // Init Soho components
    this.datePickers?.forEach((datePicker) => this.initDatePicker(datePicker));

    if (
      this.actions.length > 0 ||
      this.customActions.length > 0 ||
      this.drillBacks.length > 0
    ) {
      // Create related object containing actions, customActions and drillbacks
      this.related = {
        actions: this.actions,
        customActions: this.customActions,
        drillBacks: this.drillBacks,
        name: this.header,
        // @ts-expect-error: TODO
        record: null,
      };
    }

    // Add IntersectionObserver
    this.intersectionObserver = new IntersectionObserver((elements) => {
      for (const element of elements) {
        if (element.target === this.elementRef.nativeElement) {
          if (element.isIntersecting) {
            this.isIntersecting = true;
            // if (!this.isDataLoaded) {
            //    if (this.selectedParentRecord) {
            //       this.isDataLoaded = true;
            //       this.onApply();
            //    }
            // }
            this.loadDataAndOptions();
          } else {
            this.isIntersecting = false;
            this.unloadDataAndOptions();
          }
        }
      }
    }, {});
    this.intersectionObserver.observe(this.elementRef.nativeElement as Element);

    // Custom Actions
    this.relatedOptionService.customActionClickedEvent.subscribe(
      (customAction: ICustomAction) => {
        this.onCustomAction(customAction);
      }
    );

    this.shortcutService.customActionClickedEvent.subscribe(
      (customAction: ICustomAction) => {
        this.onCustomAction(customAction);
      }
    );
  }

  /**
   * Calls an M3 Api transaction.
   * @param record
   * @param program
   * @param transaction
   */
  protected callApi(
    record: MIRecord,
    program?: string,
    transaction?: string,
    setBusy?: boolean
  ) {
    // if (this.isBusy) {
    //    return;
    // }

    if (setBusy) {
      this.isBusy = true;
    }

    let request: IMIRequest = {
      includeMetadata: true,
      // @ts-expect-error: TODO
      program,
      // @ts-expect-error: TODO
      transaction,
      record,
      maxReturnedRecords: this.maxRecords,
      typedOutput: true,
    };

    // Call api exit point to allow, for example, to set division on the request
    request = this.callApiExitPoint(request);

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          this.onResponse(response);
          this.isDataLoaded = true;
        } else {
          this.onError('Failed to list transaction data');
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
        this.clear();
        if (error.errorCode !== 'XRE0103') {
          this.onError('Failed to list transaction data', error);
        }
      }
    );
  }

  protected callApiExitPoint(request: IMIRequest): IMIRequest {
    return request;
  }

  /**
   * Clears class variables
   */
  protected clear() {
    if (this.datagrid) {
      this.datagrid.dataset = [];
    }
    if (this.datagridOptions) {
      this.datagridOptions.dataset = [];
    }
    // this.isReady = false;
    this.isDataLoaded = false;
    this.isOptionsLoaded = false;
    this.searchQuery = '';
    this.selectedRecord = null;
  }

  /**
   * Create record with fields without prefix. Take values from the selectedRecord
   * and the selectedParentRecord
   *
   * @param isGetSelectedRecord
   * @param isGetSelectedParentRecord
   */
  protected getTrimmedSelectedRecord(
    isGetSelectedRecord: boolean,
    isGetSelectedParentRecord: boolean
  ): MIRecord {
    let fields: string[];
    let record: any;

    record = new MIRecord();
    (record as any).CONO = this.userContextService.userContext.currentCompany;

    // SelectedParentRecord
    if (isGetSelectedParentRecord) {
      if (this.selectedParentRecord) {
        fields = Object.keys(this.selectedParentRecord);
        for (const field of fields) {
          if (field.length === 6) {
            const shortField = field.substring(2);
            record[shortField] = this.selectedParentRecord[field];
          } else {
            record[field] = this.selectedParentRecord[field];
          }
        }
      }
    }

    // SelectedRecord
    if (isGetSelectedRecord) {
      if (this.selectedRecord) {
        fields = Object.keys(this.selectedRecord);
        for (const field of fields) {
          if (field.length === 6) {
            const shortField = field.substring(2);
            // @ts-expect-error: TODO
            record[shortField] = this.selectedRecord[field];
          } else {
            // @ts-expect-error: TODO
            record[field] = this.selectedRecord[field];
          }
        }
      }
    }

    return record;
  }

  /**
   *    This method should be defined in the child class and make a super call to
   *    the parent class (this class). It initializes
   *
   *    1. columns
   *    2. searchOptions
   *    3. dateformat
   *
   */
  protected init(userContext: IUserContext) {
    if (!userContext) {
      throw new Error(
        'UserContext needs to be supplied manually when using new template (will be fixed in the future)'
      );
    }
    this.userContextService.setUserContext(userContext);

    this.clear();
    this.initColumns();
    this.dateFormat = this.userContextService.getDateFormat();
    if (this.isSearchable) {
      this.searchOptions = this.initService.initSearchOptions();
    }
  }

  /**
   *    This method is called from the parent class init method. It contains the
   *    function for handling conditional styles for datagrid cells.
   *
   *    The programmer can override this method in the child class if desired. If
   *    that is the case, the overriding child method should do a super call to the
   *    parent method.
   *
   *    If the programmer does not override this method, the columns will be set in
   *    the on response method and will contain all the fields returned from the Api.
   *
   */
  protected initColumns() {
    this.personalizationCellTemplate = (
      row: any,
      cell: any,
      value: string,
      col: any,
      record: any
    ) => {
      let cellTemplate = '';
      if (!this.personalization && !this.personalizations) {
        return `<span>` + value + `</span>`;
      } else {
        if (this.personalization) {
          // @ts-expect-error: TODO
          cellTemplate = this.setPersonalizations(
            this.personalization,
            row,
            cell,
            value,
            col,
            record
          );
        } else {
          for (const personalization of this.personalizations) {
            // @ts-expect-error: TODO
            cellTemplate = this.setPersonalizations(
              personalization,
              row,
              cell,
              value,
              col,
              record
            );
            if (cellTemplate) {
              break;
            }
          }
        }
        if (cellTemplate) {
          return cellTemplate;
        } else {
          return `<span>` + value + `</span>`;
        }
      }
    };

    this.columns = [];
    this.columns.push({
      width: 'auto',
      id: 'col-last',
      field: 'last',
      name: '',
      resizable: true,
      sortable: false,
    });
  }

  /**
   * Sets the date format for any datepickers used by the component.
   * @param datePicker
   */
  protected initDatePicker(datePicker: SohoDatePickerComponent) {
    // @ts-expect-error: TODO
    datePicker.dateFormat = this.dateFormat;
  }

  /**
   * Retrieves personalizations and calls the api method for data retrieval.
   * @param record
   */
  protected listData(record: MIRecord) {
    if (this.personalizationProgram && !this.isPersonalizationReady) {
      this.isBusy = true;
      this.personalizationService
        .getPersonalization(this.personalizationProgram)
        .subscribe((response) => {
          this.personalization = response;
          this.isPersonalizationReady = true;
          this.callApi(record, this.apiProgram, this.apiTransaction);
        });
    } else if (this.personalizationPrograms && !this.isPersonalizationReady) {
      this.isBusy = true;
      this.personalizationService
        .getPersonalizations(this.personalizationPrograms)
        .subscribe((response) => {
          this.personalizations = response;
          this.isPersonalizationReady = true;
          this.callApi(record, this.apiProgram, this.apiTransaction);
        });
    } else {
      this.callApi(record, this.apiProgram, this.apiTransaction, true);
    }
  }

  /**
   * Called by the IntersectionObserver and is responsible for lazy loading of
   * data and related options.
   */
  protected loadDataAndOptions() {
    /**
     * Load data
     */
    if (!this.isDataLoaded) {
      if (this.selectedParentRecord) {
        this.onApply();
        this.isDataLoaded = true;
      }
    }

    /**
     *    Load related object, containing actions, customActions and drillbacks.
     *    Wait for other components to clear their options
     */
    if (!this.isOptionsLoaded) {
      setTimeout(() => {
        if (this.related) {
          // Sort by name
          if (this.related.drillBacks) {
            this.related.drillBacks.sort((a, b) => {
              if (a.name > b.name) {
                return 1;
              } else {
                return -1;
              }
            });
          }
          this.relatedOptionService.setRelatedInformation(this.related);
          this.shortcutService.setRelatedInformation(this.related);
        }
        this.isOptionsLoaded = true;
      }, 250);
    }
  }

  /**
   * This method is called when the apply button is pressed. It should be defined in the
   * child class and make a super call to the parent class (this class) at the end of the
   * method.
   *
   * If the @isDateRange variable is set to true, it automatically adds data
   * filter fields, as defined by variable @dateRangeField to the API transaction
   * call.
   *
   * All other API transaction fields must be set in the child method.
   */
  protected onApply() {
    // Clear dirty array when reloading data
    try {
      if (this.datagrid) {
        (this.datagrid as any).datagrid.dirtyArray = [];
      }
    } catch (err) {
      this.logError(err);
    }

    // Set apiInputRecord
    if (this.searchQuery.length > 0) {
      if (this.isDateRange) {
        if (this.fromDate || this.toDate) {
          (this.apiInputRecord as any).SQRY += ' ' + this.dateRangeField + ':';
          (this.apiInputRecord as any).SQRY += '[';
          if (this.fromDate) {
            (this.apiInputRecord as any).SQRY +=
              this.userContextService.getDateFormattedForEnterpriseSearch(
                this.fromDate
              );
          } else {
            (this.apiInputRecord as any).SQRY += '*';
          }
          (this.apiInputRecord as any).SQRY += ' TO ';
          if (this.toDate) {
            (this.apiInputRecord as any).SQRY +=
              this.userContextService.getDateFormattedForEnterpriseSearch(
                this.toDate
              );
          } else {
            (this.apiInputRecord as any).SQRY += '*';
          }
          (this.apiInputRecord as any).SQRY += ']';
        }
      }
      this.searchData(this.apiInputRecord);
    } else {
      if (this.isDateRange) {
        if (this.fromDate) {
          this.apiInputRecord['F_' + this.dateRangeField] =
            this.userContextService.getDateFormatted(this.fromDate);
        }
        if (this.toDate) {
          this.apiInputRecord['T_' + this.dateRangeField] =
            this.userContextService.getDateFormatted(this.toDate);
        }
      }
      this.listData(this.apiInputRecord);
    }

    this.isDataLoaded = true;
  }

  /**
   * This method when a custom action is clicked. It is called by the
   * customActionClickedEvent in the ngAfterViewInit method.
   *
   * Custom actions are used when you cannot use regular actions. Therefore
   * the M3 demo list component is responsible for implementing the
   * functionality that should take place when the custom action is clicked.
   *
   * The custom action functionality should be defined in the child class. A
   * check should be made of the custom action id so that the correct M3 demo list
   * component is handling the custom action
   *
   *    Example:
   *    if (customAction == "releasePopLine") {
   *       ...
   *    }
   *
   * @param customAction
   */
  protected onCustomAction(customAction: ICustomAction) {}

  /**
   * An error handling method.
   * @param message
   * @param error
   */
  protected onError(message: string, error?: any) {
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
   * Called when the from date is changed.
   * @param event
   */
  protected onFromDateChanged(event: any) {}

  protected onHyperLinkClick(event: any) {
    try {
      let hyperLink: IHyperLink;
      let sortingOrder = '1';
      const field = event[0].originalEvent.target.id;
      const record = this.utilService.getTrimmedRecord(event[0].item);

      // Get hyperlink from personalization
      if (this.personalization) {
        hyperLink = ArrayUtil.itemByProperty(
          this.personalization.hyperLinks,
          'field',
          field
        );
      } else if (this.personalizations) {
        for (const personalization of this.personalizations) {
          hyperLink = ArrayUtil.itemByProperty(
            personalization.hyperLinks,
            'field',
            field
          );
          if (hyperLink) {
            break;
          }
        }
      }
      // @ts-expect-error: TODO
      if (hyperLink) {
        if (hyperLink.attributes.option) {
          const rcd = new MIRecord();
          // @ts-expect-error: TODO
          (rcd as any).PGNM = this.personalization.program;

          // Special handling for certain programs because they need it
          // @ts-expect-error: TODO
          if (this.personalization.program === 'OIS350') {
            (rcd as any).FILE = 'ODHEAD';
            sortingOrder = '3';
          }

          const request: IMIRequest = {
            includeMetadata: true,
            program: 'BOOKMKMI',
            transaction: 'GetParByPgm',
            record: rcd,
            maxReturnedRecords: 1,
            typedOutput: true,
          };

          this.miService.execute(request).subscribe((response: IMIResponse) => {
            if (!response.hasError()) {
              const keys = Object.keys(response.item);
              // Get bookmark key names
              const keyNames: string[] = [];
              for (let i = 2; i < 17; i++) {
                const key = keys[i];
                const keyValue = response.item[key];
                if (keyValue) {
                  keyNames.push(keyValue);
                }
              }

              // Get bookmark values
              const values: MIRecord = new MIRecord();
              for (const key of keyNames) {
                // Check key name
                // @ts-expect-error: TODO
                if (record[key]) {
                  // Check date
                  // @ts-expect-error: TODO
                  if (MIUtil.isDate(record[key])) {
                    // @ts-expect-error: TODO
                    values[key] = MIUtil.getDateFormatted(record[key]);
                  } else {
                    // @ts-expect-error: TODO
                    values[key] = record[key];
                  }
                } else {
                  // Check shortkey (For example, IBPUNO <-> PUNO)
                  const shortKey = key.substr(key.length - 4);
                  // @ts-expect-error: TODO
                  if (record[shortKey]) {
                    // Check date
                    // @ts-expect-error: TODO
                    if (MIUtil.isDate(record[shortKey])) {
                      // @ts-expect-error: TODO
                      values[key] = MIUtil.getDateFormatted(record[shortKey]);
                    } else {
                      // @ts-expect-error: TODO
                      values[key] = record[shortKey];
                    }
                    // Special check for zero value
                    // @ts-expect-error: TODO
                  } else if (record[shortKey] === 0) {
                    // @ts-expect-error: TODO
                    values[key] = record[shortKey];
                  } else {
                    Log.warning(
                      'Bookmark key value not found, setting value to blank'
                    );
                    // @ts-expect-error: TODO
                    values[key] = ' ';
                  }
                }
              }

              const bookmark: IBookmark = {
                // @ts-expect-error: TODO
                program: this.personalization.program,
                table: response.item.FILE,
                keyNames: keyNames.toString(),
                startPanel: 'B',
                includeStartPanel: false,
                sortingOrder,
                option: hyperLink.attributes.option.toString(),
                // @ts-expect-error: TODO
                view: null,
                values,
              };
              this.launchService.launchBookmark(bookmark);
            }
          });
        }
      }
    } catch (err) {
      // Do nothing for now
    }
  }

  /**
   * Called when pressing Enter in the search query input field.
   * @param event
   */
  protected onKey(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.onApply();
    }
  }

  /**
   * Called when the max records dropdown value is changed.
   */
  public onMaxRecordsChange() {
    this.onApply();
  }

  /**
   * Called by the drill down button in the datagrid.
   */
  protected onNavigateTo(args: any) {
    this.preNavigateTo(args);
    if (this.selectedRecord) {
      const record = this.getTrimmedSelectedRecord(true, true);
      this.postNavigateTo(record);
    }
  }

  /**
   * Handles the response from the API transaction.
   * @param response
   */
  protected onResponse(response: IMIResponse) {
    try {
      /**
       *    If we have more than 2 columns it means that they have been
       *    set in the initColumns method. Otherwise set the columns based
       *    on the fields returned from the API transaction
       */
      if (this.columns.length <= 1) {
        this.columns = [];
        const fieldNames = Object.keys(response.metadata);

        /**
         *    Drill enabled
         */
        if (this.isDrillable) {
          this.columns.push({
            id: 'drilldown',
            field: 'button',
            name: '',
            sortable: false,
            resizable: false,
            align: 'center',
            formatter: Soho.Formatters.Drilldown,
            click: (e, args) => {
              this.onNavigateTo(args);
            },
          });
        }

        for (const fieldName of fieldNames) {
          let column: SohoDataGridColumn;
          const fieldMetadata: IMIMetadataInfo = response.metadata[fieldName];

          // Field width calculation formula
          let fieldWidth: number = fieldMetadata.length * 11;

          // Min field width should be 110 and max should be 300
          fieldWidth = fieldWidth < 110 ? 110 : fieldWidth;
          fieldWidth = fieldWidth > 300 ? 300 : fieldWidth;

          const shortFieldName: string =
            fieldName.length === 4 ? fieldName : fieldName.substring(2);
          // @ts-expect-error: TODO
          const alias: string = this.personalizationFieldAlias[shortFieldName];
          const keyName: string = alias ? alias : shortFieldName;

          /**
           *    Field is a date
           */
          if (fieldMetadata.isDate()) {
            this.columns.push({
              width: 120,
              id: 'col-' + fieldName,
              field: fieldName,
              name: fieldMetadata.description,
              resizable: true,
              sortable: true,
              formatter: Soho.Formatters.Date,
              dateFormat: this.dateFormat,
              align: 'right',
            });
            continue;
          }

          /**
           *    Field has a personalization
           */
          if (
            this.personalizationService.fieldHasPersonalization(
              // @ts-expect-error: TODO
              this.personalization,
              keyName
            )
          ) {
            this.columns.push({
              width: 175,
              id: 'col-' + fieldName,
              field: fieldName,
              name: fieldMetadata.description,
              resizable: true,
              filterType: 'text',
              sortable: true,
              formatter: this.personalizationCellTemplate,
            });
            continue;
          }

          /**
           *    Field is a string
           */
          if (fieldMetadata.isString()) {
            this.columns.push({
              width: fieldWidth,
              id: 'col-' + fieldName,
              field: fieldName,
              name: fieldMetadata.description,
              filterType: 'text',
              resizable: true,
              sortable: true,
            });
            continue;
          }

          /**
           *    Field is a number
           */
          if (fieldMetadata.isNumeric()) {
            // Amount and quantity fields - 120px
            if (
              this.utilService.isAmount(keyName) ||
              this.utilService.isQuantity(keyName)
            ) {
              this.columns.push({
                width: 120,
                id: 'col-' + fieldName,
                field: fieldName,
                name: fieldMetadata.description,
                resizable: true,
                sortable: false,
                formatter: Soho.Formatters.Decimal,
                align: 'right',
              });

              // Order line fields - 50px
            } else if (this.utilService.isOrderLine(keyName)) {
              this.columns.push({
                width: 50,
                id: 'col-' + fieldName,
                field: fieldName,
                name: fieldMetadata.description,
                resizable: true,
                sortable: false,
                align: 'right',
              });

              // All other numeric fields - 110px
            } else {
              this.columns.push({
                width: 110,
                id: 'col-' + fieldName,
                field: fieldName,
                name: fieldMetadata.description,
                filterType: 'text',
                resizable: true,
                sortable: true,
                align: 'right',
              });
            }

            continue;
          }
        }

        /**
         *    Last column
         */
        this.columns.push({
          width: 'auto',
          id: 'col-last',
          field: 'last',
          name: '',
          resizable: true,
          sortable: false,
        });

        // Add the columns to the datagrid
        if (this.datagrid) {
          this.datagrid.columns = this.columns;
        } else {
          this.datagridOptions.columns = this.columns;
        }
      }

      // Save any existing filter conditions
      let filterConditions: any;

      try {
        if (this.datagrid) {
          if ((this.datagrid as any).datagrid) {
            filterConditions = (
              this.datagrid as any
            ).datagrid.filterConditions();
          }
        }
      } catch (err) {
        this.logError(err);
      }

      // Set data
      if (this.datagrid) {
        // In case of refresh and the datagrid was sorted, re-apply sorting
        try {
          if ((this.datagrid as any).datagrid.sortColumn) {
            (this.datagrid as any).datagrid.restoreSortOrder = true;
          }
        } catch (err) {
          this.logError(err);
        }
        this.datagrid.dataset = response.items;
      } else {
        this.datagridOptions.dataset = response.items;
      }

      // Restore filterconditions
      if (filterConditions) {
        // this.datagrid.setFilterConditions(filterConditions);
        this.datagrid.applyFilter(filterConditions);
      }

      // @ts-expect-error: TODO
      this.selectionChanged.emit(null);
    } catch (err) {
      this.logError(err);
    }
  }

  /**
   * Sets the selected record. If no line/record is selected it clears the related
   * options.
   * @param event
   */
  public onSelected(event: any) {
    this.selectedRecord = null;
    this.buttonLinkService.clearSelectedRecord();
    if (event.rows) {
      if (event.rows.length > 0) {
        this.selectedRecord = event.rows[0].data;
        const record = this.getTrimmedSelectedRecord(true, false);
        this.businessContextService.triggerContext(record);
        if (this.related) {
          this.related.record = record;
          this.relatedOptionService.setSelectedRecord(this.related);
          this.shortcutService.setSelectedRecord(this.related);
        }
        this.selectionChanged.emit(record);
      } else {
        if (this.related) {
          // @ts-expect-error: TODO
          this.related.record = null;
          this.relatedOptionService.setSelectedRecord(this.related);
          this.shortcutService.setSelectedRecord(this.related);
        }
        // @ts-expect-error: TODO
        this.selectionChanged.emit(null);
      }
    }
  }

  /**
   * Called when the to date is changed
   * @param event
   */
  protected onToDateChanged(event: any) {}

  /**
   * Sets the selected record in preparation for the route navigation. It
   * also clears the isOptionsLoaded variable as we are about to navigate
   * to another page.
   * @param args
   */
  protected preNavigateTo(args: any) {
    this.selectedRecord = null;
    if (args.length) {
      const arg = args[args.length - 1];
      this.selectedRecord = arg.item;
    }
    this.isOptionsLoaded = false;
  }

  /**
   * Responsible for the final route navigation. It also triggers the business context
   * @param record
   * @param navigateUrl
   */
  protected postNavigateTo(record: MIRecord, navigateUrl?: string) {
    const nav: NavigationExtras = {
      relativeTo: this.route,
      skipLocationChange: true,
      queryParams: record,
    };
    const url: string = navigateUrl ? navigateUrl : this.navigateTo;
    this.zone.run(() => {
      this.router.navigate([url], nav);
    });
    this.businessContextService.triggerContext(record);
  }

  /**
   * Calls the api method for data retrieval.
   * @param record
   */
  protected searchData(record: MIRecord) {
    if (this.personalizationProgram && !this.isPersonalizationReady) {
      this.isBusy = true;
      this.personalizationService
        .getPersonalization(this.personalizationProgram)
        .subscribe((response) => {
          this.personalization = response;
          this.isPersonalizationReady = true;
          this.callApi(
            record,
            this.apiSearchProgram,
            this.apiSearchTransaction
          );
        });
    } else if (this.personalizationPrograms && !this.isPersonalizationReady) {
      this.isBusy = true;
      this.personalizationService
        .getPersonalizations(this.personalizationPrograms)
        .subscribe(
          (response) => {
            this.personalizations = response;
            this.isPersonalizationReady = true;
            this.callApi(
              record,
              this.apiSearchProgram,
              this.apiSearchTransaction
            );
          },
          (error) => {
            if (error) {
            }
          }
        );
    } else {
      this.callApi(
        record,
        this.apiSearchProgram,
        this.apiSearchTransaction,
        true
      );
    }
  }

  /**
   * Called by the personalizationCellTemplate function in initColumns
   * @param personalization
   * @param row
   * @param cell
   * @param value
   * @param col
   * @param record
   */
  protected setPersonalizations(
    personalization: IPersonalization,
    // @ts-expect-error: TODO
    row,
    // @ts-expect-error: TODO
    cell,
    // @ts-expect-error: TODO
    value,
    // @ts-expect-error: TODO
    col,
    // @ts-expect-error: TODO
    record
  ) {
    const field: string = col.field;
    const shortField: string = field.length === 4 ? field : field.substring(2);
    // @ts-expect-error: TODO
    const alias: string = this.personalizationFieldAlias[shortField];
    const keyName: string = alias ? alias : shortField;

    // Get personalizations
    const cssClass = this.personalizationService.getConditionalStyle(
      personalization,
      keyName,
      value,
      record
    );
    const replacementText = this.personalizationService.getReplacementText(
      personalization,
      keyName,
      value,
      record
    );
    const hyperLink = ArrayUtil.itemByProperty(
      personalization.hyperLinks,
      'field',
      shortField
    );

    if (cssClass || replacementText || hyperLink) {
      let tooltip = '';
      if (hyperLink) {
        tooltip = hyperLink.attributes.tooltip
          ? hyperLink.attributes.tooltip
          : hyperLink.attributes.option;
      }

      // Format value, 0 = string, 1 = decimal, 2 = date
      try {
        if (
          record.metadata[field] &&
          record.metadata[field].type === 1 &&
          this.utilService.isAmount(keyName)
        ) {
          value = value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }
      } catch (err) {
        // Do nothing
      }

      // Set cell value
      const cellValue = replacementText ? replacementText : value;

      // Set personalizations
      if (cssClass) {
        if (hyperLink) {
          if (!col.click) {
            col.click = (e: any, args: any) => {
              this.onHyperLinkClick(args);
            };
          }
          return (
            `<div title="` +
            value +
            `" class="` +
            cssClass +
            `"><div><div style="max-height:30px;padding: 0 5px"><div style="color:#368ac0!important"><a id="` +
            hyperLink.field +
            `" title="` +
            tooltip +
            `">` +
            cellValue +
            `</a></div></div></div></div>`
          );
        } else {
          return (
            `<div title="` +
            value +
            `" class="` +
            cssClass +
            `"><div><div style="max-height:30px;padding: 0 5px">` +
            cellValue +
            `</div></div></div>`
          );
        }
      } else {
        if (hyperLink) {
          if (!col.click) {
            col.click = (e: any, args: any) => {
              this.onHyperLinkClick(args);
            };
          }
          return (
            `<div style="color:#368ac0!important"><a id="` +
            hyperLink.field +
            `" title="` +
            tooltip +
            `">` +
            cellValue +
            `</a></div>`
          );
        } else {
          return `<span>` + cellValue + `</span>`;
        }
      }
    } else if (
      record.metadata[field] &&
      record.metadata[field].type === 1 &&
      this.utilService.isAmount(keyName)
    ) {
      try {
        value = value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return `<span>` + value + `</span>`;
      } catch (err) {
        return null;
      }
    } else {
      return null;
    }
  }

  /**
   * Called by the IntersectionObserver. Responsible for unloading of related
   * information
   */
  protected unloadDataAndOptions() {
    // Clear related actions, customActions and drillbacks
    if (this.related) {
      this.relatedOptionService.removeRelatedInformation(this.related);
      this.shortcutService.removeRelatedInformation(this.related);
    }
    this.isOptionsLoaded = false;
  }
}
