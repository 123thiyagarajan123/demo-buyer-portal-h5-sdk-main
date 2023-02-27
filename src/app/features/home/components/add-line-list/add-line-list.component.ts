import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
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
import { IMIResponse, IUserContext, MIRecord } from '@infor-up/m3-odin';

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

import { COLUMNS } from '../../constants/add-line-list-columns.constant';
import { parseDateFromString } from '../../utils';
import { Config, M3DateFormat } from '../../enums';
import { IItem } from '../../types';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-add-line-list',
  templateUrl: './add-line-list.component.html',
  styleUrls: ['./add-line-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddLineListComponent
  extends M3DatagridComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @ViewChild(SohoDataGridComponent)
  sohoDataGridComponent?: SohoDataGridComponent;
  @Input() customDrillback!: (record: MIRecord) => void;
  @Input() warehouse = '';
  @Input() planningDate = '';
  @Output() dirtyRowsChanged: EventEmitter<IItem[]> = new EventEmitter<
    IItem[]
  >();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.planningDate && this.planningDate) {
      this.updateRows();
    }

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
    this.datagridOptions.clickToSelect = false;
    this.datagridOptions.selectable = 'multiple';
    this.datagridOptions.editable = true;
    this.datagridOptions.showDirty = true;

    this.datagridOptions.columnSizing = 'both';
    this.datagridOptions.spacerColumn = true;
    this.datagridOptions.stretchColumnOnChange = true;

    this.isReady = true;
  }

  onCellChange(event: SohoDataGridCellChangeEvent) {
    const newRow = (this.sohoDataGridComponent?.dataset as IItem[])[event.row];
    if (!event.value) {
      newRow.TPUP = '';
      newRow.TGRW = '';
      newRow.TVOL = '';
      this.sohoDataGridComponent?.unselectRow(event.row);
    } else {
      this.sohoDataGridComponent?.selectRows(event.row);
      try {
        //Total price TPUP
        newRow.TPUP = (newRow.MMPUPR * newRow.PPQT).toFixed(2);

        //Total weight TGRW
        newRow.TGRW = (newRow.MMGRWE * newRow.PPQT).toFixed(3);

        //Total volume TVOL
        newRow.TVOL = (newRow.MMVOL3 * newRow.PPQT).toFixed(3);
      } catch (error) {}
    }
    this.sohoDataGridComponent?.updateRow(event.row, newRow);

    this.dirtyRowsChanged.emit(this.sohoDataGridComponent?.dirtyRows() || []);
  }

  protected initColumns() {
    super.initColumns();

    this.columns = COLUMNS.map((column) => ({
      ...column,
      id: column.field,
      name: this.translate(column.name || ''),
      dateFormat: this.dateFormat,
    }));

    this.columns.splice(2, 0, {
      id: 'PPQT',
      field: 'PPQT',
      name: this.translate('poppqt') + ' *',
      formatter: Soho.Formatters.Integer,
      align: 'right',
      editor: Soho.Editors.Input,
    });
  }

  onApply() {
    this.apiInputRecord = new MIRecord();

    let query = `WHLO:${this.warehouse}`;
    let sort = `SortBy:ITNO`;

    if (this.userSearchQuery) {
      this.apiInputRecord[
        'SQRY'
      ] = `${query} related:[ZBP_ITEM_DESC("${this.userSearchQuery}* OR ITNO:${this.userSearchQuery}*")] ${sort}`;
    } else {
      this.apiInputRecord['SQRY'] = `${query} ${sort}`;
    }

    super.onApply();
  }

  onResponse(response: IMIResponse) {
    if (response.items && response.items.length > 0 && this.planningDate) {
      response.items.forEach((record, index) => {
        record['PLDT'] = parseDateFromString(
          this.planningDate,
          this.m3DateFormat,
          '/'
        );
        record['index'] = index;
      });
    }

    super.onResponse(response);
  }

  updateRows() {
    const rows = (this.sohoDataGridComponent?.dataset as IItem[]) || [];
    rows.forEach((row: IItem, index: number) => {
      row.PLDT = parseDateFromString(this.planningDate, this.m3DateFormat, '/');
      this.sohoDataGridComponent?.updateRow(index, row);
    });
  }

  onKey(event: KeyboardEvent) {
    if (event.code === 'NumpadEnter') {
      this.onApply();
    } else {
      super.onKey(event);
    }
  }

  translate(value: string) {
    return this.translationService.translate(`${Config.Scope}.${value}`);
  }
}
