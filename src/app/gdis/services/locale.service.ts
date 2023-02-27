import { ChangeDetectorRef, Inject, Injectable, NgZone } from '@angular/core';

import { Log } from '@infor-up/m3-odin';

import { SOHO } from '@core/tokens/soho.token';

import { GdisStore } from '..';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  constructor(
    @Inject(SOHO) readonly Soho: SohoStatic,
    private globalStore: GdisStore
  ) {}

  getCurrentLocale() {
    return Soho.Locale.currentLocale.name;
  }

  setCulturesPath(culturesPath: string) {
    this.Soho.Locale.culturesPath = culturesPath;
  }

  async setLocale(locale: string | undefined) {
    if (!locale) {
      return;
    }

    const currentLocale = this.getCurrentLocale();
    if (currentLocale === locale) {
      return;
    }

    await this.Soho.Locale.set(locale)
      .then(() => {
        Log.info(`IDS locale set to: ${locale}`);
        this.globalStore.setLocale({ currentLocale: locale });
      })
      .catch((error: any) => Log.error('Failed to set IDS locale', error));
  }
}
