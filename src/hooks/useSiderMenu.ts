// import React, { useState } from 'react'
import { createContainer } from 'unstated-next';
import { queryMenu } from '@/services/user';
import { useState, useEffect } from 'react';
import { notification } from 'antd';

function useSiderMenu() {
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    if (menu.length == 0) {
      queryMenu()
        .then((res) => setMenu(res))
        .catch((error) => {
          if (error instanceof Error) {
            if (/权限标识列表为空/.test(error.message)) {
              notification.error({
                message: '授权为空',
                description: '权限标识列表为空',
                key: 'notificationKey',
              });
            }
          }
        });
    }
  }, [menu.length]);
  return {
    menuData: menu,
    setMenu,
  };
}

const SiderMenuContext = createContainer(useSiderMenu);

export default SiderMenuContext;
