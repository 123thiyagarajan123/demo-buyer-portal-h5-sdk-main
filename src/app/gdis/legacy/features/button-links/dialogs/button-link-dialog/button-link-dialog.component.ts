import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import {
  ArrayUtil,
  CoreBase,
  IMIRequest,
  IMIResponse,
  MIRecord,
} from '@infor-up/m3-odin';
import { MIService } from '@infor-up/m3-odin-angular';
import { MIResponse } from '@infor-up/m3-odin/dist/mi/runtime';

import { SohoMessageService } from 'ids-enterprise-ng';

import { DemoButtonLinkService } from '../../services/button-link.service';
import { DemoBusinessContextService } from '../../../../services/businesscontext/businesscontext.service';
import { Action } from '../../enums/action.enum';
import { ButtonLinkType } from '../../enums/button-link-type.enum';
import { Cugex } from '../../enums/cugex.enum';
import { IButtonLink } from '../../types/button-link.type';
import { TranslationService } from '../../../../../index';

@Component({
  selector: 'm3-button-link-dialog',
  templateUrl: './button-link-dialog.component.html',
  styleUrls: ['./button-link-dialog.component.css'],
})

/**
 * The ButtonLinkDialogComponent component is used to add buttons to a mashup
 * *
 */
export class ButtonLinkDialogComponent extends CoreBase implements OnInit {
  action!: number;
  buttonLink!: IButtonLink;
  buttonLinks!: IButtonLink[];

  businessContext!: MIRecord;
  businessContexts: MIRecord[] = [];

  options = [
    {
      text: this.translate('buttonLinkProgram'),
      value: ButtonLinkType.Program,
    },
    {
      text: this.translate('buttonLinkBookmark'),
      value: ButtonLinkType.Bookmark,
    },
    { text: this.translate('buttonLinkMashup'), value: ButtonLinkType.Mashup },
    { text: this.translate('buttonLinkUrl'), value: ButtonLinkType.URL },
  ];

  isBusy = false;
  isReady = false;
  selectedRecord!: MIRecord;
  subscription!: Subscription;

  constructor(
    protected messageService: SohoMessageService,
    protected miService: MIService,
    private businessContextService: DemoBusinessContextService,
    public buttonLinkService: DemoButtonLinkService,
    private readonly translationService: TranslationService
  ) {
    super('ButtonLinkDialogComponent');
  }

  ngOnInit(): void {
    this.action = this.buttonLinkService.selectedAction;
    if (this.action == Action.Add) {
      this.buttonLink = {
        type: -1,
        name: '',
        program: '',
        mashup: '',
        mashupQuery: '',
        key: new MIRecord(),
      };
    }
    this.buttonLinks = this.buttonLinkService.buttonLinks;

    // Get business contexts
    const tempContexts: MIRecord[] =
      this.businessContextService.getBusinessContextRecords();

    // Filter out duplicate records
    for (let businessContext of tempContexts) {
      if (
        !ArrayUtil.containsByProperty(
          this.businessContexts,
          'ISEC',
          // @ts-expect-error: TODO
          businessContext['ISEC']
        )
      ) {
        this.businessContexts.push(
          new MIRecord({
            // @ts-expect-error: TODO
            ISEC: businessContext['ISEC'],
          })
        );
      }
    }

    this.isReady = true;
  }

  onButtonLinkSelected(buttonLink: IButtonLink) {
    if (ArrayUtil.containsByProperty(this.options, 'value', buttonLink.type)) {
      // this.selectedOption = ArrayUtil.itemByProperty(
      //   this.options,
      //   'value',
      //   buttonLink.type
      // );
    }

    this.buttonLink = buttonLink;
  }

  onAdd() {
    this.isBusy = true;
    let record: MIRecord = new MIRecord();

    const program = 'CUSEXTMI';
    const transaction = 'AddFieldValue';
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = this.buttonLinkService.applicationName.toUpperCase();
    (record as any).PK03 = Cugex.pk03;
    (record as any).PK04 = this.buttonLink.name.toUpperCase();
    //  (record as any).N096 = (this.option as any).KEY;
    (record as any).N096 = this.buttonLink.type;
    (record as any).A030 = this.buttonLink.name;

    switch (this.buttonLink.type) {
      case ButtonLinkType.Program:
        (record as any).A130 = this.buttonLink.program;
        break;
      case ButtonLinkType.Bookmark:
        (record as any).A130 = this.buttonLink.program;
        (record as any).N196 = this.buttonLink.option;
        break;
      case ButtonLinkType.Mashup:
        (record as any).A130 = this.buttonLink.mashup;
        (record as any).A121 = this.buttonLink.mashupQuery;
        break;
      default:
        (record as any).A121 = this.buttonLink.url;
        break;
    }

    let request: IMIRequest = {
      includeMetadata: true,
      program: program,
      transaction: transaction,
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('buttonLinkOnError'));
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  onCancel() {
    this.buttonLinkService.panelRef.close(true);
  }

  onDelete() {
    this.isBusy = true;
    let record: MIRecord = new MIRecord();
    (record as any).FILE = Cugex.file;
    (record as any).PK01 = (this.buttonLink.key as any).PK01;
    (record as any).PK02 = (this.buttonLink.key as any).PK02;
    (record as any).PK03 = (this.buttonLink.key as any).PK03;
    (record as any).PK04 = (this.buttonLink.key as any).PK04;

    let request: IMIRequest = {
      includeMetadata: true,
      program: 'CUSEXTMI',
      transaction: 'DelFieldValue',
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('buttonLinkOnError'));
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

  onEdit() {
    this.isBusy = true;
    let record: MIRecord = new MIRecord();

    const program = 'CUSEXTMI';
    const transaction = 'ChgFieldValue';

    (record as any).FILE = Cugex.file;
    (record as any).PK01 = Cugex.pk01;
    (record as any).PK02 = this.buttonLinkService.applicationName.toUpperCase();
    (record as any).PK03 = Cugex.pk03;
    (record as any).PK04 = (this.buttonLink as any).PK04;
    (record as any).N096 = this.buttonLink.type;
    (record as any).A030 = this.buttonLink.name;

    switch (this.buttonLink.type) {
      case ButtonLinkType.Program:
        (record as any).A130 = this.buttonLink.program;
        break;
      case ButtonLinkType.Bookmark:
        (record as any).A130 = this.buttonLink.program;
        (record as any).N196 = this.buttonLink.option;
        break;
      case ButtonLinkType.Mashup:
        (record as any).A130 = this.buttonLink.mashup;
        (record as any).A121 = this.buttonLink.mashupQuery;
        break;
      default:
        (record as any).A121 = this.buttonLink.url;
        break;
    }

    //  if (linkType == ButtonLinkType.Program) {
    //    (record as any).A130 = this.buttonLinkProgram;
    //  } else if (linkType == ButtonLinkType.Bookmark) {
    //    (record as any).A130 = this.buttonLinkProgram;
    //    (record as any).N196 = this.buttonLinkOption;
    //  } else if (linkType == ButtonLinkType.Mashup) {
    //    (record as any).A130 = this.buttonLinkMashup;
    //    (record as any).A121 = this.buttonLinkMashupQueryString;
    //  } else {
    //    (record as any).A121 = this.buttonLinkUrl;
    //  }

    let request: IMIRequest = {
      includeMetadata: true,
      program: program,
      transaction: transaction,
      record: record,
      maxReturnedRecords: 1,
      typedOutput: true,
    };

    this.miService.execute(request).subscribe(
      (response: IMIResponse) => {
        this.isBusy = false;
        if (!response.hasError()) {
          this.onResponse(response);
        } else {
          this.onError(this.translate('buttonLinkOnError'));
        }
        this.isBusy = false;
      },
      (error: MIResponse) => {
        this.isBusy = false;
      }
    );
  }

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
      .title(this.translate('buttonLinkErrorTitle'))
      .message(message + this.translate('buttonLinkErrorMessage'))
      .buttons(buttons)
      .open();
  }

  protected onResponse(response: IMIResponse) {
    this.buttonLinkService.buttonLinkChange.emit(this.buttonLink);
    this.buttonLinkService.panelRef.close(true);
  }

  private translate(value: string) {
    return this.translationService.translate(value);
  }
}
