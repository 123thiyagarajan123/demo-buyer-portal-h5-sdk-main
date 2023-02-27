import { EventEmitter, Injectable } from '@angular/core';

import {
  IAction,
  ICustomAction,
  IDrillBack,
  IRelatedInformation,
} from '../types';

import { GdisStore } from './gdis.store';

@Injectable({
  providedIn: 'root',
})
export class ShortcutService {
  constructor(private store: GdisStore) {}

  customActionClickedEvent: EventEmitter<ICustomAction> = new EventEmitter();

  get actions() {
    return this.store.state.shortcut.actions;
  }

  set actions(actions: IAction[]) {
    this.store.setShortcut({
      actions: [...actions],
    });
  }

  get customActions() {
    return this.store.state.shortcut.customActions;
  }

  set customActions(customActions: ICustomAction[]) {
    this.store.setShortcut({
      customActions: [...customActions],
    });
  }

  get drillBacks() {
    return this.store.state.shortcut.drillBacks;
  }

  set drillBacks(drillBacks: IDrillBack[]) {
    this.store.setShortcut({
      drillBacks: [...drillBacks],
    });
  }

  get relatedInformations() {
    return this.store.state.shortcut.relatedInformations;
  }

  set relatedInformations(relatedInformations: IRelatedInformation[]) {
    this.store.setShortcut({
      relatedInformations: [...relatedInformations],
    });
  }

  get currentRecord() {
    return this.store.state.shortcut.currentRecord;
  }

  set currentRecord(currentRecord: IRelatedInformation | null) {
    this.store.setShortcut({
      currentRecord: currentRecord,
    });
  }

  /**
   * TODO
   * list and/or detail component will call this.
   * Shortcut component will subscribe and show this.relatedInformations
   */
  setRelatedInformation(relatedInformation: IRelatedInformation) {
    const exists = this.relatedInformations.find(
      (x) => x.name === relatedInformation.name
    );

    // Only add relatedInformation if it does not exist in array
    if (exists) {
      return;
    }

    // Add
    this.relatedInformations = [
      ...this.relatedInformations,
      relatedInformation,
    ];
  }

  /**
   * TODO
   * list and/or detail component will call this.
   * Shortcut component will subscribe and show this.relatedInformations
   */
  removeRelatedInformation(relatedInformation: IRelatedInformation) {
    // Remove the relatedInformation if it exists
    const filtered = this.relatedInformations.filter(
      (x) => x.name !== relatedInformation.name
    );

    this.relatedInformations = [...filtered];
  }

  /**
   * TODO
   * list and/or detail component will call this. Indicating that that the MIRecord for a related information object has been set
   * Shortcut component will subscribe and show this.relatedInformations
   */
  setSelectedRecord(relatedInformation: IRelatedInformation) {
    this.currentRecord = relatedInformation;
  }

  /**
   * TODO
   * list and/or detail component will call this. event indicating that a custom action has been clicked
   * Shortcut component will subscribe and show this.relatedInformations
   */
  customActionClicked(customAction: ICustomAction) {
    // TODO
    this.customActionClickedEvent.emit(customAction);
  }
}
