import { Injectable } from '@angular/core';

import { SohoAboutService, SohoMessageService } from 'ids-enterprise-ng';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(
    private messageService: SohoMessageService,
    private aboutService: SohoAboutService
  ) {}

  error(options?: SohoMessageOptions | undefined) {
    return this.messageService.error(options);
  }

  message(options?: SohoMessageOptions | undefined) {
    return this.messageService.message(options);
  }

  alert(options?: SohoMessageOptions | undefined) {
    return this.messageService.alert(options);
  }

  confirm(options?: SohoMessageOptions | undefined) {
    return this.messageService.confirm(options);
  }

  about(options?: SohoAboutOptions | undefined) {
    return this.aboutService.about(options);
  }
}
