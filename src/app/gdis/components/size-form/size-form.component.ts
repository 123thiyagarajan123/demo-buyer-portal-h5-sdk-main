import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { tap } from 'rxjs/operators';

import { CoreBase } from '@infor-up/m3-odin';

import { Size, SizeService } from '../../index';

@Component({
  selector: 'h5-size-form',
  templateUrl: './size-form.component.html',
  styleUrls: ['./size-form.component.css'],
})
export class SizeFormComponent extends CoreBase implements OnInit {
  rootForm!: FormGroup;
  formSizes!: Size[];
  rowSizes!: Size[];

  readonly FORM_SIZE_DROPDOWN = 'formSize';
  readonly ROW_SIZE_DROPDOWN = 'rowSize';

  constructor(
    private sizeService: SizeService,
    private formBuilder: FormBuilder
  ) {
    super('SizeFormComponent');
  }

  ngOnInit(): void {
    this.rootForm = this.createForm();
    this.formSizeControl();
    this.rowSizeControl();
  }

  createForm() {
    return this.formBuilder.group({
      [this.FORM_SIZE_DROPDOWN]: { value: null, disabled: false },
      [this.ROW_SIZE_DROPDOWN]: { value: null, disabled: false },
    });
  }

  formSizeControl() {
    const control = this.rootForm.get(
      this.FORM_SIZE_DROPDOWN
    ) as AbstractControl;

    this.formSizes = this.sizeService.getSizes();

    const size = this.sizeService.getFormSize();
    if (size) {
      control.setValue(size);
    }

    control.valueChanges
      .pipe(tap((size: Size) => this.sizeService.setFormSize(size)))
      .subscribe();
  }

  rowSizeControl() {
    const control = this.rootForm.get(
      this.ROW_SIZE_DROPDOWN
    ) as AbstractControl;

    this.rowSizes = this.sizeService.getSizes();

    const size = this.sizeService.getRowSize();
    if (size) {
      control.setValue(size);
    }

    control.valueChanges
      .pipe(tap((size: Size) => this.sizeService.setRowSize(size)))
      .subscribe();
  }
}
