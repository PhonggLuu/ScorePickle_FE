import type React from 'react';
import { Card, Button, Tabs, Tag, Typography, message } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  //   MailOutlined,
  //   PhoneOutlined,
} from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tournament-detail.css';
import { useParams } from 'react-router-dom';
import { Tournament } from '@src/modules/Tournament/models';
import TournamentInfo from './containers/TournamentInfo';
import Participants from './containers/Participants';
import { useState } from 'react';
import { RegistrationFormModal } from './containers/RegistrationForm';
import { useGetTournamentTeamRequestByPlayerIdAndTournamentId } from '@src/modules/TournamentRegistration/hooks/useGetTournamentTeamRequestByTournamentAndPlayerId';
import { RootState } from '@src/redux/store';
import { useSelector } from 'react-redux';
import { useGetTournamentById } from '@src/modules/Tournament/hooks/useGetTournamentById';
import { getPaymentUrl } from '@src/modules/Payment/hooks/useGetPaymentUrl';
import { createRegistration } from '@src/modules/TournamentRegistration/hooks/useCreateRegistration';
import { useCheckJoinTournament } from '@src/modules/Tournament/hooks/useCheckJoinTournament';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

export const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  console.log('user', user);
  const {
    data: tournamentData,
    isLoading,
    error: notFoundTournament,
  } = useGetTournamentById(Number(id || 0));

  const { data: isTeamRegistered } =
    useGetTournamentTeamRequestByPlayerIdAndTournamentId(
      user?.id ?? 0,
      Number(id || 0)
    );
  const { data: isRegistered } = useCheckJoinTournament(
    user?.id ?? 0,
    Number(id || 0)
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  // If data is still loading or there's an error, render appropriate messages
  if (isLoading) return <div>Loading...</div>;
  if (notFoundTournament) return <div>Error loading tournament details</div>;

  const tournament: Tournament = tournamentData as Tournament;

  const formatDates = (date: string) => {
    const newDate = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    const formattedDate = newDate.toLocaleDateString('en-US', options);

    return `${formattedDate}`;
  };

  const handlePayment = async (registrationId) => {
    const userId = user?.id || 0;
    const paymentUrl = await getPaymentUrl(userId, registrationId);
    window.location.href = paymentUrl;
  };

  const handleJoinSingleTournament = async () => {
    const request = {
      tournamentId: tournament.id,
      playerId: user?.id || 0,
      partnerId: null,
    };
    const registration = await createRegistration(request);
    if (registration?.id != null) {
      const userId = user?.id || 0;
      const paymentUrl = await getPaymentUrl(userId, registration?.id);
      if (paymentUrl !== null) window.location.href = paymentUrl;
      else message.success('You joined tournament succesfully');
    }
  };

  const showButton = () => {
    if (user?.userDetails?.experienceLevel === undefined) {
      return (
        <Button
          type="primary"
          size="large"
          style={{ width: '100%' }}
          onClick={() => {
            message.info('You have to login to join this tournament');
            window.location.href = '/auth/signin';
          }}
        >
          Register Now
        </Button>
      );
    }
    if (tournament.status !== 'Scheduled') {
      return (
        <Button
          type="primary"
          size="large"
          style={{ width: '100%' }}
          disabled={true}
        >
          Tournament is closed
        </Button>
      );
    }
    if (
      ((user?.userDetails?.experienceLevel ?? 0) >= tournament.isMinRanking &&
        (user?.userDetails?.experienceLevel ?? 0) <= tournament.isMaxRanking &&
        tournament.type
          .toLocaleLowerCase()
          .includes(user?.gender?.toLocaleLowerCase() ?? '')) ||
      tournament.type.toLocaleLowerCase().includes('mix')
    ) {
      if (tournament.type.toLocaleLowerCase().includes('single')) {
        if (isRegistered) {
          return (
            <Button
              type="primary"
              size="large"
              disabled={true}
              style={{ width: '100%' }}
            >
              Registered
            </Button>
          );
        } else {
          return (
            <Button
              type="primary"
              size="large"
              disabled={!tournament.isAccept}
              onClick={() => handleJoinSingleTournament()}
              style={{ width: '100%' }}
            >
              Register Now
            </Button>
          );
        }
      }
      if (tournament.type.toLocaleLowerCase().includes('double')) {
        if (isTeamRegistered === undefined) {
          return (
            <Button
              type="primary"
              size="large"
              disabled={!tournament.isAccept}
              onClick={() => setIsModalVisible(true)}
              style={{ width: '100%' }}
            >
              Register Now
            </Button>
          );
        } else if (
          isTeamRegistered?.playerId === user?.id &&
          isTeamRegistered?.isApproved === 1
        ) {
          return (
            <Button
              type="primary"
              size="large"
              onClick={() => handlePayment(isTeamRegistered.id)}
              style={{ width: '100%' }}
            >
              Pay Registration Fee
            </Button>
          );
        } else if (
          isTeamRegistered?.playerId === user?.id &&
          isTeamRegistered?.isApproved === 2
        ) {
          return (
            <Button
              type="primary"
              size="large"
              disabled={true}
              style={{ width: '100%' }}
            >
              Paid
            </Button>
          );
        } else if (
          isTeamRegistered?.partnerId === user?.id &&
          isTeamRegistered?.isApproved === 2
        ) {
          return (
            <Button
              type="primary"
              size="large"
              className="me-3"
              disabled={true}
              style={{ width: '100%' }}
            >
              Paid
            </Button>
          );
        } else {
          return (
            <Button
              type="primary"
              size="large"
              disabled={true}
              style={{ width: '100%' }}
            >
              Registered
            </Button>
          );
        }
      }
    } else {
      return (
        <Button
          type="primary"
          size="large"
          style={{
            width: '100%',
            border: '2px solid red', // sửa dòng này
            color: 'red', // tuỳ chọn: để chữ cùng tông với border
            backgroundColor: 'white', // tuỳ chọn: làm nổi bật viền đỏ
          }}
          disabled={true}
        >
          You are not eligible to participate in this tournament
        </Button>
      );
    }
  };

  return (
    <>
      <div className="container mt-4 mb-5">
        {/* Tournament Header */}
        <div className="row mb-3">
          <div className="col-md-8">
            <div
              className="d-flex align-items-center"
              style={{ fontWeight: 'bold' }}
            >
              <Title level={2} className="mb-0 me-2">
                {tournament.name}
              </Title>
              <Tag color="green" className="registration-tag">
                {tournament.isAccept &&
                new Date(tournament.startDate) > new Date()
                  ? 'Registration Open'
                  : 'Registration Closed'}
              </Tag>
            </div>
            <div className="tournament-meta mt-2" style={{ fontSize: '20px' }}>
              <span className="meta-item">
                <CalendarOutlined /> {formatDates(tournament.startDate)} -{' '}
                {formatDates(tournament.endDate)}
              </span>
              <span className="meta-item">
                <EnvironmentOutlined /> {tournament.location}
              </span>
              <span className="meta-item">
                <TrophyOutlined /> {tournament.type}
              </span>
            </div>
          </div>
          <div className="col-md-4 d-flex justify-content-end align-items-start mt-2">
            {showButton()}
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultActiveKey="details" className="tournament-tabs">
          <TabPane tab="Details" key="details">
            <TournamentInfo id={tournament.id} />
          </TabPane>
          <TabPane tab="Schedule" key="schedule">
            <Card>
              <Paragraph>
                Schedule information will be displayed here.
              </Paragraph>
            </Card>
          </TabPane>
          <TabPane tab="Participants" key="participants">
            <Participants
              registrations={tournament.registrationDetails}
              tournamentId={tournament.id}
              refetch={() => {
                // Add logic to refetch tournament data if needed
                console.log('Refetching tournament data...');
              }}
            />
          </TabPane>
          <TabPane tab="Results" key="results">
            <Card>
              <Paragraph>Results information will be displayed here.</Paragraph>
            </Card>
          </TabPane>
        </Tabs>
      </div>
      <RegistrationFormModal
        tournamentId={tournament.id}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <div className="container mt-4 mb-5">
        {/* Tournament Header */}
        <div className="row mb-3">
          <div className="col-md-12">
            <div
              className="d-flex align-items-center"
              style={{ fontWeight: 'bold' }}
            >
              {showButton()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentDetailPage;
