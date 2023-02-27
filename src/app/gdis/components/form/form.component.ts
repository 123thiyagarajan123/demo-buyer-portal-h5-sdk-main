import { Component, HostBinding } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { SizeService, Size } from '../../index';

@Component({
  selector: 'h5-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent extends CoreBase {
  @HostBinding('class.form-layout-compact') get isSizeSmall() {
    return this.sizeService.getFormSize() === Size.Small;
  }

  constructor(private sizeService: SizeService) {
    super('FormComponent');
  }
}
