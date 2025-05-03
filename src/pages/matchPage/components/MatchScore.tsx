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
import { useGetMatchDetail } from '@src/modules/Match/hooks/useGetMatchScoreDetail';

const { Title, Text } = Typography;

interface MatchCollapseProps {
  matchId: number;
}

export function MatchScore({ matchId }: MatchCollapseProps) {
  const { logs, isLoading, error } = useGetMatchRealTime(matchId);
  const { data: score } = useGetMatchDetail(matchId);
  // const { data: endMatchScore } = useGetMatchEndScore(matchId);

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
  const items: CollapseProps['items'] = score?.matchScoreDetails?.map(
    (match) => {
      const { round, team1Score, team2Score } = match;
      const roundKey = `round_${round}`; // key của logs
      const scoreSummary = `Đội 1: ${team1Score} - Đội 2: ${team2Score}`;

      const roundLogs = logs[roundKey] || [];

      const sortedEntries = [...roundLogs].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const team1Entries = sortedEntries.filter((log) => log.team === 1);
      const team2Entries = sortedEntries.filter((log) => log.team === 2);

      const renderTimeline = (entries: LogEntry[]) => (
        <Timeline
          style={{ maxHeight: '200px', overflowY: 'auto', paddingTop: 20 }}
        >
          {entries.map((log, idx) => (
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
                  {new Date(log.timestamp).toLocaleString()}
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
            Round {round} — {scoreSummary}
          </Title>
        ),
        children: (
          <Card bordered className="mt-5">
            <Row gutter={16}>
              <Col span={12} style={{ background: 'rgba(254, 226, 171, 0.3)' }}>
                <Title level={5} style={{ textAlign: 'center' }}>
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

  return (
    <Collapse
      accordion
      bordered={false}
      items={items || []} // Fallback to an empty array if items is undefined
    />
  );
}
