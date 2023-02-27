import { Inject, Injectable } from '@angular/core';

import { IBookmark } from '@infor-up/m3-odin';
import { ApplicationService } from '@infor-up/m3-odin-angular';

import { WINDOW } from '@core/tokens';

import { GdisStore } from './gdis.store';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(
    @Inject(WINDOW) readonly window: Window,
    private readonly gdisStore: GdisStore,
    private readonly appService: ApplicationService
  ) {}

  /**
   * Launches a bookmark in a separate tab.
   * @param bookmark
   */
  launchBookmark(bookmark: IBookmark) {
    let query = `bookmark?program=${bookmark.program}&tablename=${bookmark.table}&keys=`;

    query += this.getKeyFields(bookmark);

    const fields = this.getFields(bookmark);
    if (fields) {
      query += '&fields=';
      query += fields;
    }

    if (bookmark.sortingOrder) {
      query += '&sortingorder=' + bookmark.sortingOrder;
    }

    if (bookmark.view) {
      query += '&view=' + bookmark.view;
    }

    if (bookmark.startPanel) {
      query += '&startpanel=' + bookmark.startPanel;
    }

    if (bookmark.includeStartPanel) {
      query += '&includestartpanel=true';
    } else {
      query += '&includestartpanel=false';
    }

    if (bookmark.option) {
      query += '&option=' + bookmark.option;
    }

    if (bookmark.panel) {
      query += '&panel=' + bookmark.panel;
    }

    if (bookmark.panelSequence) {
      query += '&panelsequence=' + bookmark.panelSequence;
    }

    if (bookmark.requirePanel) {
      query += '&requirepanel=true';
    } else {
      query += '&requirepanel=false';
    }

    const frameElement = this.window.self !== this.window.top;
    if (frameElement) {
      return this.appService.launch(query);
    }
  }

  private getKeyFields(bookmark: IBookmark) {
    const keys = bookmark.keyNames?.split(',');
    const values = bookmark.values;
    if (!keys) {
      return '';
    }

    let keyFieldsValues = '';
    for (let key of keys) {
      keyFieldsValues += key;
      keyFieldsValues += ',';
      const shortKey = key.substr(key.length - 4);
      if (shortKey == 'CONO') {
        keyFieldsValues += this.gdisStore.state.userContext?.currentCompany;
      } else {
        keyFieldsValues += values[key]
          ? values[key].toString()
          : values[shortKey]
          ? values[shortKey].toString()
          : '';
      }
      keyFieldsValues += ',';
    }

    return keyFieldsValues;
  }

  private getFields(bookmark: IBookmark) {
    const values = bookmark.values;
    const fieldNames = bookmark.fieldNames
      ? bookmark.fieldNames.split(',')
      : [];

    let fieldNameValues = '';
    for (let fieldName of fieldNames) {
      const shortName = fieldName.substr(fieldName.length - 4);
      const value = values[fieldName]
        ? values[fieldName].toString()
        : values[shortName]
        ? values[shortName].toString()
        : null;
      if (value) {
        fieldNameValues += fieldName;
        fieldNameValues += ',';
        fieldNameValues += value;
        fieldNameValues += ',';
      }
    }

    return fieldNameValues;
  }
}
