import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';

import { CoreBase, IMIRequest, IMIResponse, MIRecord } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { DemoCountService } from '@gdis/legacy';

import { ICount } from '../../types/count.type';
import { DemoReplaceVariableService } from '../../services/replace-variable.service';
import { DemoSearchMacroService } from '../../services/search-macro.service';

export interface nasse extends MIRecord {
  [key: string]: any;
}

/**
 * TODO: Describe the monitor component
 *
 */
@Component({
  selector: 'm3-count',
  styleUrls: ['./count.component.css'],
  templateUrl: './count.component.html',
})
/**
 *
 * This is a base class for showing M3 monitor data
 *
 */
export class DemoCountComponent extends CoreBase implements OnInit {
  @Input() count!: ICount;
  @Input() selectedParentRecord!: MIRecord;

  badgeColor!: string;
  isBusy!: boolean;

  constructor(
    private countService: DemoCountService,
    private miService: MIService,
    private replaceVariableService: DemoReplaceVariableService,
    private searchMacroService: DemoSearchMacroService
  ) {
    super('DemoCountComponent');
  }

  ngOnInit(): void {
    this.loadCount();
  }

  loadCount() {
    this.count.recordCount = '';
    this.isBusy = true;

    let record: MIRecord = new MIRecord();
    let args = this.count.query.split(',');
    let inputFields: string[] = [];
    let valueFields: string[] = [];

    for (let i = 0; i < args.length; i++) {
      if (i % 2 === 0) {
        inputFields.push(args[i]);
      } else {
        valueFields.push(args[i]);
      }
    }

    for (let i = 0; i < inputFields.length; i++) {
      const inputfield = inputFields[i];
      let valueField = valueFields[i];

      if (inputfield === 'SQRY' || inputfield === 'QERY') {
        let query = '';
        query = this.searchMacroService.processSearchMacros(valueField, 'YMD');
        query = this.replaceVariableService.replace(
          query,
          this.selectedParentRecord
        );
        valueField = query;
      }

      // @ts-expect-error: TODO
      if (this.selectedParentRecord[valueField]) {
        // @ts-expect-error: TODO
        record.setString(inputfield, this.selectedParentRecord[valueField]);
      } else {
        record.setString(inputfield, valueField);
      }
    }

    let request: IMIRequest = {
      includeMetadata: true,
      program: this.count.apiProgram,
      transaction: this.count.apiTransaction,
      record: record,
      maxReturnedRecords: 999,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          if (response.items) {
            this.count.recordCount = response.items.length.toString();
          }
        }
      },
      (error: MIResponse) => {
        this.count.recordCount = '0';
        this.isBusy = false;
      }
    );
  }

  onRefresh() {
    this.loadCount();
  }
}
