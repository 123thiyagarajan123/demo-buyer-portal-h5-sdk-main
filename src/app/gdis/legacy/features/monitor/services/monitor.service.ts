import {
  EventEmitter,
  Injectable,
  Output,
  ViewContainerRef,
} from '@angular/core';

import { IFormResponse, MIRecord } from '@infor-up/m3-odin';

import { SohoContextualActionPanelRef } from 'ids-enterprise-ng';

import { GdisStore } from '../../../../index';
import { ProgramService } from '../../../services/program/program.service';
import { IMonitorGroup } from '../types/monitor-group.type';
import { IMonitor } from '../types/monitor.type';

import { DemoReplaceVariableService } from './replace-variable.service';
import { DemoSearchMacroService } from './search-macro.service';

@Injectable({
  providedIn: 'root',
})
export class DemoMonitorService {
  @Output() monitorChange = new EventEmitter<IMonitor>();
  @Output() monitorGroupChange = new EventEmitter<IMonitorGroup>();

  applicationName!: string;
  panelRef!: SohoContextualActionPanelRef<any>;
  panelRef2!: SohoContextualActionPanelRef<any>;
  placeHolder!: ViewContainerRef;
  selectedAction!: number;
  selectedMonitor!: IMonitor;
  selectedMonitorGroup!: IMonitorGroup;

  constructor(
    private programService: ProgramService,
    private replaceVariableService: DemoReplaceVariableService,
    private searchMacroService: DemoSearchMacroService,
    private storeService: GdisStore
  ) {
    this.applicationName = this.storeService.state.environment.title;
  }

  async setRecordCount(monitor: IMonitor, record: MIRecord) {
    let iid: any;
    let sid: any;
    let response: IFormResponse;

    try {
      // Run program
      response = await this.programService
        .runProgram(monitor.program)
        .toPromise();
      iid = response.instanceId;
      sid = response.sessionId;
      if (!response.panel) {
        throw 'no panel';
      }

      // Set inquiry type
      response = await this.programService
        .setInquiryType(sid, iid, monitor.sortingOrder, monitor.view)
        .toPromise();

      if (!response.panel) {
        throw 'no panel';
      }

      let query = '';
      query = this.searchMacroService.processSearchMacros(monitor.query);
      query = this.replaceVariableService.replace(query, record);

      // Search program
      response = await this.programService
        .searchProgram(
          sid,
          iid,
          response.panel,
          query,
          monitor.sortingOrder,
          monitor.view
        )
        .toPromise();

      if (!response.panel) {
        throw 'no panel';
      }

      // Calculate record count
      monitor.recordCount = response.panel.list.items.length.toString();
      // if (monitor.recordCount == '100') {
      //   monitor.recordCount += '+';
      // }
    } catch (err) {
      monitor.recordCount = '0';
      // Maybe throw error here and handle it in monitor component
    } finally {
      const x = await this.programService.closeProgram(sid, iid).toPromise();

      return [monitor, x];
    }
  }

  getBadgeColor(monitor: IMonitor): string {
    let badgeColor = '';
    if (monitor.severityArrays) {
      if (monitor.severityArrays.length == 2) {
        if (
          monitor.severityArrays[0].length == 4 &&
          monitor.severityArrays[1].length
        ) {
          const higherThanArray = monitor.severityArrays[0];
          const lowerThanArray = monitor.severityArrays[1];
          if (monitor.recordCount) {
            // Set badge color
            if (
              monitor.recordCount > higherThanArray[0] &&
              monitor.recordCount < lowerThanArray[0]
            ) {
              badgeColor = 'blue';
            } else if (
              monitor.recordCount > higherThanArray[1] &&
              monitor.recordCount < lowerThanArray[1]
            ) {
              badgeColor = 'green';
            } else if (
              monitor.recordCount > higherThanArray[2] &&
              monitor.recordCount < lowerThanArray[2]
            ) {
              badgeColor = 'yellow';
            } else if (
              monitor.recordCount > higherThanArray[3] &&
              monitor.recordCount < lowerThanArray[3]
            ) {
              badgeColor = 'red';
            }
          }
        }
      }
    }
    return badgeColor;
  }
}
