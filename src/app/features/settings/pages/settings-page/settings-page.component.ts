import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';

import { CoreBase } from '@infor-up/m3-odin';

import { Tab } from '@features/settings/enums';

import { GdisStore, HeaderService } from '@gdis/api';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css'],
})
export class SettingsPageComponent
  extends CoreBase
  implements OnInit, OnDestroy
{
  private readonly unsubscribe$: Subject<void> = new Subject();
  store$ = this.store.state$;
  Tab = Tab;

  constructor(
    private store: GdisStore,
    private headerService: HeaderService,
    private router: Router
  ) {
    super('SettingsPageComponent');
  }

  ngOnInit() {
    this.setupHeader();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.resetHeader();
  }

  setupHeader() {
    const previousUrl = this.store.state.url.previous;
    this.headerService.customButton = {
      onClick: () => this.router.navigateByUrl(previousUrl),
      icon: 'left-arrow',
      text: 'Go back',
    };
    const menuButton = this.headerService
      .getButtons()
      .find((x) => x.icon === 'menu');
    if (menuButton) {
      menuButton.disabled = true;
    }

    const settingsButton = this.headerService
      .getButtons()
      .find((x) => x.icon === 'settings');
    if (settingsButton) {
      settingsButton.disabled = true;
    }
  }

  resetHeader() {
    this.headerService.customButton = null;

    const menuButton = this.headerService
      .getButtons()
      .find((x) => x.icon === 'menu');
    if (menuButton) {
      menuButton.disabled = false;
    }

    const settingsButton = this.headerService
      .getButtons()
      .find((x) => x.icon === 'settings');
    if (settingsButton) {
      settingsButton.disabled = false;
    }
  }
}
