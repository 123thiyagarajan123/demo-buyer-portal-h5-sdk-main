/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component } from '@angular/core';
import { Directive, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { Subscription } from 'rxjs';

import { CoreBase, MIRecord } from '@infor-up/m3-odin';

import { DemoRoutingStateService } from '../..';

/**
 * The GdisMiNavigationComponent should be used as parent class when you want to navigate to
 * a different page using routes.
 *
 * It subscribes to the activated routes queryparams and receives the selected record
 * as input. This is then used to pass the data to its child components.
 *
 */
@Component({
  selector: 'm3-mi-navigation',
  templateUrl: './mi-navigation.component.html',
  styleUrls: ['./mi-navigation.component.css'],
})
export class MiNavigationComponent extends CoreBase {
  qryParamsSubscription!: Subscription;
  selectedRecord!: MIRecord;
  searchField!: string;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected routingStateService: DemoRoutingStateService,
    // protected translate: TranslateService,
    protected zone: NgZone
  ) {
    super('MiNavigationComponent');
  }

  /**
   * Unsubscribes to observables and event emitters.
   */
  ngOnDestroy() {
    this.qryParamsSubscription.unsubscribe();
  }

  /**
   * Subscribes to the activated routes queryparams.
   */
  protected init() {
    this.qryParamsSubscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.onRouteNavigation(param);
      }
    );
  }

  /**
   *    This method is called when navigating away from the detail panel
   */
  public onNavigateBackClick() {
    // Navigate back
    const navigateBackTo: string = this.routingStateService.gotoPreviousUrl();
    let nav: NavigationExtras = {
      relativeTo: this.activatedRoute,
    };
    this.router.navigate([navigateBackTo], nav);
  }

  /**
   *    This method is called by the route params observable in the
   *    ngOnInit lifecycle method
   */
  protected onRouteNavigation(param: any) {
    if (Object.keys(param).length !== 0) {
      /**
       *    If TMTS is included we should refresh the component data...
       */
      if (param['TMTS']) {
        // Do nothing
      } else {
        /**
         *    ...else we should set the record
         */
        this.selectedRecord = param;
      }
    }
  }
}
