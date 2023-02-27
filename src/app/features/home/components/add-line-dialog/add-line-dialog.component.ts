import { Component, OnInit } from '@angular/core';

import { IWarehouse, IItem } from '../../types';
import { Config } from '../../enums';

@Component({
  selector: 'app-add-line-dialog',
  templateUrl: './add-line-dialog.component.html',
  styleUrls: ['./add-line-dialog.component.css'],
})
export class AddLineDialogComponent implements OnInit {
  Config = Config;
  supplier = '';
  supplierName = '';
  warehouses: IWarehouse[] = [];
  warehouse = '';
  date = '';
  dateFormat = '';
  dirtyRows: IItem[] = [];

  constructor() {}

  ngOnInit(): void {
    return;
  }

  dirtyRowsChanged(dirtyRows: IItem[]) {
    this.dirtyRows = dirtyRows;
  }
}
