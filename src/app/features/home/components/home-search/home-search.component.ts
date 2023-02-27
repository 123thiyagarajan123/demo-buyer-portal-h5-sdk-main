import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { SohoListViewComponent } from 'ids-enterprise-ng';

import { IFilter, ISupplier, IWarehouse, ISupplierFilter } from '../../types';
import { Config } from '../../enums';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.css'],
})
export class HomeSearchComponent {
  @ViewChild('sohoSearchField') sohoSearchField!: Input;
  @ViewChild(SohoListViewComponent) listview!: SohoListViewComponent;
  @Output() selectedItem: EventEmitter<ISupplierFilter> =
    new EventEmitter<ISupplierFilter>();
  @Output() warehousesFoundBubbleUp: EventEmitter<IWarehouse[]> =
    new EventEmitter<IWarehouse[]>();

  dataset: ISupplier[] = [];
  isBusy = false;
  Config = Config;
  filters: IFilter = {
    F_WHLO: '',
    T_WHLO: '',
    F_ACTP: '',
    T_ACTP: '',
    F_RELD: '',
    T_RELD: '',
    POBUYE: '',
  };

  constructor(private dataService: DataService) {}

  filtersChanged(filters: IFilter) {
    this.filters = filters;
    this.isBusy = true;
    this.listPlannedOrders(filters);
  }

  listPlannedOrders(filters: IFilter) {
    this.dataService
      .listPlannedOrders(
        filters.POBUYE,
        filters.F_RELD,
        filters.T_RELD,
        filters.F_WHLO,
        filters.T_WHLO,
        filters.F_ACTP,
        filters.T_ACTP
      )
      .toPromise()
      .then((response) => {
        this.dataset = response;
      })
      .catch(() => {
        this.dataset = [];
      })
      .finally(() => {
        /*  if (this.dataset.length > 0) {
          setTimeout(() => {
            this.listview.select(0);
          }, 100);
        } */

        if (this.filters.POBUYE) {
          const selected = { ...this.filters };
          this.selectedItem.emit(selected as ISupplierFilter);
        }

        this.isBusy = false;
      });
  }

  // Keep type 'any' for ease of use. See Soho Listview Component "selected" output for details
  onSelected($event: any) {
    if (this.listview) {
      let selectedIndex: SohoListViewItemReference;

      const selectedItems = this.listview.getSelectedItems;

      if (selectedItems && selectedItems.length > 0) {
        selectedIndex = selectedItems[0];

        if ($event.length == 2) {
          $event[1].selectedData[0] = this.dataset[selectedIndex as number];
        }
      }
    }
    const [_, data] = $event;
    let [selected] = data.selectedData;

    selected = { ...selected, ...this.filters };

    this.selectedItem.emit(selected as ISupplierFilter);
  }

  warehousesFound(event: IWarehouse[]) {
    this.warehousesFoundBubbleUp.emit(event || []);
  }
}
