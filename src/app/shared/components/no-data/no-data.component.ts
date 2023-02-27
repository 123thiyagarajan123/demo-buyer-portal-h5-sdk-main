import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { take } from 'rxjs/operators';

import { CoreBase } from '@infor-up/m3-odin';

import { GdisStore, TranslationService } from '@gdis/api';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.css'],
})
export class NoDataComponent extends CoreBase implements OnInit {
  store$ = this.store.state$;
  currentUrl!: string;
  previousUrl!: string;
  title!: string;
  info!: string;
  buttonName!: string;

  constructor(
    private store: GdisStore,
    private router: Router,
    private translationService: TranslationService
  ) {
    super('NoDataComponent');
  }

  ngOnInit(): void {
    this.translationService
      .selectTranslate('notFoundTitle')
      .pipe(take(1))
      .subscribe({ next: (value) => (this.title = value) });

    this.translationService
      .selectTranslate('notFoundInfo')
      .pipe(take(1))
      .subscribe({ next: (value) => (this.info = value) });

    this.translationService
      .selectTranslate('notFoundButtonLabel')
      .pipe(take(1))
      .subscribe({ next: (value) => (this.buttonName = value) });
  }

  onClick() {
    this.router.navigateByUrl(this.previousUrl);
  }
}
