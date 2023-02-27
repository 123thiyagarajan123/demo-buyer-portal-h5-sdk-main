import { Component, HostBinding, Input, OnDestroy } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { SidePanelService } from '../../index';

@Component({
  selector: 'h5-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent extends CoreBase implements OnDestroy {
  static _count: number;
  isNested = false;
  @Input() pageContainer = false;
  @Input() scrollable = false;
  @Input() scrollableFlex = false;
  @Input() twoColumn = false;
  @Input() threeColumn = false;
  @Input() fixed = false;
  @Input() both = false;

  @HostBinding('class.page-container') get isPageContainer() {
    return this.pageContainer;
  }

  @HostBinding('class.scrollable') get isScrollable() {
    return this.scrollable;
  }

  @HostBinding('class.scrollable-flex') get isScrollableFlex() {
    return this.scrollableFlex;
  }

  @HostBinding('class.two-column') get isTwoColumn() {
    return this.twoColumn;
  }

  @HostBinding('class.three-column') get isThreeColumn() {
    return this.threeColumn;
  }

  @HostBinding('class.fixed') get isFixed() {
    return this.fixed;
  }

  @HostBinding('class.both') get isBoth() {
    return this.both;
  }

  @HostBinding('attr.role') get role() {
    return 'main';
  }

  @HostBinding('attr.id') get id() {
    return 'maincontent';
  }

  static increaseCount() {
    this.count += 1;
  }

  static decreaseCount() {
    this.count -= 1;
  }

  static get count() {
    return this._count || 0;
  }

  static set count(v) {
    this._count = v;
  }

  constructor(private sidePanelService: SidePanelService) {
    super('MainComponent');

    MainComponent.increaseCount();
    this.isNested = MainComponent.count > 1 ? true : false;
  }

  ngOnDestroy(): void {
    // this.sidePanelService.isOpen = false;
    MainComponent.decreaseCount();
  }

  isOpen() {
    return this.sidePanelService.isOpen;
  }
}
