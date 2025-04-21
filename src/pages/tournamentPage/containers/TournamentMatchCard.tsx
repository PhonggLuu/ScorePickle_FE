import { Card, Button, Badge, Avatar, Typography } from 'antd';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tournament-match-card.css';
import {
  MatchFormat,
  MatchStatus,
  TournamentMatch,
} from '@src/modules/Match/models';

const { Text, Title } = Typography;

interface TournamentMatchCardProps {
  value: TournamentMatch;
}

export default function TournamentMatchCard({
  value,
}: TournamentMatchCardProps) {
  // Safe defaults for team responses
  const teams = value.teamResponse ?? [];
  const teamA = teams[0] ?? { members: [] };
  const teamB = teams[1] ?? { members: [] };

  // Render up to first two players per team
  const renderPlayers = (team: {
    members: Array<{ id: number; playerId: number }>;
  }) =>
    team.members.slice(0, 2).map((member) => (
      <div key={member.id} className="d-flex flex-column align-items-center">
        <Avatar
          src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
          size={60}
        />
        <Text strong className="mt-2">
          Player {member.playerId}
        </Text>
      </div>
    ));

  return (
    <Card className="match-card shadow-sm border-0 rounded-4 mb-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center">
          <CalendarOutlined className="me-2" />
          <Text className="text-secondary me-5">
            {new Date(value.matchDate).toLocaleString()}
          </Text>
        </div>
        <Button type="primary" className="upcoming-btn" size="small">
          {MatchStatus[value.status]}
        </Button>
      </div>

      <Title level={4} className="mb-1">
        {value.title}
      </Title>
      <Text className="text-secondary d-block mb-3">{value.description}</Text>

      <div className="match-info d-flex align-items-center mb-3">
        <div className="d-flex align-items-center me-3">
          <UserOutlined className="me-2" />
          <Text>{MatchFormat[value.matchFormat]}</Text>
        </div>
        <Badge
          count={
            MatchFormat[value.matchFormat].toLowerCase().includes('single')
              ? '1 v 1'
              : '2 v 2'
          }
          className="me-3"
          style={{ backgroundColor: '#f5f5f5', color: '#000' }}
        />
      </div>

      <div className="teams-container d-flex align-items-center justify-content-between">
        <div className="team d-flex">
          {/* Team A players */}
          {renderPlayers(teamA)}
        </div>

        <Text strong className="vs-text">
          vs
        </Text>

        <div className="team d-flex">
          {/* Team B players */}
          {renderPlayers(teamB)}
        </div>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <Button type="primary" size="large" className="join-btn">
          View Detail
        </Button>
      </div>
    </Card>
  );
}
