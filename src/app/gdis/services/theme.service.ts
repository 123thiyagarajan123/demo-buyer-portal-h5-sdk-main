import { Injectable } from '@angular/core';

import { SohoPersonalizeDirective } from 'ids-enterprise-ng';

import { GdisStore } from '..';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private personalizeRef!: SohoPersonalizeDirective;

  constructor(private store: GdisStore) {}

  initialize(personalize: SohoPersonalizeDirective) {
    this.personalizeRef = personalize;

    this.getThemeModes(); // call to update global store as a side effect
    this.getThemeColors(); // call to update global store as a side effect

    this.setThemeColor('default');
    this.setThemeMode(this.personalizeRef.currentTheme.id);
  }

  getThemeModes() {
    const themeModes = this.personalizeRef.themes();
    this.store.setTheme({ themeModes });
    return themeModes;
  }

  getThemeMode() {
    return this.store.state.theme.currentThemeMode;
  }

  setThemeMode(theme: string) {
    if (!theme) {
      return;
    }

    this.personalizeRef.theme = theme;
    this.store.setTheme({ currentThemeMode: theme });
  }

  getThemeColors() {
    const themeColors = this.personalizeRef.personalizationColors();
    this.store.setTheme({ themeColors });
    return themeColors;
  }

  getThemeColor() {
    return this.store.state.theme.currentThemeColor;
  }

  setThemeColor(color: string | undefined) {
    if (!color) {
      return;
    }

    color = color.toLowerCase();

    // special case, h5-client uses "green" when it should be "emerald"
    if (color === 'green') {
      color = 'emerald';
    }

    // special case, h5-client misspelled "turqoise" should be "turquoise"
    if (color === 'turqoise') {
      color = 'turquoise';
    }

    const colors = this.getThemeColors();
    const colorValue = colors[color].value;
    const colorId = colors[color].id;

    this.personalizeRef.colors = colorValue;
    this.store.setTheme({ currentThemeColor: colorId });
  }
}
