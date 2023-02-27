import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface IShortcut {
  programs: IProgramLink[];
  bookmarks: IBookmarkLink[];
  mashups: IMashupLink[];
  urls: IUrlLink[];
}

export interface ILink {
  id: string;
}

export type ShortcutLinks =
  | IProgramLink
  | IBookmarkLink
  | IMashupLink
  | IUrlLink;

export interface IProgramLink extends ILink {}
export interface IBookmarkLink extends ILink {}
export interface IMashupLink extends ILink {}
export interface IUrlLink extends ILink {
  value: string;
}

export enum ShortcutAction {
  Add,
  Edit,
  Delete,
}

export enum ShortcutType {
  Program,
  Bookmark,
  Mashup,
  Url,
}

import { CoreBase } from '@infor-up/m3-odin';

import { ShortcutService } from '../../../index';

@Component({
  selector: 'h5-side-panel-modal',
  templateUrl: './side-panel-modal.component.html',
  styleUrls: ['./side-panel-modal.component.css'],
})
export class SidePanelModalComponent extends CoreBase implements OnInit {
  rootForm!: FormGroup;

  readonly ACTION_DROPDOWN = 'action';
  ShortcutAction = ShortcutAction;
  actions = [ShortcutAction.Add, ShortcutAction.Delete, ShortcutAction.Edit];

  readonly TYPE_DROPDOWN = 'type';
  ShortcutType = ShortcutType;
  types = [
    ShortcutType.Bookmark,
    ShortcutType.Mashup,
    ShortcutType.Program,
    ShortcutType.Url,
  ];

  readonly VALUE_INPUT = 'value';
  value = '';

  constructor(
    private formBuilder: FormBuilder,
    private shortcutService: ShortcutService
  ) {
    super('SidePanelModalComponent');
  }

  ngOnInit(): void {
    this.rootForm = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      [this.ACTION_DROPDOWN]: { value: ShortcutAction.Add, disabled: false },
      [this.TYPE_DROPDOWN]: { value: ShortcutType.Url, disabled: false },
      [this.VALUE_INPUT]: { value: this.value, disabled: false },
    });
  }

  onSave() {
    // Form is not valid (missing values for required fields or wrong input has been entered)
    if (!this.rootForm.valid) {
      return;
    }

    // // Form is not dirty (none of the fields has been changed)
    if (!this.rootForm.dirty) {
      return this.onSaveComplete();
    }

    // Merge original with new values into new object
    const originalValues = this.value;
    const updatedValues = this.rootForm[this.VALUE_INPUT].value;
    const newValue = {
      id: '1',
      value: updatedValues,
    } as IUrlLink;

    // Update
    return this.update(newValue);
  }

  onSaveComplete(): void {
    this.rootForm.reset();
  }

  update(link: IUrlLink) {
    // this.shortcutService.saveLink(link);
  }

  onError(message: string): void {
    this.logError(message);
  }
}
