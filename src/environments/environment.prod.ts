import { Environment } from '@core/enums/environment.enum';
import { IEnvironment } from '@core/types/environment.type';

import { commonEnv } from './environment.common';

const transloco = {
  ...commonEnv.transloco,
  config: {
    ...commonEnv.transloco.config,
    prodMode: true,
  },
};

const env: Partial<IEnvironment> = {
  production: true,
  environmentName: Environment.PROD,
  transloco,
};

export const environment = { ...commonEnv, ...env };
