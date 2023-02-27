import { Component, HostBinding, Input, OnDestroy } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

@Component({
  selector: 'h5-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css'],
})
export class FrameComponent extends CoreBase {
  @Input() sidebar = false;
  @Input() scrollableY = false;
  @Input() main = false;
  @Input() singleColumn = false;

  @HostBinding('class.main') get isMain() {
    return this.main;
  }

  @HostBinding('class.sidebar') get isSidebar() {
    return this.sidebar;
  }

  @HostBinding('class.scrollable-y') get isScrollableY() {
    return this.scrollableY;
  }

  @HostBinding('class.single-column') get isSingleColumn() {
    return this.singleColumn;
  }

  constructor() {
    super('FrameComponent');
  }
}
