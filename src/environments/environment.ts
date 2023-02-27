import { Environment } from '@core/enums/environment.enum';
import { IEnvironment } from '@core/types/environment.type';

import { commonEnv } from './environment.common';

const env: Partial<IEnvironment> = {
  development: true,
  environmentName: Environment.DEV,
};

export const environment = { ...commonEnv, ...env };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
