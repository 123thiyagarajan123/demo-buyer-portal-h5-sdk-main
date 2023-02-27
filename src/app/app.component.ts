import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreBase } from '@infor-up/m3-odin';

import { SohoPersonalizeDirective } from 'ids-enterprise-ng';

import { SystemService } from '@core/services';
import { Outlet, Path } from '@core/enums';
import { IOutlet } from '@core/types';

import {
  LogLevel,
  Size,
  GdisStore,
  MessageService,
  TranslationService,
  UrlService,
  UserService,
  DebugService,
  HeaderService,
  LocaleService,
  SidePanelService,
  SizeService,
  ThemeService,
  SnapshotService,
  DeepLinkingService,
  AnalyticService,
} from '@gdis/api';

import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent extends CoreBase implements OnInit, OnDestroy {
  @ViewChild(SohoPersonalizeDirective, { static: true })
  private personalize!: SohoPersonalizeDirective;

  private readonly unsubscribe$: Subject<void> = new Subject();

  private readonly outlets: IOutlet[] = [
    {
      outlet: Outlet.Aside,
      path: Path.Shortcut,
    },
  ];

  store$ = this.store.state$;

  constructor(
    private readonly deepLinkingService: DeepLinkingService,
    private readonly snapshotService: SnapshotService,
    private readonly analyticService: AnalyticService,
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly urlService: UrlService,
    private readonly store: GdisStore,
    private readonly userService: UserService,
    private readonly localeService: LocaleService,
    private readonly themeService: ThemeService,
    private readonly sizeService: SizeService,
    private readonly headerService: HeaderService,
    private readonly sidePanelService: SidePanelService,
    private readonly systemService: SystemService,
    private readonly translationService: TranslationService,
    private readonly messageService: MessageService,
    private readonly debugService: DebugService,
    private readonly router: Router,
    private readonly zone: NgZone,
    private readonly ref: ChangeDetectorRef
  ) {
    super('AppComponent');
  }

  ngOnInit(): void {
    this.analyticService.ping();
    this.initialiseApplication();
    this.watchForUserContextUpdates();
    this.watchForNavigationUpdates();

    if (this.deepLinkingService.isDeepLink()) {
      this.deepLinkingService.navigateToDeepLinkUrl();
    } else {
      // normal navigating
      this.logInfo('Normal Navigating');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  // isOpen() {
  //   return this.sidePanelService.isOpen;
  // }

  // toggleSidePanel() {
  //   this.sidePanelService.toggle();

  //   if (this.sidePanelService.isOpen) {
  //     this.router.navigate([{ outlets: { [Outlet.Aside]: null } }], {
  //       relativeTo: this.route,
  //     });
  //   } else {
  //     this.router.navigate([{ outlets: { [Outlet.Aside]: [Path.Shortcut] } }], {
  //       relativeTo: this.route,
  //     });
  //   }
  // }

  initialiseApplication() {
    this.setLogLevel();

    this.setTitle();

    this.themeService.initialize(this.personalize);

    this.sizeService.setFormSize(Size.Small);
    this.sizeService.setRowSize(Size.Small);

    this.sidePanelService.isOpen = true;
    this.sidePanelService.resetWidth();

    this.headerService.showToolbar = true;
    this.headerService.showButtons = true;

    this.headerService.addButton({
      icon: 'url',
      text: 'Url',
      variant: 'icon',
      onClick: () => this.snapshotService.copyLink(),
    });

    this.headerService.addButton({
      icon: 'refresh',
      text: 'Restart',
      variant: 'icon',
      onClick: () => this.systemService.restartApplication(),
    });

    this.headerService.addButton({
      icon: 'help',
      text: 'About',
      variant: 'icon',
      onClick: () =>
        this.messageService
          .about()
          .appName(this.store.state.environment.title)
          .productName(this.store.state.environment.title)
          .version(`(${this.store.state.environment.version})`)
          .content(
            `<p>${this.translationService.translate('AboutContent')}</p>`
          )
          .open(),
    });

    this.headerService.addButton({
      icon: 'settings',
      text: 'Settings',
      variant: 'icon',
      onClick: () => this.router.navigate(['settings']),
    });

    this.headerService.addButton({
      icon: 'menu',
      text: 'Side panel',
      variant: 'icon',
      onClick: () => this.sidePanelService.toggle(),
    });
  }

  setLocale(locale: string | undefined) {
    if (!locale) {
      return;
    }
    this.zone.runOutsideAngular(() => {
      this.localeService.setLocale(locale).then(() => {
        this.zone.run(() => this.ref.markForCheck());
      });
    });
  }

  setLogLevel() {
    if (environment.development) {
      this.debugService.currentLogLevel = LogLevel.Debug;
    }
  }

  setTitle() {
    this.titleService.setTitle(this.store.state.environment.title);
  }

  watchForUserContextUpdates() {
    this.userService
      .getUserContext()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (userContext) => {
          this.themeService.setThemeColor(userContext.theme);
          this.translationService.setActiveLang(userContext.currentLanguage);
          this.setLocale(userContext.languageTag);
        },
      });
  }

  watchForNavigationUpdates() {
    this.urlService.observeUrl().pipe(takeUntil(this.unsubscribe$)).subscribe();
  }
}
