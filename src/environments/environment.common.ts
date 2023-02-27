import { Environment } from '@core/enums/environment.enum';
import { IEnvironment } from '@core/types/environment.type';

export const commonEnv: IEnvironment = {
  production: false,
  development: false,
  testing: false,
  environmentName: Environment.UNKNOWN,
  version: '1.3.0',
  title: 'demo-buyer-portal-h5-sdk',
  mne: '/mne/apps/',
  analyticsFILE: 'h5-sdk',
  analyticsPK01: 'ping',
  ids: {
    culturesPath: 'assets/ids-enterprise/js/cultures/',
  },
  transloco: {
    translationsPath: 'assets/i18n/',
    extensionType: '.json',
    config: {
      availableLangs: ['GB', 'DE', 'FR'],
      fallbackLang: ['GB'],
      defaultLang: 'GB',
      reRenderOnLangChange: true,
      prodMode: false,
    },
  },
};
