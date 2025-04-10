import type React from 'react';
import { Card, Typography, Divider, Button } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TrophyOutlined,
  DollarOutlined,
  FormOutlined,
  BranchesOutlined,
  //   MailOutlined,
  //   PhoneOutlined,
} from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../tournament-detail.css';
import { useGetTournamentById } from '@src/modules/Tournament/hooks/useGetTournamentById';
import { Tournament } from '@src/modules/Tournament/models';

const { Text, Paragraph } = Typography;

interface TournamentInfoProps {
  id: number;
}

export const TournamentInfo: React.FC<TournamentInfoProps> = ({ id }) => {
  const { data, isLoading, error } = useGetTournamentById(id);

  // If data is still loading or there's an error, render appropriate messages
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tournament details</div>;

  const tournament: Tournament = data as Tournament;

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

  const dealineDate = (date: string) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };
    const formattedDate = newDate.toLocaleDateString('en-US', options);
    return `${formattedDate}`;
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        {/* Tournament Format */}
        <Card title="Tournament Policy" className="mb-4">
          <Paragraph>
            <div dangerouslySetInnerHTML={{ __html: tournament.note }} />
          </Paragraph>
        </Card>

        {/* About This Tournament */}
        {tournament.description && (
          <Card title="About This Tournament" className="mb-4">
            <Paragraph>
              {tournament.description || 'No description available.'}
            </Paragraph>
          </Card>
        )}
      </div>

      <div className="col-lg-4">
        {/* Tournament Details */}
        <Card title="Tournament Details" className="mb-4">
          <div className="detail-item">
            <CalendarOutlined className="detail-icon" />
            <div>
              <Text strong>Date</Text>
              <div>
                {formatDates(tournament.startDate)} -{' '}
                {formatDates(tournament.endDate)}
              </div>
            </div>
          </div>

          <Divider className="my-3" />

          <div className="detail-item">
            <EnvironmentOutlined className="detail-icon" />
            <div>
              <Text strong>Location</Text>
              <div>{tournament.location}</div>
            </div>
          </div>

          <Divider className="my-3" />

          <div className="detail-item">
            <TrophyOutlined className="detail-icon" />
            <div>
              <Text strong>Tournament Type</Text>
              <div>{tournament.type}</div>
            </div>
          </div>

          <Divider className="my-3" />

          <div className="detail-item">
            <FormOutlined className="detail-icon" />
            <div>
              <Text strong>Max Registration Quantity</Text>
              <div>{tournament.maxPlayer}</div>
            </div>
          </div>

          <Divider className="my-3" />

          {
            <div className="detail-item">
              <BranchesOutlined className="detail-icon" />
              <div>
                <Text strong>Skill Level</Text>
                <div>
                  {tournament.isMinRanking && tournament.isMaxRanking ? (
                    <li>{`Skill Level: ${tournament.isMinRanking} - ${tournament.isMaxRanking}`}</li>
                  ) : (
                    <li>No specific skill levels required</li>
                  )}
                </div>
              </div>
            </div>
          }

          <Divider className="my-3" />

          <div className="detail-item">
            <DollarOutlined className="detail-icon" />
            <div>
              <Text strong>Entry Fee</Text>
              <div>
                $
                {!tournament.isFree
                  ? 'Free registration'
                  : tournament.entryFee.toLocaleString('vi-VN')}
              </div>
            </div>
          </div>

          <Divider className="my-3" />

          <div className="detail-item">
            <DollarOutlined className="detail-icon" />
            <div>
              <Text strong>Total Prize</Text>
              <div>${tournament.totalPrize.toLocaleString('vi-VN')}</div>
            </div>
          </div>

          <Divider className="my-3" />

          <div className="detail-item">
            <CalendarOutlined className="detail-icon" />
            <div>
              <Text strong>Registration Deadline</Text>
              <div>{dealineDate(tournament.startDate)}</div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card title="Contact Information">
          {/* <div className="detail-item">
                    <UserOutlined className="detail-icon" />
                    <div>
                      <Text strong>Tournament Director</Text>
                      <div>{tournament.contact?.director}</div>
                    </div>
                  </div>
  
                  <Divider className="my-3" />
  
                  <div className="detail-item">
                    <MailOutlined className="detail-icon" />
                    <div>
                      <Text strong>Email</Text>
                      <div>{tournament.contact?.email}</div>
                    </div>
                  </div>
  
                  <Divider className="my-3" />
  
                  <div className="detail-item">
                    <PhoneOutlined className="detail-icon" />
                    <div>
                      <Text strong>Phone</Text>
                      <div>{tournament.contact?.phone}</div>
                    </div>
                  </div> */}
        </Card>
      </div>
    </div>
  );
};

export default TournamentInfo;
