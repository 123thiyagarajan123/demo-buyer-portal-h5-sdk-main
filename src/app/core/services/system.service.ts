import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { WINDOW } from '@core/tokens/window.token';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  constructor(
    @Inject(WINDOW) readonly window: Window,
    private router: Router
  ) {}

  reloadComponent(url: string) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([url]);
  }

  async restartApplication() {
    await this.router.navigate(['/']);
    this.window.location.reload();
  }
}
