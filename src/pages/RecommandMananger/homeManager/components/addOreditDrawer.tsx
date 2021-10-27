import { useEffect, useState } from 'react';
import { Form, Select, InputNumber, Radio, Modal } from 'antd';
import { useContainer, useModalFromSubmit } from '../useStore';
import DrawerForm from '@/components/DrawerForm';
import styles from '../index.less';
import { gameList } from '@/services/gameQuery';

const { Item } = Form,
  { Option } = Select,
  { confirm } = Modal;

export default () => {
  const {
      modalProps,
      modalFormRef,
      setEditRecord,
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
        const data = res?.data?.total_datas?.filter((item: { status: number }) => {
          return item.status == 1;
        });
        setDataSource(inputSelect || page == 1 ? data : dataSource?.concat(data));
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }

  const onscroll = (e) => {
    if (
      dataSource?.length > 0 &&
      !inputSelect &&
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 1
    ) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    queryGameList();
  }, [page, inputSelect]);

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
        className: styles.editForm,
        initialValues: { showStatus: 1 },
      }}
    >
      <Item label="游戏名称" name="categoryName" rules={[{ required: true }]}>
        <Select
          optionLabelProp="value"
          allowClear
          loading={loading}
          showSearch
          filterOption={false}
          onSearch={(value) => setInputSelect(value)}
          onPopupScroll={onscroll}
          onClear={() => setSelectGame([])}
          onSelect={(_, option) => setSelectGame([option])}
        >
          {dataSource?.map((item) => {
            return (
              <Option
                packageName={item.packageName}
                value={item.gameName}
                gameIcon={item.gameIcon}
                className={styles.Options}
              >
                <div className={styles.GameOptions}>
                  <img src={item.gameIcon} />
                  <div className={styles.gameBody}>
                    <div>{item.gameName}</div>
                    <div className={styles.packge}>{item.packageName}</div>
                  </div>
                </div>
              </Option>
            );
          })}
        </Select>
      </Item>
      <Item noStyle dependencies={['categoryName']}>
        {({}) => {
          const item = selectGame?.[0];
          return (
            selectGame?.length > 0 && (
              <div className={styles.GameShow}>
                <img src={item.gameIcon} />
                <div className={styles.gameBody}>
                  <div>{item.value}</div>
                  <div className={styles.packge}>{item.packageName}</div>
                </div>
              </div>
            )
          );
        }}
      </Item>
      <Item label="展示状态" name="status" rules={[{ required: true }]}>
        <Radio.Group
          optionType="button"
          options={[
            { value: true, label: '展示' },
            { value: false, label: '隐藏' },
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
        rules={[{ required: true }]}
      >
        <InputNumber max={50} min={0} style={{ width: '100%' }} placeholder="请输入数值0-50" />
      </Item>
    </DrawerForm>
  );
};
