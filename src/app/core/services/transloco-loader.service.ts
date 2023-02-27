import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { tap } from 'rxjs/operators';

import { Log } from '@infor-up/m3-odin';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslocoLoaderService implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    Log.info(`Retrieving translation for: ${lang}`);
    const { translationsPath, extensionType } = environment.transloco;
    return this.http
      .get<Translation>(`${translationsPath}${lang}${extensionType}`)
      .pipe(
        tap({
          next: (res) =>
            Log.info(`Success retrieving translation for: ${lang}`),
          error: (err) =>
            Log.error(`Error retrieving translation for: ${lang}`),
        })
      );
  }
}
