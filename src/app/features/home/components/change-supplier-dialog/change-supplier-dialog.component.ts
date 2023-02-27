import { Component, OnInit } from '@angular/core';

import { MIRecord } from '@infor-up/m3-odin';

import { IPlannedPurchaseOrder, IPurchaseAgreement } from '../../types';
import { Config } from '../../enums';

@Component({
  selector: 'app-change-supplier-dialog',
  templateUrl: './change-supplier-dialog.component.html',
  styleUrls: ['./change-supplier-dialog.component.css'],
})
export class ChangeSupplierDialogComponent implements OnInit {
  Config = Config;
  supplier = '';
  supplierName = '';
  record: IPlannedPurchaseOrder | undefined;
  selectedRecord: IPurchaseAgreement | undefined;
  isBusy = false;

  constructor() {}

  ngOnInit(): void {
    this.supplier = this.record?.POSUNO || '';
    this.supplierName = this.record?.IDSUNM || '';
    return;
  }

  selectionChanged(record: MIRecord) {
    this.selectedRecord = (record as IPurchaseAgreement) || undefined;
  }
}
