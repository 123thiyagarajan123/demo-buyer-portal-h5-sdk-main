import { Component, OnInit } from '@angular/core';

import { CoreBase, IMIRequest, IMIResponse, MIRecord } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoMessageService } from 'ids-enterprise-ng';

import { TranslationService } from '../../../../../index';
import { DemoMonitorService } from '../../services/monitor.service';
import { IMonitorGroup } from '../../types/monitor-group.type';
import { Action } from '../../enums/action.enum';
import { Cugex } from '../../enums/cugex.enum';

@Component({
  selector: 'monitor-group-dialog',
  styleUrls: ['./monitor-group-dialog.component.css'],
  templateUrl: './monitor-group-dialog.component.html',
})

/**
 * The NewButtonDialogComponent component is used to add buttons to a mashup
 * *
 */
export class DemoMonitorGroupDialogComponent
  extends CoreBase
  implements OnInit
{
  action!: number;
  isBusy = false;
  isReady = false;
  name!: string;
  monitorGroup!: IMonitorGroup;

  constructor(
    protected messageService: SohoMessageService,
    protected miService: MIService,
    private monitorService: DemoMonitorService,
    private readonly translationService: TranslationService
  ) {
    super('DemoMonitorGroupDialogComponent');
  }

  ngOnInit(): void {
    this.action = this.monitorService.selectedAction;
    if (this.action == Action.Add) {
      this.monitorGroup = {
        name: '',
        monitors: [],
        key: new MIRecord(),
      };
    } else {
      this.monitorGroup = this.monitorService.selectedMonitorGroup;
    }
    this.isReady = true;
  }

  onAdd() {
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = this.monitorService.applicationName.toUpperCase();
    (record as any).PK03 = Cugex.pk03;
    (record as any).PK04 = this.monitorGroup.name.toUpperCase();
    (record as any).A030 = this.monitorGroup.name;

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'AddFieldValue',
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.isBusy = true;
    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('monitorOnError'), response);
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.onError(this.translate('monitorOnError'), error);
        this.isBusy = false;
      }
    );
  }

  onCancel() {
    this.monitorService.panelRef.close(true);
  }

  onEdit() {
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = (this.monitorGroup.key as any).PK02;
    (record as any).PK03 = (this.monitorGroup.key as any).PK03;
    (record as any).PK04 = (this.monitorGroup.key as any).PK04;
    (record as any).A030 = this.monitorGroup.name;

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'ChgFieldValue',
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.isBusy = true;
    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('monitorOnError'));
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  onDelete() {
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = (this.monitorGroup.key as any).PK02;
    (record as any).PK03 = (this.monitorGroup.key as any).PK03;
    (record as any).PK04 = (this.monitorGroup.key as any).PK04;

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'DelFieldValue',
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.isBusy = true;
    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('monitorOnError'));
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  protected onError(message: string, response?: IMIResponse) {
    this.logError(
      message,
      response ? '- Error: ' + JSON.stringify(response) : ''
    );
    const buttons = [
      {
        text: 'Ok',
        click: (e: any, modal: any) => {
          modal.close();
        },
      },
    ];
    message = response?.errorMessage
      ? response.errorMessage
      : message + this.translate('monitorErrorMessage');
    this.messageService
      .error()
      .title(this.translate('monitorErrorTitle'))
      .message(message)
      .buttons(buttons)
      .open();
  }

  protected onResponse(response: IMIResponse) {
    this.monitorService.monitorGroupChange.emit(this.monitorGroup);
    this.monitorService.panelRef.close(true);
  }

  translate(value: string) {
    return this.translationService.translate(value);
  }
}
