// 文档 https://github.com/SheetJS/sheetjs
import XLSX from 'xlsx';

export type ExportColumn<T, C = any> = {
  // 当前列名
  title?: any;
  // 自定义转化器
  replacer?: (text: any, idx: number, row: T, col: C) => string;
};

export type ExportColumns<T extends Record<any, any> = any> = Record<string, ExportColumn<T>>;

export type Row = Record<string, any>;

// json -> json 根据column的转化json格式
export function JSON2Sheet<T extends Record<any, any> = any>(
  json: T[],
  columns: ExportColumns<T>,
): Row[] {
  const allowKeys = Object.keys(columns);
  return json.map((j) =>
    allowKeys.reduce((row: Row, key, idx) => {
      const pv = j[key],
        col = columns[key],
        colName = col?.title ?? 'unknown',
        replacer = col?.replacer,
        fv = replacer ? replacer(pv, idx, j, col) : pv;

      return { ...row, [colName]: fv };
    }, {}),
  );
}

// json -> excel
export default function exportExcel(sheets: Row[], name: string = 'sheetjs') {
  /* convert state to workbook */
  const ws = XLSX.utils.json_to_sheet(sheets);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
  /* generate XLSX file and send to client */
  XLSX.writeFile(wb, `${name}.xlsx`);
}
