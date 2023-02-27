import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { CoreBase, IMIRequest, IMIResponse, MIRecord } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoContextualActionPanelService } from 'ids-enterprise-ng';

import { DemoMonitorService } from '../../services/monitor.service';
import { DemoMonitorGroupDialogComponent } from '../../dialogs/monitor-group-dialog/monitor-group-dialog.component';
import { DemoMonitorDialogComponent } from '../../dialogs/monitor-dialog/monitor-dialog.component';
import { IMonitor } from '../../types/monitor.type';
import { IMonitorGroup } from '../../types/monitor-group.type';
import { Action } from '../../enums/action.enum';
import { Cugex } from '../../enums/cugex.enum';
import { TranslationService } from '../../../../../index';

/**
 * TODO: Describe the monitor component
 *
 */
@Component({
  //   encapsulation: ViewEncapsulation.None,
  selector: 'demo-monitor-group',
  styleUrls: ['./monitor-group.component.css'],
  templateUrl: './monitor-group.component.html',
})
/**
 *
 * This is a base class for showing M3 monitor data
 *
 */
export class DemoMonitorGroupComponent extends CoreBase implements OnInit {
  @Input() canEdit!: boolean;
  @Input() header!: string;
  @Input() monitorGroup!: IMonitorGroup;
  @Input() selectedParentRecord!: MIRecord;

  isBusy!: boolean;

  constructor(
    private miService: MIService,
    private monitorService: DemoMonitorService,
    private panelService: SohoContextualActionPanelService,
    private readonly translationService: TranslationService
  ) {
    super('MonitorGroupComponent');
  }

  ngOnInit(): void {
    this.getMonitors();
    this.monitorService.monitorChange.subscribe((monitor: IMonitor) => {
      if ((monitor.key as any).PK04 == (this.monitorGroup.key as any).PK04) {
        this.getMonitors();
      }
    });
  }

  getBadgeColor(monitor: IMonitor): string {
    return this.monitorService.getBadgeColor(monitor);
  }

  getMonitors() {
    let record: MIRecord = new MIRecord();

    (record as any).FILE = Cugex.file;
    (record as any).PK01 = (this.monitorGroup.key as any).PK01;
    (record as any).PK02 = (this.monitorGroup.key as any).PK02;
    (record as any).PK03 = (this.monitorGroup.key as any).PK03;
    (record as any).PK04 = (this.monitorGroup.key as any).PK04;
    (record as any).PK05 = 'MONITOR';

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'LstFieldValue',
      record: record,
      maxReturnedRecords: 999,
      typedOutput: true,
    };

    this.monitorGroup.monitors = [];
    this.isBusy = true;

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          if (response.items) {
            for (let item of response.items) {
              let higherThanArray: string[] = [
                item['N096'],
                item['N196'],
                item['N296'],
                item['N396'],
              ];
              let lowerThanArray: string[] = [
                item['N496'],
                item['N596'],
                item['N696'],
                item['N796'],
              ];
              this.monitorGroup.monitors.push({
                name: item['A030'],
                program: item['A130'],
                sortingOrder: item['A230'],
                view: item['A330'],
                query: item['A121'],
                key: item,
                severityArrays: [higherThanArray, lowerThanArray],
              });
            }
          }
        }
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  onAddMonitor() {
    this.monitorService.selectedMonitorGroup = this.monitorGroup;
    this.monitorService.selectedAction = Action.Add;
    this.monitorService.panelRef = this.panelService
      .contextualactionpanel(
        DemoMonitorDialogComponent,
        this.monitorService.placeHolder
      )
      .title(this.translate('monitorAddMonitor'))
      .initializeContent(true)
      .open();
  }

  onEditMonitor(event: any) {
    setTimeout(() => {
      this.monitorService.selectedMonitorGroup = this.monitorGroup;
      this.monitorService.selectedAction = Action.Edit;
      this.monitorService.panelRef = this.panelService
        .contextualactionpanel(
          DemoMonitorDialogComponent,
          this.monitorService.placeHolder
        )
        .title(this.translate('monitorEditMonitor'))
        .initializeContent(true)
        .open();
    }, 100);
  }

  onEditMonitorGroup() {
    this.monitorService.selectedMonitorGroup = this.monitorGroup;
    this.monitorService.selectedAction = Action.Edit;
    this.monitorService.panelRef = this.panelService
      .contextualactionpanel(
        DemoMonitorGroupDialogComponent,
        this.monitorService.placeHolder
      )
      .title(this.translate('monitorEditMonitorGroup'))
      .initializeContent(true)
      .open();
  }

  onDeleteMonitor(event: any) {
    setTimeout(() => {
      this.monitorService.selectedMonitorGroup = this.monitorGroup;
      this.monitorService.selectedAction = Action.Delete;
      this.monitorService.panelRef = this.panelService
        .contextualactionpanel(
          DemoMonitorDialogComponent,
          this.monitorService.placeHolder
        )
        .title(this.translate('monitorDeleteMonitor'))
        .initializeContent(true)
        .open();
    }, 100);
  }

  onDeleteMonitorGroup() {
    this.monitorService.selectedMonitorGroup = this.monitorGroup;
    this.monitorService.selectedAction = Action.Delete;
    this.monitorService.panelRef = this.panelService
      .contextualactionpanel(
        DemoMonitorGroupDialogComponent,
        this.monitorService.placeHolder
      )
      .title(this.translate('monitorDeleteMonitorGroup'))
      .initializeContent(true)
      .open();
  }

  onRefresh() {
    this.getMonitors();
  }

  onSelected(monitor: IMonitor) {
    this.monitorService.selectedMonitor = monitor;
  }

  private translate(value: string) {
    return this.translationService.translate(value);
  }
}
