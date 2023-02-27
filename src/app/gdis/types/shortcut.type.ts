import { IBookmark, MIRecord } from '@infor-up/m3-odin';

export interface IShortcut {
  actions: IAction[];
  customActions: ICustomAction[];
  drillBacks: IDrillBack[];
  relatedInformations: IRelatedInformation[];
  currentRecord: IRelatedInformation | null;
}

export interface IAction {
  bookmark: IBookmark;
  messageComplete: string;
  name: string;
}

export interface ICustomAction {
  id: string;
  bookmark?: IBookmark;
  messageComplete?: string;
  name: string;
}

export interface IDrillBack {
  bookmark: IBookmark;
  name: string;
}

export interface IRelatedInformation {
  actions: IAction[];
  customActions: ICustomAction[];
  drillBacks: IDrillBack[];
  name: string;
  record: MIRecord;
}
