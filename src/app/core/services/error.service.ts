import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import { ErrorState } from '@infor-up/m3-odin';

import { ErrorType } from '@core/enums/error-type.enum';

import { MessageService, TranslationService } from '@gdis/api';

import { SystemService } from './system.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService implements ErrorHandler {
  constructor(
    private messageService: MessageService,
    private systemService: SystemService,
    private translationService: TranslationService
  ) {}

  handleError(error: unknown) {
    let errorMessage = '';

    // Error(s) from Odin
    if (error instanceof ErrorState) {
      // UserContext error
      if ((error as any).errorMessage) {
        errorMessage = `${ErrorType.ODIN_ERRORSTATE} ${
          (error as any).errorMessage
        }`;
      } else {
        errorMessage = `${ErrorType.ODIN_ERRORSTATE} ${JSON.stringify(error)}`;
      }
    } else {
      // Server Side Error from Angular
      if (error instanceof HttpErrorResponse) {
        // Inside Error
        if (error.error instanceof ErrorEvent) {
          errorMessage = `${ErrorType.SERVER_SIDE_INSIDE} ${error.error.message}`;
        }
        // Outside Error
        else {
          errorMessage = `${ErrorType.SERVER_SIDE_OUTSIDE} ${error.status}: ${error.message}`;
        }
      }

      // Client Side Error
      if (error instanceof Error) {
        errorMessage = `${ErrorType.CLIENT_SIDE} ${error.name}: ${error.message}`;
      } else {
        // Example: throw 'x' or throw {y: true} etc...
        errorMessage = `${ErrorType.CLIENT_SIDE}  ${JSON.stringify(error)}`;
      }
    }

    // Show message to user
    // this.showErrorMessage(errorMessage);

    // Always log errors
    console.error(error);
  }

  showErrorMessage(message: string) {
    const title = this.translationService.translate('errorTitle');
    const messageTitle = this.translationService.translate('errorMessageTitle');
    const messageSubTitle = this.translationService.translate(
      'errorMessageSubTitle'
    );
    const buttonLabel = this.translationService.translate('errorButtonLabel');
    this.messageService
      .error()
      .title(`<span>${title}</span>`)
      .message(
        `${messageTitle}
         <br/><br/>
         ${messageSubTitle}
         <br/><br/>
         ${message}`
      )
      .buttons([
        {
          text: buttonLabel,
          click: (_, modal) => {
            modal.close(true);
            this.systemService.restartApplication();
          },
          isDefault: true,
        },
      ])
      .open();
  }
}
