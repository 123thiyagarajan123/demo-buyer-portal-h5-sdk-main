import { APP_INITIALIZER } from '@angular/core';

import {
  TRANSLOCO_CONFIG,
  translocoConfig,
  TRANSLOCO_LOADER,
} from '@ngneat/transloco';

import { TranslocoLoaderService } from '@core/services/transloco-loader.service';

import { TranslationService } from '@gdis/api';

import { environment } from '@environments/environment';

function initializeTranslationFactory(translationService: TranslationService) {
  return () => {
    const lang = environment.transloco.config?.defaultLang as string;
    translationService.setActiveLang(lang);
    return translationService.load(lang).toPromise();
  };
}

export const translationInitializer = {
  provide: APP_INITIALIZER,
  useFactory: initializeTranslationFactory,
  deps: [TranslationService],
  multi: true,
};

export const translationConfiguration = {
  provide: TRANSLOCO_CONFIG,
  useValue: translocoConfig(environment.transloco.config),
};

export const translationLoader = {
  provide: TRANSLOCO_LOADER,
  useClass: TranslocoLoaderService,
};
