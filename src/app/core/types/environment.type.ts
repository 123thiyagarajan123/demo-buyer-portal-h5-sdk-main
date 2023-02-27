import { TranslocoConfig } from '@ngneat/transloco';

import { Environment } from '@core/enums/environment.enum';

export interface ITransloco {
  translationsPath: string;
  extensionType: string;
  config: Partial<TranslocoConfig>;
}

export interface IEnvironment {
  production: boolean;
  development: boolean;
  testing: boolean;
  environmentName: Environment;
  version: string;
  title: string;
  analyticsFILE: string;
  analyticsPK01: string;
  mne: string;
  ids: {
    culturesPath: string;
  };
  transloco: Partial<ITransloco>;
}
