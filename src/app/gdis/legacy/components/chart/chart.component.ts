/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import {
  Component,
  ViewEncapsulation,
  Input,
  SimpleChanges,
  ViewChild,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

import { CoreBase, IMIRequest, IMIResponse, MIRecord } from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import {
  SohoMessageService,
  SohoPieComponent,
  SohoBarComponent,
  SohoColumnComponent,
  SohoLineComponent,
} from 'ids-enterprise-ng';

@Component({
  selector: 'm3-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ChartComponent extends CoreBase implements OnInit {
  constructor(
    protected miService: MIService,
    protected messageService: SohoMessageService
  ) {
    super('ChartComponent');
  }
  /**
   * M3 transaction response field to use as a datapoint label
   */
  /**
   * M3 transaction response field to use as a datapoint label
   */
  @Input() nameField!: string;
  /**
   * M3 transaction response field to use as a datapoint value
   */
  /**
   * M3 transaction response field to use as a datapoint value
   */
  @Input() valueField!: string;
  /**
   * The M3 record to be used as input for the transaction
   */
  /**
   * The M3 record to be used as input for the transaction
   */
  @Input() startRecord!: MIRecord;
  /**
   * The M3 API program to call, e.g. 'MMS200MI'
   */
  /**
   * The M3 API program to call, e.g. 'MMS200MI'
   */
  @Input() program!: string;
  /**
   * The M3 API transaction to call, e.g. 'LstItmByItm'
   */
  /**
   * The M3 API transaction to call, e.g. 'LstItmByItm'
   */
  @Input() transaction!: string;
  /**
   * The chart type: pie, bar, bar-grouped, bar-stacked, column,
   * column-grouped, column-stacked, line, donut or bubble
   */
  /**
   * The chart type: pie, bar, bar-grouped, bar-stacked, column,
   * column-grouped, column-stacked, line, donut or bubble
   */
  @Input() chartType!: string;
  /**
   * Sets whether to show the legend or not. Does not work for
   * all chart types (like 'bar')
   */
  /**
   * Sets whether to show the legend or not. Does not work for
   * all chart types (like 'bar')
   */
  @Input() showLegend!: boolean;
  /**
   * Cuts off results and sums up the remainder in one group to make charts
   * less cluttered. Default '5', set to '0' to disable.
   */
  /**
   * Cuts off results and sums up the remainder in one group to make charts
   * less cluttered. Default '5', set to '0' to disable.
   */
  @Input() top!: number;
  /**
   * The name to use for the group of results summarized by 'top'
   */
  @Input() topRemainderText = 'Others';
  /**
   * The dataset to use for the chart
   */
  /**
   * The dataset to use for the chart
   */
  @Input() chartData!: SohoDataSet;
  /**
   * Maximum number of records to return from M3 API transaction
   */
  @Input() maxRecords = 200;
  /**
   * The M3 transaction response field to count occurences of, e.g. STAT
   */
  /**
   * The M3 transaction response field to count occurences of, e.g. STAT
   */
  @Input() count!: string;
  /**
   * The M3 transaction response field to use as a key for adding amounts, e.g. ITNO
   */
  /**
   * The M3 transaction response field to use as a key for adding amounts, e.g. ITNO
   */
  @Input() sumLabelField!: string;
  /**
   * The M3 transaction response field to use as a quantity for adding amounts, e.g. ORQA
   */
  /**
   * The M3 transaction response field to use as a quantity for adding amounts, e.g. ORQA
   */
  @Input() sumValueField!: string;
  /**
   * Custom tooltip, e.g. `{{name}}: <b>{{value}}</b>, {{percent}}`
   */
  /**
   * Custom tooltip, e.g. `{{name}}: <b>{{value}}</b>, {{percent}}`
   */
  @Input() tooltip!: string;
  /**
   * Emit when user clicks chart data
   */
  @Output() chartSelected: EventEmitter<Event> = new EventEmitter();
  // @Output() chartRendered: EventEmitter<Event> = new EventEmitter();
  // @Output() chartDeselected: EventEmitter<Event> = new EventEmitter();

  // Pie
  // @Output() chartRendered: EventEmitter<Event> = new EventEmitter();
  // @Output() chartDeselected: EventEmitter<Event> = new EventEmitter();
  // Pie
  @ViewChild(SohoPieComponent, { static: true })
  sohoPieComponent!: SohoPieComponent;

  // Bar
  // Bar

  @ViewChild(SohoBarComponent, { static: true })
  sohoBarComponent!: SohoBarComponent;

  // Column
  // Column

  @ViewChild(SohoColumnComponent, { static: true })
  sohoColumnComponent!: SohoColumnComponent;

  // Line
  // Line

  @ViewChild(SohoLineComponent, { static: true })
  sohoLineComponent!: SohoLineComponent;

  isBusy!: boolean;

  public xAxis!: {};
  public yAxis!: {};

  /**
   *    Loads data when startRecord has been loaded / changed
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.startRecord) {
      if (this.startRecord && this.program && this.transaction) {
        // @ts-expect-error: TODO
        this.chartData = undefined;
        this.callApi(this.startRecord, this.program, this.transaction);
      }
    }
  }

  ngOnInit() {
    /* this.yAxis = {
      ticks: {
        number: 5, // Tip: round max data value
        format: 'd',
      },
    };
    this.xAxis = {
      formatText(d) {
        const text = d.split('|');
        let markup = '';
        text.map(function(mapText, i) {
          markup +=
            '<tspan x="0" dy="' +
            (i + 1) * 0.55 +
            'em">' +
            mapText.replace('|', ' ') +
            '</tspan>';
        });
        return markup;
      },
    }; */
  }

  ngAfterViewInit() {
    if (this.startRecord && this.program && this.transaction) {
      this.callApi(this.startRecord, this.program, this.transaction);
    } else if (
      this.chartData &&
      (this.chartData as any)[0] &&
      (this.chartData as any)[0].data
    ) {
      (this.chartData as any)[0].data = this.adjustDataset(
        (this.chartData as any)[0].data
      );
    }
  }

  /**
   * Calls an M3 Api transaction.
   * @param record
   * @param program
   * @param transaction
   */
  protected callApi(record: MIRecord, program?: string, transaction?: string) {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;

    const request: IMIRequest = {
      includeMetadata: true,
      // @ts-expect-error: TODO
      program,
      // @ts-expect-error: TODO
      transaction,
      record,
      maxReturnedRecords: this.maxRecords,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError('Failed to list transaction data');
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
        // this.clear();
        if (error.errorCode !== 'XRE0103') {
          this.onError('Failed to list transaction data', error);
        }
      }
    );
  }

  /**
   * Handles the response from the API transaction.
   * @param response
   */
  protected onResponse(response: IMIResponse) {
    if (this.count) {
      this.nameField = this.count;
      this.valueField = this.count;
    } else if (this.sumValueField && this.sumLabelField) {
      this.nameField = this.sumLabelField;
      this.valueField = this.sumValueField;
    }

    try {
      // @ts-expect-error: TODO
      let dataset = response.items.map((item, index) => {
        return {
          name: item[this.nameField],
          value: parseFloat(item[this.valueField]),
        };
      });

      dataset = this.adjustDataset(dataset);

      this.chartData = [
        {
          data: dataset,
        },
      ];
    } catch (err) {
      this.logError(err as string);
    }
  }

  adjustDataset(oldDataset: any[]): any[] {
    // @ts-expect-error: TODO
    let newDataset = [];

    oldDataset.sort((a, b) => (b.value > a.value ? 1 : -1));

    if (this.count) {
      // Count
      const countObject = {};
      // @ts-expect-error: TODO
      const countObjectKeys = [];
      oldDataset.forEach((row) => {
        const valueToCount = row.value.toString();
        // @ts-expect-error: TODO
        if (countObject[valueToCount]) {
          // @ts-expect-error: TODO
          countObject[valueToCount] += 1;
        } else {
          // @ts-expect-error: TODO
          countObject[valueToCount] = 1;
          countObjectKeys.push(valueToCount);
        }
      });
      // @ts-expect-error: TODO
      const countDataset = countObjectKeys.map((key) => {
        return {
          name: key,
          // @ts-expect-error: TODO
          value: parseFloat(countObject[key]),
        };
      });
      countDataset.sort((a, b) => (b.value > a.value ? 1 : -1));
      oldDataset = countDataset;
    } else if (this.sumValueField && this.sumLabelField) {
      // Sum
      const countObject = {};
      // @ts-expect-error: TODO
      const countObjectKeys = [];
      oldDataset.forEach((row) => {
        const label = row.name;
        const amount = parseFloat(row.value);
        // @ts-expect-error: TODO
        if (countObject[label]) {
          // @ts-expect-error: TODO
          countObject[label] += amount;
        } else {
          // @ts-expect-error: TODO
          countObject[label] = amount;
          countObjectKeys.push(label);
        }
      });
      // @ts-expect-error: TODO
      const countDataset = countObjectKeys.map((key) => {
        return {
          name: key,
          // @ts-expect-error: TODO
          value: parseFloat(countObject[key]),
        };
      });
      countDataset.sort((a, b) => (b.value > a.value ? 1 : -1));
      oldDataset = countDataset;
    }

    // Add top
    if (this.top === undefined) {
      this.top = 5;
    }
    if (this.top > 0) {
      // @ts-expect-error: TODO
      newDataset = newDataset.concat(oldDataset.splice(0, this.top - 1));

      // Sum of rest
      if (oldDataset.length > 0) {
        let sumRemaining = 0;
        oldDataset.forEach((record) => {
          sumRemaining += record.value;
        });

        const remaining = {
          name: this.topRemainderText,
          value: sumRemaining,
        };

        newDataset.push(remaining);
      }
    } else {
      newDataset = oldDataset;
    }

    // Custom tooltip
    if (this.tooltip) {
      newDataset = newDataset.map((datapoint) => {
        const customTooltip = this.tooltip.replace('{{name}}', datapoint.name);
        return {
          name: datapoint.name,
          value: datapoint.value,
          // tooltip: `{{name}}: <b>{{value}}</b>, {{percent}}`,
          tooltip: customTooltip,
        };
      });
    }

    return newDataset;
  }

  onSelected(event: unknown) {
    // console.log(`[chart.component.ts] ${this.chartType}: Selected`, event);
    this.chartSelected.emit(event as Event);
  }

  /* onRendered(event: Event) {
    // console.log(`[chart.component.ts] ${this.chartType}: onRender`, event);
    this.chartRendered.emit(event);
  } */

  /* onDeselected(event: Event) {
    // console.log(`[chart.component.ts] ${this.chartType}: Deselected`, event);
    this.chartDeselected.emit(event);
  } */

  /**
   * An error handling method.
   * @param message
   * @param error
   */
  protected onError(message: string, error?: any) {
    this.logError(message, error ? '- Error: ' + JSON.stringify(error) : '');
    const buttons = [
      {
        text: 'Ok',
        click: (e: any, modal: { close: () => void }) => {
          modal.close();
        },
      },
    ];
    this.messageService
      .error()
      .title('An error occured')
      .message(
        message + '. More details might be available in the browser console.'
      )
      .buttons(buttons)
      .open();
  }
}
