import { Component, Input } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { IHeader, UrlService } from '../../../index';

@Component({
  selector: 'h5-header-custom-button',
  templateUrl: './header-custom-button.component.html',
  styleUrls: ['./header-custom-button.component.css'],
})
export class HeaderCustomButtonComponent extends CoreBase {
  @Input() header!: IHeader;

  constructor(private urlService: UrlService) {
    super('HeaderCustomButtonComponent');
  }

  navigateTo() {
    // User handles the navigation
    if (this.header.customButton?.onClick) {
      return this.header.customButton.onClick();
    }

    // Navigate to previous url
    this.urlService.back();
  }
}
