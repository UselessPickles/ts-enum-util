import type { LightTableProColumnProps } from '@/EDK/components/LightTablePro';
import type { ExportColumns, ExportColumn } from '..';

export type Exportable<T extends Record<any, any> = any, R = T> = T &
  ExportColumn<R> & {
    forceExport?: boolean;
    noConvent?: boolean;
  };

export default <T>(cols?: Exportable<LightTableProColumnProps<T>, T>[]): ExportColumns<T> =>
  [...(cols ?? [])]
    // 排序
    // order	查询表单中的权重，权重大排序靠前	number
    .sort((a, b) => (b?.order ?? 0) - (a?.order ?? 0))
    .reduce(
      (acc: ExportColumns<T>, cur) =>
        cur?.forceExport || !cur?.hideInTable
          ? {
              ...acc,
              [`${cur.dataIndex}`]: { ...cur, title: `${cur.title}`, replacer: calcColum(cur) },
            }
          : acc,
      {},
    );

function calcColum<T>({
  replacer,
  valueEnum,
  render,
  noConvent,
}: Exportable<LightTableProColumnProps<T>, T>): Exportable<
  LightTableProColumnProps<T>,
  T
>['replacer'] {
  if (noConvent) return;

  if (replacer) return replacer;

  if (render) return (text, index, row) => render(text, row, index) as string;

  if (valueEnum) {
    return (value: any) => {
      if (valueEnum instanceof Map) {
        return valueEnum.get(value) as string;
      }
      return valueEnum[value] as string;
    };
  }
}
