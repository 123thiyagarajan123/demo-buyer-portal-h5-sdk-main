import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoInitService is used to initialize UI components in an easy manner
 */
export class DemoInitService {
  constructor() {}

  /**
   * Initializes the datagrid
   * @param title
   * @param columns
   * @param paging
   * @param pageSize
   */
  initDataGridOptions(
    title: string,
    columns: SohoDataGridColumn[],
    paging?: boolean,
    pageSize?: number
  ): SohoDataGridOptions {
    const options: SohoDataGridOptions = {
      alternateRowShading: false,
      cellNavigation: false,
      clickToSelect: true,
      disableRowDeactivation: true,
      filterable: true,
      indeterminate: false,
      paging: paging != null ? paging : false,
      pagesize: pageSize ? pageSize : 25,
      // rowHeight: 'small' as SohoDataGridRowHeight,
      selectable: 'single' as SohoDataGridSelectable,
      showFilterTotal: true,
      toolbar: {
        results: true,
        title: title,
      },
      columns: columns,
      dataset: [],
      emptyMessage: {
        title: 'No data available',
        icon: 'icon-empty-no-data',
      },
    };
    return options;
  }

  /**
   * Initializes the search options
   */
  initSearchOptions(): SohoSearchFieldOptions {
    const options: SohoSearchFieldOptions = {};
    return options;
  }
}
