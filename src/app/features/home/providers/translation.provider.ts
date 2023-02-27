import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { Config } from '../enums';
import { loader } from '../utils';

export const translationConfiguration = {
  provide: TRANSLOCO_SCOPE,
  useValue: {
    scope: Config.Scope,
    loader,
  },
};
