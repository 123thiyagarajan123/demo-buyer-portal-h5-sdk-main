import { SohoButtonType } from 'ids-enterprise-ng';

export interface IHeader {
  hasToolbar: boolean;
  showToolbar: boolean;
  hasTitle: boolean;
  title: string;
  customButton: IHeaderCustomButton | null;
  subTitle: string | null;
  hasTabs: boolean;
  showTabs: boolean;
  tabs: IHeaderTab[];
  buttons: IHeaderButton[];
  showButtons: boolean;
  isTitleFavor: boolean;
}

export interface IHeaderButton extends SohoButtonOptions {
  disabled?: boolean;
  hidden?: boolean;
  variant: SohoButtonType;
  onClick: () => void;
}

export interface IHeaderCustomButton extends SohoButtonOptions {
  disabled?: boolean;
  onClick?: () => void;
}

export interface IHeaderTab {
  id?: string;
  title?: string;
  content?: string;
  disabled?: boolean;
  hidden?: boolean;
  isSelected?: boolean;
  onClick: () => void;
}
