import {
  Button,
  Drawer,
  Flex,
  FloatButton,
  Layout,
  theme,
  Tooltip,
} from 'antd';
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  ApartmentOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TrophyOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { Logo, NProgress } from '../../components';
import { PATH_AUTH, PATH_DASHBOARD, PATH_LANDING } from '../../constants';
import FooterCustom from '@components/Footer/FooterCustom';
import {
  PATH_TOURNAMENT_PAGE,
  PATH_RANKING_PAGE,
  PATH_RULE_PAGE,
} from '@src/constants/routes';

const { Header, Content } = Layout;

export const GuestLayout = () => {
  const {
    token: { borderRadius },
  } = theme.useToken();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const nodeRef = useRef(null);
  const [navFill, setNavFill] = useState(false);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        setNavFill(true);
      } else {
        setNavFill(false);
      }
    });
  }, []);

  return (
    <>
      <NProgress isAnimating={isLoading} key={location.key} />
      <Layout
        className="layout"
        style={{
          minHeight: '100vh',
          // backgroundColor: 'white',
        }}
      >
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: navFill ? 'rgba(255, 255, 255, 0.5)' : 'none',
            backdropFilter: navFill ? 'blur(8px)' : 'none',
            boxShadow: navFill ? '0 0 8px 2px rgba(0, 0, 0, 0.05)' : 'none',
            gap: 12,
            position: 'sticky',
            top: 0,
            padding: isMobile ? '0 1rem' : '0 2rem',
            zIndex: 1,
          }}
          className="border-bottom border-1 border-dark"
        >
          <Logo color="black" asLink href={PATH_LANDING.root} />
          {!isMobile ? (
            // Desktop Menu
            <>
              <Flex gap="small">
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
                    Giải đấu
                  </Button>
                </Link>
                <Link to={PATH_RANKING_PAGE.root}>
                  <Button
                    icon={<ApartmentOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Bảng xếp hạng
                  </Button>
                </Link>
                <Link to={PATH_RULE_PAGE.root}>
                  <Button
                    icon={<ApartmentOutlined />}
                    type="link"
                    className="text-black"
                  >
                    Luật chơi
                  </Button>
                </Link>
                <Link to={PATH_AUTH.signin}>
                  <Button
                    icon={<LoginOutlined />}
                    type="primary"
                    className="bg-light text-black border border-1 border-dark"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link to={PATH_AUTH.signup}>
                  <Button
                    icon={<UserAddOutlined />}
                    type="primary"
                    className="bg-dark text-white"
                  >
                    Đăng ký
                  </Button>
                </Link>
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
                  color: 'white',
                  fontSize: '16px',
                  width: 48,
                  height: 48,
                }}
              />
            </Tooltip>
          )}
        </Header>
        <Content
          style={{
            // background: 'rgba(255, 255, 255, 1)',
            borderRadius,
            transition: 'all .25s',
            paddingBottom: '10rem',
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

        <FooterCustom />
      </Layout>
      <Drawer title="Menu" placement="left" onClose={onClose} open={open}>
        <>
          <Flex gap="small" vertical>
            {/* <Link to={PATH_DOCS.productRoadmap} target="_blank">
              <Button icon={<ProductOutlined />} type="link">
                Roadmap
              </Button>
            </Link>
            <Link to={PATH_DOCS.components} target="_blank">
              <Button icon={<AppstoreAddOutlined />} type="text">
                Components
              </Button>
            </Link>
            <Link to={PATH_GITHUB.repo} target="_blank">
              <Button icon={<GithubOutlined />} type="text">
                Github
              </Button>
            </Link> */}
            <Link to={PATH_TOURNAMENT_PAGE.root}>
              <Button
                icon={<TrophyOutlined />}
                type="link"
                className="text-black"
              >
                Giải đấu
              </Button>
            </Link>
            <Link to={PATH_RANKING_PAGE.root}>
              <Button
                icon={<ApartmentOutlined />}
                type="link"
                className="text-black"
              >
                Bảng xếp hạng
              </Button>
            </Link>
            <Link to={PATH_RULE_PAGE.root}>
              <Button
                icon={<ApartmentOutlined />}
                type="link"
                className="text-black"
              >
                Luật chơi
              </Button>
            </Link>
            <Link to={PATH_AUTH.signin}>
              <Button
                icon={<LoginOutlined />}
                type="link"
                className="text-black"
              >
                Đăng nhập
              </Button>
            </Link>
            <Link to={PATH_AUTH.signup}>
              <Button
                icon={<UserAddOutlined />}
                type="link"
                className="text-black"
              >
                Đăng ký
              </Button>
            </Link>
          </Flex>
        </>
      </Drawer>
    </>
  );
};
