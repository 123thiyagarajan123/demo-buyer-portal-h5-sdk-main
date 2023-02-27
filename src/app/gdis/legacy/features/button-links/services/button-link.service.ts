import {
  EventEmitter,
  Injectable,
  Output,
  ViewContainerRef,
} from '@angular/core';

import {
  ArrayUtil,
  IBookmark,
  IMIRequest,
  IMIResponse,
  Log,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse, MIUtil } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoContextualActionPanelRef } from 'ids-enterprise-ng';

import { GdisStore } from '../../../../index';
import { IContextEntity } from '../../../services/businesscontext/businesscontext.service';
import { DemoLaunchService } from '../../../services/launch/launch.service';
import { ButtonLinkType } from '../enums/button-link-type.enum';
import { IButtonLink } from '../types/button-link.type';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoButtonLinkService - TODO - better description of the service
 */
export class DemoButtonLinkService {
  @Output() buttonLinkChange = new EventEmitter<IButtonLink>();

  applicationName!: string;
  panelRef!: SohoContextualActionPanelRef<any>;
  placeHolder!: ViewContainerRef;
  selectedAction!: number;
  selectedRecord!: MIRecord;

  buttonLinks: IButtonLink[] = [];

  activeContextEntities: IContextEntity[] = [];
  entityRecords: MIRecord[] = [];

  constructor(
    private miService: MIService,
    private launchService: DemoLaunchService,
    private storeService: GdisStore
  ) {
    this.applicationName = this.storeService.state.environment.title;
  }

  buttonClicked(buttonLink: IButtonLink) {
    const option = buttonLink.option;
    const program = buttonLink.program;
    const mashup = buttonLink.mashup;
    let mashupQuery = buttonLink.mashupQuery;
    let url = buttonLink.url;

    let linkType = (buttonLink.key as any).N096;

    if (linkType == ButtonLinkType.Program) {
      if (program) {
        this.launchService.launchProgram(program);
      }
    }

    if (linkType == ButtonLinkType.Bookmark) {
      if (program && option) {
        let rcd: MIRecord = new MIRecord();
        (rcd as any).PGNM = program;

        const request: IMIRequest = {
          includeMetadata: true,
          program: 'BOOKMKMI',
          transaction: 'GetParByPgm',
          record: rcd,
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
                if (this.selectedRecord[key]) {
                  // Check date
                  // @ts-expect-error: TODO
                  if (MIUtil.isDate(this.selectedRecord[key])) {
                    // @ts-expect-error: TODO
                    values[key] = MIUtil.getDateFormatted(
                      // @ts-expect-error: TODO
                      this.selectedRecord[key]
                    );
                  } else {
                    // @ts-expect-error: TODO
                    values[key] = this.selectedRecord[key];
                  }
                } else {
                  // Check shortkey (For example, IBPUNO <-> PUNO)
                  const shortKey = key.substr(key.length - 4);
                  // @ts-expect-error: TODO
                  if (this.selectedRecord[shortKey]) {
                    // Check date
                    // @ts-expect-error: TODO
                    if (MIUtil.isDate(this.selectedRecord[shortKey])) {
                      // @ts-expect-error: TODO
                      values[key] = MIUtil.getDateFormatted(
                        // @ts-expect-error: TODO
                        this.selectedRecord[shortKey]
                      );
                    } else {
                      // @ts-expect-error: TODO
                      values[key] = this.selectedRecord[shortKey];
                    }
                    // Special check for zero value
                    // @ts-expect-error: TODO
                  } else if (this.selectedRecord[shortKey] === 0) {
                    // @ts-expect-error: TODO
                    values[key] = this.selectedRecord[shortKey];
                  } else {
                    /**
                     * Special check for alias fields. For example, if you want to drillback
                     * to MMS001 (ITNO), but the selected record which you want to use as
                     * data contains a product record (PRNO)
                     */

                    // const aliasField = this.getAliasField(shortKey, this.selectedRecord);
                    // if (aliasField) {
                    //    values[key] = this.selectedRecord[aliasField];
                    // } else {
                    Log.warning(
                      'Bookmark key value not found, setting value to blank'
                    );
                    // @ts-expect-error: TODO
                    values[key] = ' ';
                    // }
                  }
                }
              }

              const bookmark: IBookmark = {
                program: program,
                table: response.item['FILE'],
                keyNames: keyNames.toString(),
                startPanel: 'B',
                includeStartPanel: false,
                sortingOrder: '1',
                option: option.toString(),
                // @ts-expect-error: TODO
                view: null,
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
    }

    if (linkType == ButtonLinkType.Mashup) {
      let mashupUrl = window.location.origin + '/mne/apps/' + mashup;
      if (mashupQuery) {
        // Look for replacement variable, if any
        if (mashupQuery.indexOf('{') > -1) {
          let isVariableFound = false;
          for (let entity of this.activeContextEntities) {
            for (let entityRecord of this.entityRecords) {
              // @ts-expect-error: TODO
              if (entityRecord['ISEC'] == entity.entityType) {
                const replacementVariable: string =
                  // @ts-expect-error: TODO
                  '{' + entityRecord['FLDI'] + '}';
                if (mashupQuery.indexOf(replacementVariable) > -1) {
                  // @ts-expect-error: TODO
                  const id = 'id' + entityRecord['SQNR'];
                  mashupQuery = mashupQuery.replace(
                    replacementVariable,
                    // @ts-expect-error: TODO
                    entity[id]
                  );
                  isVariableFound = true;
                  break;
                }
              }
            }
          }
          if (!isVariableFound) {
            return;
          }
        }
        mashupUrl += mashupQuery;
      }
      this.launchService.launchUrl(mashupUrl);
    }

    if (linkType == ButtonLinkType.URL) {
      if (url) {
        if (url.indexOf('{') > -1) {
          let isVariableFound = false;
          for (let entity of this.activeContextEntities) {
            for (let entityRecord of this.entityRecords) {
              // @ts-expect-error: TODO
              if (entityRecord['ISEC'] == entity.entityType) {
                const replacementVariable: string =
                  // @ts-expect-error: TODO
                  '{' + entityRecord['FLDI'] + '}';
                if (url.indexOf(replacementVariable) > -1) {
                  // @ts-expect-error: TODO
                  const id = 'id' + entityRecord['SQNR'];
                  // @ts-expect-error: TODO
                  url = url.replace(replacementVariable, entity[id]);
                  isVariableFound = true;
                  break;
                }
              }
            }
          }
          if (!isVariableFound) {
            return;
          }
        }
        if (url.indexOf('lid://') >= 0) {
          const myDrillback = '?LogicalId=' + url;
          // @ts-expect-error: TODO
          window.parent['infor'].companyon.client.sendPrepareDrillbackMessage(
            myDrillback
          );
        } else {
          window.open(url);
        }
      }
    }
  }

  clearSelectedRecord() {
    this.selectedRecord = new MIRecord();
  }

  setActiveContextEntities(
    entities: IContextEntity[],
    entityRecords: MIRecord[]
  ) {
    this.entityRecords = entityRecords;
    for (let entity of entities) {
      if (
        !ArrayUtil.containsByProperty(
          this.activeContextEntities,
          'entityType',
          entity.entityType
        )
      ) {
        this.activeContextEntities.push(entity);
      } else {
        const index = ArrayUtil.indexByProperty(
          this.activeContextEntities,
          'entityType',
          entity.entityType
        );
        this.activeContextEntities[index] = entity;
      }
    }

    // Create a selected record from all active context entities
    for (let record of entityRecords) {
      // @ts-expect-error: TODO
      if (!(record['PGNM'] || record['VFLD'])) {
        if (
          ArrayUtil.containsByProperty(
            this.activeContextEntities,
            'entityType',
            // @ts-expect-error: TODO
            record['ISEC']
          )
        ) {
          let entity: IContextEntity = ArrayUtil.itemByProperty(
            this.activeContextEntities,
            'entityType',
            // @ts-expect-error: TODO
            record['ISEC']
          );
          // @ts-expect-error: TODO
          const field = record['FLDI'];
          // @ts-expect-error: TODO
          const seqnr: number = record['SQNR'];
          // @ts-expect-error: TODO
          const id: string = entity['id' + seqnr];
          if (id) {
            if (!this.selectedRecord) {
              this.selectedRecord = new MIRecord();
            }
            // @ts-expect-error: TODO
            this.selectedRecord[field] = id;
          }
        }
      }
    }

    if (true) {
    }
  }
}
