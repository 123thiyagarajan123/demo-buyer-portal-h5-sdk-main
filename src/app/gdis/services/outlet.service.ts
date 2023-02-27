import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Log } from '@infor-up/m3-odin';

@Injectable({
  providedIn: 'root',
})
export class OutletService {
  constructor(private readonly router: Router) {}

  isActive(outlet: string, route: ActivatedRoute) {
    return route.snapshot.children.find(
      (x) => x.routeConfig?.outlet === outlet
    );
  }

  pathForOutlet(outlet: string, route: ActivatedRoute) {
    const match = route.snapshot.children.find(
      (x) => x.routeConfig?.outlet === outlet
    );

    // Log.info('Deeplinking to: ' + url);

    return match?.routeConfig?.path;
  }

  // updateOutlets(
  //   currentOutlets: { outlet: string; path: string }[],
  //   route: ActivatedRoute
  // ) {
  //   const outlets: { [key: string]: (string | null)[] } = {};

  //   for (const outlet of currentOutlets) {
  //     const isActive = this.isActive(outlet.outlet, route);

  //     if (!isActive) {
  //       outlets[outlet.outlet] = [outlet.path];
  //     }
  //   }

  //   this.router.navigate([{ outlets }], {
  //     relativeTo: route,
  //     queryParamsHandling: 'merge',
  //   });
  // }

  // updateOutlets({
  //   outlets,
  //   extras,
  // }: {
  //   outlets: { [key: string]: string[] }[];
  //   extras?: NavigationExtras;
  // }) {
  //   // const outlets: { [key: string]: (string | null)[] } = {};
  //   this.router.navigate([{ outlets: { [Outlet.Tab]: [Path.Order] } }], extras);
  // }
}
