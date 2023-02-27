import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { CoreBase, MIRecord } from '@infor-up/m3-odin';

import { DemoMonitorService } from '../../services/monitor.service';
import { IMonitor } from '../../types/monitor.type';

/**
 * TODO: Describe the monitor component
 *
 */
@Component({
  selector: 'm3-monitor',
  styleUrls: ['./monitor.component.css'],
  templateUrl: './monitor.component.html',
})
/**
 *
 * This is a base class for showing M3 monitor data
 *
 */
export class DemoMonitorComponent extends CoreBase implements OnInit {
  @Input() monitor!: IMonitor;
  @Input() selectedParentRecord!: MIRecord;

  badgeColor!: string;
  isBusy!: boolean;

  constructor(private monitorService: DemoMonitorService) {
    super('MonitorComponent');
  }

  ngOnInit(): void {
    this.loadMonitor();
  }

  loadMonitor() {
    this.monitor.recordCount = '';
    this.isBusy = true;
    this.monitorService
      .setRecordCount(this.monitor, this.selectedParentRecord)
      .then(([monitorResponse, formResponse]) => {
        console.log(monitorResponse);
      })
      .catch((error) => {})
      .finally(() => {
        this.isBusy = false;
        this.badgeColor = this.monitorService.getBadgeColor(this.monitor);
      });
  }

  getBadgeColor(): string {
    return this.monitorService.getBadgeColor(this.monitor);
  }
}
