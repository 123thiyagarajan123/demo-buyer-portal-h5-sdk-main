export interface ITheme {
  themeModes: SohoTheme[] | null;
  themeColors: SohoPersonalizationColors | null;
  currentThemeMode: string | null;
  currentThemeColor: string | null;
}
