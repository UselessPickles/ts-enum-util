import SiderMenuContext from '@/hooks/useSiderMenu';
import { Menu } from 'antd';
import { Link } from 'umi';
import { FolderOutlined } from '@ant-design/icons';

function SubMenu() {
  const { menuData } = SiderMenuContext.useContainer();
  const dfs = (data: any) => {
    // console.log('data:', data)
    return data?.map((item: any) => {
      return item?.children?.length ? (
        <Menu.SubMenu key={item?.id?.toString()} title={item.meta.title} icon={<FolderOutlined />}>
          {dfs(item.children)}
        </Menu.SubMenu>
      ) : (
        MenuItem(item)
      );
    });
  };
  return dfs(menuData);
}

function MenuItem(menuData: any) {
  // console.log('menuData:', menuData)
  return (
    <Menu.Item key={menuData?.id?.toString()} style={{ paddingLeft: 24 }}>
      <Link to={menuData.path}>{menuData.meta.title}</Link>
    </Menu.Item>
  );
}

function SliderMenu() {
  return (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={['1']}
      // inlineCollapsed={collapsed}
      // selectedKeys={selectedKeys}
      // openKeys={openMenu}
      // onOpenChange={handleOpenChange}
      // style={{
      //   width: collapsed ? '80px' : '208px'
      // }}
    >
      {SubMenu()}
    </Menu>
  );
}

export default SliderMenu;
