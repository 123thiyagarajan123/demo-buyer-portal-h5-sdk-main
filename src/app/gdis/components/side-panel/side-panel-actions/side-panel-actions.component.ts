import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { IAction, IRelatedInformation, ActionService } from '../../../index';

@Component({
  selector: 'h5-side-panel-actions',
  templateUrl: './side-panel-actions.component.html',
  styleUrls: ['./side-panel-actions.component.css'],
})
export class SidePanelActionsComponent extends CoreBase implements OnInit {
  @Input() relatedInformation!: IRelatedInformation;

  @ViewChild('modalParentRef', { read: ViewContainerRef, static: true })
  modalParentRef?: ViewContainerRef;

  constructor(private readonly actionService: ActionService) {
    super('SidePanelActionsComponent');
  }

  ngOnInit(): void {
    this.actionService.modalParentRef = this.modalParentRef;
  }

  /**
   * This method is called when the user clicks an Action. It launches an IDS
   * dialog showing detail panel fields retrieved with the Actions bookmark.
   * @param action
   * @param relatedInformation
   */
  executeAction(action: IAction, relatedInformation: IRelatedInformation) {
    this.actionService.action = action;
    this.actionService.relatedInformation = relatedInformation;
    this.actionService.executeAction(action, relatedInformation);
  }
}
