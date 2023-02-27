import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { CoreBase } from '@infor-up/m3-odin';

import { MonitorService } from '@gdis/services/monitor.service';

import { MonitorLevel } from '../../index';

@Component({
  selector: 'h5-monitor-form',
  templateUrl: './monitor-form.component.html',
  styleUrls: ['./monitor-form.component.css'],
})
export class MonitorFormComponent extends CoreBase implements OnInit {
  rootForm!: FormGroup;
  monitorLevels!: MonitorLevel[];

  readonly LEVEL_DROPDOWN = 'monitor';
  MonitorLevel = MonitorLevel;

  constructor(
    private formBuilder: FormBuilder,
    private monitorService: MonitorService
  ) {
    super('MonitorFormComponent');
  }

  ngOnInit(): void {
    this.rootForm = this.createForm();
    this.languageControl();
  }

  createForm() {
    return this.formBuilder.group({
      [this.LEVEL_DROPDOWN]: { value: null, disabled: false },
    });
  }

  languageControl() {
    const control = this.rootForm.get(this.LEVEL_DROPDOWN) as AbstractControl;

    this.monitorLevels = this.monitorService.monitorLevels;

    const currentMonitorLevel = this.monitorService.currentMonitorLevel;
    if (currentMonitorLevel) {
      control.setValue(currentMonitorLevel);
    }

    control.valueChanges
      .pipe(
        tap(
          (monitorLevel: MonitorLevel) =>
            (this.monitorService.currentMonitorLevel = monitorLevel)
        )
      )
      .subscribe();
  }
}
