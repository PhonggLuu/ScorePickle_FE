import type React from 'react';
import { Card, Button, Tabs, Tag, Typography } from 'antd';
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
  const { data: isRegistered } =
    useGetTournamentTeamRequestByPlayerIdAndTournamentId(
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
      window.location.href = paymentUrl;
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
            {(() => {
              if (
                isRegistered === null ||
                (isRegistered === undefined &&
                  (user?.userDetails?.experienceLevel ?? 0) <=
                    (tournament?.isMaxRanking ?? 0) &&
                  (user?.userDetails?.experienceLevel ?? 0) >=
                    (tournament?.isMinRanking ?? 0))
              ) {
                return (
                  <Button
                    type="primary"
                    size="large"
                    className="me-3"
                    disabled={!tournament.isAccept}
                    onClick={() =>
                      tournament.type.includes('Doubles')
                        ? setIsModalVisible(true)
                        : handleJoinSingleTournament()
                    }
                  >
                    Register Now
                  </Button>
                );
              } else if (
                isRegistered?.playerId === user?.id &&
                isRegistered?.isApproved === 1
              ) {
                return (
                  <Button
                    type="primary"
                    size="large"
                    className="me-3"
                    onClick={() => handlePayment(isRegistered.id)}
                  >
                    Pay Registration Fee
                  </Button>
                );
              } else if (
                isRegistered?.playerId === user?.id &&
                isRegistered?.isApproved === 2
              ) {
                return (
                  <Button
                    type="primary"
                    size="large"
                    className="me-3"
                    disabled={true}
                  >
                    Paid
                  </Button>
                );
              } else if (
                isRegistered?.partnerId === user?.id &&
                isRegistered?.isApproved === 2
              ) {
                return (
                  <Button
                    type="primary"
                    size="large"
                    className="me-3"
                    disabled={true}
                  >
                    Paid
                  </Button>
                );
              } else {
                return (
                  <Button
                    type="primary"
                    size="large"
                    className="me-3"
                    disabled={true}
                  >
                    Registered
                  </Button>
                );
              }
            })()}
            <Button size="large">Share</Button>
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
    </>
  );
};

export default TournamentDetailPage;
