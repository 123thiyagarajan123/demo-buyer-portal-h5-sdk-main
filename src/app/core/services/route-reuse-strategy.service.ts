import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (route?.routeConfig?.data?.alwaysRefresh === false) {
      return true;
    }

    return false;
  }

  store(
    route: ActivatedRouteSnapshot,
    detachedTree: DetachedRouteHandle
  ): void {
    const key = this.getRouteKey(route);
    this.storedRoutes.set(key, detachedTree);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return (
      !!route.routeConfig && !!this.storedRoutes.get(this.getRouteKey(route))
    );
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.getRouteKey(route);
    return this.storedRoutes.get(key) as DetachedRouteHandle;
  }

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private routeToUrl(route: ActivatedRouteSnapshot): string {
    if (route.url) {
      if (route.url.length) {
        return route.url.join('/');
      } else {
        if (typeof route.component === 'function') {
          return `[${route.component.name}]`;
        } else if (typeof route.component === 'string') {
          return `[${route.component}]`;
        } else {
          return `[null]`;
        }
      }
    } else {
      return '(null)';
    }
  }

  private getChildRouteKeys(route: ActivatedRouteSnapshot): string {
    let url = this.routeToUrl(route);
    return route.children.reduce(
      (fin, cr) => (fin += this.getChildRouteKeys(cr)),
      url
    );
  }

  private getRouteKey(route: ActivatedRouteSnapshot) {
    let url =
      route.pathFromRoot.map((it) => this.routeToUrl(it)).join('/') + '*';
    url += route.children.map((cr) => this.getChildRouteKeys(cr));
    return url;
  }
}
