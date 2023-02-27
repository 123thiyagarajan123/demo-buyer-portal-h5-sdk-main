import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';

import { LocaleService } from '@gdis/api';

import { environment } from '@environments/environment';

function initializeLocaleFactory(localeService: LocaleService, locale: string) {
  return () => {
    localeService.setCulturesPath(environment.ids.culturesPath);
    return localeService.setLocale(locale);
  };
}

export const localeInitializer = {
  provide: APP_INITIALIZER,
  useFactory: initializeLocaleFactory,
  deps: [LocaleService, LOCALE_ID],
  multi: true,
};
