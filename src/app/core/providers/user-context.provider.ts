import { APP_INITIALIZER } from '@angular/core';

import { first } from 'rxjs/operators';

import { UserService } from '@gdis/api';

function initializeUserContextFactory(userService: UserService) {
  return () => userService.getUserContext().pipe(first()).toPromise();
}

export const userContextInitializer = {
  provide: APP_INITIALIZER,
  useFactory: initializeUserContextFactory,
  deps: [UserService],
  multi: true,
};
