import { Injectable, EventEmitter, ViewContainerRef } from '@angular/core';

import { MIRecord, IBookmark, Log } from '@infor-up/m3-odin';

import { SohoContextualActionPanelRef } from 'ids-enterprise-ng';

import {
  IAction,
  ICustomAction,
  IDrillBack,
  IRelatedInformation,
} from '../../../index';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoRelatedOptionService is used by listpanels and detailpanels to communicate
 * with the DemoRelatedOptionComponent (the component that owns the sidebar)
 */
export class DemoRelatedOptionService {
  actions: IAction[] = [];
  customActions: ICustomAction[] = [];
  bookmark!: IBookmark;
  drillBacks: IDrillBack[] = [];
  relatedInformations: IRelatedInformation[] = [];

  selectedAction!: IAction;
  selectedRecord!: MIRecord;

  /**
   * These variables are used to show a contextual dialog
   */
  /**
   * These variables are used to show a contextual dialog
   */
  panelRef!: SohoContextualActionPanelRef<any>;
  placeHolder!: ViewContainerRef;

  /**
   * Event emitters
   */
  customActionClickedEvent: EventEmitter<ICustomAction> = new EventEmitter();
  relatedInformationChangedEvent: EventEmitter<IRelatedInformation[]> =
    new EventEmitter();
  recordSelectedEvent: EventEmitter<IRelatedInformation> = new EventEmitter();

  constructor() {}

  /**
   * Emits an event indicating that a custom action has been clicked
   * @param customAction
   */
  customActionClicked(customAction: ICustomAction) {
    this.customActionClickedEvent.emit(customAction);
  }

  /**
   * Emits an event indicating that a related information object has been removed.
   * Used by the list component and the detail component.
   * The relatedsChangedEvent is subscribed to by the related option component, which displays all
   * related options in the sidebar
   * @param relatedInformation
   */
  removeRelatedInformation(relatedInformation: IRelatedInformation) {
    try {
      const index = this.relatedInformations
        .map((e) => e.name)
        .indexOf(relatedInformation.name);
      if (index >= 0) {
        this.relatedInformations.splice(index, 1);
        this.relatedInformationChangedEvent.emit(this.relatedInformations);
      }
    } catch (err) {
      Log.info('The related object is invalid');
    }
  }

  /**
   * Emits an event indicating that a related information object has been loaded.
   * Used by the list component and the detail component.
   * The relatedsChangedEvent is subscribed to by the related option component, which displays all
   * related options in the sidebar
   * @param relatedInformation
   */
  setRelatedInformation(relatedInformation: IRelatedInformation) {
    try {
      const index = this.relatedInformations
        .map((e) => e.name)
        .indexOf(relatedInformation.name);
      if (index == -1) {
        this.relatedInformations.push(relatedInformation);
        // Sort alphanumerically
        this.relatedInformations.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else {
            return -1;
          }
        });
        this.relatedInformationChangedEvent.emit(this.relatedInformations);
      }
    } catch (err) {
      Log.info('The related object is invalid');
    }
  }

  /**
   * Emits an event indicating that that the MIRecord for a related information object has been
   * set.
   * Used by the list component and the detail component.
   * The recordSelectedEvent is subscribed to by the related option component, which displays all
   * related options in the sidebar
   * @param relatedInformation
   */
  setSelectedRecord(relatedInformation: IRelatedInformation) {
    this.recordSelectedEvent.emit(relatedInformation);
  }
}
