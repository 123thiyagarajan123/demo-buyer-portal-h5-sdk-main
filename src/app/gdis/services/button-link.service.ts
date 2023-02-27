import { Injectable } from '@angular/core';

import { ButtonLinkLevel } from '../index';

import { GdisStore } from '.';

@Injectable({
  providedIn: 'root',
})
export class ButtonLinkService {
  constructor(private store: GdisStore) {}

  get buttonLinkLevels() {
    return this.store.state.buttonLink.buttonLinkLevels;
  }

  get currentButtonLinkLevel() {
    return this.store.state.buttonLink.currentButtonLinkLevel;
  }

  set currentButtonLinkLevel(currentButtonLinkLevel: ButtonLinkLevel) {
    this.store.setButtonLink({ currentButtonLinkLevel });
  }
}
