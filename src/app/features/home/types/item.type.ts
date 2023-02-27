import { MIRecord } from '@infor-up/m3-odin';

export interface IItem extends MIRecord {
  MBWHLO: string;
  MBITNO: string;
  MMITDS: string;
  MMPUPR: number;
  MMCUCD: string;
  MBLOQT: number;
  MMGRWE: number;
  MMVOL3: number;
  PLDT: Date;
  index: number;
  _isFilteredOut: boolean;
  PPQT: number;
  _selected: boolean;
  TPUP: string;
  TGRW: string;
  TVOL: string;
}
