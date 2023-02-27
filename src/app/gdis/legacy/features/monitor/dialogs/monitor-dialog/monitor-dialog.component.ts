import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import {
  ArrayUtil,
  CoreBase,
  IMIRequest,
  IMIResponse,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import {
  SohoContextualActionPanelService,
  SohoMessageService,
} from 'ids-enterprise-ng';

import { TranslationService } from '../../../../../index';
import { DemoMonitorService } from '../../services/monitor.service';
import { Action } from '../../enums/action.enum';
import { IMonitor } from '../../types/monitor.type';
import { DemoSeverityIndicatorDialogComponent } from '../severity-indicator-dialog/severity-indicator-dialog.component';
import { Cugex } from '../../enums/cugex.enum';

@Component({
  selector: 'monitor-dialog',
  styleUrls: ['./monitor-dialog.component.css'],
  templateUrl: './monitor-dialog.component.html',
})

/**
 * The NewButtonDialogComponent component is used to add buttons to a mashup
 * *
 */
export class DemoMonitorDialogComponent extends CoreBase implements OnInit {
  action!: number;
  isBusy = false;
  isReady = false;
  name!: string;
  monitor!: IMonitor;
  severityArrays!: string[][];

  constructor(
    protected messageService: SohoMessageService,
    protected miService: MIService,
    private monitorService: DemoMonitorService,
    private panelService: SohoContextualActionPanelService,
    private readonly translationService: TranslationService
  ) {
    super('DemoMonitorDialogComponent');
  }

  ngOnInit(): void {
    this.action = this.monitorService.selectedAction;
    if (this.action == Action.Add) {
      this.monitor = {
        name: '',
        program: '',
        sortingOrder: '',
        view: '',
        query: '',
        key: new MIRecord(),
      };
    } else {
      this.monitor = this.monitorService.selectedMonitor;
    }
    this.isReady = true;
  }

  onAdd() {
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = this.monitorService.applicationName.toUpperCase();
    (record as any).PK03 = Cugex.pk03;
    (record as any).PK04 = (
      this.monitorService.selectedMonitorGroup.key as any
    ).PK04;
    (record as any).PK05 = Cugex.pk05;
    (record as any).PK06 = this.monitor.name.toUpperCase();
    (record as any).A030 = this.monitor.name;
    (record as any).A130 = this.monitor.program;
    (record as any).A230 = this.monitor.sortingOrder;
    (record as any).A330 = this.monitor.view;
    (record as any).A121 = this.monitor.query;
    if (this.monitor.severityArrays) {
      if (this.monitor.severityArrays.length == 2) {
        if (
          this.monitor.severityArrays[0].length == 4 &&
          this.monitor.severityArrays[1].length
        ) {
          const higherThanArray = this.monitor.severityArrays[0];
          const lowerThanArray = this.monitor.severityArrays[1];
          (record as any).N096 = higherThanArray[0];
          (record as any).N196 = higherThanArray[1];
          (record as any).N296 = higherThanArray[2];
          (record as any).N396 = higherThanArray[3];
          (record as any).N496 = lowerThanArray[0];
          (record as any).N596 = lowerThanArray[1];
          (record as any).N696 = lowerThanArray[2];
          (record as any).N796 = lowerThanArray[3];
        }
      }
    }
    this.monitor.key = record;

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
    this.monitorService.panelRef.close(false);
  }

  onDelete() {
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = (this.monitor.key as any).PK02;
    (record as any).PK03 = (this.monitor.key as any).PK03;
    (record as any).PK04 = (this.monitor.key as any).PK04;
    (record as any).PK05 = (this.monitor.key as any).PK05;
    (record as any).PK06 = (this.monitor.key as any).PK06;

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

  onEdit() {
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = (this.monitor.key as any).PK02;
    (record as any).PK03 = (this.monitor.key as any).PK03;
    (record as any).PK04 = (this.monitor.key as any).PK04;
    (record as any).PK05 = (this.monitor.key as any).PK05;
    (record as any).PK06 = (this.monitor.key as any).PK06;
    (record as any).A030 = this.monitor.name;
    (record as any).A130 = this.monitor.program;
    (record as any).A230 = this.monitor.sortingOrder;
    (record as any).A330 = this.monitor.view;
    (record as any).A121 = this.monitor.query;
    if (this.severityArrays) {
      if (this.severityArrays.length == 2) {
        const higherThanArray = this.severityArrays[0];
        const lowerThanArray = this.severityArrays[1];
        if (higherThanArray.length == 4 && lowerThanArray.length == 4) {
          (record as any).N096 = higherThanArray[0];
          (record as any).N196 = higherThanArray[1];
          (record as any).N296 = higherThanArray[2];
          (record as any).N396 = higherThanArray[3];
          (record as any).N496 = lowerThanArray[0];
          (record as any).N596 = lowerThanArray[1];
          (record as any).N696 = lowerThanArray[2];
          (record as any).N796 = lowerThanArray[3];
        }
      }
    }

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
    this.monitorService.monitorChange.emit(this.monitor);
    this.monitorService.panelRef.close(true);
  }

  onSeverityIndicator() {
    this.monitorService.selectedAction = Action.Add;
    this.monitorService.selectedMonitor = this.monitor;
    this.monitorService.panelRef2 = this.panelService
      .contextualactionpanel(
        DemoSeverityIndicatorDialogComponent,
        this.monitorService.placeHolder
      )
      .title(this.translate('monitorAddSeverityIndicator'))
      .initializeContent(true)
      .open()
      .afterClose((severityArrays) => {
        if (severityArrays) {
          this.severityArrays = severityArrays;
        }
      }) as any;
  }

  private translate(value: string) {
    return this.translationService.translate(value);
  }
}
