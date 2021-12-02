import { useEffect, useState } from 'react';
import { Form, Select, InputNumber, Radio, Modal } from 'antd';
import { useContainer, useModalFromSubmit } from '../useStore';
import DrawerForm from '@/components/DrawerForm';
import styles from '../index.less';
import { gameList } from '@/services/gameQuery';
import RESTful from '@/utils/RESTful';

const { Item } = Form,
  { Option } = Select,
  { confirm } = Modal;

export default () => {
  const {
      modalProps,
      modalFormRef,
      setEditRecord,
      editRecord,
      page,
      setPage,
      loading,
      setLoading,
      selectGame,
      setSelectGame,
      inputSelect,
      setInputSelect,
    } = useContainer(),
    { submitor, onCancel } = useModalFromSubmit(),
    [dataSource, setDataSource] = useState<any>([]);

  async function queryGameList() {
    setLoading(true);
    page == 1 && setDataSource([]);
    inputSelect && setPage(1);
    try {
      const res = await gameList({
        data: {
          packageOrGameName: inputSelect,
          page: {
            pageNo: inputSelect ? 1 : page,
            pageSize: inputSelect ? 1000 : 20,
          },
        },
      });
      if (res) {
        const isEdit = modalProps?.title === '编辑';
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
        console.log('source', dataSource);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  const onscroll = (e: any) => {
    if (
      dataSource?.length > 0 &&
      !inputSelect &&
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 1
    ) {
      setPage(page + 1);
    }
  };

  function showGameOptions(
    name: string,
    packageName: string,
    num: any,
    icon: string,
    isChecked: boolean,
  ) {
    return (
      <div className={isChecked ? styles.GameShow : styles.GameOptions} key={num}>
        <img src={icon} />
        <div className={styles.gameBody}>
          <div>{name}</div>
          <div className={styles.packge}>{packageName}</div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    queryGameList();
  }, [page, inputSelect, editRecord]);

  return (
    <DrawerForm
      onCancel={() => {
        onCancel();
      }}
      onSubmit={submitor}
      modalProps={modalProps}
      formProps={{
        layout: 'vertical',
        form: modalFormRef,
        initialValues: { showStatus: 1 },
      }}
    >
      <Item label="游戏名称" name="gameNum" rules={[{ required: true }]}>
        <Select
          optionLabelProp="label"
          allowClear
          loading={loading}
          showSearch
          filterOption={false}
          onSearch={(value) => setInputSelect(value)}
          onPopupScroll={onscroll}
          onClear={() => setSelectGame([])}
          onSelect={(_, option) => setSelectGame([option])}
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
                {showGameOptions(gameName, packageName, gameNum, gameIcon, false)}
              </Option>
            );
          })}
        </Select>
      </Item>
      <Item noStyle dependencies={['gameName']}>
        {({}) => {
          const item = selectGame?.[0],
            { icon, label, pname, value } = item ?? {};
          return selectGame?.length > 0 && showGameOptions(label, pname, value, icon, true);
        }}
      </Item>
      <Item label="展示状态" name="showStatus" rules={[{ required: true }]}>
        <Radio.Group
          optionType="button"
          options={[
            { value: 1, label: '展示' },
            { value: 0, label: '隐藏' },
          ]}
        />
      </Item>
      <Item
        label={[
          <>
            <span>展示位置</span>
            <span style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: '8px' }}>
              (可在首页前50个位置中，任意一个位置展示)
            </span>
          </>,
        ]}
        name="sort"
        rules={[
          { required: true },
          ({}) => {
            return {
              async validator(_, sort) {
                const numOption = await RESTful.get('fxx/game/index/numOption').then(
                  (res) => res?.data,
                );
                if (sort > 50 || sort < 1) {
                  return Promise.reject('请输入1-50区间的数字（包含1和50）');
                }
                if (!numOption.includes(sort) && sort != editRecord?.sort) {
                  return Promise.reject('此展示位置已配置游戏');
                }
                return Promise.resolve();
              },
            };
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请输入数值0-50"
          stringMode
          precision={0}
        />
      </Item>
    </DrawerForm>
  );
};
