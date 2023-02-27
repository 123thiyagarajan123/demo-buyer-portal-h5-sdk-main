/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { CoreBase, MIRecord, IBookmark, Log } from '@infor-up/m3-odin';

import { SohoToastService } from 'ids-enterprise-ng';

import { DemoRelatedOptionService } from '../..';
import { IDetailPanelMessage, PanelResult } from '../..';
import { BookmarkPanelComponent } from '../bookmark-panel/bookmark-panel.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'm3-related-option-dialog',
  templateUrl: './related-option-dialog.component.html',
  styleUrls: ['./related-option-dialog.component.css'],
})

/**
 * The GdisRelatedOptionDialogComponent component is used to display a detailPanel
 * component in a dialog window. It is launched when clicking an Action in the
 * related option component.
 *
 * The detailPanel component is used to process an action of some kind, for example
 * confirming a PO.
 *
 */
export class RelatedOptionDialogComponent extends CoreBase implements OnInit {
  @ViewChild('detailPanel') detailPanel!: BookmarkPanelComponent;
  bookmark!: IBookmark;
  isBusy = false;
  isReady = false;
  selectedRecord!: MIRecord;
  subscription!: Subscription;

  constructor(
    protected relatedOptionService: DemoRelatedOptionService,
    private toastService: SohoToastService
  ) {
    super('RelatedOptionDialogComponent');
  }

  ngOnInit(): void {
    this.isBusy = true;
    this.selectedRecord = this.relatedOptionService.selectedRecord;
    let bookmark: IBookmark = this.relatedOptionService.selectedAction.bookmark;

    // Get bookmark values
    // @ts-expect-error: TODO
    let keyNames = bookmark.keyNames.split(',');
    // @ts-expect-error: TODO
    let fieldNames = bookmark.fieldNames.split(',');
    let values: MIRecord = new MIRecord();

    for (let key of keyNames) {
      // @ts-expect-error: TODO
      if (this.selectedRecord[key]) {
        // @ts-expect-error: TODO
        values[key] = this.selectedRecord[key];
        // Special check for blank value
        // @ts-expect-error: TODO
      } else if (this.selectedRecord[key] === '') {
        // @ts-expect-error: TODO
        values[key] = this.selectedRecord[key];
        // Special check for zero value
        // @ts-expect-error: TODO
      } else if (this.selectedRecord[key] === 0) {
        // @ts-expect-error: TODO
        values[key] = this.selectedRecord[key];
      } else {
        const shortKey = key.substr(key.length - 4);
        // @ts-expect-error: TODO
        if (this.selectedRecord[shortKey]) {
          // @ts-expect-error: TODO
          values[key] = this.selectedRecord[shortKey];
          // Special check for blank value
          // @ts-expect-error: TODO
        } else if (this.selectedRecord[shortKey] === '') {
          // @ts-expect-error: TODO
          values[key] = this.selectedRecord[shortKey];
          // Special check for zero value
          // @ts-expect-error: TODO
        } else if (this.selectedRecord[shortKey] === 0) {
          // @ts-expect-error: TODO
          values[key] = this.selectedRecord[shortKey];
        } else {
          Log.error('Key value not found. Stop executing bookmark');
          return;
        }
      }
    }

    for (let field of fieldNames) {
      // @ts-expect-error: TODO
      if (this.selectedRecord[field]) {
        // @ts-expect-error: TODO
        values[field] = this.selectedRecord[field];
        // @ts-expect-error: TODO
      } else if (this.selectedRecord[field] === '') {
        // Special check for blank value
        // @ts-expect-error: TODO
        values[field] = this.selectedRecord[field];
        // @ts-expect-error: TODO
      } else if (this.selectedRecord[field] === 0) {
        // Special check for zero value
        // @ts-expect-error: TODO
        values[field] = this.selectedRecord[field];
      } else {
        const shortKey = field.substr(field.length - 4);
        // @ts-expect-error: TODO
        if (this.selectedRecord[shortKey]) {
          // @ts-expect-error: TODO
          values[field] = this.selectedRecord[shortKey];
          // @ts-expect-error: TODO
        } else if (this.selectedRecord[shortKey] === '') {
          // Special check for blank value
          // @ts-expect-error: TODO
          values[field] = this.selectedRecord[shortKey];
          // @ts-expect-error: TODO
        } else if (this.selectedRecord[shortKey] === 0) {
          // Special check for zero value
          // @ts-expect-error: TODO
          values[field] = this.selectedRecord[shortKey];
        } else {
          Log.error('Field value not found');
        }
      }
    }

    // Set bookmark
    bookmark.values = values;
    this.bookmark = bookmark;

    this.isReady = true;
  }

  /**
   *    Subscribes to the detail panels updateCompleteEmitter, so we know when the
   *    bookmark update has completed.
   */
  ngAfterViewInit() {
    this.subscription = this.detailPanel.updateCompleteEmitter.subscribe(
      (response) => {
        this.onUpdateComplete(response);
      }
    );
  }

  /**
   * Unsubscribes to observables and event emitters.
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Closes the contextual action panel used by the dialog.
   */
  onCancel() {
    this.relatedOptionService.panelRef.close(true);
  }

  /**
   * Calls the onSave method of the detail panel component. Triggered when the
   * dialogs save button is clicked.
   */
  onSave() {
    this.detailPanel.onSave();
  }

  /**
   * Called by the detail panel updateCompleteEmitter (subscribed to in the
   * ngAfterViewInit method). Shows a toast message saying "Action Completed"
   * and closes the dialog.
   */
  onUpdateComplete(response: IDetailPanelMessage) {
    if (response.type == PanelResult.Finished) {
      this.toastService.show({
        title: 'Action Completed',
        message: this.relatedOptionService.selectedAction.messageComplete,
        position: SohoToastService.TOP_RIGHT,
      });
      this.relatedOptionService.panelRef.close(true);
    } else if (response.type == PanelResult.Exit) {
      this.relatedOptionService.panelRef.close(true);
    }
  }

  /**
   * Triggers the busy indicator.
   * @param value
   */
  showBusyindicator(value: boolean) {
    this.isBusy = value;
  }
}
