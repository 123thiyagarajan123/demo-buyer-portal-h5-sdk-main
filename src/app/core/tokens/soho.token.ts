import { inject, InjectionToken } from '@angular/core';

import 'ids-enterprise-ng';

import { WINDOW } from './window.token';

declare global {
  interface Window {
    Soho: SohoStatic;
  }
}

export const SOHO = new InjectionToken<SohoStatic>(
  'An abstraction over window.Soho object',
  {
    providedIn: 'root',
    factory: () => inject(WINDOW).Soho,
  }
);
