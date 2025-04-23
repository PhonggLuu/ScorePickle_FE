import React, { useState, useMemo } from 'react';
import { Card, Table, Avatar, Row, Col, Typography, Input } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useSelector } from 'react-redux';
import trophyIcon from '@src/assets/icons/trophy.png';
import { useGetTopPlayer } from '@src/modules/Ranking/hooks/useGetLeaderBoard';
import { TopPlayer } from '@src/modules/Ranking/models';
import { RootState } from '@src/redux/store';
import { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface TeamMemberCardProps {
  player: TopPlayer;
  trophyCount: number;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  player,
  trophyCount,
}) => (
  <Card bordered={false} className="team-member-card">
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Avatar size={80} src={player.avatar} />
        <div style={{ position: 'absolute', top: -20, right: -30 }}>
          {Array.from({ length: trophyCount }).map((_, i) => (
            <img
              key={i}
              src={trophyIcon}
              alt="Trophy"
              style={{ width: 20, height: 20, marginLeft: i > 0 ? 4 : 0 }}
            />
          ))}
        </div>
      </div>

      <Title level={5} style={{ margin: '16px 0 0' }}>
        {player.fullName}
      </Title>

      <Row justify="space-between" style={{ marginTop: 16 }}>
        <Col>
          <Text type="secondary">Level</Text>
          <Title level={4} style={{ color: '#1890ff', margin: 0 }}>
            {player.exeprienceLevel}
          </Title>
        </Col>
        <Col>
          <Text type="secondary">Point</Text>
          <Title level={4} style={{ margin: 0 }}>
            {player.rankingPoint}
          </Title>
        </Col>
      </Row>
    </div>
  </Card>
);

export const RankingPage: React.FC = () => {
  const { data } = useGetTopPlayer();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchName, setSearchName] = useState<string>('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Featured top 3 players
  const featuredMembers = useMemo(
    () => (data ? [data[1], data[0], data[2]] : []),
    [data]
  );

  // Remaining players
  const otherPlayers = useMemo(() => data?.slice(3) ?? [], [data]);

  // Filter by search term
  const filteredPlayers = useMemo(
    () =>
      otherPlayers.filter(
        (p) =>
          p.rankingPoint &&
          p.fullName.toLowerCase().includes(searchName.toLowerCase())
      ),
    [otherPlayers, searchName]
  );

  const trophyCounts = [2, 3, 1];

  const columns = useMemo(
    () =>
      [
        {
          title: 'STT',
          key: 'index',
          width: 60,
          render: (_: any, _record: TopPlayer, index: number) =>
            (pagination.current - 1) * pagination.pageSize + index + 4,
        },
        {
          title: 'Avatar',
          dataIndex: 'avatar',
          key: 'avatar',
          width: 60,
          render: (avatar: string) => <Avatar src={avatar} />,
        },
        {
          title: 'Name',
          dataIndex: 'fullName',
          key: 'fullName',
          render: (text: string) => <Text>{text}</Text>,
        },
        {
          title: 'Total Wins',
          dataIndex: 'totalWins',
          key: 'totalWins',
          width: 100,
          render: (wins: number) => (
            <Text style={{ color: '#1890ff' }}>{wins}</Text>
          ),
        },
        {
          title: 'Total Match',
          dataIndex: 'totalMatch',
          key: 'totalMatch',
          width: 120,
          render: (matches: number) => (
            <Text style={{ color: '#1890ff' }}>{matches}</Text>
          ),
        },
        {
          title: 'Level',
          dataIndex: 'exeprienceLevel',
          key: 'exeprienceLevel',
          width: 100,
          render: (level: number) => (
            <Text style={{ color: '#1890ff' }}>{level}</Text>
          ),
        },
        {
          title: 'Point',
          dataIndex: 'rankingPoint',
          key: 'rankingPoint',
          width: 100,
          render: (point: number) => (
            <Text style={{ color: '#1890ff' }}>{point}</Text>
          ),
        },
        {
          title: '',
          key: 'action',
          width: 60,
          render: () => <MoreOutlined style={{ fontSize: 20 }} />,
        },
      ] as ColumnsType<TopPlayer>,
    [pagination.current, pagination.pageSize]
  );

  const isMobile = useMediaQuery({ maxWidth: 769 });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Row
        className="d-flex justify-content-center"
        gutter={[16, 16]}
        style={{ marginBottom: 24 }}
      >
        {featuredMembers.map((member, idx) => (
          <Col
            xs={12}
            sm={12}
            md={8}
            lg={8}
            xl={6}
            key={member.userId}
            style={
              idx === 1 && !isMobile ? { transform: 'translateY(-20px)' } : {}
            }
          >
            <TeamMemberCard player={member} trophyCount={trophyCounts[idx]} />
          </Col>
        ))}
      </Row>

      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              Leader Board
            </Title>
          </Col>
          <Col>
            <Input
              placeholder="Search players..."
              prefix={<SearchOutlined />}
              value={searchName}
              onChange={handleSearch}
              style={{ width: 300 }}
              className="rounded-pill p-3"
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredPlayers}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredPlayers.length,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          rowClassName={(record) =>
            record.userId === user?.id ? 'ant-table-row-selected' : ''
          }
        />
      </Card>
    </div>
  );
};

export default RankingPage;
