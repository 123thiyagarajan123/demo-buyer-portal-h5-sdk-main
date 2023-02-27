import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { CoreBase } from '@infor-up/m3-odin';

import { ThemeService } from '../../index';

@Component({
  selector: 'h5-theme-form',
  templateUrl: './theme-form.component.html',
  styleUrls: ['./theme-form.component.css'],
})
export class ThemeFormComponent extends CoreBase implements OnInit {
  rootForm!: FormGroup;
  colors!: SohoPersonalizationColor[];
  modes!: SohoTheme[];

  readonly COLOR_DROPDOWN = 'color';
  readonly MODE_DROPDOWN = 'mode';

  constructor(
    private themeService: ThemeService,
    private formBuilder: FormBuilder
  ) {
    super('ThemeFormComponent');
  }

  ngOnInit(): void {
    this.rootForm = this.createForm();
    this.colorControl();
    this.modeControl();
  }

  createForm() {
    return this.formBuilder.group({
      [this.COLOR_DROPDOWN]: { value: null, disabled: false },
      [this.MODE_DROPDOWN]: { value: null, disabled: false },
    });
  }

  colorControl() {
    const control = this.rootForm.get(this.COLOR_DROPDOWN) as AbstractControl;

    this.colors = Object.values(this.themeService.getThemeColors());

    const color = this.themeService.getThemeColor();
    if (color) {
      control.setValue(color);
    }

    control.valueChanges
      .pipe(tap((color: string) => this.themeService.setThemeColor(color)))
      .subscribe();
  }

  modeControl() {
    const control = this.rootForm.get(this.MODE_DROPDOWN) as AbstractControl;

    this.modes = this.themeService.getThemeModes();

    const mode = this.themeService.getThemeMode();
    if (mode) {
      control.setValue(mode);
    }

    control.valueChanges
      .pipe(tap((mode: string) => this.themeService.setThemeMode(mode)))
      .subscribe();
  }

  dataIcon(color: SohoPersonalizationColor): string {
    return JSON.stringify({
      icon: 'swatch',
      class: color.backgroundColorClass + ' swatch',
    });
  }
}
