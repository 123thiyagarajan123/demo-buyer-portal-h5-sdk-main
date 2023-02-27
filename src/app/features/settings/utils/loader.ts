import { environment } from '@environments/environment';

const { config, extensionType } = environment.transloco;
const availableLangs = config?.availableLangs as string[];

export const loader = availableLangs.reduce((acc, lang) => {
  acc[lang] = () => import(`../i18n/${lang}${extensionType}`);
  return acc;
}, {} as any);
