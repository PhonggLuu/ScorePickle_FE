import {
  Collapse,
  Typography,
  Space,
  Spin,
  Alert,
  Card,
  Timeline,
  Tag,
  Row,
  Col,
} from 'antd';
import type { CollapseProps } from 'antd';
import {
  LogEntry,
  useGetMatchRealTime,
} from '@src/modules/Match/hooks/useGetMatchRealTime';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MatchCollapseProps {
  matchId: number;
}

export function MatchScore({ matchId }: MatchCollapseProps) {
  const { logs, isLoading, error } = useGetMatchRealTime(matchId);

  // Loading state
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Spin tip="⏳ Updating score ..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        message="Some error occured when loading score"
        description={error.message}
        type="error"
        showIcon
      />
    );
  }

  // Nếu chưa có log nào
  if (Object.keys(logs).length === 0) {
    return (
      <div>
        <Text></Text>
      </div>
    );
  }

  // Xây dựng items cho Collapse
  const items: CollapseProps['items'] = Object.entries(logs).map(
    ([roundKey, entries]) => {
      // Gộp điểm cho từng team
      const teamScores = entries.reduce<Record<number, number>>(
        (acc, { team, points }) => {
          acc[team] = (acc[team] || 0) + points;
          return acc;
        },
        {}
      );

      // Đảm bảo luôn có team 1 và team 2
      const score1 = teamScores[1] ?? 0;
      const score2 = teamScores[2] ?? 0;
      const scoreSummary = `Đội 1: ${score1} - Đội 2: ${score2}`;

      // (Tuỳ chọn) Muốn timeline theo thứ tự thời gian thì sort trước:
      const sortedEntries = [...entries].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const team1Entries = sortedEntries.filter((log) => log.team === 1);
      const team2Entries = sortedEntries.filter((log) => log.team === 2);
      const renderTimeline = (logs: LogEntry[]) => (
        <Timeline
          style={{ maxHeight: '200px', overflowY: 'auto', paddingTop: 20 }}
        >
          {logs.map((log, idx) => (
            <Timeline.Item
              key={idx}
              color={log.team === 1 ? 'blue' : 'orange'}
              dot={
                log.points > 0 ? undefined : (
                  <ClockCircleOutlined style={{ fontSize: 16 }} />
                )
              }
            >
              <Space>
                <Tag color={log.team === 1 ? 'blue' : 'orange'}>
                  Team {log.team}
                </Tag>
                <Text type={log.points > 0 ? 'success' : 'danger'}>
                  {log.points > 0 ? `+${log.points}` : log.points}
                </Text>
                <Text type="secondary">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </Text>
              </Space>
            </Timeline.Item>
          ))}
        </Timeline>
      );

      return {
        key: roundKey,
        label: (
          <Title level={4} style={{ margin: 0 }}>
            {roundKey.replace('_', ' ').toUpperCase()} — {scoreSummary}
          </Title>
        ),
        children: (
          <Card bordered className="mt-5">
            <Row gutter={16}>
              <Col span={12} style={{ background: 'rgba(254, 226, 171, 0.3)' }}>
                <Title
                  level={5}
                  style={{ textAlign: 'center' }}
                  className="rounded-3"
                >
                  Team 1
                </Title>
                {renderTimeline(team1Entries)}
              </Col>
              <Col span={12} style={{ background: 'rgba(171, 219, 254, 0.3)' }}>
                <Title level={5} style={{ textAlign: 'center' }}>
                  Team 2
                </Title>
                {renderTimeline(team2Entries)}
              </Col>
            </Row>
          </Card>
        ),
      };
    }
  );

  return <Collapse accordion bordered={false} items={items} />;
}
