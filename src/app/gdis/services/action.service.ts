import { Injectable, ViewContainerRef } from '@angular/core';

import {
  SohoContextualActionPanelRef,
  SohoContextualActionPanelService,
  SohoToastService,
} from 'ids-enterprise-ng';

import { SidePanelActionsModalComponent } from '../components/side-panel/side-panel-actions-modal/side-panel-actions-modal.component';
import { IAction, IRelatedInformation } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  private _modalRef:
    | SohoContextualActionPanelRef<SidePanelActionsModalComponent>
    | undefined;
  private _modalParentRef: ViewContainerRef | undefined;

  private _action: IAction | undefined;
  private _relatedInformation: IRelatedInformation | undefined;

  constructor(
    private readonly toastService: SohoToastService,
    private readonly panelService: SohoContextualActionPanelService
  ) {}

  get modalRef() {
    return this._modalRef;
  }

  set modalRef(
    modalRef:
      | SohoContextualActionPanelRef<SidePanelActionsModalComponent>
      | undefined
  ) {
    this._modalRef = modalRef;
  }

  get modalParentRef() {
    return this._modalParentRef;
  }

  set modalParentRef(modalParentRef: ViewContainerRef | undefined) {
    this._modalParentRef = modalParentRef;
  }

  get action() {
    return this._action;
  }

  set action(action: IAction | undefined) {
    this._action = action;
  }

  get relatedInformation() {
    return this._relatedInformation;
  }

  set relatedInformation(relatedInformation: IRelatedInformation | undefined) {
    this._relatedInformation = relatedInformation;
  }

  executeAction(action: IAction, relatedInformation: IRelatedInformation) {
    // Stop execution if a) an option has been provided and b) no record has been selected
    const selectedRecord = relatedInformation.record;
    if (typeof action.bookmark.option != 'undefined' && !selectedRecord) {
      return this.toastService.show({
        title: 'No record selected',
        message: 'Please select a record before clicking on the link',
        position: SohoToastService.TOP_RIGHT,
      });
    }

    this.openModal();
  }

  openModal() {
    if (!this.modalParentRef) {
      return;
    }

    if (this.modalRef) {
      this.closeModal();
    }

    this.modalRef = this.panelService
      .contextualactionpanel(
        SidePanelActionsModalComponent,
        this.modalParentRef as any
      )
      .title('')
      .initializeContent(true)
      .open();
  }

  closeModal() {
    if (!this.modalRef) {
      return;
    }

    this.modalRef.close(true);
  }
}
