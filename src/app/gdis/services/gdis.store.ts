import { Injectable } from '@angular/core';

import { IUserContext, Log } from '@infor-up/m3-odin';

import { IMonitor } from '@gdis/types/monitor.type';

import {
  ButtonLinkLevel,
  IButtonLink,
  IDebug,
  IShortcut,
  ISidePanel,
  ISize,
  ITranslation,
  MonitorLevel,
} from '../index';
import { environment } from '@environments/environment';
import { Store } from '../models';
import { IGdisStore } from '../types/gdis-store.type';
import { IHeader } from '../types/header.type';
import { ILocale, ITheme, IUrl, LogLevel, Size } from '..';
import { IDeepLink } from '../types/deep-link.type';

@Injectable({
  providedIn: 'root',
})
export class GdisStore extends Store<IGdisStore> {
  constructor() {
    super({
      environment: environment,
      userContext: null,
      header: {
        hasToolbar: false,
        isTitleFavor: false,
        hasTitle: true,
        title: environment.title,
        subTitle: null,
        customButton: null,
        hasTabs: false,
        showToolbar: false,
        showTabs: false,
        tabs: [],
        showButtons: false,
        buttons: [],
      },
      sidePanel: {
        width: '250px',
        isOpen: false,
      },
      shortcut: {
        actions: [],
        customActions: [],
        drillBacks: [],
        relatedInformations: [],
        currentRecord: null,
      },
      debug: {
        logLevels: [
          LogLevel.Trace,
          LogLevel.Warning,
          LogLevel.Debug,
          LogLevel.Error,
          LogLevel.Fatal,
          LogLevel.Info,
        ],
        currentLogLevel: Log.level,
      },
      size: {
        sizes: [Size.Small, Size.Compact, Size.Large],
        formSize: null,
        rowSize: null,
      },
      theme: {
        themeColors: null,
        themeModes: null,
        currentThemeMode: null,
        currentThemeColor: null,
      },
      locale: {
        currentLocale: null,
      },
      url: {
        current: '',
        previous: '',
        history: [],
        isNavigating: false,
      },
      translation: {
        currentLanguage: null,
      },
      deepLink: {
        url: '',
      },
      monitor: {
        monitorLevels: [MonitorLevel.Read, MonitorLevel.Edit],
        currentMonitorLevel: MonitorLevel.Read,
      },
      buttonLink: {
        buttonLinkLevels: [ButtonLinkLevel.Read, ButtonLinkLevel.Edit],
        currentButtonLinkLevel: ButtonLinkLevel.Read,
      },
    });
  }

  setHeader(header: Partial<IHeader>): void {
    this.setState({
      ...this.state,
      header: {
        ...this.state.header,
        ...header,
      },
    });
  }

  setSidePanel(sidePanel: Partial<ISidePanel>): void {
    this.setState({
      ...this.state,
      sidePanel: {
        ...this.state.sidePanel,
        ...sidePanel,
      },
    });
  }

  setDebug(debug: Partial<IDebug>): void {
    this.setState({
      ...this.state,
      debug: {
        ...this.state.debug,
        ...debug,
      },
    });
  }

  setSize(size: Partial<ISize>): void {
    this.setState({
      ...this.state,
      size: {
        ...this.state.size,
        ...size,
      },
    });
  }

  setTheme(themes: Partial<ITheme>): void {
    this.setState({
      ...this.state,
      theme: {
        ...this.state.theme,
        ...themes,
      },
    });
  }

  setLocale(locale: Partial<ILocale>): void {
    this.setState({
      ...this.state,
      locale: {
        ...this.state.locale,
        ...locale,
      },
    });
  }

  setUrl(url: Partial<IUrl>): void {
    this.setState({
      ...this.state,
      url: {
        ...this.state.url,
        ...url,
      },
    });
  }

  setUserContext(userContext: IUserContext): void {
    this.setState({
      ...this.state,
      userContext: userContext,
    });
  }

  setTranslation(translation: Partial<ITranslation>): void {
    this.setState({
      ...this.state,
      translation: {
        ...this.state.translation,
        ...translation,
      },
    });
  }

  setDeepLink(deepLink: Partial<IDeepLink>): void {
    this.setState({
      ...this.state,
      deepLink: {
        ...this.state.deepLink,
        ...deepLink,
      },
    });
  }

  setShortcut(shortcut: Partial<IShortcut>): void {
    this.setState({
      ...this.state,
      shortcut: {
        ...this.state.shortcut,
        ...shortcut,
      },
    });
  }

  setMonitor(monitor: Partial<IMonitor>): void {
    this.setState({
      ...this.state,
      monitor: {
        ...this.state.monitor,
        ...monitor,
      },
    });
  }

  setButtonLink(buttonLink: Partial<IButtonLink>): void {
    this.setState({
      ...this.state,
      buttonLink: {
        ...this.state.buttonLink,
        ...buttonLink,
      },
    });
  }
}
