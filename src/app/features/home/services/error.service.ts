import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import { ErrorState, Log } from '@infor-up/m3-odin';

import { ErrorType } from '@core/enums/error-type.enum';

import { Config } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class ErrorService implements ErrorHandler {
  constructor() {}

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
        errorMessage = `${ErrorType.CLIENT_SIDE} ${JSON.stringify(error)}`;
      }
    }

    // Always log errors
    Log.fatal(`[${Config.Scope.toUpperCase()} FEATURE] ${errorMessage}`);
    console.error(error);
  }
}
