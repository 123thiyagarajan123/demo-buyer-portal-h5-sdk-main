import {
  EventEmitter,
  Injectable,
  Output,
  ViewContainerRef,
} from '@angular/core';

import {
  ArrayUtil,
  IBookmark,
  IMIRequest,
  IMIResponse,
  Log,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse, MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoContextualActionPanelRef } from 'ids-enterprise-ng';

import { GdisStore } from '../../../../index';
import { IContextEntity } from '../../../services/businesscontext/businesscontext.service';
import { DemoLaunchService } from '../../../services/launch/launch.service';
import { ICount } from '../types/count.type';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoButtonLinkService - TODO - better description of the service
 */
export class DemoCountService {
  @Output() countChange = new EventEmitter<ICount>();

  applicationName!: string;
  panelRef!: SohoContextualActionPanelRef<any>;
  placeHolder!: ViewContainerRef;
  selectedAction!: number;
  selectedCount!: ICount;

  constructor(
    private miService: MIService,
    private launchService: DemoLaunchService,
    private storeService: GdisStore
  ) {
    this.applicationName = this.storeService.state.environment.title;
  }
}
