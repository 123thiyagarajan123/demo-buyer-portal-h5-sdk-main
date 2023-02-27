import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';

import { MIService } from '@infor-up/m3-odin-angular';
import {
  IBookmark,
  IMIResponse,
  IUserContext,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoDataGridComponent, SohoMessageService } from 'ids-enterprise-ng';

import { COLUMNS } from '@features/home/constants/datagrid-columns.constant';

import {
  DemoBusinessContextService,
  DemoButtonLinkService,
  DemoInitService,
  DemoLaunchService,
  DemoPersonalizationService,
  DemoRelatedOptionService,
  DemoUserContextService,
  DemoUtilService,
  DemoBookmarkService,
  DatagridComponent as M3DatagridComponent,
  GdisStore,
  ShortcutService,
  TranslationService,
  ICustomAction,
} from '@gdis/api';

import {
  IPlannedPurchaseOrder,
  ISupplierFilter,
  SohoDataGridSelectedEventLight,
} from '../../types/';
import { addDays, createQueryDateRange, createQueryRange } from '../../utils';
import { Config, M3DateFormat } from '../../enums';

@Component({
  selector: 'app-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DatagridComponent
  extends M3DatagridComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @ViewChild(SohoDataGridComponent)
  sohoDataGridComponent?: SohoDataGridComponent;
  @Output() selectedRowsChanged: EventEmitter<IPlannedPurchaseOrder[]> =
    new EventEmitter<IPlannedPurchaseOrder[]>();
  @Output() rowActivated: EventEmitter<IPlannedPurchaseOrder[]> =
    new EventEmitter<IPlannedPurchaseOrder[]>();

  m3DateFormat!: M3DateFormat;
  maxRecords = 9999;

  constructor(
    private store: GdisStore,
    protected elementRef: ElementRef,
    protected miService: MIService,
    protected messageService: SohoMessageService,
    protected route: ActivatedRoute,
    protected router: Router,
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
    private readonly translationService: TranslationService,
    protected readonly shortcutService: ShortcutService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope
  ) {
    super(
      elementRef,
      miService,
      messageService,
      route,
      router,
      zone,
      bookmarkService,
      businessContextService,
      buttonLinkService,
      initService,
      launchService,
      personalizationService,
      relatedOptionService,
      userContextService,
      utilService,
      shortcutService
    );
  }

  store$ = this.store.state$;

  async ngOnInit() {
    // Set actions
    this.customActions = [
      {
        id: 'latestPOs',
        name: this.translate('latestPOs'),
        bookmark: {
          program: 'PPS220',
          table: 'MPLINE',
          keyNames: 'IBCONO,IBPUNO,IBPNLI,IBPNLS',
          sortingOrder: '5',
          fieldNames: `W1OBKV,WFSLCT,WTSLCT,WFSLC2,WTSLC2,WFSLC3,WTSLC3`,
          panel: 'B',
          isStateless: true,
        },
      },
      {
        id: 'createInquiry',
        name: this.translate('createInquiry'),
        bookmark: {
          program: 'PPS170',
          option: 'F15',
        },
      },
      {
        id: 'createProposal',
        name: this.translate('createProposal'),
        bookmark: {
          program: 'PPS170',
          option: 'F17',
        },
      },
      {
        id: 'supplier',
        name: this.translate('supplier'),
        bookmark: {
          program: 'PPS440',
          table: 'MVENST',
          keyNames: 'IVCONO,IVDIVI,IVSUNO,IVCYP6',
          includeStartPanel: false,
          requirePanel: false,
          startPanel: 'B',
        },
      },
    ];

    // Set actions
    this.actions = [];

    // Set related options
    this.drillBacks = [
      this.PPS170(this.translate('plannedOrder'), 2),
      this.PPS170(this.translate('attributes'), 22),
      this.PPS170(this.translate('suppliers'), 18),
      this.PPS100(this.translate('contracts')),
      this.PPS170(this.translate('charges'), 21),
      this.PPS170(this.translate('supplyChain'), 45),
      this.PPS170(this.translate('preAllocation'), 39),
      this.PPS170(this.translate('itemToolbox'), 14),
      this.PPS170(this.translate('changeToDO'), 24),
      this.PPS170(this.translate('closeToOrder'), 19),
      this.PPS170(this.translate('materialPlan'), 15),
      this.PPS170(this.translate('purchase'), 17),
      this.PPS130(this.translate('quotes')),
      this.PPS190(this.translate('targetPlan')),
      this.PPS170(this.translate('subcontracting'), 20),
    ];

    await this.translationService.loadFeatureTranslations(this.scope);

    this.init();
  }

  PPS170(name: string, option?: number) {
    return {
      name,
      bookmark: {
        program: 'PPS170',
        table: 'MPOPLP',
        keyNames: 'POCONO,POPLPN,POPLPS,POPLP2',
        option: option ? option.toString() : '',
        panelSequence: 'EF',
        isStateless: true,
      },
    };
  }

  PPS100(name: string, option?: number) {
    return {
      name,
      bookmark: {
        program: 'PPS100',
        table: 'MPAGRH',
        keyNames: 'AHCONO,AHSUNO,AHAGNB',
        option: option ? option.toString() : '',
        includeStartPanel: false,
        requirePanel: false,
        startPanel: 'B',
      },
    };
  }

  PPS130(name: string, option?: number) {
    return {
      name,
      bookmark: {
        program: 'PPS130',
        table: 'MPPQTH',
        keyNames: 'QHCONO,QHSUNO,QHQUOT',
        includeStartPanel: false,
        requirePanel: false,
        startPanel: 'B',
        option: option ? option.toString() : '',
      },
    };
  }

  PPS190(name: string, option?: number) {
    return {
      name,
      bookmark: {
        program: 'PPS190',
        table: 'PPW190',
        keyNames: 'PWCONO,PWBUYE,PWSUNO,PWPDLN,PWWHLO',
        includeStartPanel: false,
        requirePanel: false,
        option: option ? option.toString() : '',
      },
    };
  }

  protected onResponse(response: IMIResponse): void {
    super.onResponse(response);
    //this.sohoDataGridComponent?.selectAllRows();
  }

  protected onCustomAction(customAction: ICustomAction) {
    // Pass component busy indicator reference to service
    this.bookmarkService.componentRef = this;

    if (!customAction.bookmark) return;
    if (!this.selectedRecord) return;

    const userContext = this.store.state.userContext as IUserContext;

    if (customAction.id === 'latestPOs') {
      let formattedDate: string = MIUtil.getDateFormatted(
        addDays(new Date(), -7)
      );

      customAction.bookmark.values = {
        W1OBKV: this.selectedParentRecord.POSUNO,
        WFSLCT: userContext.FACI,
        WTSLCT: userContext.FACI,
        WFSLC2: '',
        WTSLC2: '49',
        WFSLC3: formattedDate,
        WTSLC3: '',
      };
      this.launchService.launchBookmark(customAction.bookmark);
    }

    if (customAction.id === 'createInquiry') {
      this.launchProgramAction(customAction.bookmark);
    }

    if (customAction.id === 'createProposal') {
      this.launchProgramAction(customAction.bookmark);
    }

    if (customAction.id === 'supplier') {
      customAction.bookmark.values = {
        IVCONO: userContext.CONO,
        IVDIVI: userContext.DIVI,
        IVSUNO: this.selectedParentRecord.POSUNO,
        IVCYP6: '',
      };
      this.launchService.launchBookmark(customAction.bookmark);
    }

    /**
     *    Release line
     */
    if (customAction.id === 'releaseLine') {
      customAction.bookmark.values = {
        POPLPN: (this.selectedRecord as IPlannedPurchaseOrder).POPLPN,
        POPLPS: (this.selectedRecord as IPlannedPurchaseOrder).POPLPS,
        POPLP2: (this.selectedRecord as IPlannedPurchaseOrder).POPLP2,
        WEPSTS: '60',
      };
      this.bookmarkService.updateViaBookmark(customAction.bookmark);
    }

    /**
     *    Release proposals
     */
    if (customAction.id === 'releaseProposals') {
      customAction.bookmark.values = {
        WFBUYE: '',
        WTBUYE: '',
        WFSUNO: this.selectedParentRecord['SUNO'],
        WTSUNO: this.selectedParentRecord['SUNO'],
        WFFACI: '',
        WTFACI: '',
        WFPUNO: '',
        WTPUNO: '',
      };
      this.bookmarkService.updateViaProgram(customAction.bookmark);
    }
  }

  launchProgramAction(bookmark: IBookmark) {
    const task = `<?xml version='1.0' encoding='utf-8'?><sequence><step command='RUN' value='${bookmark.program}' /><step command='KEY' value='${bookmark.option}' /></sequence>`;
    this.launchService.launchUrl(task);
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  protected init() {
    const userContext = this.store.state.userContext as IUserContext;
    super.init(userContext);
    this.datagridOptions = this.initService.initDataGridOptions(
      this.header,
      this.columns
    );

    this.datagridOptions.columnSizing = 'both';
    this.datagridOptions.spacerColumn = true;
    this.datagridOptions.stretchColumnOnChange = true;

    this.datagridOptions.selectable = 'mixed';

    this.datagridOptions.clickToSelect = true;
    this.datagridOptions.disableRowDeactivation = false;

    this.isReady = true;
  }

  protected initColumns() {
    super.initColumns();

    this.columns = COLUMNS.map((column) => this.initColumn(column));
  }

  protected initColumn(column: SohoDataGridColumn): SohoDataGridColumn {
    if (!column.formatter) {
      column.formatter = this.personalizationCellTemplate;
    }
    if (column.name) {
      column.name = this.translate(column.name || '');
    }
    if (!column.id) {
      column.id = column.field;
    }
    if (column.formatter === Soho.Formatters.Date) {
      column.dateFormat = this.dateFormat;
    }
    return column;
  }

  onApply() {
    const userContext = this.store.state.userContext as IUserContext;
    this.m3DateFormat =
      (userContext.DTFM as M3DateFormat) || ('MDY' as M3DateFormat);

    this.apiInputRecord = new MIRecord();

    const filterRecord: ISupplierFilter = this.selectedParentRecord;
    this.apiInputRecord['SQRY'] = this.buildQuery(
      filterRecord,
      this.m3DateFormat
    );

    super.onApply();
  }

  buildQuery(filterRecord: ISupplierFilter, dateFormat: M3DateFormat): string {
    let query = '';

    if (filterRecord.POSUNO) {
      query += 'SUNO:' + filterRecord.POSUNO + ' ';
    }

    query += 'BUYE:' + filterRecord.POBUYE;

    query += createQueryDateRange(
      'RELD',
      filterRecord.F_RELD,
      filterRecord.T_RELD,
      dateFormat
    );

    query += createQueryRange('WHLO', filterRecord.F_WHLO, filterRecord.T_WHLO);

    query += createQueryRange('ACTP', filterRecord.F_ACTP, filterRecord.T_ACTP);

    return `${query} SortBy:SUNO,RELD`;
  }

  onSelected($event: SohoDataGridSelectedEvent) {
    const records: IPlannedPurchaseOrder[] = $event.rows.map(
      (record: { data: IPlannedPurchaseOrder }) => {
        return record.data;
      }
    );
    this.selectedRowsChanged.emit(records || []);
    //super.onSelected($event);
  }

  onRowActivated($event: SohoDataGridRowActivatedEvent) {
    let $modifiedEvent = $event as unknown as SohoDataGridSelectedEventLight;
    try {
      $modifiedEvent.rows = [{ data: $event.item || undefined }];
    } catch (error) {}

    const records: IPlannedPurchaseOrder[] = $modifiedEvent.rows.map(
      (record) => {
        return record.data as IPlannedPurchaseOrder;
      }
    );

    this.rowActivated.emit(records || []);
    super.onSelected($modifiedEvent);
  }

  onRowDeactivated($event: SohoDataGridRowActivatedEvent) {
    let $modifiedEvent = $event as unknown as SohoDataGridSelectedEventLight;
    $modifiedEvent.rows = [];
    super.onSelected($modifiedEvent);
  }

  onFromDateChanged(event: SohoDatePickerEvent) {
    super.onFromDateChanged(event);
  }

  onToDateChanged(event: SohoDatePickerEvent) {
    super.onToDateChanged(event);
  }

  onKey(event: KeyboardEvent) {
    super.onKey(event);
  }

  translate(value: string) {
    return this.translationService.translate(`${Config.Scope}.${value}`);
  }
}
