import React, { useEffect, useRef, useState } from 'react';
import { ConfigProvider, Layout, Menu, MenuProps, SiderProps } from 'antd';
import {
  BranchesOutlined,
  FormOutlined,
  InfoCircleOutlined,
  PieChartOutlined,
  SecurityScanOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Logo } from '../../components';
import { Link, useLocation } from 'react-router-dom';
import {
  PATH_ABOUT,
  PATH_AUTH,
  PATH_DASHBOARD,
  PATH_LANDING,
  PATH_USER_PROFILE,
  //New Path
  PATH_TOURNAMENT,
  PATH_USER,
  PATH_CONTENT,
} from '../../constants';
import { COLOR } from '../../App.tsx';

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

const items: MenuProps['items'] = [
  getItem('Dashboards', 'dashboards', <PieChartOutlined />, [
    getItem(<Link to={PATH_DASHBOARD.default}>Default</Link>, 'default', null),
    getItem(
      <Link to={PATH_DASHBOARD.projects}>Projects</Link>,
      'projects',
      null
    ),
    getItem(
      <Link to={PATH_DASHBOARD.ecommerce}>eCommerce</Link>,
      'ecommerce',
      null
    ),
    getItem(
      <Link to={PATH_DASHBOARD.marketing}>Marketing</Link>,
      'marketing',
      null
    ),
    getItem(<Link to={PATH_DASHBOARD.social}>Social</Link>, 'social', null),
    getItem(<Link to={PATH_DASHBOARD.bidding}>Bidding</Link>, 'bidding', null),
    getItem(
      <Link to={PATH_DASHBOARD.learning}>Learning</Link>,
      'learning',
      null
    ),
    getItem(
      <Link to={PATH_DASHBOARD.logistics}>Logistics</Link>,
      'logistics',
      null
    ),
  ]),
  getItem(
    <Link to={PATH_ABOUT.root}>About</Link>,
    'about',
    <InfoCircleOutlined />
  ),
  // getItem(
  //   <Link to={PATH_SITEMAP.root}>Sitemap</Link>,
  //   'sitemap',
  //   <BranchesOutlined />
  // ),
  getItem(
    <Link to={PATH_TOURNAMENT.overview}>Tournament</Link>,
    'tournament',
    <BranchesOutlined />
  ),
  getItem(
    <Link to={PATH_CONTENT.root}>Content</Link>,
    'content',
    <FormOutlined />
  ),
  getItem('User', 'user', <UserOutlined />, [
    getItem(<Link to={PATH_USER.user}>Users</Link>, 'users', null),
    getItem(<Link to={PATH_USER.player}>Players</Link>, 'players', null),
    getItem(<Link to={PATH_USER.sponsor}>Sponsors</Link>, 'sponsors', null),
    getItem(<Link to={PATH_USER.referee}>Referees</Link>, 'referees', null),
    getItem(
      <Link to={PATH_USER.organizer}>Organizers</Link>,
      'organizers',
      null
    ),
    getItem(<Link to={PATH_USER.staff}>Staffs</Link>, 'staffs', null),
  ]),
  // getItem('Tournament', 'tournament', <BranchesOutlined />, [
  //   getItem(<Link to={PATH_TOURNAMENT.overview}>Overview</Link>, 'overview', null),
  // ]),

  getItem('Pages', 'pages', null, [], 'group'),

  getItem('User profile', 'user-profile', <UserOutlined />, [
    getItem(
      <Link to={PATH_USER_PROFILE.details}>Details</Link>,
      'details',
      null
    ),
    getItem(
      <Link to={PATH_USER_PROFILE.preferences}>Preferences</Link>,
      'preferences',
      null
    ),
    getItem(
      <Link to={PATH_USER_PROFILE.personalInformation}>Information</Link>,
      'personal-information',
      null
    ),
    getItem(
      <Link to={PATH_USER_PROFILE.security}>Security</Link>,
      'security',
      null
    ),
    getItem(
      <Link to={PATH_USER_PROFILE.activity}>Activity</Link>,
      'activity',
      null
    ),
    getItem(
      <Link to={PATH_USER_PROFILE.action}>Actions</Link>,
      'actions',
      null
    ),
    getItem(<Link to={PATH_USER_PROFILE.help}>Help</Link>, 'help', null),
    getItem(
      <Link to={PATH_USER_PROFILE.feedback}>Feedback</Link>,
      'feedback',
      null
    ),
  ]),

  getItem('Authentication', 'authentication', <SecurityScanOutlined />, [
    getItem(<Link to={PATH_AUTH.signin}>Sign In</Link>, 'auth-signin', null),
    getItem(<Link to={PATH_AUTH.signup}>Sign Up</Link>, 'auth-signup', null),
    getItem(<Link to={PATH_AUTH.welcome}>Welcome</Link>, 'auth-welcome', null),
    getItem(
      <Link to={PATH_AUTH.verifyEmail}>Verify email</Link>,
      'auth-verify',
      null
    ),
    getItem(
      <Link to={PATH_AUTH.passwordReset}>Password reset</Link>,
      'auth-password-reset',
      null
    ),
    // getItem(<Link to={PATH_AUTH.passwordConfirm}>Passsword confirmation</Link>, 'auth-password-confirmation', null),
    getItem(
      <Link to={PATH_AUTH.accountDelete}>Account deleted</Link>,
      'auth-account-deactivation',
      null
    ),
  ]),
];

const rootSubmenuKeys = ['dashboards', 'corporate', 'user-profile'];

type SideNavProps = SiderProps;

const SideNav = ({ ...others }: SideNavProps) => {
  const nodeRef = useRef(null);
  const { pathname } = useLocation();
  const [openKeys, setOpenKeys] = useState(['']);
  const [current, setCurrent] = useState('');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
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
