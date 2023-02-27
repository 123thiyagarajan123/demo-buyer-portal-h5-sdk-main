import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';

import { MIService } from '@infor-up/m3-odin-angular';
import { IMIResponse, IUserContext, MIRecord } from '@infor-up/m3-odin';
import { MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoDataGridComponent, SohoMessageService } from 'ids-enterprise-ng';

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
} from '@gdis/api';

import { Config, M3DateFormat } from '../../enums';
import { IPurchaseAgreement } from '../../types';

@Component({
  selector: 'app-change-supplier-list',
  templateUrl: './change-supplier-list.component.html',
  styleUrls: ['./change-supplier-list.component.css'],
})
export class ChangeSupplierListComponent
  extends M3DatagridComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @ViewChild(SohoDataGridComponent)
  sohoDataGridComponent?: SohoDataGridComponent;
  @Input() warehouse = '';
  @Input() planningDate = '';

  m3DateFormat!: M3DateFormat;
  userSearchQuery = '';
  maxRecords = 100;

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
    await this.translationService.loadFeatureTranslations(this.scope);

    const userContext = this.store.state.userContext as IUserContext;
    this.m3DateFormat =
      (userContext.DTFM as M3DateFormat) || ('MDY' as M3DateFormat);

    this.init();
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

    this.isReady = true;
  }

  protected initColumns() {
    super.initColumns();

    this.columns = [
      {
        id: 'AJSUNO',
        field: 'AJSUNO',
        name: this.translate('supplier'),
        filterType: 'text',
      },
      {
        id: 'IDSUNM',
        field: 'IDSUNM',
        name: this.translate('name'),
        filterType: 'text',
      },
      {
        id: 'AJAGNB',
        field: 'AJAGNB',
        name: this.translate('agreement'),
        filterType: 'text',
      },
      {
        width: 90,
        id: 'AJFVDT',
        field: 'AJFVDT',
        name: this.translate('fromDate'),
        formatter: Soho.Formatters.Date,
        dateFormat: this.dateFormat,
        align: 'right',
        filterType: 'date',
      },
      {
        width: 90,
        id: 'AIUVDT',
        field: 'AIUVDT',
        name: this.translate('toDate'),
        formatter: Soho.Formatters.Date,
        dateFormat: this.dateFormat,
        align: 'right',
        filterType: 'date',
      },
      {
        id: 'AJFRQT',
        field: 'AJFRQT',
        name: this.translate('quantity'),
        formatter: Soho.Formatters.Integer,
        filterType: 'number',
        align: 'right',
      },
      {
        id: 'AJPUPR',
        field: 'AJPUPR',
        name: this.translate('price'),
        formatter: Soho.Formatters.Decimal,
        filterType: 'number',
        align: 'right',
      },
      {
        id: 'AHCUCD',
        field: 'AHCUCD',
        name: this.translate('currency'),
        filterType: 'text',
      },
    ];
  }

  onApply() {
    this.apiInputRecord = new MIRecord();

    const ITNO = this.selectedParentRecord.POITNO;

    this.apiInputRecord['F_OBV1'] = ITNO;
    this.apiInputRecord['T_OBV1'] = ITNO;
    this.apiInputRecord['T_FVDT'] = MIUtil.getDateFormatted(new Date());

    super.onApply();
  }

  onResponse(response: IMIResponse) {
    const filteredItems: IPurchaseAgreement[] | undefined = [];
    if (response.items && response.items.length > 0) {
      response.items.forEach((record: IPurchaseAgreement) => {
        try {
          // Only show non-expired agreements with the correct status
          if (
            record.AIUVDT.getTime() > new Date().getTime() &&
            record.AHPAST === '40'
          ) {
            filteredItems.push(record);
          }
        } catch (error) {}
      });
    }

    response.items = filteredItems;

    super.onResponse(response);
  }

  onKey(event: KeyboardEvent) {
    super.onKey(event);
  }

  translate(value: string) {
    return this.translationService.translate(`${Config.Scope}.${value}`);
  }
}
