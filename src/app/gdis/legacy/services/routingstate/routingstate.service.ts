import { Router, NavigationEnd } from '@angular/router';
import { Injectable } from '@angular/core';

import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

/**
 * A service for routing
 */
export class DemoRoutingStateService {
  private history = [];

  constructor(private router: Router) {}

  public loadRouting(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      // @ts-expect-error: TODO
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        let url = urlAfterRedirects.split(/[?#]/)[0];
        // Don't add to the history if the last url is the same
        if (url != this.history[this.history.length - 1]) {
          // @ts-expect-error: TODO
          this.history = [...this.history, url];
        }
      });
  }

  /**
   * Returns the route history
   */
  public getHistory(): string[] {
    return this.history;
  }

  /**
   * Gets the previous url.
   */
  public getPreviousUrl(): string {
    let url = '';
    try {
      url = this.history[this.history.length - 2] || 'mashup';
      return url;
    } catch (err) {
      return '';
    }
  }

  /**
   * Goes to the previous url. Used by the navigation component to return to the previous panel
   */
  public gotoPreviousUrl(): string {
    let url = '';
    try {
      url = this.history[this.history.length - 2] || 'mashup';
      this.history.length--;
      return url;
    } catch (err) {
      this.history = [];
      return '';
    }
  }
}
