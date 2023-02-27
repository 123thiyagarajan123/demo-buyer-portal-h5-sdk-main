import { Inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Log } from '@infor-up/m3-odin';

import { WINDOW } from '@core/tokens';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SnapshotService {
  constructor(
    @Inject(WINDOW) readonly window: Window,
    private readonly location: Location
  ) {}

  copyLink() {
    let currentPath = this.location.path();
    currentPath = `${environment.mne}${environment.title}/#${currentPath}?snapshot=true`;
    navigator.clipboard.writeText(currentPath).then(
      () => Log.info('Copied to clipboard: ' + currentPath),
      () => Log.error('Copied to clipboard failed: ' + currentPath)
    );
  }
}
