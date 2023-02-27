import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import { CoreBase, IMIRequest, IMIResponse, MIRecord } from '@infor-up/m3-odin';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';
import { MIService } from '@infor-up/m3-odin-angular';

import { SohoContextualActionPanelService } from 'ids-enterprise-ng';

import { MonitorLevel } from '@gdis/enums';

import { GdisStore } from '../../../../index';
import { Action } from '../enums/action.enum';
import { Cugex } from '../enums/cugex.enum';
import { ICount } from '../types';
import { DemoCountService } from '..';
import { CountDialogComponent } from '../dialogs/count-dialog/count-dialog.component';

/**
 * The button link page is used to display buttons in a mashup
 *
 */
@Component({
  selector: 'm3-count-page',
  styleUrls: ['./count-page.component.css'],
  templateUrl: './count-page.component.html',
})
/**
 *
 * This is a base class for showing M3 monitor data
 *
 */
export class DemoCountPageComponent
  extends CoreBase
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() selectedParentRecord!: MIRecord;

  @ViewChild('countPlaceholder', { static: false })
  countPlaceholder!: ViewContainerRef;

  isBusy = false;
  counts: ICount[] = [];

  // TODO:replace hardcoded values
  tooltip = 'Add new count';

  constructor(
    private miService: MIService,
    private countService: DemoCountService,
    private panelService: SohoContextualActionPanelService,
    private gdisStore: GdisStore
  ) {
    super('ButtonLinkPageComponent');
  }

  ngOnInit() {
    this.countService.countChange.subscribe(() => {
      this.getCounts();
    });
  }

  ngAfterViewInit() {
    this.countService.placeHolder = this.countPlaceholder;
  }

  ngOnChanges(changes: SimpleChanges) {
    // When the selected parent record changes, load data via the onApply() method
    if (changes.selectedParentRecord) {
      this.getCounts();
    }
    if (changes.counts) {
      this.getContainerWidth();
    }
  }

  beforeOpen(event: any, count: ICount) {
    if (count) {
      this.countService.selectedCount = count;
    }
  }

  getCounts() {
    this.counts = [];

    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = this.countService.applicationName.toUpperCase();
    (record as any).PK03 = Cugex.pk03;

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'LstFieldValue',
      record: record,
      maxReturnedRecords: 999,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          // @ts-expect-error: TODO
          for (let item of response.items) {
            this.counts.push({
              key: item,
              type: (item as any).N096,
              name: (item as any).A030,
              text: (item as any).A130,
              apiProgram: (item as any).A230,
              apiTransaction: (item as any).A330,
              query: (item as any).A121,
            });
          }
        }
      },
      (error: MIResponse) => {
        // Do nothing
      }
    );
  }

  onAddButton() {
    this.countService.selectedAction = Action.Add;
    this.countService.panelRef = this.panelService
      .contextualactionpanel(
        CountDialogComponent,
        this.countService.placeHolder
      )
      .title('Add Count')
      .initializeContent(true)
      .open();
  }

  onCountClick(event: any, count: ICount) {
    this.countService.selectedCount = count;
  }

  onEditCount(event: any) {
    setTimeout(() => {
      this.countService.selectedAction = Action.Edit;
      this.countService.panelRef = this.panelService
        .contextualactionpanel(
          CountDialogComponent,
          this.countService.placeHolder
        )
        .title('Edit Count')
        .initializeContent(true)
        .open();
    });
  }

  onDeleteCount(event: any) {
    setTimeout(() => {
      this.countService.selectedAction = Action.Delete;
      this.countService.panelRef = this.panelService
        .contextualactionpanel(
          CountDialogComponent,
          this.countService.placeHolder
        )
        .title('Remove Count')
        .initializeContent(true)
        .open();
    });
  }

  isEdit() {
    const countLevel = this.gdisStore.state.monitor.currentMonitorLevel;
    if (countLevel === MonitorLevel.Edit) {
      return true;
    }
    return false;
  }

  getContainerWidth() {
    let width = 0;
    try {
      width = Math.ceil(this.counts.length * 0.5) * 188;
    } catch (err) {
      // Do nothing
    } finally {
      return width;
    }
  }
}
