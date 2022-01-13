import { useState } from 'react';
import { message } from 'antd';
import type { ExportColumns } from './util';
import { JSON2Sheet } from './util';
import exportExcel from './util';

export interface ExportParams<D> {
  fetch: () => Promise<{
    fetchSlice: (params: {
      current: number;
      perSize: number;
    }) => Promise<{ data: D[]; total: number }>;
    fetchTotal?: () => Promise<D> | undefined;
  }>;
  name: string | (() => string);
  columns: ExportColumns<D>;
  perSize?: number;
  maxConcurrent?: number;
}

export default <D extends Record<any, any> = any>({
  fetch,
  name,
  columns,
  perSize = 100,
  maxConcurrent = 8,
}: ExportParams<D>) => {
  const [loading, setLoading] = useState(false);

  async function exporter() {
    try {
      setLoading(true);

      const n = typeof name === 'function' ? name() : name;

      let total = perSize * 2,
        current = 0,
        arr: D[] = [];

      const { fetchSlice, fetchTotal } = await fetch();

      const [res, summary] = await Promise.all([fetchSlice({ current, perSize }), fetchTotal?.()]);

      if (summary) arr = arr.concat(summary);
      arr = arr.concat(res.data);

      current++;
      total = +res.total;
      const maxFetchCount = Math.ceil(total / perSize) - 1,
        maxConcurrentFetchCount = Math.ceil(maxFetchCount / maxConcurrent);

      for (let i = 0; i < maxConcurrentFetchCount; i++) {
        message.loading({
          content: `分片下载中，当前第${i + 1}片, 共${maxConcurrentFetchCount}片`,
          key: n,
        });

        const offset = i * maxConcurrent;
        const concurrent = await Promise.all(
          Array(Math.min(maxConcurrent, maxFetchCount - i * maxConcurrent))
            .fill(Object.create(null))
            .map((_, idx) =>
              fetchSlice({ current: current + offset + idx, perSize }).then((r) => r.data),
            ),
        );
        arr = arr.concat(...concurrent);
      }

      if (!arr?.length) throw new Error('无数据');

      exportExcel(JSON2Sheet(arr, columns), n);
    } catch (e: any) {
      message.destroy();
      message.error(`导出失败： ${e?.message}`);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    exporter,
  };
};
