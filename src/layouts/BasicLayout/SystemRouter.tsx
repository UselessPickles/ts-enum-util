import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { config } from '@/utils/RESTful';
import styles from './index.less';
import IconFont from '@/components/IconFont';

interface systemListType {
  id: number;
  name: string;
  url: string;
  orderNum: number;
}

function postMassage(system: systemListType) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(system, config.REQUEST_URL);
  } else {
    window.location.href = config.REQUEST_URL + '/index-frontend/index.html';
  }
}
const regExp = new RegExp(`(^${config.REQUEST_URL}/)|(/index.html)$`, 'gi');

function getSystemFlag(system: systemListType) {
  return (system.url || '').replace(regExp, '');
}

const SystemRouter = () => {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [systemList, setSystemList] = useState<systemListType[]>([]);

  useEffect(() => {
    const systemList = JSON.parse(localStorage.getItem('sysUrlList') as string);
    setSystemList(systemList || []);
  }, []);

  const iconPair = {
    businessfont: 'sctg',
    'commercialize-manager': 'syh',
    intelligentfont: 'zntf',
    'quzhuanxiang-manager': 'qzxtj',
    'companybiz-manager': 'ywgl',
    quManager: 'qzxyw',
    supplierfont: 'scgys',
    analyzefont: 'jyfx',
    financefont: 'czxt',
    'yingzhong-security': 'qxgl',
    'resource-manager': 'zywgl',
    'game-management-front': '566Icon',
    'game-management-frontend': '566Icon',
    '566gam': '566Icon',
    default: 'default',
  };

  return (
    <>
      <IconFont
        type={'icon-systems'}
        className={styles.systemOperationIcon}
        onClick={() => setShowDrawer(true)}
      />
      <Drawer
        title={'切换子系统'}
        visible={showDrawer}
        onClose={() => setShowDrawer(false)}
        placement={'left'}
        width={390}
        className={styles.systemDrawer}
      >
        <ul className={styles.systemUl}>
          {systemList?.map((item, index) => {
            const name =
              (item.url?.match(/.com\/(\S*)(\/|ed$|e$|end$|-front$)/) ?? ['', 'default'])?.[1] ??
              'default';
            return (
              <li className={styles.systemLi} key={item.id} onClick={() => postMassage(item)}>
                <img
                  className={styles.systemIcon}
                  src={require(`@/assets/img/icon/icon-${
                    iconPair?.[name ?? 'default'] ?? 'default'
                  }.png`)}
                />
                {item?.name?.replace(/系统|后台|子系统/g, '')}
              </li>
            );
          })}
        </ul>
      </Drawer>
    </>
  );
};

export default SystemRouter;
