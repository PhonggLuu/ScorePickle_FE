'use client';
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

export default function TournamentMatchCard(props: TournamentMatchCardProps) {
  return (
    <Card className="match-card shadow-sm border-0 rounded-4 mb-3">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center">
          <CalendarOutlined className="me-2" />
          <Text className="text-secondary me-5">{`${props.value.matchDate}`}</Text>
        </div>
        <Button type="primary" className="upcoming-btn" size="small">
          {MatchStatus[props.value.status]}
        </Button>
      </div>

      <Title level={4} className="mb-1">
        {props.value.title}
      </Title>
      <Text className="text-secondary d-block mb-3">
        {props.value.description}
      </Text>

      <div className="match-info d-flex align-items-center mb-3">
        <div className="d-flex align-items-center me-3">
          <UserOutlined className="me-2" />
          <Text>{MatchFormat[props.value.matchFormat]}</Text>
        </div>
        <Badge
          count={
            MatchFormat[props.value.matchFormat]
              .toLowerCase()
              .includes('single')
              ? '1 v 1'
              : '2 v 2'
          }
          className="me-3"
          style={{ backgroundColor: '#f5f5f5', color: '#000' }}
        />
      </div>

      <div className="teams-container d-flex align-items-center justify-content-between">
        <div className="team d-flex flex-column align-items-center">
          <Avatar
            src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
            size={60}
          />
          <Text strong className="mt-2">
            {props.value.teamResponse[0].name}
          </Text>
        </div>

        <Text strong className="vs-text">
          vs
        </Text>

        <div className="team d-flex flex-column align-items-center">
          <Avatar
            src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
            size={60}
          />
          <Text strong className="mt-2">
            {props.value.teamResponse[1].name}
          </Text>
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
