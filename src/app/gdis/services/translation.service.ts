import { Injectable } from '@angular/core';

import {
  HashMap,
  TranslateParams,
  TranslocoScope,
  TranslocoService,
} from '@ngneat/transloco';
import { take } from 'rxjs/operators';

import { Log } from '@infor-up/m3-odin';

import { GdisStore } from './gdis.store';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private transloco: TranslocoService, private store: GdisStore) {}

  translate(
    key: TranslateParams,
    params?: HashMap<any> | undefined,
    lang?: string | undefined
  ) {
    return this.transloco.translate(key, params, lang);
  }

  selectTranslate(
    key: TranslateParams,
    params?: HashMap<any> | undefined,
    lang?: TranslocoScope,
    _isObject?: boolean | undefined
  ) {
    return this.transloco.selectTranslate(key, params, lang);
  }

  getAvailableLangs() {
    return this.transloco.getAvailableLangs() as string[];
  }

  getActiveLang() {
    return this.transloco.getActiveLang();
  }

  setActiveLang(lang: string | undefined) {
    if (!lang) {
      return;
    }

    const languageExists = this.getAvailableLangs().find(
      (existingLang) => existingLang === lang
    );
    if (!languageExists) {
      Log.info(`language not found in available languages: ${lang}`);
      return;
    }

    Log.info(`Set active language to: ${lang}`);
    this.transloco.setActiveLang(lang);
    this.store.setTranslation({ currentLanguage: lang });
  }

  load(lang: string) {
    Log.info(`Loading language: ${lang}`);
    return this.transloco.load(lang);
  }

  /**
   * Helper function to load feature translations
   */
  async loadFeatureTranslations(scope: TranslocoScope) {
    await this.transloco
      .selectTranslate('', {}, scope)
      .pipe(take(1))
      .toPromise();
  }
}
