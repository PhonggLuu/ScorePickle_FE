import {
  Badge,
  Button,
  Card,
  Drawer,
  Dropdown,
  Flex,
  FloatButton,
  Layout,
  MenuProps,
  Modal,
  Tabs,
  theme,
  Tooltip,
} from 'antd';
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
  ApartmentOutlined,
  EditOutlined,
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  ReadOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { Logo, NProgress } from '../../components';
import { PATH_AUTH, PATH_LANDING } from '../../constants';
import {
  PATH_TOURNAMENT_PAGE,
  PATH_RANKING_PAGE,
  PATH_RULE_PAGE,
  PATH_PLAYER_PAGE,
} from '@src/constants/routes';
import { RootState } from '@src/redux/store';
import { useSelector } from 'react-redux';
import useLogout from '@src/modules/User/hooks/useLogout';
import TabPane from 'antd/es/tabs/TabPane';
import TournamentInvitation from '@src/pages/tournamentPage/containers/TournamentInvitation';
import { useCountNotification } from '@src/modules/Notification/hooks/useCountNoti';
import FriendRequest from '@src/pages/friend/FriendRequest';

const { Header, Content } = Layout;
export const GuestLayout = () => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const nodeRef = useRef(null);
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: countNoti } = useCountNotification(user?.id ?? 0);

  const { logout } = useLogout();
  const items: MenuProps['items'] = [
    {
      label: (
        <Card
          style={{ width: 300, border: '0' }}
          bodyStyle={{ padding: 10, paddingBottom: '20px' }}
        >
          <Flex>
            <img
              src={
                user?.avatarUrl ??
                'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
              }
              alt="user avatar"
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                marginRight: '10px',
              }}
            />
            <div style={{ whiteSpace: 'nowrap' }}>
              <span>{user?.firstName + ' ' + user?.lastName}</span>
              <br />
              <p
                className="text-muted"
                style={{ marginTop: 0, fontSize: '13px', display: 'inline' }}
              >
                {user?.userDetails?.province.toLocaleLowerCase() +
                  ', ' +
                  user?.userDetails?.city.toLocaleLowerCase()}
              </p>
              <span className="mx-1">•</span>
              <p
                className="text-muted"
                style={{ marginTop: 0, fontSize: '13px', display: 'inline' }}
              >
                {user?.gender}
              </p>
            </div>
          </Flex>
        </Card>
      ),
      key: 'profile',
      style: { padding: '0', marginBottom: '10px' },
    },
    {
      key: 'profile-gap',
      label: (
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            marginTop: '10px',
          }}
        >
          My Account
        </p>
      ),
      disabled: true,
      style: {
        padding: '0',
        margin: '0',
        paddingLeft: '10px',
        backgroundColor: 'rgb(224, 224, 224)',
      },
    },
    {
      key: 'user-profile-link',
      label: (
        <Link to={`my-profile`} style={{ textDecoration: 'none' }}>
          <EditOutlined className="me-2" />
          Edit Profile
        </Link>
      ),
      style: {
        padding: '10px 0 10px 10px',
      },
    },
    {
      key: 'user-password-link',
      label: (
        <Link to={`update-password`} style={{ textDecoration: 'none' }}>
          <LockOutlined className="me-2" />
          Password
        </Link>
      ),
      style: {
        padding: '10px 0 10px 10px',
      },
    },
    {
      key: 'info-gap',
      label: (
        <p
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            marginTop: '10px',
          }}
        >
          Activity
        </p>
      ),
      disabled: true,
      style: {
        padding: '0',
        margin: '0',
        paddingLeft: '10px',
        backgroundColor: 'rgb(224, 224, 224)',
      },
    },
    {
      key: 'my-friend',
      label: (
        <Link to={`my-friend`} style={{ textDecoration: 'none' }}>
          <TeamOutlined className="me-2" />
          Friends
        </Link>
      ),
      style: {
        padding: '10px 0 10px 10px',
      },
    },
    {
      key: 'my-tournament',
      label: (
        <Link to={`my-tournament`} style={{ textDecoration: 'none' }}>
          <TrophyOutlined className="me-2" />
          Joined-Tournament
        </Link>
      ),
      style: {
        padding: '10px 0 10px 10px',
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'user-logout-link',
      label: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => logout(),
      style: {
        padding: '10px 0 10px 10px',
      },
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Toggle the modal visibility
  const showNotification = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <NProgress isAnimating={isLoading} key={location.key} />
      <Layout
        className="layout rounded-pill"
        style={{
          minHeight: '100vh',
          // backgroundColor: 'white',
        }}
      >
        <Header
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgb(255, 255, 255)',
            gap: 12,
            top: 0,
            zIndex: 1,
            color: 'var(--blue-900)',
            backgroundColor: '#fff',
            border: '1px solid #fff',
            borderRadius: '900000px',
            width: '98%',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            position: 'fixed',
            boxShadow: '0 4px 10px #0003',
            padding: isMobile ? '0 1rem' : '1.5rem .75rem 1.5rem 1.5rem',
          }}
          className="rounded-pill m-2 mt-3 p-4"
        >
          <Logo color="black" asLink href={PATH_LANDING.root} />
          {!isMobile ? (
            // Desktop Menu
            <>
              <Flex
                style={{
                  fontSize: '14px',
                  color: '05155E',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                }}
                className="py-4"
              >
                {/* <Link to={PATH_DOCS.productRoadmap} target="_blank">
                  <Button icon={<ProductOutlined />} type="link">
                    Product Roadmap
                  </Button>
                </Link>
                <Link to={PATH_DOCS.components} target="_blank">
                  <Button icon={<AppstoreAddOutlined />} type="link">
                    Components
                  </Button>
                </Link>
                <Link to={PATH_GITHUB.repo} target="_blank">
                  <Button icon={<GithubOutlined />} type="link">
                    Give us a star
                  </Button>
                </Link> */}
                <Link to={PATH_TOURNAMENT_PAGE.root}>
                  <Button
                    icon={<TrophyOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Tournaments
                  </Button>
                </Link>
                <Link to={PATH_PLAYER_PAGE.root}>
                  <Button
                    icon={<TeamOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Players
                  </Button>
                </Link>
                {/* <Link to={PATH_RANKING_PAGE.root}>
                  <Button
                    icon={<ApartmentOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Bảng xếp hạng
                  </Button>
                </Link> */}
                <Link to={PATH_RULE_PAGE.root}>
                  <Button
                    icon={<ReadOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Platform Rule
                  </Button>
                </Link>
                {user ? (
                  <>
                    {/* <Link to="match-calendar">
                      <Button
                        icon={<ClockCircleOutlined />}
                        type="link"
                        className="text-black"
                      >
                        Calendar
                      </Button>
                    </Link>*/}
                    <Link to="#" className="me-4">
                      <Button
                        icon={
                          <Badge count={countNoti}>
                            <NotificationOutlined />
                          </Badge>
                        }
                        type="link"
                        className="text-black"
                        onClick={showNotification}
                      ></Button>
                    </Link>
                    <Dropdown
                      menu={{
                        items,
                        style: {
                          padding: '20px', // Thêm padding cho toàn bộ menu
                        },
                      }}
                      trigger={['click']}
                      className="me-2"
                    >
                      <Flex>
                        <img
                          src={
                            user.avatarUrl ??
                            'https://images.icon-icons.com/3446/PNG/512/account_profile_user_avatar_icon_219236.png'
                          }
                          alt="user profile photo"
                          height={36}
                          width={36}
                          className="rounded-circle"
                          style={{
                            borderRadius,
                            objectFit: 'cover',
                            alignItems: 'center',
                            marginTop: '12px',
                          }}
                        />
                      </Flex>
                    </Dropdown>
                  </>
                ) : (
                  <>
                    <Link to={PATH_AUTH.signin} className="mr-3">
                      <Button
                        icon={<LoginOutlined />}
                        type="primary"
                        className="bg-light text-black border border-1 border-dark"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to={PATH_AUTH.signup}>
                      <Button
                        icon={<UserAddOutlined />}
                        type="primary"
                        className="bg-dark text-white"
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </Flex>
            </>
          ) : (
            // Mobile Menu
            <Tooltip title={`${open ? 'Expand' : 'Collapse'} Sidebar`}>
              <Button
                type="text"
                icon={open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={showDrawer}
                style={{
                  color: 'black',
                  fontSize: '16px',
                  width: 48,
                  height: 48,
                }}
              />
            </Tooltip>
          )}
          <Modal
            title="Notifications"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="Request doubles tournament" key="1">
                <TournamentInvitation playerId={user?.id} />
              </TabPane>
              <TabPane tab="Add friend request" key="2">
                <FriendRequest userId={user?.id} />
              </TabPane>
              {/* <TabPane tab="Lịch thi đấu" key="2">
                <p>Thông báo lịch thi đấu</p>
                <ul>
                  <li>
                    <strong>Giải đấu 1</strong>
                    <p>Thời gian: 20/10/2023</p>
                  </li>
                  <li>
                    <strong>Giải đấu 2</strong>
                    <p>Thời gian: 25/10/2023</p>
                  </li>
                </ul>
              </TabPane>
              <TabPane tab="Thông báo" key="3">
                <p>Thông báo từ hệ thống</p>
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <strong>{notification.message}</strong>
                      <p>{notification.description}</p>
                    </li>
                  ))}
                </ul>
              </TabPane> */}
            </Tabs>
          </Modal>
        </Header>
        <Content
          style={{
            // background: 'rgba(255, 255, 255, 1)',
            borderRadius,
            transition: 'all .25s',
            paddingBottom: '10rem',
            background: 'linear-gradient(to right, #1e3a8a, #3b82f6)',
          }}
        >
          <TransitionGroup>
            <SwitchTransition>
              <CSSTransition
                key={`css-transition-${location.key}`}
                nodeRef={nodeRef}
                onEnter={() => {
                  setIsLoading(true);
                }}
                onEntered={() => {
                  setIsLoading(false);
                }}
                timeout={300}
                classNames="page"
                unmountOnExit
              >
                {() => (
                  <div
                    ref={nodeRef}
                    className="site-layout-content"
                    style={{ background: 'none' }}
                  >
                    <Outlet />
                  </div>
                )}
              </CSSTransition>
            </SwitchTransition>
          </TransitionGroup>
          <FloatButton.BackTop />
        </Content>
      </Layout>
      <Drawer title="Menu" placement="left" onClose={onClose} open={open}>
        <>
          <Flex gap="small" vertical>
            <Link to={PATH_TOURNAMENT_PAGE.root}>
              <Button
                icon={<TrophyOutlined />}
                type="link"
                className="text-black"
              >
                Tournaments
              </Button>
            </Link>
            <Link to={PATH_RANKING_PAGE.root}>
              <Button
                icon={<ApartmentOutlined />}
                type="link"
                className="text-black"
              >
                Ranking
              </Button>
            </Link>
            <Link to={PATH_RULE_PAGE.root}>
              <Button
                icon={<ReadOutlined />}
                type="link"
                className="text-black"
              >
                Platform Rule
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="my-profile">
                  <Button
                    icon={<UserOutlined />}
                    type="link"
                    className="text-black"
                  >
                    My Profile
                  </Button>
                </Link>
                <Link to="my-tournament">
                  <Button
                    icon={<TrophyOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Joined-Tournament
                  </Button>
                </Link>
                <Link to="my-tournament">
                  <Button
                    icon={<TrophyOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Friends
                  </Button>
                </Link>
                <Link to="#">
                  <Button
                    icon={
                      <Badge count={countNoti}>
                        <NotificationOutlined />
                      </Badge>
                    }
                    type="link"
                    className="text-black"
                    onClick={showNotification}
                  >
                    Notification
                  </Button>
                </Link>
                <Link to="#">
                  <Button
                    icon={<LogoutOutlined />}
                    type="link"
                    className="text-black"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={PATH_AUTH.signin}>
                  <Button
                    icon={<LoginOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Login
                  </Button>
                </Link>
                <Link to={PATH_AUTH.signup}>
                  <Button
                    icon={<UserAddOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </Flex>
        </>
      </Drawer>
    </>
  );
};
