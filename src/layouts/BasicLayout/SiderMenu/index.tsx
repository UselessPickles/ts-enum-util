import SiderMenuContext from '@/hooks/useSiderMenu';
import { Menu } from 'antd';
import { Link } from 'umi';
import { FolderOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const Wrap = styled.div`
  .ant-menu-item-selected {
    color: #1b73e8ff;
    background-color: #e8f1fcff !important;
    border-radius: 4px;
  }
  .ant-menu-inline .ant-menu-item::after {
    border-right: none;
  }
`;

const MenuDIV = styled(Menu)`
  ::-webkit-scrollbar-thumb {
    width: 0px;
    background: #fff !important;
  }
  transition: width 0s cubic-bezier(0.2, 0, 0, 1) 0s !important;
  padding: 0 8px !important;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

const SubMenuDIV = styled(Menu.SubMenu)`
  .ant-menu-item:active {
    background: none;
  }
  .ant-menu-sub.ant-menu-inline {
    background: #fff !important;
  }
  .ant-menu-submenu-arrow {
    color: #a9a9a9ff;
  }
  .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-arrow::before {
    height: 0.5px;
  }
  .ant-menu-sub.ant-menu-inline > .ant-menu-item,
  .ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
    margin: 4px 0 !important;
    padding-left: 32px !important;
  }
  .ant-menu-submenu-inline > .ant-menu-sub.ant-menu-inline > .ant-menu-item {
    padding-left: 48px !important;
  }
  .ant-menu-submenu-title .anticon {
    font-size: 16px !important;
  }
`;

function SubMenu() {
  const { menuData } = SiderMenuContext.useContainer();
  const dfs = (data: any) => {
    return data?.map((item: any) => {
      return item?.children?.length ? (
        <SubMenuDIV key={item?.id?.toString()} title={item.meta.title} icon={<FolderOutlined />}>
          {dfs(item.children)}
        </SubMenuDIV>
      ) : (
        MenuItem(item)
      );
    });
  };
  return dfs(menuData);
}

function MenuItem(menuData: any) {
  return (
    <Menu.Item key={menuData?.id?.toString()} style={{ paddingLeft: 24 }}>
      <Link to={menuData.path}>{menuData.meta.title}</Link>
    </Menu.Item>
  );
}

function SliderMenu() {
  return (
    <Wrap>
      <MenuDIV theme="light" mode="inline" defaultSelectedKeys={['1']}>
        {SubMenu()}
      </MenuDIV>
    </Wrap>
  );
}

export default SliderMenu;
