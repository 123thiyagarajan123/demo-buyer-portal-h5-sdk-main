import { Component, Input } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

@Component({
  selector: 'app-lorem',
  templateUrl: './lorem.component.html',
  styleUrls: ['./lorem.component.css'],
})
export class LoremComponent extends CoreBase {
  @Input() count = 1;

  constructor() {
    super('LoremComponent');
  }

  numberOfTimes(count: number) {
    return Array.from(Array(count));
  }
}
