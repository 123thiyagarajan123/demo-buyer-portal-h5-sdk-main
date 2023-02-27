import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { ArrayUtil, IUserContext } from '@infor-up/m3-odin';

import { SohoBusyIndicatorDirective } from 'ids-enterprise-ng';

import { GdisStore } from '@gdis/api';

import { DataService } from '../../services/data.service';
import { Config, M3DateFormat } from '../../enums';
import {
  addMonths,
  convertM3toSohoDateFormat,
  formatDate,
  parseDateFromString,
} from '../../utils';
import { IBuyer, IFilter, IWarehouse } from '../../types';

@Component({
  selector: 'app-home-filters',
  templateUrl: './home-filters.component.html',
  styleUrls: ['./home-filters.component.css'],
})
export class HomeFiltersComponent implements AfterViewInit, OnInit {
  @ViewChildren(SohoBusyIndicatorDirective)
  busyIndicators?: QueryList<SohoBusyIndicatorDirective>;

  @Output() filtersChanged: EventEmitter<IFilter> = new EventEmitter<IFilter>();
  @Output() warehousesFound: EventEmitter<IWarehouse[]> = new EventEmitter<
    IWarehouse[]
  >();

  warehouses: IWarehouse[] = [];
  buyers: IBuyer[] = [];
  defaultWHLO = '';
  defaultUSID = '';
  fromWarehouse = '';
  toWarehouse = '';
  fromActionMessage = '';
  toActionMessage = '';
  dateFormat!: string;
  m3DateFormat!: M3DateFormat;
  fromDate!: string;
  toDate!: string;
  busyIndicator: SohoBusyIndicatorDirective | undefined;
  buyer = '';

  Config = Config;

  constructor(private store: GdisStore, private dataService: DataService) {}

  ngOnInit() {
    const userContext = this.store.state.userContext as IUserContext;
    this.defaultWHLO = userContext.WHLO || '';
    this.defaultUSID = userContext.USID || '';
    this.m3DateFormat =
      (userContext.DTFM as M3DateFormat) || ('MDY' as M3DateFormat);
    this.dateFormat = convertM3toSohoDateFormat(this.m3DateFormat);
    this.fromDate = formatDate(
      addMonths(new Date(), -1),
      this.m3DateFormat as M3DateFormat,
      '/'
    );
    this.toDate = formatDate(
      addMonths(new Date(), 1),
      this.m3DateFormat as M3DateFormat,
      '/'
    );
  }

  ngAfterViewInit() {
    this.busyIndicator = this.busyIndicators?.toArray()[0];
    this.busyIndicator?.open();
    this.listWarehouses();
  }

  listWarehouses() {
    this.dataService
      .listWarehouses()
      .toPromise()
      .then((response) => {
        this.warehouses = response;
        if (this.warehouses.length > 0) {
          this.fromWarehouse =
            ArrayUtil.itemByProperty(this.warehouses, 'WHLO', this.defaultWHLO)
              .WHLO || this.warehouses[0].WHLO;
          this.toWarehouse = this.fromWarehouse;
        }
      })
      .catch(() => {
        this.warehouses = [];
      })
      .finally(() => {
        this.warehousesFound.emit(this.warehouses);
        this.listBuyers();
      });
  }

  listBuyers() {
    this.dataService
      .listUsers()
      .toPromise()
      .then((response) => {
        this.buyers = response;
        if (this.buyers.length > 0) {
          this.buyer =
            ArrayUtil.itemByProperty(this.buyers, 'USID', this.defaultUSID)
              .USID || this.buyers[0].USID;
        }
      })
      .catch(() => {
        this.buyers = [];
      })
      .finally(() => {
        this.busyIndicator?.close(true);
        if (
          this.buyer &&
          this.fromWarehouse &&
          this.toWarehouse &&
          this.fromDate &&
          this.toDate
        ) {
          this.updateFilters();
        }
      });
  }

  updateFilters() {
    const F_WHLO = this.fromWarehouse;
    const T_WHLO = this.toWarehouse;
    const F_ACTP = this.fromActionMessage;
    const T_ACTP = this.toActionMessage;
    const F_RELD = this.fromDate
      ? formatDate(
          parseDateFromString(this.fromDate, this.m3DateFormat, '/'),
          M3DateFormat.YearMonthDay
        )
      : '';
    const T_RELD = this.toDate
      ? formatDate(
          parseDateFromString(this.toDate, this.m3DateFormat, '/'),
          M3DateFormat.YearMonthDay
        )
      : '';
    const POBUYE = this.buyer;

    const filter: IFilter = {
      F_WHLO,
      T_WHLO,
      F_ACTP,
      T_ACTP,
      F_RELD,
      T_RELD,
      POBUYE,
    };

    this.filtersChanged.emit(filter);
  }
}
