/* eslint-disable @angular-eslint/use-lifecycle-interface */
import {
  Input,
  ElementRef,
  NgZone,
  EventEmitter,
  Output,
  SimpleChanges,
  Directive,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';
import { MIService } from '@infor-up/m3-odin-angular';
import {
  ArrayUtil,
  CoreBase,
  IMIRequest,
  IMIResponse,
  MIRecord,
} from '@infor-up/m3-odin';

import { SohoListViewComponent, SohoMessageService } from 'ids-enterprise-ng';

import {
  IAction,
  ICustomAction,
  IDrillBack,
  IRelatedInformation,
  ShortcutService,
} from '../../../index';
import { IPersonalization } from '../..';
import { DemoBookmarkService } from '../..';
import { DemoBusinessContextService } from '../..';
import { DemoInitService } from '../..';
import { DemoLaunchService } from '../..';
import { DemoPersonalizationService } from '../..';
import { DemoRelatedOptionService } from '../..';
import { DemoUserContextService } from '../..';
import { DemoUtilService } from '../..';

type CustomMIRecord = MIRecord & { [key: string]: string };

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'm3-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
})

/**
 *
 * This is a base class for showing M3 data in a list / datagrid.
 *
 * It can be configured to optionally show a search input box (as defined by the
 * isSearchable decorator), where the user can key in a value and search for data. This
 * require that a search api transaction has been defined.
 *
 * The child class should, in the ngOnInit method, set the following variables
 *
 * 1. apiProgram
 * 2. apiTransaction
 *
 * The following variables should optionally be set if applicable.
 *
 * 1. apiSearchProgram
 * 2. apiSearchTransaction
 * 3. personalizationProgram
 * 4. drillbacks, actions and custom actions
 * 5. date range field
 *
 */
export class CardListComponent extends CoreBase {
  @Input() apiProgram!: string;

  @Input() apiTransaction!: string;

  @Input() apiSearchProgram!: string;

  @Input() apiSearchTransaction!: string;

  // Sort by. Used by the enterprise search transaction
  // Sort by. Used by the enterprise search transaction

  @Input() apiSearchSortByField!: string;

  // Auto select the first item after loading the list
  // Auto select the first item after loading the list

  @Input() autoSelectFirstItem!: boolean;

  @Input() header!: string;

  @Input() mainLine!: string;

  @Input() subLine!: string;

  @Input() microLine!: string;

  @Input() isDrillable!: boolean;

  @Input() isSearchable!: boolean;

  @Input() personalizationProgram!: string;

  @Input() personalizationPrograms!: string[];

  @Input() selectedParentRecord!: MIRecord;

  @Output() selectionChanged = new EventEmitter<MIRecord>();

  @ViewChild('singleSelectListView')
  singleSelectListView!: SohoListViewComponent;

  apiInputRecord!: MIRecord;
  maxRecords = 100;
  public dataset!: CustomMIRecord[];
  private intersectionObserver!: IntersectionObserver;

  isBusy!: boolean;
  isBookmarksBusy!: boolean;
  isReady!: boolean;
  isDataLoaded!: boolean;
  isIntersecting!: boolean;
  isOptionsLoaded!: boolean;
  isPersonalizationReady!: boolean;

  personalization!: IPersonalization;
  personalizations!: IPersonalization[];
  personalizationFieldAlias: MIRecord = new MIRecord();
  personalizationCellTemplate: any;

  actions: IAction[] = [];
  customActions: ICustomAction[] = [];
  drillBacks: IDrillBack[] = [];
  related!: IRelatedInformation;

  searchTag = '';
  searchQuery = '';
  selectedRecord!: MIRecord;

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
    protected initService: DemoInitService,
    protected launchService: DemoLaunchService,
    protected personalizationService: DemoPersonalizationService,
    protected relatedOptionService: DemoRelatedOptionService,
    protected userContextService: DemoUserContextService,
    protected utilService: DemoUtilService,

    protected readonly shortcutService: ShortcutService
  ) {
    super('CardListComponent');
  }

  /**
   *    Unsubscribes observables and event emitters.
   */
  ngOnDestroy() {
    this.intersectionObserver.unobserve(<Element>this.elementRef.nativeElement);
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
      for (let element of elements) {
        if (element.target == this.elementRef.nativeElement) {
          if (element.isIntersecting) {
            this.isIntersecting = true;
            this.loadDataAndOptions();
          } else {
            this.isIntersecting = false;
            this.unloadDataAndOptions();
          }
        }
      }
    }, {});
    this.intersectionObserver.observe(<Element>this.elementRef.nativeElement);

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
  protected callApi(record: MIRecord, program?: string, transaction?: string) {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;

    let request: IMIRequest = {
      includeMetadata: true,
      // @ts-expect-error: TODO
      program: program,
      // @ts-expect-error: TODO
      transaction: transaction,
      record: record,
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
        if (error.errorCode != 'XRE0103') {
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
    this.dataset = [];
    this.isDataLoaded = false;
    this.isOptionsLoaded = false;
    // @ts-expect-error: TODO
    this.selectedRecord = null;
    // @ts-expect-error: TODO
    this.selectionChanged.emit(null);
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
    let record: MIRecord;

    record = new MIRecord();
    // @ts-expect-error: TODO
    record['CONO'] = this.userContextService.userContext.currentCompany;

    // SelectedParentRecord
    if (isGetSelectedParentRecord) {
      if (this.selectedParentRecord) {
        fields = Object.keys(this.selectedParentRecord);
        for (let field of fields) {
          if (field.length == 6) {
            const shortField = field.substring(2);
            // @ts-expect-error: TODO
            record[shortField] = this.selectedParentRecord[field];
          } else {
            // @ts-expect-error: TODO
            record[field] = this.selectedParentRecord[field];
          }
        }
      }
    }

    // SelectedRecord
    if (isGetSelectedRecord) {
      if (this.selectedRecord) {
        fields = Object.keys(this.selectedRecord);
        for (let field of fields) {
          if (field.length == 6) {
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
  protected init() {
    this.clear();
  }

  /**
   * Retrieves personalizations and calls the api method for data retrieval.
   * @param record
   */
  protected listData(record: MIRecord) {
    if (this.personalizationProgram && !this.isPersonalizationReady) {
      this.personalizationService
        .getPersonalization(this.personalizationProgram)
        .subscribe((response) => {
          this.personalization = response;
          this.isPersonalizationReady = true;
          this.callApi(record, this.apiProgram, this.apiTransaction);
        });
    } else if (this.personalizationPrograms && !this.isPersonalizationReady) {
      this.personalizationService
        .getPersonalizations(this.personalizationPrograms)
        .subscribe((response) => {
          this.personalizations = response;
          this.isPersonalizationReady = true;
          this.callApi(record, this.apiProgram, this.apiTransaction);
        });
    } else {
      this.callApi(record, this.apiProgram, this.apiTransaction);
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
   * All other API transaction fields must be set in the child method.
   */
  protected onApply() {
    // Set apiInputRecord
    if (this.searchQuery.length > 0) {
      this.searchTag = this.searchQuery;
      this.searchQuery += '*';
      if (this.apiSearchSortByField) {
        this.searchQuery += ' SortBy:' + this.apiSearchSortByField;
      }
      // @ts-expect-error: TODO
      this.apiInputRecord['SQRY'] = this.searchQuery;
      this.searchData(this.apiInputRecord);
    } else {
      this.searchTag = '';
      this.apiInputRecord = this.selectedParentRecord;
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
   * Deselects the selected record and clears the related
   * options.
   * @param event
   */
  public onDeSelected(event: any) {
    // @ts-expect-error: TODO
    this.selectedRecord = null;
    if (this.related) {
      // @ts-expect-error: TODO
      this.related.record = null;
      this.relatedOptionService.setSelectedRecord(this.related);
      this.shortcutService.setSelectedRecord(this.related);
    }
    // @ts-expect-error: TODO
    this.selectionChanged.emit(null);
  }

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
   * Called when pressing Enter in the search query input field.
   * @param event
   */
  public onKey(event: KeyboardEvent) {
    if (event.code == 'Enter') {
      this.onApply();
    }
  }

  /**
   * Handles the response from the API transaction.
   * @param response
   */
  protected onResponse(response: IMIResponse) {
    try {
      // @ts-expect-error: TODO
      this.dataset = response.items;
      // Auto select first item
      if (this.autoSelectFirstItem) {
        // @ts-expect-error: TODO
        if (response.items.length > 0) {
          setTimeout(() => {
            this.singleSelectListView.select(0);
          }, 100);
        }
      }
      // @ts-expect-error: TODO
      this.selectionChanged.emit(null);
    } catch (err) {
      this.logError(err);
    }
  }

  /**
   * Clear search tag
   */
  public onSearchTagClick() {
    this.searchTag = '';
    this.searchQuery = '';
    this.onApply();
  }

  /**
   * Sets the selected record. If no line/record is selected it clears the related
   * options.
   * @param event
   */
  public onSelected(event: any) {
    // @ts-expect-error: TODO
    this.selectedRecord = null;
    if (event.length == 2) {
      if (event[1].selectedData) {
        this.selectedRecord = event[1].selectedData[0];
        const record = this.getTrimmedSelectedRecord(true, false);
        this.businessContextService.triggerContext(record);
        if (this.related) {
          this.related.record = record;
          this.relatedOptionService.setSelectedRecord(this.related);
          this.shortcutService.setSelectedRecord(this.related);
        }
        this.selectionChanged.emit(record);
      }
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

  /**
   * Calls the api method for data retrieval.
   * @param record
   */
  protected searchData(record: MIRecord) {
    if (this.personalizationProgram && !this.isPersonalizationReady) {
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
      this.callApi(record, this.apiSearchProgram, this.apiSearchTransaction);
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
    field: string,
    value: string,
    record: MIRecord
  ) {
    let shortField: string = field.length == 4 ? field : field.substring(2);
    // @ts-expect-error: TODO
    let alias: string = this.personalizationFieldAlias[shortField];
    let keyName: string = alias ? alias : shortField;

    let personalization = this.personalization;

    let htmlString = '';

    if (personalization) {
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

      if (cssClass || replacementText) {
        // Set personalizations
        const newValue = replacementText ? replacementText : value;
        if (cssClass) {
          htmlString =
            `<div title="` +
            value +
            `" class="` +
            cssClass +
            `"><div><div class="tag" style="max-height:30px;padding: 0 5px">` +
            newValue +
            `</div></div></div>`;
        } else {
          htmlString = `<span>` + newValue + `</span>`;
        }
      } else {
        htmlString = `<span>` + value + `</span>`;
      }
    } else {
      htmlString = `<span>` + value + `</span>`;
    }

    return htmlString;
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
