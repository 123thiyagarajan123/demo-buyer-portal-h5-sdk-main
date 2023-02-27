import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  CoreBase,
  IFormResponse,
  IMIRequest,
  IMIResponse,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';
import { MIService } from '@infor-up/m3-odin-angular';

import {
  SohoContextualActionPanelRef,
  SohoContextualActionPanelService,
} from 'ids-enterprise-ng';

import { GdisStore, MonitorLevel, TranslationService } from '../../../../index';
import { DemoMonitorService } from '../services/monitor.service';
import { DemoMonitorGroupDialogComponent } from '../dialogs/monitor-group-dialog/monitor-group-dialog.component';
import { IMonitorGroup } from '../types/monitor-group.type';
import { Action } from '../enums/action.enum';
import { Cugex } from '../enums/cugex.enum';

/**
 * The button link page is used to display monitors in a mashup
 *
 */
@Component({
  selector: 'monitor-group-page',
  styleUrls: ['./monitor-group-page.component.css'],
  templateUrl: './monitor-group-page.component.html',
})
/**
 *
 * This is a base class for showing M3 monitor data
 *
 */
export class DemoMonitorGroupPageComponent
  extends CoreBase
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() canEdit!: boolean;

  @Input() selectedParentRecord!: MIRecord;

  @ViewChild('monitorPlaceholder', { static: false })
  monitorPlaceholder!: ViewContainerRef;

  isBusy = false;
  monitorGroups: IMonitorGroup[] = [];

  tooltip = this.translate('monitorAddNewMonitorGroup');

  constructor(
    private miService: MIService,
    private monitorService: DemoMonitorService,
    private panelService: SohoContextualActionPanelService,
    private gdisStore: GdisStore,
    private readonly translationService: TranslationService
  ) {
    super('MonitorGroupPageComponent');
  }

  ngOnInit() {
    this.monitorService.monitorGroupChange.subscribe(() => {
      this.getMonitorGroups();
    });
  }

  ngAfterViewInit() {
    this.monitorService.placeHolder = this.monitorPlaceholder;
  }

  ngOnChanges(changes: SimpleChanges) {
    // When the selected parent record changes, load data via the onApply() method
    if (changes.selectedParentRecord) {
      this.getMonitorGroups();
    }
  }

  getMonitorGroups() {
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = this.monitorService.applicationName.toUpperCase();
    (record as any).PK03 = Cugex.pk03;

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'LstFieldValue',
      record: record,
      maxReturnedRecords: 999,
      typedOutput: true,
    };

    this.monitorGroups = [];

    this.isBusy = true;
    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          if (response.items) {
            for (let item of response.items) {
              if (item['PK05'] != 'MONITOR') {
                this.monitorGroups.push({
                  name: item['A030'],
                  monitors: [],
                  key: item,
                });
              }
            }
          }
        }
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  isEdit() {
    const monitorLevel = this.gdisStore.state.monitor.currentMonitorLevel;
    if (monitorLevel === MonitorLevel.Edit) {
      return true;
    }
    return false;
  }

  onAddMonitorGroup() {
    this.monitorService.selectedAction = Action.Add;
    this.monitorService.panelRef = this.panelService
      .contextualactionpanel(
        DemoMonitorGroupDialogComponent,
        this.monitorService.placeHolder
      )

      .title(this.translate('monitorAddMonitorGroup'))
      .initializeContent(true)
      .open();
  }

  private translate(value: string) {
    return this.translationService.translate(value);
  }
}
