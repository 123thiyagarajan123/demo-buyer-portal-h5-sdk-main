import { IUserContext } from '@infor-up/m3-odin';

import { IEnvironment } from '@core/types';

import { IDebug } from './debug.type';
import { IHeader } from './header.type';
import { ILocale } from './locale.type';
import { IShortcut } from './shortcut.type';
import { ISidePanel } from './side-panel.type';
import { ISize } from './size.type';
import { ITheme } from './theme.type';
import { ITranslation } from './translation.type';
import { IUrl } from './url.type';
import { IDeepLink } from './deep-link.type';
import { IMonitor } from './monitor.type';
import { IButtonLink } from './button-link.type';

export interface IGdisStore {
  environment: IEnvironment;
  userContext: IUserContext | null;
  header: IHeader;
  sidePanel: ISidePanel;
  shortcut: IShortcut;
  debug: IDebug;
  monitor: IMonitor;
  size: ISize;
  theme: ITheme;
  locale: ILocale;
  url: IUrl;
  translation: ITranslation;
  deepLink: IDeepLink;
  buttonLink: IButtonLink;
}
