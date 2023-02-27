import { Injectable } from '@angular/core';

import { UserService, MIService } from '@infor-up/m3-odin-angular';
import {
  IUserContext,
  MIRecord,
  Log,
  IMIRequest,
  IMIResponse,
} from '@infor-up/m3-odin';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { DemoButtonLinkService } from '../../features/button-links/services/button-link.service';

@Injectable({
  providedIn: 'root',
})

/**
 * The DemoBusinessContextService is used to send business context messages to the
 * Infor OS context application area. It takes the data from the selectedRecord and
 * constructs context entities for all applicable fields in the selectedRecord
 */
export class DemoBusinessContextService {
  private userContext!: IUserContext;
  private entityRecords: MIRecord[] = [];

  constructor(
    private userService: UserService,
    private miService: MIService,
    private buttonLinkService: DemoButtonLinkService
  ) {
    this.userService.getUserContext().subscribe((userContext: IUserContext) => {
      this.userContext = userContext;
    });

    let record: MIRecord = new MIRecord();
    // @ts-expect-error: TODO
    record['ISEC'] = '';

    const request: IMIRequest = {
      includeMetadata: true,
      program: 'MNS035MI',
      transaction: 'LstByEntity',
      record: record,
      maxReturnedRecords: 999,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          // @ts-expect-error: TODO
          this.entityRecords = response.items;
        }
      },
      (error: MIResponse) => {
        // Do nothing for now
      }
    );
  }

  getBusinessContextRecords(): MIRecord[] {
    return this.entityRecords;
  }

  /**
   * Gets all valid context entities for an MIRecord.
   * @param record
   */
  getContextEntities(record: MIRecord): any[] {
    let contextEntities: IContextEntity[] = [];
    const cono = this.userContext.currentCompany;
    const divi = this.userContext.currentDivision;

    // Get record fields
    const fields: string[] = Object.keys(record);

    // Loop through all fields of the record
    for (let field of fields) {
      // Check against the entities
      for (let entityRecord of this.entityRecords) {
        // @ts-expect-error: TODO
        if (!entityRecord['PGNM']) {
          // @ts-expect-error: TODO
          if (field == entityRecord['FLDI']) {
            // @ts-expect-error: TODO
            const entityType: string = entityRecord['ISEC'];
            // @ts-expect-error: TODO
            const seqnr: number = entityRecord['SQNR'];
            let contextEntity: IContextEntity;

            // Check for existing accounting entity
            // @ts-expect-error: TODO
            contextEntity = contextEntities.find(
              (e) => e.entityType === entityType
            );

            // ContextEntity exist
            if (contextEntity) {
              // @ts-expect-error: TODO
              contextEntity['id' + seqnr] = record[field];
            } else {
              // Create new
              contextEntity = {
                accountingEntity: cono + '_' + divi,
                entityType: entityType,
                visible: true,
                drillbackURL: '',
              };
              // @ts-expect-error: TODO
              if (record[field]) {
                // @ts-expect-error: TODO
                contextEntity['id' + seqnr] = record[field];
                contextEntities.push(contextEntity);
              }
            }
          }
        }
      }
    }
    // Return all entities where we have an id1 present
    return contextEntities.filter((entity) => {
      return entity.id1 !== undefined;
    });
  }

  /**
   * Triggers the business context.
   * @param record
   */
  triggerContext(record: MIRecord) {
    try {
      const type = 'inforBusinessContext';
      const entities: IContextEntity[] = this.getContextEntities(record);
      const data = {
        screenId: 'm3_mashup',
        program: 'MASHUP',
        entities: entities,
      };
      this.buttonLinkService.setActiveContextEntities(
        entities,
        this.entityRecords
      );
      // @ts-expect-error: TODO
      window.parent['infor'].companyon.client.sendMessage(type, data);
    } catch (err) {
      Log.error(err);
    }
  }
}

export interface IContextEntity {
  accountingEntity: string;
  entityType: string;
  id1?: string;
  id2?: string;
  id3?: string;
  id4?: string;
  id5?: string;
  id6?: string;
  visible?: boolean;
  drillbackURL?: string;
}
