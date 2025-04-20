import {
  FormOutlined,
  FundOutlined,
  PieChartOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, MenuProps, SiderProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COLOR } from '../../App.tsx';
import { Logo } from '../../components';
import { PATH_LANDING } from '../../constants';
import {
  PATH_ADMIN_PAYMENT,
  PATH_ADMIN_TOURNAMENT,
  PATH_USER,
  PATH_CONTENT,
  PATH_SPONSOR_PAYMENT,
  PATH_TOURNAMENT,
  PATH_DASHBOARD,
  PATH_REFEREE,
} from '../../constants/routes.ts';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const SideNav = ({ ...others }: SiderProps) => {
  const nodeRef = useRef(null);
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>('');
  const user = useSelector((state: RootState) => state.auth.user);

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  useEffect(() => {
    const paths = pathname.split('/');
    setOpenKeys(paths);
    setCurrent(paths[paths.length - 1]);
  }, [pathname]);
  const items: MenuProps['items'] = [
    ...(user?.roleId === 2
      ? [
          getItem('Dashboard', 'dashboard/default', <PieChartOutlined />, [
            getItem(
              <Link to={PATH_DASHBOARD.default}>Default</Link>,
              'Default'
            ),
          ]),
          getItem('Transactions', 'admin/payment', <FundOutlined />, [
            getItem(
              <Link to={PATH_ADMIN_PAYMENT.root}>Default</Link>,
              'Transactions'
            ),
          ]),
          getItem('User', 'user', <UserOutlined />, [
            getItem(
              <Link to={PATH_USER.managerSponsor}>Manage Sponsor</Link>,
              'managerSponsor'
            ),
            getItem(
              <Link to={PATH_USER.blockUser}>Block User</Link>,
              'blockUser'
            ),
          ]),
          getItem('Tournaments', 'admin/tournament', <TrophyOutlined />, [
            getItem(
              <Link to={PATH_ADMIN_TOURNAMENT.overview}>Overview</Link>,
              'overview'
            ),
            getItem(
              <Link to={PATH_ADMIN_TOURNAMENT.venues}>Venues</Link>,
              'venues'
            ),
            getItem(
              <Link to={PATH_ADMIN_TOURNAMENT.referees}>Referees</Link>,
              'referees'
            ),
          ]),
          getItem(
            <Link to={PATH_CONTENT.root}>Content</Link>,
            'content',
            <FormOutlined />
          ),
        ]
      : user?.roleId === 4
        ? [
            getItem(
              <Link to={PATH_REFEREE.root}>Dashboard</Link>,
              'refOverview'
            ),
          ]
        : [
            getItem('Tournament', 'tournament', <TrophyOutlined />, [
              getItem(
                <Link to={PATH_TOURNAMENT.overview}>List</Link>,
                'overview'
              ),
              getItem(
                <Link to={PATH_TOURNAMENT.venues}>Venues</Link>,
                'schedule'
              ),
              getItem(
                <Link to={PATH_TOURNAMENT.referees}>Referees</Link>,
                'referees'
              ),
            ]),
            getItem('Payments', 'payment', <PieChartOutlined />, [
              getItem(
                <Link to={PATH_SPONSOR_PAYMENT.root}>Transactions</Link>,
                'List'
              ),
            ]),
          ]),
  ];

  const rootSubmenuKeys = [
    'dashboards',
    'corporate',
    'user-profile',
    'tournament',
  ];

  return (
    <Sider ref={nodeRef} breakpoint="lg" collapsedWidth="0" {...others}>
      <Logo
        color="blue"
        asLink
        href={PATH_LANDING.root}
        justify="center"
        gap="small"
        imgSize={{ h: 28, w: 28 }}
        style={{ padding: '1rem 0' }}
      />
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemBg: 'none',
              itemSelectedBg: COLOR['100'],
              itemHoverBg: COLOR['50'],
              itemSelectedColor: COLOR['600'],
            },
          },
        }}
      >
        <Menu
          mode="inline"
          items={items}
          onClick={onClick}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[current]}
          style={{ border: 'none' }}
        />
      </ConfigProvider>
    </Sider>
  );
};

export default SideNav;
