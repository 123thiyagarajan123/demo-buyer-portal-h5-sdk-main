import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CoreBase } from '@infor-up/m3-odin';

import { DemoMonitorService } from '../../services/monitor.service';

@Component({
  selector: 'severity-indicator-dialog',
  styleUrls: ['./severity-indicator-dialog.component.css'],
  templateUrl: './severity-indicator-dialog.component.html',
})

/**
 * The NewButtonDialogComponent component is used to add buttons to a mashup
 * *
 */
export class DemoSeverityIndicatorDialogComponent
  extends CoreBase
  implements OnInit
{
  currentSeverity = 0;
  higherThan!: string;
  lowerThan!: string;
  higherThanArray: string[] = ['', '', '', ''];
  lowerThanArray: string[] = ['', '', '', ''];
  severity!: number;
  startValue = [0];
  // TODO: Replace hardcoded values
  ticks =
    '[{ "value": 0, "description": "0:Blue", "color": "#2578A9" }, { "value": 1, "description": "1:Green", "color": "#80CE4D" }, { "value": 2, "description": "2:Yellow", "color": "#FFD726" }, { "value": 3, "description": "3:Red", "color": "#E84F4F" }]';

  constructor(
    private ref: ChangeDetectorRef,
    private monitorService: DemoMonitorService
  ) {
    super('DemoSeverityIndicatorDialogComponent');
  }

  ngOnInit() {
    if (this.monitorService.selectedMonitor.severityArrays) {
      if (this.monitorService.selectedMonitor.severityArrays.length == 2) {
        // Clone the arrays
        this.higherThanArray = [
          ...this.monitorService.selectedMonitor.severityArrays[0],
        ];
        this.lowerThanArray = [
          ...this.monitorService.selectedMonitor.severityArrays[1],
        ];
        // Undefined severity should not show contain blank, not zero
        for (let i = 0; i < 3; i++) {
          if (this.higherThanArray[i] == '0' && this.lowerThanArray[i] == '0') {
            this.higherThanArray[i] = '';
            this.lowerThanArray[i] = '';
          }
        }
        this.higherThan = this.higherThanArray[0];
        this.lowerThan = this.lowerThanArray[0];
      }
    }
  }

  onCancel() {
    this.monitorService.panelRef2.close(false);
  }

  onHigherChange() {
    this.higherThanArray[this.currentSeverity] = this.higherThan;
  }

  onLowerChange() {
    this.lowerThanArray[this.currentSeverity] = this.lowerThan;
  }

  onSlide(event: SohoSliderEvent) {
    this.currentSeverity = event.data;
    this.higherThan = this.higherThanArray[event.data];
    this.lowerThan = this.lowerThanArray[event.data];
    this.ref.detectChanges();
  }

  onOkay() {
    this.monitorService.panelRef2.close([
      this.higherThanArray,
      this.lowerThanArray,
    ]);
  }
}
