import { Injectable } from '@angular/core';

import {
  MIService,
  FormService,
  ApplicationService,
} from '@infor-up/m3-odin-angular';
import { IBookmark } from '@infor-up/m3-odin';

import { DemoUserContextService } from '../usercontext/usercontext.service';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoLaunchService is used to launch bookmarks and programs
 */
export class DemoLaunchService {
  constructor(
    private userContextService: DemoUserContextService,
    private appService: ApplicationService,
    private miService: MIService,
    private formService: FormService
  ) {}

  /**
   * Launches a bookmark in a separate tab. Used by the panel component, the address component and
   * the related option component for drillbacks to M3
   * @param bookmark
   */
  public launchBookmark(bookmark: IBookmark) {
    let frameElement = window.self !== window.top;
    let prefix: string = frameElement ? 'mforms://' : 'mforms%3A%2F%2F';

    let task: string;
    let query: string;
    let fields: string[];
    let fieldNames: string[];

    fields = bookmark.fields ? bookmark.fields.split(',') : [];
    fieldNames = bookmark.fieldNames ? bookmark.fieldNames.split(',') : [];

    query = '';
    query += 'bookmark?program=' + bookmark.program;
    query += '&tablename=' + bookmark.table;
    query += '&keys=';

    // @ts-expect-error: TODO
    const keys = bookmark.keyNames.split(',');
    const values = bookmark.values;

    // Add key fields

    let keyFieldsValues = '';
    for (let key of keys) {
      keyFieldsValues += key;
      keyFieldsValues += ',';
      const shortKey = key.substr(key.length - 4);
      if (shortKey == 'CONO') {
        keyFieldsValues += this.userContextService.userContext.currentCompany;
      } else {
        keyFieldsValues += values[key]
          ? values[key].toString()
          : values[shortKey]
          ? values[shortKey].toString()
          : '';
      }
      keyFieldsValues += ',';
    }

    query += keyFieldsValues;

    // Add fields

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

    if (fieldNameValues.length > 0) {
      query += '&fields=';
      query += fieldNameValues;
    }

    bookmark.sortingOrder
      ? (query += '&sortingorder=' + bookmark.sortingOrder)
      : null;
    bookmark.view ? (query += '&view=' + bookmark.view) : null;
    bookmark.startPanel ? (query += '&startpanel=' + bookmark.startPanel) : 'B';
    bookmark.includeStartPanel != undefined
      ? (query += '&includestartpanel=' + bookmark.includeStartPanel)
      : null;
    bookmark.option ? (query += '&option=' + bookmark.option) : null;
    bookmark.panel ? (query += '&panel=' + bookmark.panel) : null;
    bookmark.panelSequence
      ? (query += '&panelsequence=' + bookmark.panelSequence)
      : null;
    bookmark.requirePanel != undefined
      ? (query += '&requirepanel=' + bookmark.requirePanel)
      : null;

    task = query;

    if (frameElement) {
      return this.appService.launch(task);
    }
  }

  /**
   * Launches a program in a separate tab.
   * @param program
   */
  public launchProgram(program: string) {
    const frameElement = window.self !== window.top;
    const prefix: string = frameElement ? 'mforms://' : 'mforms%3A%2F%2F';
    const task = prefix + program;
    if (frameElement) {
      return this.appService.launch(task);
    }
  }

  /**
   * Launches a Url in a separate tab.
   * @param url
   */
  public launchUrl(url: string) {
    const frameElement = window.self !== window.top;
    if (frameElement) {
      return this.appService.launch(url);
    }
  }

  private addComma(element: any) {
    if (frameElement) {
      return ',';
    } else {
      return '%2C';
    }
  }
}
