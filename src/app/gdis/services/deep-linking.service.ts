import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Log } from '@infor-up/m3-odin';

import { GdisStore } from '.';

@Injectable({
  providedIn: 'root',
})
export class DeepLinkingService {
  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private store: GdisStore
  ) {}

  set deeplinkUrl(url: string) {
    this.store.setDeepLink({ url });
  }

  get deeplinkUrl() {
    return this.store.state.deepLink.url;
  }

  getPath() {
    return this.location.path();
  }

  isDeepLink() {
    let url = this.getPath();
    if (url.endsWith(`?snapshot=true`)) {
      url = url.replace('?snapshot=true', '');
      this.deeplinkUrl = url;
      return true;
    }
    return false;
  }

  navigateToDeepLinkUrl() {
    Log.info('Deeplinking to: ' + this.deeplinkUrl);
    this.router.navigateByUrl(this.deeplinkUrl);
  }
}
