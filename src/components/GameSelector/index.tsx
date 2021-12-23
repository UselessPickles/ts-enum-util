import RESTful from '@/utils/RESTful';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

export interface GameSelectProps extends SelectProps<T> {
  editRecord?: any;
  isEdit?: boolean;
}

export default ({ editRecord, isEdit, ...props }: GameSelectProps) => {
  const [inputSelect, setInputSelect] = useState<string>(),
    [page, setPage] = useState<any>(1),
    [dataSource, setDataSource] = useState<any>([]),
    [loading, setLoading] = useState<boolean>(false);

  const { Option } = Select;

  async function queryGameList() {
    setLoading(true);
    page == 1 && setDataSource([]);
    inputSelect && setPage(1);
    try {
      const res = await RESTful.post('fxx/game/prod/page', {
        data: {
          packageOrGameName: inputSelect,
          page: {
            pageNo: inputSelect ? 1 : page,
            pageSize: inputSelect ? 1000 : 20,
          },
        },
      });
      if (res) {
        const data = res?.data?.total_datas?.filter((item: { status: number; gameNum: string }) => {
          return (
            item.status == 1 &&
            (isEdit && !inputSelect ? item.gameNum !== editRecord?.gameNum : true)
          );
        });
        if (isEdit && page == 1) {
          setDataSource(inputSelect ? data : [editRecord]?.concat(data));
        } else {
          setDataSource(inputSelect || page == 1 ? data : dataSource?.concat(data));
        }
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    queryGameList();
  }, [page, inputSelect, editRecord]);

  const onscroll = (e: any) => {
    if (
      dataSource?.length > 0 &&
      !inputSelect &&
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 1
    ) {
      setPage(page + 1);
    }
  };

  return (
    <Select
      optionLabelProp="label"
      allowClear
      loading={loading}
      showSearch
      filterOption={false}
      onSearch={(value) => setInputSelect(value)}
      onPopupScroll={onscroll}
      {...props}
    >
      {dataSource?.map((item: any, index: any) => {
        const { packageName, gameName, gameNum, gameIcon } = item ?? {};
        return (
          <Option
            pname={packageName}
            label={gameName}
            value={gameNum}
            icon={gameIcon}
            className={styles.Options}
            key={index}
          >
            <div className={styles.GameOptions} key={gameNum}>
              <img src={gameIcon} />
              <div className={styles.gameBody}>
                <div>{gameName}</div>
                <div className={styles.packge}>{packageName}</div>
              </div>
            </div>
          </Option>
        );
      })}
    </Select>
  );
};
