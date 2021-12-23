import { Button, Form, Select, Image } from 'antd';
import ModalForm from '@/components/ModalForm';
import { useContainer, useModalFromSubmit } from '../useStore';
import { useEffect, useState } from 'react';
import styles from '../index.less';
import { gameList } from '@/services/gameQuery';
import DeleteOutlined from '@ant-design/icons/lib/icons/DeleteOutlined';

const { Item } = Form,
  { Option } = Select;

export default () => {
  const {
      editRecord,
      modalProps,
      setModalProps,
      inputSelect,
      setInputSelect,
      loading,
      setLoading,
      page,
      setPage,
      selectGame,
      setSelectGame,
    } = useContainer(),
    { submitor } = useModalFromSubmit();
  const [dataSource, setDataSource] = useState<any>([]);

  function onCancel() {
    setModalProps({
      visible: false,
    });
    setSelectGame([]);
  }
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
        const data = res?.data?.total_datas?.filter((item: { status: number; gameNum: string }) => {
          return item.status == 1 && (!inputSelect ? item.gameNum !== editRecord?.gameNum : true);
        });
        if (page == 1) {
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

  function showGameOptions(
    name: string,
    packageName: string,
    num: any,
    icon: string,
    isChecked: boolean,
  ) {
    return (
      <div className={isChecked ? styles.GameShow : styles.GameOptions} key={num}>
        {isChecked ? <Image src={icon} width={60} /> : <img src={icon} />}
        {isChecked ? (
          <>
            <div className={styles.title}>{name}</div>
            <div className={styles.packge}>{packageName}</div>
          </>
        ) : (
          <div className={styles.gameBody}>
            <div>{name}</div>
            <div className={styles.packge}>{packageName}</div>
          </div>
        )}

        {isChecked && (
          <DeleteOutlined
            className={styles.delete}
            onClick={() => {
              setSelectGame([]);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <ModalForm
      formProps={{
        onFinish: submitor,
      }}
      modalProps={{ ...modalProps, onOk: submitor, onCancel: onCancel }}
    >
      <Item label="游戏名称" name="gameNum">
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
    </ModalForm>
  );
};
