import { Injectable } from '@angular/core';

import { tap } from 'rxjs/operators';

import { UserService as OdinUserService } from '@infor-up/m3-odin-angular';

import { GdisStore } from './gdis.store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private odinUserService: OdinUserService,
    private store: GdisStore
  ) {}

  getUserContext() {
    return this.odinUserService.getUserContext().pipe(
      tap({
        next: (userContext) => this.store.setUserContext(userContext),
      })
    );
  }
}
