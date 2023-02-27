/* eslint-disable @angular-eslint/use-lifecycle-interface */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ViewChild,
} from '@angular/core';
import { isDefined } from '@angular/compiler/src/util';

import {
  CoreBase,
  IMIRequest,
  IMIResponse,
  MIRecord,
  Log,
  IBookmark,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse, MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import {
  SohoAccordionComponent,
  SohoContextualActionPanelService,
  SohoToastService,
} from 'ids-enterprise-ng';

import {
  IAction,
  ICustomAction,
  IDrillBack,
  IRelatedInformation,
} from '../../../index';
import { DemoRelatedOptionService } from '../../services/relatedoption/relatedoption.service';
import { DemoLaunchService } from '../../services/launch/launch.service';
import { DemoUserContextService } from '../../services/usercontext/usercontext.service';
import { RelatedOptionDialogComponent } from '../related-option-dialog/related-option-dialog.component';

@Component({
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'm3-related-option',
  templateUrl: './related-option.component.html',
  styleUrls: ['./related-option.component.css'],
})

/**
 * The GdisRelatedOptionComponent is the owner of the sidebar. It loads and unloads
 * RelatedInformation objects from listpanels and detailpanels in the application
 * and displays them in the sidebar.
 *
 */
export class RelatedOptionComponent extends CoreBase implements OnInit {
  @Input() actionsHeader!: string;
  @Input() customActionsHeader!: string;
  @Input() drillBacksHeader!: string;
  @ViewChild('accordion') accordion?: SohoAccordionComponent;

  aliases = [
    {
      field: 'ITNO',
      aliasFields: ['PRNO', 'MTNO'],
    },
    {
      field: 'CUNO',
      aliasFields: ['PYNO'],
    },
    {
      field: 'PYNO',
      aliasFields: ['CUNO'],
    },
  ];

  heading!: string;

  actions: IAction[] = [];
  customActions: ICustomAction[] = [];
  drillBacks: IDrillBack[] = [];
  relatedInformations: IRelatedInformation[] = [];
  // @ts-expect-error: TODO
  selectedRecord: MIRecord = null;

  constructor(
    private miService: MIService,
    private userContextService: DemoUserContextService,
    private panelService: SohoContextualActionPanelService,
    private toastService: SohoToastService,
    private launchService: DemoLaunchService,
    private relatedOptionService: DemoRelatedOptionService
  ) {
    super('RelatedOptionComponent');
  }

  /**
   * Initializes the component. Subscribes to RelatedInformation change events and to
   * record selected events. The RelatedInformation object is defined in, and passed
   * from, a DemoListComponent or a DemoDetailComponent.
   *
   * The RelatedInformation object is central to this component. It contains all related
   * options that the user may want to execute. The RelatedInformation object contains
   * the following:
   *
   * 1. Actions. Allows the user to process data based on the selected record, for example
   * confirming a PO. It launches an IDS dialog showing detail panel fields retrieved with
   * the Actions bookmark.
   *
   * 2. Custom Actions. CustomActions are used when you cannot use regular Actions. In this
   * case we emit an event that the DemoListComponent or DemoDetailComponent subscribes to.
   * The subscribing component is responsible for implementing the functionality that should
   * take place when the custom action is clicked.
   *
   * 3. Drillbacks. Used to navigate to a program in M3.
   *
   */
  ngOnInit(): void {
    // Set heading
    const lang = this.userContextService.userContext.language;

    switch (lang) {
      case 'DE':
        this.heading = 'Links';
        break;
      case 'FR':
        this.heading = 'Liens';
        break;
      case 'GB':
        this.heading = 'Links';
        break;
      case 'SE':
        this.heading = 'Länkar';
        break;
      case 'ES':
        this.heading = 'Enlaces';
        break;
      default:
        this.heading = 'Links';
        break;
    }

    // RelatedInformations
    this.relatedOptionService.relatedInformationChangedEvent.subscribe(
      (relateds: IRelatedInformation[]) => {
        this.relatedInformations = relateds;
        setTimeout(() => {
          this.accordion?.updated();
          this.accordion?.expandAll();
        });
      }
    );

    // Selected record
    this.relatedOptionService.recordSelectedEvent.subscribe(
      (related: IRelatedInformation) => {
        try {
          if (related) {
            if (this.relatedInformations.length > 0) {
              const index = this.relatedInformations
                .map((e) => e.name)
                .indexOf(related.name);
              if (index >= 0) {
                this.relatedInformations[index].record = related.record;
              }
            }
          }
        } catch (err) {
          this.logError(err as any);
        }
      }
    );
  }

  /**
   *    Unsubscribes to observables and event emitters
   */
  ngOnDestroy() {
    this.relatedOptionService.recordSelectedEvent.unsubscribe();
  }

  /**
   * This method is called when the user clicks an Action. It launches an IDS
   * dialog showing detail panel fields retrieved with the Actions bookmark.
   * @param action
   * @param relatedInformation
   */
  executeAction(action: IAction, relatedInformation: IRelatedInformation) {
    this.relatedOptionService.selectedAction = action;
    const selectedRecord: MIRecord = relatedInformation.record;

    // Stop execution if a) an option has been provided and b) no record has been selected
    if (typeof action.bookmark.option != 'undefined') {
      if (!selectedRecord) {
        this.toastService.show({
          title: 'No record selected',
          message: 'Please select a record before clicking on the link',
          position: SohoToastService.TOP_RIGHT,
        });
        return;
      }
    }

    this.relatedOptionService.selectedRecord = relatedInformation.record;

    this.relatedOptionService.panelRef = this.panelService
      .contextualactionpanel(
        RelatedOptionDialogComponent,
        this.relatedOptionService.placeHolder
      )
      .title(action.name)
      .initializeContent(true)
      .trigger('immediate')
      .open();
  }

  /**
   * This method is called when the user clicks a CustomAction. It emits a
   * customActionClicked event. The subscriber will have to implement whatever
   * logic that should take place.
   *
   * A CustomAction is used whenever a regular Action is not suitable.
   *
   * @param customAction
   * @param relatedInformation
   */
  executeCustomAction(
    customAction: ICustomAction,
    relatedInformation: IRelatedInformation
  ) {
    this.relatedOptionService.customActionClickedEvent.emit(customAction);
  }

  /**
   * This method is called when the user clicks a drillback.
   * @param drillBack
   * @param relatedInformation
   */
  executeDrillBack(
    drillBack: IDrillBack,
    relatedInformation: IRelatedInformation
  ) {
    let record: MIRecord = new MIRecord();
    let selectedRecord = new MIRecord();

    // @ts-expect-error: TODO
    record['FILE'] = drillBack.bookmark.table;
    selectedRecord = relatedInformation.record;

    // Stop execution if a) an option has been provided and b) no record has been selected
    if (typeof drillBack.bookmark.option != 'undefined') {
      if (!selectedRecord) {
        this.toastService.show({
          title: 'No record selected',
          message: 'Please select a record before clicking on the link',
          position: SohoToastService.TOP_RIGHT,
        });
        return;
      }
    }

    const request: IMIRequest = {
      includeMetadata: true,
      program: 'BOOKMKMI',
      transaction: 'GetParByTable',
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          const keys = Object.keys(response.item);
          // Get bookmark key names
          let keyNames: string[] = [];
          for (let i = 2; i < 17; i++) {
            const key = keys[i];
            const keyValue = response.item[key];
            if (keyValue) {
              keyNames.push(keyValue);
            }
          }

          // Get bookmark values
          let values: MIRecord = new MIRecord();
          for (let key of keyNames) {
            // Check key name
            // @ts-expect-error: TODO
            if (selectedRecord[key]) {
              // Check date
              // @ts-expect-error: TODO
              if (MIUtil.isDate(selectedRecord[key])) {
                // @ts-expect-error: TODO
                values[key] = MIUtil.getDateFormatted(selectedRecord[key]);
              } else {
                // @ts-expect-error: TODO
                values[key] = selectedRecord[key];
              }
            } else {
              // Check shortkey (For example, IBPUNO <-> PUNO)
              const shortKey = key.substr(key.length - 4);
              // @ts-expect-error: TODO
              if (selectedRecord[shortKey]) {
                // Check date
                // @ts-expect-error: TODO
                if (MIUtil.isDate(selectedRecord[shortKey])) {
                  // @ts-expect-error: TODO
                  values[key] = MIUtil.getDateFormatted(
                    // @ts-expect-error: TODO
                    selectedRecord[shortKey]
                  );
                } else {
                  // @ts-expect-error: TODO
                  values[key] = selectedRecord[shortKey];
                }
                // Special check for zero value
                // @ts-expect-error: TODO
              } else if (selectedRecord[shortKey] === 0) {
                // @ts-expect-error: TODO
                values[key] = selectedRecord[shortKey];
              } else {
                /**
                 * Special check for alias fields. For example, if you want to drillback
                 * to MMS001 (ITNO), but the selected record which you want to use as
                 * data contains a product record (PRNO)
                 */

                const aliasField = this.getAliasField(shortKey, selectedRecord);
                if (aliasField) {
                  // @ts-expect-error: TODO
                  values[key] = selectedRecord[aliasField];
                } else {
                  Log.warning(
                    'Bookmark key value not found, setting value to blank'
                  );
                  // @ts-expect-error: TODO
                  values[key] = ' ';
                }
              }
            }
          }

          const bookmark: IBookmark = {
            program: drillBack.bookmark.program,
            table: drillBack.bookmark.table,
            keyNames: keyNames.toString(),
            startPanel: drillBack.bookmark.startPanel
              ? drillBack.bookmark.startPanel
              : 'B',
            includeStartPanel: drillBack.bookmark.includeStartPanel
              ? true
              : false,
            sortingOrder: drillBack.bookmark.sortingOrder
              ? drillBack.bookmark.sortingOrder
              : '1',
            option: drillBack.bookmark.option,
            // @ts-expect-error: TODO
            view: drillBack.bookmark.view ? drillBack.bookmark.view : null,
            values: values,
          };
          this.launchService.launchBookmark(bookmark);
        }
      },
      (error: MIResponse) => {
        Log.error(error.errorMessage);
      }
    );
  }

  /**
   * Returns the alias value for a field. For example, if you want to drillback
   * to MMS001 (ITNO), but the selected record which you want to use as data
   * contains a product record (PRNO)
   * @param key
   * @param record
   */
  getAliasField(key: string, record: MIRecord): string {
    for (let alias of this.aliases) {
      if (alias.field == key) {
        for (let aliasField of alias.aliasFields) {
          // @ts-expect-error: TODO
          if (record[aliasField]) {
            return aliasField;
          }
        }
      }
    }
    // @ts-expect-error: TODO
    return null;
  }
}
