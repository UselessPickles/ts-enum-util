// import React, { useState } from 'react'
import { createContainer } from 'unstated-next';
import request from '@/utils/RESTful';
import { useQuery } from 'react-query';
import { queryMenu } from '@/services/user';
import LoginContext from '@/hooks/useLogin';
import { useState, useEffect } from 'react';

function useSiderMenu() {
  const [menu, setMenu] = useState([]);
  console.log('useSiderMenu');
  const { logOut } = LoginContext.useContainer();
  useEffect(() => {
    // const { error, data } = useQuery(
    //   'sys/sysmenu/list_for_tree',
    //   queryMenu
    // )
    // if (error instanceof Error) {
    //   if (/权限标识列表为空/.test(error.message)) {
    //     logOut()
    //   }
    // }
    queryMenu()
      .then((res) => setMenu(res))
      .catch((error) => {
        if (error instanceof Error) {
          if (/权限标识列表为空/.test(error.message)) {
            logOut();
          }
        }
      });
    // setMenu(data)
  }, [logOut]);

  console.log('useSiderMenu data', menu);
  return {
    menuData: menu,
  };
}

const SiderMenuContext = createContainer(useSiderMenu);

export default SiderMenuContext;
