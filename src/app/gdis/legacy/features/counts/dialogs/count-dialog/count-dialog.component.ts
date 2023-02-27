import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import {
  ArrayUtil,
  CoreBase,
  IMIRequest,
  IMIResponse,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoMessageService } from 'ids-enterprise-ng';

import { DemoBusinessContextService } from '../../../../services/businesscontext/businesscontext.service';
import { Action } from '../../enums/action.enum';
import { Cugex } from '../../enums/cugex.enum';
import { TranslationService } from '../../../../../index';
import { DemoCountService } from '../..';
import { ICount } from '../../types';
import { CountType } from '../../enums/count-type.enum';

@Component({
  selector: 'm3-count-dialog',
  templateUrl: './count-dialog.component.html',
  styleUrls: ['./count-dialog.component.css'],
})

/**
 * The ButtonLinkDialogComponent component is used to add buttons to a mashup
 * *
 */
export class CountDialogComponent extends CoreBase implements OnInit {
  action!: number;
  count!: ICount;
  counts!: ICount[];

  isBusy = false;
  isReady = false;
  selectedRecord!: MIRecord;
  subscription!: Subscription;

  options = [
    {
      text: this.translate('normal'),
      value: CountType.Normal,
    },
    {
      text: this.translate('circle'),
      value: CountType.Circle,
    },
  ];

  constructor(
    protected messageService: SohoMessageService,
    protected miService: MIService,
    private businessContextService: DemoBusinessContextService,
    public countService: DemoCountService,
    private readonly translationService: TranslationService
  ) {
    super('CountDialogComponent');
  }

  ngOnInit(): void {
    this.action = this.countService.selectedAction;
    if (this.action == Action.Add) {
      this.count = {
        key: new MIRecord(),
        type: 0,
        name: '',
        text: '',
        apiProgram: '',
        apiTransaction: '',
        query: '',
      };
    } else {
      this.count = this.countService.selectedCount;
    }
    this.isReady = true;
  }

  onAdd() {
    this.isBusy = true;
    let record: MIRecord = new MIRecord();

    const program = 'CUSEXTMI';
    const transaction = 'AddFieldValue';
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = this.countService.applicationName.toUpperCase();
    (record as any).PK03 = Cugex.pk03;
    (record as any).PK04 = this.count.name.toUpperCase();
    (record as any).N096 = this.count.type;
    (record as any).A030 = this.count.name;
    (record as any).A130 = this.count.text;
    (record as any).A230 = this.count.apiProgram;
    (record as any).A330 = this.count.apiTransaction;
    (record as any).A121 = this.count.query;

    let request: IMIRequest = {
      includeMetadata: true,
      program: program,
      transaction: transaction,
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('buttonLinkOnError'));
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  onCancel() {
    this.countService.panelRef.close(true);
  }

  onDelete() {
    this.isBusy = true;
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = (this.count.key as any).PK01;
    (record as any).PK02 = (this.count.key as any).PK02;
    (record as any).PK03 = (this.count.key as any).PK03;
    (record as any).PK04 = (this.count.key as any).PK04;

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'DelFieldValue',
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('buttonLinkOnError'));
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  onEdit() {
    this.isBusy = true;
    let record: MIRecord = new MIRecord();

    const program = 'CUSEXTMI';
    const transaction = 'ChgFieldValue';

    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = (this.count.key as any).PK02;
    (record as any).PK03 = (this.count.key as any).PK03;
    (record as any).PK04 = (this.count.key as any).PK04;
    (record as any).N096 = this.count.type;
    (record as any).A030 = this.count.name;
    (record as any).A130 = this.count.text;
    (record as any).A230 = this.count.apiProgram;
    (record as any).A330 = this.count.apiTransaction;
    (record as any).A121 = this.count.query;
    let request: IMIRequest = {
      includeMetadata: true,
      program: program,
      transaction: transaction,
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('buttonLinkOnError'));
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  protected onError(message: string, error?: any) {
    this.logError(message, error ? '- Error: ' + JSON.stringify(error) : '');
    const buttons = [
      {
        text: 'Ok',
        click: (e: any, modal: { close: () => void }) => {
          modal.close();
        },
      },
    ];
    this.messageService
      .error()
      .title(this.translate('buttonLinkErrorTitle'))
      .message(message + this.translate('buttonLinkErrorMessage'))
      .buttons(buttons)
      .open();
  }

  protected onResponse(response: IMIResponse) {
    this.countService.countChange.emit(this.count);
    this.countService.panelRef.close(true);
  }

  private translate(value: string) {
    return this.translationService.translate(value);
  }
}
