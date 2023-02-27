import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { CoreBase, IMIRequest, IMIResponse, MIRecord } from '@infor-up/m3-odin';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';
import { MIService } from '@infor-up/m3-odin-angular';

import { SohoContextualActionPanelService } from 'ids-enterprise-ng';

import { GdisStore, ButtonLinkLevel } from '../../../../index';
import { DemoButtonLinkService } from '../services/button-link.service';
import { Action } from '../enums/action.enum';
import { Cugex } from '../enums/cugex.enum';
import { IButtonLink } from '../types/button-link.type';
import { ButtonLinkDialogComponent } from '../dialogs/button-link-dialog/button-link-dialog.component';

/**
 * The button link page is used to display buttons in a mashup
 *
 */
@Component({
  selector: 'm3-button-link-page',
  styleUrls: ['./button-link-page.component.css'],
  templateUrl: './button-link-page.component.html',
})
/**
 *
 * This is a base class for showing M3 monitor data
 *
 */
export class DemoButtonLinksPageComponent
  extends CoreBase
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() selectedParentRecord!: MIRecord;

  @ViewChild('buttonLinkPlaceholder', { static: false })
  buttonLinkPlaceholder!: ViewContainerRef;

  isBusy = false;
  buttonLinks: IButtonLink[] = [];

  // TODO:replace hardcoded values
  tooltip = 'Add new button link';

  constructor(
    private miService: MIService,
    private buttonLinkService: DemoButtonLinkService,
    private panelService: SohoContextualActionPanelService,
    private gdisStore: GdisStore
  ) {
    super('ButtonLinkPageComponent');
  }

  ngOnInit() {
    this.getButtonLinks();
  }

  ngAfterViewInit() {
    this.buttonLinkService.placeHolder = this.buttonLinkPlaceholder;
    this.buttonLinkService.buttonLinkChange.subscribe(() => {
      this.getButtonLinks();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // When the selected parent record changes, load data via the onApply() method
    if (changes.selectedParentRecord) {
      // this.getButtonLinks();
    }
  }

  getButtonLinks() {
    this.buttonLinks = [];

    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = this.buttonLinkService.applicationName.toUpperCase();
    (record as any).PK03 = Cugex.pk03;

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'LstFieldValue',
      record: record,
      maxReturnedRecords: 999,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        if (!response.hasError()) {
          // @ts-expect-error: TODO
          for (let item of response.items) {
            this.buttonLinks.push({
              key: item,
              type: (item as any).N096,
              name: (item as any).A030,
              program: (item as any).A130,
              option: (item as any).N196,
              mashup: (item as any).A130,
              mashupQuery: (item as any).A121,
            });
          }
          //  this.buttonLinks = response.items;
        }
      },
      (error: MIResponse) => {
        // Do nothing
      }
    );
  }

  onAddButton() {
    this.buttonLinkService.selectedAction = Action.Add;
    this.buttonLinkService.panelRef = this.panelService
      .contextualactionpanel(
        ButtonLinkDialogComponent,
        this.buttonLinkService.placeHolder
      )
      .title('Add Button')
      .initializeContent(true)
      .open();
  }

  onButtonLinkClick(buttonLink: IButtonLink) {
    this.buttonLinkService.buttonClicked(buttonLink);
  }

  onEditButton() {
    this.buttonLinkService.buttonLinks = this.buttonLinks;
    this.buttonLinkService.selectedAction = Action.Edit;
    this.buttonLinkService.panelRef = this.panelService
      .contextualactionpanel(
        ButtonLinkDialogComponent,
        this.buttonLinkService.placeHolder
      )
      .title('Edit Button')
      .initializeContent(true)
      .open();
  }

  onDeleteButton() {
    this.buttonLinkService.buttonLinks = this.buttonLinks;
    this.buttonLinkService.selectedAction = Action.Delete;
    this.buttonLinkService.panelRef = this.panelService
      .contextualactionpanel(
        ButtonLinkDialogComponent,
        this.buttonLinkService.placeHolder
      )
      .title('Remove Button')
      .initializeContent(true)
      .open();
  }

  isEdit() {
    const buttonLinkLevel =
      this.gdisStore.state.buttonLink.currentButtonLinkLevel;
    if (buttonLinkLevel === ButtonLinkLevel.Edit) {
      return true;
    }
    return false;
  }
}
