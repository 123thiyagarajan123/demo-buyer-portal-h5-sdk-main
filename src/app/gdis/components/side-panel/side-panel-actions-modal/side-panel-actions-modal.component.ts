import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { CoreBase, IBookmark, Log, MIRecord } from '@infor-up/m3-odin';

import { SohoToastService } from 'ids-enterprise-ng';

import {
  ActionService,
  IDetailPanelMessage,
  PanelResult,
  BookmarkPanelComponent,
} from '../../../index';

@Component({
  selector: 'h5-side-panel-actions-modal',
  templateUrl: './side-panel-actions-modal.component.html',
  styleUrls: ['./side-panel-actions-modal.component.css'],
})
export class SidePanelActionsModalComponent
  extends CoreBase
  implements OnInit, AfterViewInit
{
  @ViewChild('detailPanel') detailPanel!: BookmarkPanelComponent;
  bookmark!: IBookmark;
  selectedRecord!: MIRecord | undefined;
  isBusy = false;

  constructor(
    private readonly actionService: ActionService,
    private readonly toastService: SohoToastService
  ) {
    super('SidePanelActionsModalComponent');
  }

  ngOnInit(): void {
    this.isBusy = true;
    this.setupBookmark();
  }

  /**
   *    Subscribes to the detail panels updateCompleteEmitter, so we know when the
   *    bookmark update has completed.
   */
  ngAfterViewInit() {
    this.detailPanel.updateCompleteEmitter.subscribe((response) => {
      this.onUpdateComplete(response);
    });
  }

  /**
   * Setup bookmark
   */
  setupBookmark() {
    this.selectedRecord = this.actionService.relatedInformation?.record;
    if (!this.selectedRecord) {
      return Log.error('selectedRecord not found. Stop executing bookmark');
    }

    this.bookmark = this.actionService.action?.bookmark as IBookmark;
    if (!this.bookmark) {
      return Log.error('bookmark not found. Stop executing bookmark');
    }

    const [keyNames, fieldNames] = this.parseBookmark(this.bookmark);

    this.bookmark.values = this.createBookmarkValues(
      this.selectedRecord,
      keyNames,
      fieldNames
    );
  }

  /**
   * Parse current bookmark
   */
  parseBookmark(bookmark: IBookmark) {
    let keyNames: string[] = [];
    if (bookmark.keyNames) {
      keyNames = bookmark.keyNames.split(',');
    }

    let fieldNames: string[] = [];
    if (bookmark.fieldNames) {
      fieldNames = bookmark.fieldNames.split(',');
    }
    return [keyNames, fieldNames];
  }

  /**
   * Create bookmark
   */
  createBookmarkValues(
    selectedRecord: MIRecord,
    keyNames: string[],
    fieldNames: string[]
  ) {
    const values = new MIRecord();

    // Key Names
    for (const key of keyNames) {
      let currentValue = (selectedRecord as any)[key];

      if (currentValue || currentValue === '' || currentValue === 0) {
        (values as any)[key] = currentValue;
      } else {
        const shortKey = key.substr(key.length - 4);
        currentValue = (selectedRecord as any)[shortKey];

        if (currentValue || currentValue === '' || currentValue === 0) {
          // @ts-expect-error: TODO
          values[key] = currentValue;
        } else {
          Log.error('Key value not found. Stop executing bookmark');
          return;
        }
      }
    }

    // Field Names
    for (const field of fieldNames) {
      let currentValue = (selectedRecord as any)[field];

      if (currentValue || currentValue === '' || currentValue === 0) {
        (values as any)[field] = currentValue;
      } else {
        const shortKey = field.substr(field.length - 4);
        currentValue = (selectedRecord as any)[shortKey];
        if (currentValue || currentValue === '' || currentValue === 0) {
          (values as any)[field] = currentValue;
        } else {
          Log.error('Field value not found');
        }
      }
    }

    return values;
  }

  /**
   * Calls the onSave method of the detail panel component. Triggered when the
   * dialogs save button is clicked.
   */
  onSave() {
    this.detailPanel.onSave();
  }

  /**
   * Closes the contextual action panel used by the dialog.
   */
  onCancel(): void {
    this.actionService.closeModal();
  }

  /**
   * Toggle busy indicator
   */
  showBusyindicator(state: boolean): void {
    this.isBusy = state;
  }

  /**
   * Called by the detail panel updateCompleteEmitter (subscribed to in the
   * ngAfterViewInit method). Shows a toast message saying "Action Completed"
   * and closes the dialog.
   */
  onUpdateComplete(response: IDetailPanelMessage) {
    if (response.type === PanelResult.Finished) {
      this.toastService.show({
        title: 'Action Completed',
        message: this.actionService.action?.messageComplete || 'Unknown',
        position: SohoToastService.TOP_RIGHT,
      });
      this.actionService.modalRef?.close(true);
    }

    if (response.type === PanelResult.Exit) {
      this.actionService.modalRef?.close(true);
    }
  }
}
