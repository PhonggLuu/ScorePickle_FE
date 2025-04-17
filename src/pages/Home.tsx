import { Button, Col, Flex, Image, Row, Typography } from 'antd';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { ApartmentOutlined, FormOutlined } from '@ant-design/icons';
import { Container } from '../components';
import { PATH_RULE_PAGE, PATH_TOURNAMENT_PAGE } from '@src/constants/routes';
import scorePickleImage from '@src/assets/images/ScorePickle.png';
import { UpcomingEvent } from './home/UpcomingEvent';
import { useGetAllTournamentsForHomePage } from '@src/modules/Tournament/hooks/useGetAllTournaments';
import FooterCustom from '@components/Footer/FooterCustom';

const { Title, Text } = Typography;

export const HomePage = () => {
  // const {
  //   token: { colorPrimary },
  // } = theme.useToken();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const isTablet = useMediaQuery({ maxWidth: 992 });
  const { data } = useGetAllTournamentsForHomePage();
  const tournaments = (data ?? []).slice(0, 6); // Only load first 6 tournaments

  return (
    <div
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Flex
        vertical
        align="center"
        justify="center"
        style={{
          height: isTablet ? 600 : 800,
          width: '100%',
          padding: isMobile ? '2rem 1rem' : '5rem 0',
        }}
      >
        <Container>
          <Row style={{ alignItems: 'center' }} className="me-2">
            <Col lg={12}>
              <Title
                style={{
                  fontSize: isMobile ? 36 : 40,
                  fontWeight: 900,
                  margin: '1.5rem 0',
                }}
              >
                <span style={{ color: 'rgba(0, 247, 255, 0.85)' }}>
                  ScorePickle
                </span>
                <br />
                <span className="text-white fw-semibold">
                  Pickleball Tournament and Level Progression System
                </span>
              </Title>
              <Text
                style={{ fontSize: 20, marginBottom: '1.5rem', color: 'white' }}
              >
                Find matches, join tournaments, and connect with players who
                share your passion for pickleball.
              </Text>
              <Flex
                gap="middle"
                vertical={isMobile}
                style={{ marginTop: '1.5rem' }}
              >
                <Link to={PATH_RULE_PAGE.root}>
                  <Button
                    icon={<FormOutlined />}
                    type="primary"
                    size="large"
                    block={isMobile}
                  >
                    ScorePickle Rule
                  </Button>
                </Link>
                <Link to={PATH_TOURNAMENT_PAGE.root}>
                  <Button
                    icon={<ApartmentOutlined />}
                    type="default"
                    size="large"
                    block={isMobile}
                  >
                    View Tournaments
                  </Button>
                </Link>
              </Flex>
            </Col>
            {!isTablet && (
              <Col lg={12}>
                <Image src={scorePickleImage} alt="ScorePickle Image" />
              </Col>
            )}
          </Row>
        </Container>
      </Flex>
      <UpcomingEvent rows={tournaments} />

      <FooterCustom />
    </div>
  );
};
