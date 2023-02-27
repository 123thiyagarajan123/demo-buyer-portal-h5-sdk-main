import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { CoreBase } from '@infor-up/m3-odin';

import { TranslationService } from '../../index';

@Component({
  selector: 'h5-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.css'],
})
export class LanguageFormComponent extends CoreBase implements OnInit {
  rootForm!: FormGroup;
  languages!: string[];

  readonly LANGUAGE_DROPDOWN = 'language';

  constructor(
    private formBuilder: FormBuilder,
    private translationService: TranslationService
  ) {
    super('LanguageFormComponent');
  }

  ngOnInit(): void {
    this.rootForm = this.createForm();
    this.languageControl();
  }

  createForm() {
    return this.formBuilder.group({
      [this.LANGUAGE_DROPDOWN]: { value: null, disabled: false },
    });
  }

  languageControl() {
    const control = this.rootForm.get(
      this.LANGUAGE_DROPDOWN
    ) as AbstractControl;

    this.languages = this.translationService.getAvailableLangs() as string[];

    const lang = this.translationService.getActiveLang();
    if (lang) {
      control.setValue(lang);
    }

    control.valueChanges
      .pipe(tap((lang: string) => this.translationService.setActiveLang(lang)))
      .subscribe();
  }
}
