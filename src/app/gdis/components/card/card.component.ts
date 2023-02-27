import { Component, HostBinding, Input, OnDestroy } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

@Component({
  selector: 'h5-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent extends CoreBase {
  @Input() autoHeight = false;
  @Input() doubleHeight = false;

  @HostBinding('class.card') get isMain() {
    return true;
  }

  @HostBinding('class.auto-height') get isAutoHeight() {
    return this.autoHeight;
  }

  @HostBinding('class.double-height') get isDoubleHeight() {
    return this.doubleHeight;
  }

  constructor() {
    super('FrameComponent');
  }
}
