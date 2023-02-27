import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

@Component({
  selector: 'h5-side-panel-button',
  templateUrl: './side-panel-button.component.html',
  styleUrls: ['./side-panel-button.component.css'],
})
export class SidePanelButtonComponent extends CoreBase {
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }

  constructor() {
    super('SidePanelButtonComponent');
  }
}
