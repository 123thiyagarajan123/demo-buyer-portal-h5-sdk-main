import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { CoreBase } from '@infor-up/m3-odin';

import { ButtonLinkService } from '@gdis/services/button-link.service';

import { ButtonLinkLevel } from '../../index';

@Component({
  selector: 'h5-button-link-form',
  templateUrl: './button-link-form.component.html',
  styleUrls: ['./button-link-form.component.css'],
})
export class ButtonLinkFormComponent extends CoreBase implements OnInit {
  rootForm!: FormGroup;
  buttonLinkLevels!: ButtonLinkLevel[];

  readonly LEVEL_DROPDOWN = 'button-link';
  ButtonLinkLevel = ButtonLinkLevel;

  constructor(
    private formBuilder: FormBuilder,
    private buttonLinkService: ButtonLinkService
  ) {
    super('ButtonLinkFormComponent');
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

    this.buttonLinkLevels = this.buttonLinkService.buttonLinkLevels;

    const currentButtonLinkLevel =
      this.buttonLinkService.currentButtonLinkLevel;
    if (currentButtonLinkLevel) {
      control.setValue(currentButtonLinkLevel);
    }

    control.valueChanges
      .pipe(
        tap(
          (buttonLinkLevel: ButtonLinkLevel) =>
            (this.buttonLinkService.currentButtonLinkLevel = buttonLinkLevel)
        )
      )
      .subscribe();
  }
}
