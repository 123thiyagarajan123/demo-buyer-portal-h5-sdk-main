import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  PRIMARY_OUTLET,
  Router,
  RouterEvent,
} from '@angular/router';

import { filter, tap } from 'rxjs/operators';

import { GdisStore } from './gdis.store';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor(
    private router: Router,
    private store: GdisStore,
    private location: Location
  ) {
    const url = this.router.url;
    this.store.setUrl({
      previous: url,
      current: url,
    });
  }

  observeUrl() {
    return this.router.events.pipe(
      filter((event): event is RouterEvent => event instanceof RouterEvent),
      tap({
        next: (routerEvent: RouterEvent) => {
          this.checkRouterEvent(routerEvent);
        },
      })
    );
  }

  private checkRouterEvent(routerEvent: RouterEvent) {
    if (routerEvent instanceof NavigationStart) {
      this.store.setUrl({
        isNavigating: true,
      });
    }

    if (routerEvent instanceof NavigationEnd) {
      const current = routerEvent.url;
      const previous = this.store.state.url.current;
      const history = routerEvent.urlAfterRedirects;
      this.store.setUrl({
        previous,
        current,
        history: [...this.store.state.url.history, history],
        isNavigating: false,
      });
    }

    if (
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      this.store.setUrl({
        isNavigating: false,
      });
    }
  }

  back(): void {
    const history = [...this.store.state.url.history];
    history.pop();
    this.store.setUrl({
      history: [...history],
    });
    if (history.length > 0) {
      this.location.back();
    } else {
      this.router.navigateByUrl('/');
    }
  }

  private toUrlTree(url: string) {
    return this.router.parseUrl(url);
  }

  toSegments(url: string) {
    const urlTree = this.toUrlTree(url);
    const segmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    let segments: string[] = [];
    if (segmentGroup) {
      segments = segmentGroup.segments.map((segment) => segment.path);
    }
    return segments;
  }
}
