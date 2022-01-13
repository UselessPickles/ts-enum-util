import { useState } from 'react';
import { Space, Select, Image, Skeleton, Empty, Typography } from 'antd';
import type { SelectProps, SpaceProps } from 'antd';
import type { SelectValue } from 'antd/lib/select';

import { useInfiniteQuery, useQuery } from 'react-query';

import { services } from '@/pages/GameStore/mgt/services';
import type Game from '@/pages/GameStore/mgt/models';
import type { Response } from '@/model/Response';

import type { ListProps } from 'react-virtualized';
import { List, InfiniteLoader, AutoSizer } from 'react-virtualized';

import styles from './index.less';
import useThrottle from '@/EDK/hooks/useThrottle';

const { Text } = Typography;

export default function (props: SelectProps<SelectValue>) {
  const [value, setValue] = useState<SelectValue>(),
    [open, setOpen] = useState(false),
    realValue = props?.value ?? value,
    realChange = props?.onChange ?? setValue,
    [searchValue, setSearchValue] = useState(typeof realValue === 'string' ? realValue : void 0),
    setSearchValueWithThrottle = useThrottle(setSearchValue);

  const checkedDataSource = useQuery(
      ['game-mgt-prod-checked', realValue],
      () =>
        services
          .page({ data: { packageOrGameName: `${realValue}` } }, 'prod')
          .then((res) => res.data),
      { refetchOnWindowFocus: false, enabled: !!realValue },
    ),
    allChecked: Game[] = checkedDataSource?.data?.total_datas ?? [],
    { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<Response<Game>>(
      ['game-mgt-prod', searchValue],
      ({ pageParam }) =>
        services
          .page({ data: { page: { pageNo: pageParam }, packageOrGameName: searchValue } }, 'prod')
          .then((res) => res.data),
      {
        getNextPageParam: ({ page_no, page_size, total_count }) =>
          +total_count - +page_no * +page_size > 0 ? page_no + 1 : void 0,
        refetchOnWindowFocus: false,
      },
    ),
    rowCount = data?.pages?.[0]?.total_count ?? 0,
    dataSource =
      data?.pages?.reduce(
        (acc: Game[], p) =>
          acc.concat(p.total_datas?.filter((d) => !allChecked?.some((c) => c.id === d.id))),
        allChecked,
      ) || [],
    dataSourceOpts = dataSource?.map((d) => ({ label: d.gameName, value: d.id }));

  // react-window-infinite
  // const length = pages?.length || 0;
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  // const itemCount = hasNextPage ? length + 1 : length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = () => (isFetching ? Promise.resolve() : fetchNextPage());

  // Every row is loaded except for our loading indicator row.
  // const isItemLoaded = index => !hasNextPage || index < pages.length;
  const isItemLoaded = ({ index }: { index: number }) => !hasNextPage || index < dataSource?.length;

  const onSelect: SpaceProps['onClick'] = (e) => {
    const id = Number(e.currentTarget.dataset?.id),
      i = dataSource.filter((d) => +d.id === +id).map((d) => ({ label: d.gameName, value: d.id })),
      output = props.mode ? ([] as any[]).concat(realValue, id) : id;

    realChange?.(output, i);
    if (!props?.mode) {
      setOpen(false);
    }
  };

  const GameItem = ({ g }: { g: Game }) => {
    return (
      <Space size="small" key={g?.id}>
        <Image src={g?.gameIcon} preview={false} height={60} width={60} />
        <Space direction="vertical">
          {g?.gameName}
          <Text type="secondary">{g?.packageName}</Text>
        </Space>
      </Space>
    );
  };

  const rowRenderer: ListProps['rowRenderer'] = ({ index, style }) => {
    const d = dataSource?.[index],
      checked = ([] as SelectValue[]).concat(realValue)?.includes(d?.id);

    return (
      <Space
        size="small"
        style={{ ...style, padding: 6 }}
        key={d?.id}
        className={[styles['row-renderer'], checked && styles.checked]?.join(' ')}
        data-id={d?.id}
        onClick={onSelect}
      >
        {isItemLoaded({ index }) ? (
          <GameItem g={d} />
        ) : (
          <>
            <Skeleton.Avatar active />
            <Skeleton.Input active style={{ width: '256px' }} />
          </>
        )}
      </Space>
    );
  };

  const dropdownRender = () =>
    dataSource?.length ? (
      <InfiniteLoader isRowLoaded={isItemLoaded} rowCount={rowCount} loadMoreRows={loadMoreItems}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                width={width}
                height={360}
                rowCount={rowCount}
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                rowHeight={72}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    ) : (
      <Empty />
    );

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Select<any>
        {...props}
        onSearch={setSearchValueWithThrottle}
        showSearch
        value={realValue}
        onChange={realChange}
        dropdownMatchSelectWidth={false}
        loading={isFetching}
        dropdownRender={dropdownRender}
        options={dataSourceOpts}
        open={open}
        onDropdownVisibleChange={setOpen}
      />
      {realValue &&
        ([] as SelectValue[])
          .concat(realValue)
          ?.map((r) => (
            <GameItem key={`${r}`} g={dataSource.find((g) => +g.id === Number(r)) as Game} />
          ))}
    </Space>
  );
}
