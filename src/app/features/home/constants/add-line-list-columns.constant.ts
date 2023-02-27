export const COLUMNS: SohoDataGridColumn[] = [
  {
    field: 'MBITNO',
    name: 'poitno',
    filterType: 'text',
  },
  {
    field: 'MMITDS',
    name: 'popitd',
    filterType: 'text',
  },
  {
    width: 90,
    field: 'PLDT',
    name: 'popldt',
    formatter: Soho.Formatters.Date,
    align: 'right',
  },
  /*  {
    field: 'PPQT',
    name: 'poppqt',
    formatter: Soho.Formatters.Integer,
    align: 'right',
    editor: Soho.Editors.Input,
  }, */
  {
    field: 'MMPUPR',
    name: 'popupr',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
  {
    field: 'TPUP',
    name: 'totalPrice',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
  {
    field: 'MMCUCD',
    name: 'currency',
    filterType: 'text',
  },
  {
    field: 'MMGRWE',
    name: 'weight',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    numberFormat: { minimumFractionDigits: 3, maximumFractionDigits: 3 },
  },
  {
    field: 'MMVOL3',
    name: 'volume',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    numberFormat: { minimumFractionDigits: 3, maximumFractionDigits: 3 },
  },
  {
    field: 'TGRW',
    name: 'totalWeight',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    numberFormat: { minimumFractionDigits: 3, maximumFractionDigits: 3 },
  },
  {
    field: 'TVOL',
    name: 'totalVolume',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    numberFormat: { minimumFractionDigits: 3, maximumFractionDigits: 3 },
  },
];
