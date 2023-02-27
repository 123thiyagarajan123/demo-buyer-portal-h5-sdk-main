import { ErrorHandler } from '@angular/core';

import { ErrorService } from '@core/services/error.service';

export const errorHandler = { provide: ErrorHandler, useClass: ErrorService };
