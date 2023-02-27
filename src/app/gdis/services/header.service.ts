import { Injectable } from '@angular/core';

import {
  IHeaderCustomButton,
  IHeaderTab,
  IHeaderButton,
} from '../types/header.type';

import { GdisStore } from './gdis.store';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  constructor(private store: GdisStore) {}

  get hasToolbar() {
    return this.store.state.header.hasToolbar;
  }

  set hasToolbar(hasToolbar: boolean) {
    this.store.setHeader({ hasToolbar });
  }

  get showToolbar() {
    return this.store.state.header.showToolbar;
  }

  set showToolbar(hasToolbar: boolean) {
    this.store.setHeader({ hasToolbar });
  }

  get isTitleFavor() {
    return this.store.state.header.isTitleFavor;
  }

  set isTitleFavor(isTitleFavor: boolean) {
    this.store.setHeader({ isTitleFavor });
  }

  get hasTitle() {
    return this.store.state.header.hasTitle;
  }

  set hasTitle(hasTitle: boolean) {
    this.store.setHeader({ hasTitle });
  }

  get title() {
    return this.store.state.header.title;
  }

  set title(title: string) {
    this.store.setHeader({ title });
  }

  get subTitle() {
    return this.store.state.header.subTitle;
  }

  set subTitle(subTitle: string | null) {
    this.store.setHeader({ subTitle });
  }

  get customButton() {
    return this.store.state.header.customButton;
  }

  set customButton(customButton: IHeaderCustomButton | null) {
    this.store.setHeader({ customButton });
  }

  get hasTabs() {
    return this.store.state.header.hasTabs;
  }

  set hasTabs(hasTabs: boolean) {
    this.store.setHeader({ hasTabs });
  }

  get showTabs() {
    return this.store.state.header.showTabs;
  }

  set showTabs(showTabs: boolean) {
    this.store.setHeader({ showTabs });
  }

  addTab(tab: IHeaderTab) {
    this.store.setHeader({
      hasTabs: true,
      tabs: [...this.store.state.header.tabs, tab],
    });
  }

  getTabs() {
    return this.store.state.header.tabs;
  }

  clearTabs() {
    this.store.setHeader({ hasTabs: false, tabs: [] });
  }

  get showButtons() {
    return this.store.state.header.showButtons;
  }

  set showButtons(showButtons: boolean) {
    this.store.setHeader({ showButtons });
  }

  addButton(button: IHeaderButton) {
    this.store.setHeader({
      buttons: [...this.store.state.header.buttons, button],
    });
  }

  getButtons() {
    return this.store.state.header.buttons;
  }

  clearButtons() {
    this.store.setHeader({ buttons: [] });
  }
}
