import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CoreBase } from '@infor-up/m3-odin';

import { SohoTabsComponent } from 'ids-enterprise-ng';

import { IHeader } from '../../../index';

@Component({
  selector: 'h5-header-tabs',
  templateUrl: './header-tabs.component.html',
  styleUrls: ['./header-tabs.component.css'],
})
export class HeaderTabsComponent extends CoreBase implements AfterViewInit {
  @Input() header!: IHeader;

  @ViewChild('tabset', { static: true })
  tabset?: SohoTabsComponent;

  constructor(private route: ActivatedRoute) {
    super('HeaderTabsComponent');
  }
  ngAfterViewInit(): void {
    // this.header.tabs.forEach((tab) => this.tabset?.select(tab.id as string));
    // this.tabset?.select('demo');
    // this.tabset?.select('demo');
    // this.tabset?.updated;
    // this.location.pathname;
    // this.route.routeConfig;

    const TODO = null;
  }

  onTabActivated(event: SohoTabsEvent) {
    setTimeout(() => {
      console.log('selected tab index is: ' + event.tab.tabIndex);
    }, 1);
  }
}
