export const COLUMNS: SohoDataGridColumn[] = [
  {
    id: 'selectionCheckbox',
    field: 'SELECT',
    formatter: Soho.Formatters.SelectionCheckbox,
    align: 'center',
    sortable: false,
  },
  {
    width: 90,
    field: 'PORELD',
    name: 'poreld',
    filterType: 'date',
    formatter: Soho.Formatters.Date,
    align: 'right',
  },
  {
    field: 'POITNO',
    name: 'poitno',
    filterType: 'text',
  },
  {
    field: 'POPITD',
    name: 'popitd',
    filterType: 'text',
  },
  {
    field: 'POPSTS',
    name: 'popsts',
    filterType: 'text',
  },
  {
    field: 'POACTP',
    name: 'poactp',
    filterType: 'text',
  },
  {
    field: 'POMSG1',
    name: 'pomsg1',
    filterType: 'text',
  },
  {
    width: 90,
    field: 'POPLDT',
    name: 'popldt',
    filterType: 'date',
    formatter: Soho.Formatters.Date,
    align: 'right',
  },
  {
    field: 'PORORN',
    name: 'pororn',
    filterType: 'text',
  },
  {
    field: 'POPLPN',
    name: 'poplpn',
    filterType: 'text',
  },
  {
    field: 'POPUPR',
    name: 'popupr',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    filterType: 'decimal',
  },
  {
    field: 'POPPQT',
    name: 'poppqt',
    formatter: Soho.Formatters.Integer,
    align: 'right',
    filterType: 'integer',
  },
  {
    field: 'POGETY',
    name: 'pogety',
    filterType: 'text',
  },

  {
    field: 'MMGRWE',
    name: 'weight',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    filterType: 'decimal',
  },
  {
    field: 'MMVOL3',
    name: 'volume',
    formatter: Soho.Formatters.Decimal,
    align: 'right',
    filterType: 'decimal',
  },
  {
    field: 'POMODL',
    name: 'pomodl',
    filterType: 'text',
  },
  {
    field: 'POTEDL',
    name: 'potedl',
    filterType: 'text',
  },
  {
    field: 'POWHLO',
    name: 'powhlo',
    filterType: 'text',
  },
];
