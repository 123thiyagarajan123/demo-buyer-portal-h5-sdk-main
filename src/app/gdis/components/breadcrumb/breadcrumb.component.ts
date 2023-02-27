import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, PRIMARY_OUTLET, Router } from '@angular/router';

import { CoreBase } from '@infor-up/m3-odin';

import { GdisStore, UrlService } from '../../index';

@Component({
  selector: 'h5-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent extends CoreBase {
  @Input() alternate = true;
  @Input() backButton: (() => void) | null = null;
  @Input() scope: string | null = null;
  @Input() removeFirstUrl = false;

  store$ = this.store.state$;

  @HostBinding('class.scrollable-flex-header') get scrollableFlexHeader() {
    return true;
  }

  @HostBinding('class.has-breadcrumb') get hasBreadcrumb() {
    return !this.alternate;
  }

  @HostBinding('class.has-alternate-breadcrumb') get hasAlternateBreadcrumb() {
    return this.alternate;
  }

  constructor(
    private urlService: UrlService,
    private store: GdisStore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super('BreadcrumbComponent');
  }

  getUrls(url: string) {
    const urlTree = this.toUrlTree(url);
    let segmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    if (!segmentGroup) {
      return [];
    }

    const auxiliaryPaths = segmentGroup.hasChildren();
    if (this.scope && auxiliaryPaths) {
      let auxiliaryKey: string | null = null;
      // TODO handle case where scope is in multiple auxiliary paths
      for (const [key, value] of Object.entries(segmentGroup.children)) {
        const [segment] = value.segments;
        if (segment && segment.path === this.scope) {
          auxiliaryKey = key;
        }
      }

      if (auxiliaryKey) {
        segmentGroup = segmentGroup.children[auxiliaryKey];
      }
    }

    if (!segmentGroup) {
      return [];
    }

    const urls = segmentGroup.segments.map((segment) => segment.path);

    if (this.removeFirstUrl) {
      const [_, ...rest] = urls;
      return rest;
    }
    // const urls = this.urlService.toSegments(url);
    // if (this.scope) {
    //   const index = urls.findIndex((url: string) => url === this.scope);
    //   const scopeUrls = urls.slice(index);
    //   return scopeUrls;
    // }
    return urls;
  }

  private toUrlTree(url: string) {
    return this.router.parseUrl(url);
  }

  toSegmentsRelativeTo(url: string) {
    const urlTree = this.toUrlTree(url);
    const segmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    let segments: string[] = [];
    if (segmentGroup) {
      segments = segmentGroup.segments.map((segment) => segment.path);
    }
    return segments;
  }

  // getUrls(url: string) {
  //   const urls = this.urlService.toSegments(url);
  //   if (this.scope) {
  //     const index = urls.findIndex((url: string) => url === this.scope);
  //     const scopeUrls = urls.slice(index);
  //     return scopeUrls;
  //   }
  //   return urls;
  // }

  navigateTo() {
    // User handles the navigation
    if (typeof this.backButton === 'function') {
      return this.backButton();
    }

    // Navigate to previous url
    this.urlService.back();
  }

  isBackButton() {
    let value = false;
    if (this.backButton) {
      value = true;
    }
    return value;
  }
}
