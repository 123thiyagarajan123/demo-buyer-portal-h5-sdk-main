import { ErrorHandler } from '@angular/core';

import { ErrorService } from '../services';

export const errorHandler = { provide: ErrorHandler, useClass: ErrorService };
