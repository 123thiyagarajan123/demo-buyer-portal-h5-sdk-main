import {
  Component,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { Params } from '@angular/router';

import { ArrayUtil, IUserContext, Log } from '@infor-up/m3-odin';
import { MIRecord, MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoModalDialogRef, SohoModalDialogService } from 'ids-enterprise-ng';

import {
  GdisStore,
  HeaderService,
  TranslationService,
  SidePanelService,
} from '@gdis/api';

import {
  IItem,
  IPackaging,
  IPlannedPurchaseOrder,
  IPurchaseAgreement,
  ISupplierFilter,
  IWarehouse,
} from '../../types';
import {
  convertM3toSohoDateFormat,
  formatDate,
  createDataSetItem,
} from '../../utils';
import { DataService } from '../../services/data.service';
import { Config, M3DateFormat } from '../../enums';
import {
  AddLineDialogComponent,
  ChangeSupplierDialogComponent,
} from '../../components/';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  @ViewChild('dialogPlaceholder', { read: ViewContainerRef, static: true })
  placeholder?: ViewContainerRef;
  Config = Config;
  queryParams!: Params;
  supplier!: ISupplierFilter;
  isOpen = true;
  packagings: IPackaging[] = [];
  packaging = '';
  weightData: SohoDataSetItem[] = [];
  volumeData: SohoDataSetItem[] = [];
  currentUnits = 0;
  currentValue = 0;
  maxWeight = 0;
  maxVolume = 0;
  currentWeight = 0;
  currentVolume = 0;
  currentRecords: IPlannedPurchaseOrder[] = [];
  warehouses: IWarehouse[] = [];
  warehouse = '';
  defaultWHLO = '';
  m3DateFormat = '';
  dateFormat = '';
  date = '';
  isBusy = false;
  linesToCreate = 0;
  linesToDelete = 0;
  linesToRelease = 0;

  constructor(
    private readonly headerService: HeaderService,
    private dataService: DataService,
    private readonly translationService: TranslationService,
    private modalService: SohoModalDialogService,
    private store: GdisStore,
    private sidepanelService: SidePanelService
  ) {
    this.onSelectedSupplier = this.onSelectedSupplier.bind(this);
  }

  ngOnDestroy() {
    this.resetHeader();
  }

  async ngOnInit() {
    //this.sidepanelService.toggle();
    const userContext = this.store.state.userContext as IUserContext;
    this.defaultWHLO = userContext.WHLO || '';
    this.m3DateFormat =
      (userContext.DTFM as M3DateFormat) || ('MDY' as M3DateFormat);
    this.dateFormat = convertM3toSohoDateFormat(this.m3DateFormat);
    this.date = formatDate(new Date(), this.m3DateFormat as M3DateFormat, '/');
    this.dataService
      .listPackaging()
      .toPromise()
      .then((response) => {
        this.packagings = response;
        if (this.packagings.length > 0) {
          this.packaging = this.packagings[this.packagings.length - 1].PACT;
          this.updatePackaging();
        }
      })
      .catch(() => {
        this.packagings = [];
      });
    this.setupHeader();
  }

  rowActivated(records: IPlannedPurchaseOrder[]) {
    //Supplier hasn't been selected yet, take supplier from selected planned purchase order
    if (
      (!this.supplier || !this.supplier?.POSUNO) &&
      records &&
      records.length > 0
    ) {
      this.sidepanelService.isOpen = false;
      this.isOpen = false;

      this.supplier = new MIRecord({
        POSUNO: records[0].POSUNO,
        IDSUNM: this.supplier?.IDSUNM || '',
        F_WHLO: this.supplier?.F_WHLO || '',
        T_WHLO: this.supplier?.T_WHLO || '',
        F_ACTP: this.supplier?.F_ACTP || '',
        T_ACTP: this.supplier?.T_ACTP || '',
        F_RELD: this.supplier?.F_RELD || '',
        T_RELD: this.supplier?.T_RELD || '',
        POBUYE: this.supplier?.POBUYE || '',
      }) as ISupplierFilter;
      this.currentRecords = [];
    }
  }

  orderSelectionChanged(records: IPlannedPurchaseOrder[]) {
    this.currentRecords = records || [];
    this.updateCount(records);
  }

  updateCount(records: IPlannedPurchaseOrder[]) {
    try {
      let units = 0;
      let value = 0;
      let volume = 0;
      let weight = 0;
      for (let record of records) {
        units += record.POPPQT;
        if (record.POPUUN != record.MMUNMS) {
          try {
            if (parseInt(record.MUDMCF) === 1) {
              value += record.POPPQT * record.POPUPR * record.MUCOFA;
              weight += record.POPPQT * record.MMGRWE * record.MUCOFA;
              volume += record.POPPQT * record.MMVOL3 * record.MUCOFA;
            } else {
              value += (record.POPPQT * record.POPUPR) / record.MUCOFA;
              weight += record.POPPQT * (record.MMGRWE / record.MUCOFA);
              volume += record.POPPQT * (record.MMVOL3 / record.MUCOFA);
            }
          } catch (err) {}
        } else {
          value += record.POPPQT * record.POPUPR;
          weight += record.POPPQT * record.MMGRWE;
          volume += record.POPPQT * record.MMVOL3;
        }
      }
      this.currentUnits = units;
      this.currentValue = value;
      if (this.packaging) {
        this.currentWeight = weight;
        this.currentVolume = volume;
        let pctVol = 0;
        let pctWght = 0;
        try {
          if (this.maxWeight) {
            pctWght = (weight / this.maxWeight) * 100;
          }
          if (this.maxVolume) {
            pctVol = (volume / this.maxVolume) * 100;
          }
        } catch (err) {}
        this.weightData = [
          createDataSetItem(
            pctWght,
            this.translate('cumulativeValueForSelectedOrders')
          ),
        ];
        this.volumeData = [
          createDataSetItem(
            pctVol,
            this.translate('cumulativeValueForSelectedOrders')
          ),
        ];
      }
    } catch (err) {}
  }

  updatePackaging() {
    this.maxWeight =
      ArrayUtil.itemByProperty(this.packagings, 'PACT', this.packaging).WEIG ||
      0;
    this.maxVolume =
      ArrayUtil.itemByProperty(this.packagings, 'PACT', this.packaging).VOL3 ||
      0;
    this.updateCount(this.currentRecords);
  }

  warehousesFound(warehouses: IWarehouse[]) {
    this.warehouses = warehouses || [];
    if (this.warehouses.length > 0) {
      this.warehouse =
        ArrayUtil.itemByProperty(this.warehouses, 'WHLO', this.defaultWHLO)
          .WHLO || this.warehouses[0].WHLO;
    }
  }

  openDeleteLineDialog() {
    const POPLPNs = this.currentRecords
      .map((record: IPlannedPurchaseOrder) => {
        return record.POPLPN;
      })
      .join(', ');
    const dialogRef = this.modalService
      .message(
        `<span class="message">${this.translate(
          'deletePopMsg'
        )}${POPLPNs}</span>`
      )
      .buttons([
        {
          text: this.translate('cancel'),
          click: () => {
            dialogRef.close('CANCEL');
          },
          isDefault: true,
        },
        {
          text: this.translate('delete'),
          click: () => {
            dialogRef.close('DELETE');
          },
        },
      ])
      .title(`${this.translate('deletePop')} (${this.currentRecords.length})`)
      .open()
      .afterClose((result: string) => {
        if (result === 'DELETE') {
          this.linesToDelete = this.currentRecords.length;
          this.isBusy = true;

          for (let record of this.currentRecords) {
            this.deletePlannedPO(record);
          }
        } else {
          Log.info('Cancelled');
        }
      });
  }

  openChangeSupplierDialog() {
    const dialogRef = this.modalService
      .modal(ChangeSupplierDialogComponent, this.placeholder)
      .buttons([
        {
          text: this.translate('cancel'),
          click: () => {
            dialogRef.close('CANCEL');
          },
        },
        {
          text: this.translate('update'),
          click: () => {
            dialogRef.close('SUBMIT');
          },
          isDefault: true,
        },
      ])
      .title(this.translate('changeSupplierAgreement'))
      .apply((component: ChangeSupplierDialogComponent) => {
        //Initialize variables for dialog page
        /*   component.supplier = this.supplier?.POSUNO || '';
        component.supplierName = this.supplier?.IDSUNM || ''; */
        component.record = this.currentRecords[0];
      })
      .afterClose(
        (
          result: string,
          panelRef: SohoModalDialogRef<ChangeSupplierDialogComponent>,
          dialogComponent: ChangeSupplierDialogComponent
        ) => {
          if (result && result == 'SUBMIT') {
            if (dialogComponent.selectedRecord) {
              this.updatePOPSupplier(dialogComponent.selectedRecord);
            }
          }
        }
      )
      .open();
  }

  openAddLineDialog() {
    const dialogRef = this.modalService
      .modal(AddLineDialogComponent, this.placeholder)
      .buttons([
        {
          text: this.translate('cancel'),
          click: () => {
            dialogRef.close('CANCEL');
          },
        },
        {
          text: this.translate('createPlannedPO'),
          click: () => {
            dialogRef.close('SUBMIT');
          },
          isDefault: true,
        },
      ])
      .title(this.translate('addLine'))
      .apply((component: AddLineDialogComponent) => {
        //Initialize variables for dialog page
        component.supplier = this.supplier?.POSUNO || '';
        component.supplierName = this.supplier?.IDSUNM || '';
        component.warehouses = this.warehouses;
        component.warehouse = this.warehouse;
        component.dateFormat = this.dateFormat;
        component.date = this.date;
      })
      .afterClose(
        (
          result: string,
          panelRef: SohoModalDialogRef<AddLineDialogComponent>,
          dialogComponent: AddLineDialogComponent
        ) => {
          if (result && result == 'SUBMIT') {
            //Create planned PO
            if (
              dialogComponent.dirtyRows &&
              dialogComponent.dirtyRows.length > 0
            ) {
              this.linesToCreate = dialogComponent.dirtyRows.length;
              this.isBusy = true;
            }
            for (let record of dialogComponent.dirtyRows) {
              if (record['PPQT']) {
                this.createPOP(record, dialogComponent.warehouse);
              }
            }
          }
        }
      )
      .open();
  }

  private createPOP(record: IItem, warehouse: string) {
    const WHLO = warehouse;
    const ITNO = record['MBITNO'];
    const SUNO = this.supplier?.POSUNO || '';
    const PLDT = MIUtil.getDateFormatted(record['PLDT']);
    const PPQT = record['PPQT'].toString();
    const PSTS = '10';
    this.dataService
      .createPOP(WHLO, ITNO, SUNO, PLDT, PPQT, PSTS)
      .toPromise()
      .finally(() => {
        this.linesToCreate -= 1;
        if (this.linesToCreate <= 0) {
          this.isBusy = false;
          this.supplier = JSON.parse(JSON.stringify(this.supplier));
        }
      });
  }

  private deletePlannedPO(record: IPlannedPurchaseOrder) {
    const PLPN = record['POPLPN'];
    this.dataService
      .deletePlannedPO(PLPN)
      .toPromise()
      .finally(() => {
        this.linesToDelete -= 1;
        if (this.linesToDelete <= 0) {
          this.isBusy = false;
          this.supplier = JSON.parse(JSON.stringify(this.supplier));
        }
      });
  }

  releaseLines() {
    this.linesToRelease = this.currentRecords.length;
    this.isBusy = true;
    for (let record of this.currentRecords) {
      this.updatePOP(record);
    }
  }

  private updatePOP(record: IPlannedPurchaseOrder) {
    const PLPN = record['POPLPN'];
    const PLPS = record['POPLPS'];
    const PLP2 = record['POPLP2'];
    const PSTS = '60';
    this.dataService
      .updatePOP(PLPN, PLPS, PLP2, PSTS)
      .toPromise()
      .finally(() => {
        this.linesToRelease -= 1;
        if (this.linesToRelease <= 0) {
          this.isBusy = false;
          this.supplier = JSON.parse(JSON.stringify(this.supplier));
        }
      });
  }

  private updatePOPSupplier(record: IPurchaseAgreement) {
    this.isBusy = true;
    const PLPN = this.currentRecords[0]['POPLPN'];
    const PLPS = this.currentRecords[0]['POPLPS'];
    const PLP2 = this.currentRecords[0]['POPLP2'];
    const SUNO = record.AJSUNO;
    const PUPR = record.AJPUPR;
    const AGNB = record.AJAGNB;
    this.dataService
      .updatePOPSupplier(PLPN, PLPS, PLP2, SUNO, PUPR, AGNB)
      .toPromise()
      .finally(() => {
        this.isBusy = false;
        this.supplier = JSON.parse(JSON.stringify(this.supplier));
      });
  }

  releaseProposals() {
    this.releasePOP(this.supplier?.POSUNO);
  }

  private releasePOP(SUNO: string) {
    if (!SUNO) return;
    this.isBusy = true;
    this.dataService
      .releasePOP(SUNO)
      .toPromise()
      .finally(() => {
        this.isBusy = false;
        this.supplier = JSON.parse(JSON.stringify(this.supplier));
      });
  }

  async onSelectedSupplier(supplier?: ISupplierFilter) {
    this.sidepanelService.isOpen = false;
    if (supplier?.POSUNO) {
      this.isOpen = false;
    }
    this.supplier =
      supplier ||
      (new MIRecord({
        POSUNO: '',
        IDSUNM: '',
        F_WHLO: '',
        T_WHLO: '',
        F_ACTP: '',
        T_ACTP: '',
        F_RELD: '',
        T_RELD: '',
        POBUYE: '',
      }) as ISupplierFilter);
  }

  setupHeader() {
    this.headerService.customButton = {
      onClick: () => this.toogleMenu(),
      icon: 'menu',
      text: 'Search Menu',
    };
  }

  resetHeader() {
    this.headerService.customButton = null;
  }

  toogleMenu() {
    this.isOpen = !this.isOpen;
  }

  translate(value: string) {
    return this.translationService.translate(`${Config.Scope}.${value}`);
  }
}
