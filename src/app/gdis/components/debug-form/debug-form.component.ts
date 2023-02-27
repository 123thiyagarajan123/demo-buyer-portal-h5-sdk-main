import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { CoreBase } from '@infor-up/m3-odin';

import { LogLevel, DebugService } from '../../index';

@Component({
  selector: 'h5-debug-form',
  templateUrl: './debug-form.component.html',
  styleUrls: ['./debug-form.component.css'],
})
export class DebugFormComponent extends CoreBase implements OnInit {
  rootForm!: FormGroup;
  logLevels!: LogLevel[];

  readonly LEVEL_DROPDOWN = 'level';
  LogLevel = LogLevel;

  constructor(
    private formBuilder: FormBuilder,
    private debugService: DebugService
  ) {
    super('DebugFormComponent');
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

    this.logLevels = this.debugService.logLevels;

    const currentLogLevel = this.debugService.currentLogLevel;
    if (currentLogLevel) {
      control.setValue(currentLogLevel);
    }

    control.valueChanges
      .pipe(
        tap(
          (logLevel: LogLevel) => (this.debugService.currentLogLevel = logLevel)
        )
      )
      .subscribe();
  }
}
