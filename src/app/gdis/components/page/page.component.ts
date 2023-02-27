import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { CoreBase } from '@infor-up/m3-odin';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})
export class PageComponent extends CoreBase implements OnInit {
  protected state?: { [key: string]: any };

  protected queryParams!: Params;
  protected params!: Params;
  private outlets: {
    outlet: string;
    path: string;
  }[] = [];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location
  ) {
    super('PageComponent');

    this.route = route;
    this.router = router;

    this.goBack = this.goBack.bind(this);

    const navigation = router.getCurrentNavigation();
    this.state = navigation?.extras.state;
  }

  ngOnInit(): void {
    this.activateOutlets(this.outlets);

    // Listen to query parameter changes
    // this.route.queryParams.subscribe(
    //   (queryParams) => (this.queryParams = queryParams)
    // );

    // Listen to parameter changes
    // this.route.params.subscribe((params) => {
    //   this.params = params;
    //   this.updateState();
    // });

    // Listen to data changes
    // this.route.data.subscribe((data) => this.onData(data));
  }

  protected registerOutlets(outlets: { outlet: string; path: string }[]) {
    this.outlets = [...outlets];
  }

  protected updateState() {
    const newState = this.location.getState() as { [key: string]: any };
    console.log('newState:');
    console.log(newState);
    this.state = newState;
    this.onUpdateState(newState);
  }

  protected onUpdateState(newState: { [key: string]: any }) {}

  protected onData(data: Data) {}

  protected goBack(steps: number = 1) {
    const numberOfSteps = Array.from(Array(steps)).map((x) => '..');
    this.router.navigate(numberOfSteps, {
      relativeTo: this.route,
    });
  }

  protected getCurrentPathForOutlet(outlet: string, route: ActivatedRoute) {
    const match = route.snapshot.children.find(
      (x) => x.routeConfig?.outlet === outlet
    );

    return match?.routeConfig?.path;
  }

  private activateOutlets(currentOutlets: { outlet: string; path: string }[]) {
    const outlets: { [key: string]: string[] } = {};

    for (const outlet of currentOutlets) {
      const isOutlet = this.route.snapshot.children.find(
        (x) => x.routeConfig?.outlet === outlet.outlet
      );

      if (!isOutlet) {
        outlets[outlet.outlet] = [outlet.path];
      }
    }

    this.router.navigate([{ outlets }], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
    });
  }

  private updateOutlet(outlet: string, value: (string | null)[]) {
    const outlets: { [key: string]: (string | null)[] } = {};

    outlets[outlet] = value;

    this.router.navigate([{ outlets }], {
      relativeTo: this.route,
    });
  }
}
