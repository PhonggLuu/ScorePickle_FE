import {
  CrownOutlined,
  RiseOutlined,
  StarOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useGetTopPlayer } from '@src/modules/Ranking/hooks/useGetLeaderBoard';
import { TopPlayer } from '@src/modules/Ranking/models';
import { RootState } from '@src/redux/store';
import {
  Avatar,
  Badge,
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

export const RankingPage: React.FC = () => {
  const { data: leaderboard, isLoading, error } = useGetTopPlayer();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const handleTableChange = (newPagination: any) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const topThreePlayers = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0) return [];
    return leaderboard.slice(0, 3);
  }, [leaderboard]);

  // Find current user's rank in the leaderboard
  const currentUserRank = useMemo(() => {
    if (!leaderboard || leaderboard.length === 0 || !userId) return null;

    const userIndex = leaderboard.findIndex(
      (player) => player.userId === userId
    );
    if (userIndex === -1) return null;

    return {
      player: leaderboard[userIndex],
      rank: userIndex + 1,
    };
  }, [leaderboard, userId]);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#f0f0f0';
    }
  };

  const getIconForRank = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <TrophyOutlined style={{ color: '#FFD700', fontSize: '24px' }} />
        );
      case 2:
        return <CrownOutlined style={{ color: '#C0C0C0', fontSize: '24px' }} />;
      case 3:
        return <RiseOutlined style={{ color: '#CD7F32', fontSize: '24px' }} />;
      default:
        return null;
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🏆';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const getRankLabel = (rank: number) => {
    switch (rank) {
      case 1:
        return 'Champion';
      case 2:
        return 'Runner-up';
      case 3:
        return 'Third Place';
      default:
        return '';
    }
  };

  const columns = [
    {
      title: 'Rank',
      key: 'position',
      width: 80,
      render: (_: unknown, __: unknown, index: number) => (
        <Tag
          color="#108ee9"
          style={{
            fontSize: '16px',
            padding: '2px 8px',
            borderRadius: '12px',
          }}
        >
          #{(pagination.current - 1) * pagination.pageSize + index + 1}
        </Tag>
      ),
    },
    {
      title: 'Player',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (name: string, record: TopPlayer) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size="large"
            src={
              record.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
            }
            style={{ marginRight: 8 }}
          />
          <Text
            strong
            style={record.userId === userId ? { color: '#1677ff' } : undefined}
          >
            {name} {record.userId === userId && <span>(You)</span>}
          </Text>
        </div>
      ),
    },
    {
      title: 'Experience Level',
      dataIndex: 'exeprienceLevel',
      key: 'exeprienceLevel',
      render: (level: number) => <Tag color="purple">{level}</Tag>,
    },
    {
      title: 'Matches',
      dataIndex: 'totalMatch',
      key: 'totalMatch',
      render: (totalMatch: number) => (
        <Tooltip title="Total matches played">
          <Tag color="blue">
            <TeamOutlined /> {totalMatch}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Wins',
      dataIndex: 'totalWins',
      key: 'totalWins',
      render: (totalWins: number) => <Tag color="green">{totalWins}</Tag>,
    },
    {
      title: 'Ranking Points',
      dataIndex: 'rankingPoint',
      key: 'rankingPoint',
      render: (rankingPoint: number) => (
        <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
          {rankingPoint}
        </Text>
      ),
    },
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ textAlign: 'center', padding: '50px' }}
      >
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: 16 }}>
          Loading leaderboard...
        </Text>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Failed to load leaderboard data"
        />
      </motion.div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No ranking data available for this tournament"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Title level={3} style={{ textAlign: 'center', marginBottom: 50 }}>
          <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
          <span style={{ color: '#fff' }}> Top Champions</span>
        </Title>
      </motion.div>

      <Row gutter={[32, 32]} style={{ marginBottom: 48 }}>
        {[...topThreePlayers]
          .sort((a, b) => {
            const indexA = topThreePlayers.indexOf(a);
            const indexB = topThreePlayers.indexOf(b);
            const order = [1, 0, 2];
            return order[indexA] - order[indexB];
          })
          .map((player: TopPlayer, index) => {
            const actualIndex = topThreePlayers.indexOf(player);
            const rank = actualIndex + 1;
            const isChampion = rank === 1;
            const columnSpan = { xs: 24, sm: 24, md: 8 };

            return (
              <Col
                key={player.userId}
                {...columnSpan}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: isChampion ? 'flex-start' : 'flex-end',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: 'easeOut',
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Badge.Ribbon
                    text={
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '200px',
                          gap: '5px',
                          fontSize: isChampion ? '16px' : '14px',
                          padding: '0 5px',
                        }}
                      >
                        {getMedalIcon(rank)} {getRankLabel(rank)}
                      </motion.span>
                    }
                    color={getMedalColor(rank)}
                    style={{ zIndex: 2 }}
                  >
                    <motion.div
                      whileHover={
                        isChampion
                          ? {
                              y: -10,
                              scale: 1.05,
                              boxShadow: `0 15px 30px rgba(255, 215, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2)`,
                            }
                          : {
                              y: -5,
                              scale: 1.03,
                              boxShadow: `0 10px 20px rgba(0, 0, 0, 0.15), 0 0 15px ${getMedalColor(
                                rank
                              )}30`,
                            }
                      }
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Card
                        bordered
                        style={{
                          width: '100%',
                          background: `linear-gradient(135deg, ${getMedalColor(
                            rank
                          )}30, white)`,
                          boxShadow: isChampion
                            ? `0 10px 25px rgba(255, 215, 0, 0.3), 0 0 20px ${getMedalColor(
                                rank
                              )}40`
                            : `0 5px 15px rgba(0, 0, 0, 0.1), 0 0 10px ${getMedalColor(
                                rank
                              )}30`,
                          borderRadius: '12px',
                          height: '100%',
                          transform: isChampion
                            ? 'translateY(-20px) scale(1.08)'
                            : 'scale(1)',
                          transition: 'all 0.5s ease',
                          position: 'relative',
                          overflow: 'visible',
                          textAlign: 'center',
                          maxWidth: '350px',
                          padding: isChampion ? '10px' : '0',
                          borderTop: `4px solid ${getMedalColor(rank)}`,
                        }}
                        className={`rank-${rank}-card`}
                        hoverable
                        bodyStyle={{
                          padding: isChampion ? '20px 25px' : '15px 20px',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {isChampion && (
                          <motion.div
                            animate={{
                              y: [0, -10, 0],
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 3,
                              ease: 'easeInOut',
                            }}
                            style={{
                              position: 'absolute',
                              top: '-30px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: '40px',
                              filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))',
                              zIndex: 3,
                            }}
                          >
                            👑
                          </motion.div>
                        )}

                        <div style={{ position: 'relative' }}>
                          {isChampion && (
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: 'easeInOut',
                              }}
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '120px',
                                height: '120px',
                                background:
                                  'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,255,255,0) 70%)',
                                borderRadius: '50%',
                                zIndex: 0,
                              }}
                            />
                          )}

                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <Avatar
                              size={isChampion ? 120 : 100}
                              src={
                                player.avatar ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${player.fullName}`
                              }
                              style={{
                                margin: '8px auto 16px',
                                border: `4px solid ${getMedalColor(rank)}`,
                                boxShadow: isChampion
                                  ? `0 0 0 4px rgba(255,255,255,0.8), 0 5px 15px rgba(0,0,0,0.2)`
                                  : `0 2px 8px rgba(0,0,0,0.2)`,
                                position: 'relative',
                                zIndex: 1,
                              }}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: index * 0.3 + 0.3,
                              duration: 0.5,
                            }}
                          >
                            <Title
                              level={isChampion ? 3 : 4}
                              style={{
                                marginBottom: 8,
                                color: isChampion
                                  ? '#5c3c00'
                                  : rank === 2
                                    ? '#494949'
                                    : '#5c2700',
                              }}
                            >
                              {player.fullName}
                              {player.userId === userId && (
                                <Tag
                                  color="#1677ff"
                                  style={{ marginLeft: 8, fontSize: '12px' }}
                                >
                                  YOU
                                </Tag>
                              )}
                            </Title>
                          </motion.div>

                          {isChampion ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8, duration: 0.5 }}
                              style={{
                                margin: '15px 0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                              }}
                            >
                              <StarOutlined
                                style={{ fontSize: '24px', color: '#FFD700' }}
                              />
                              <Text
                                strong
                                style={{
                                  fontSize: '20px',
                                  background:
                                    'linear-gradient(45deg, #FFD700, #FFA500)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                }}
                              >
                                Tournament Champion
                              </Text>
                              <StarOutlined
                                style={{ fontSize: '24px', color: '#FFD700' }}
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.3 + 0.5 }}
                            >
                              <Tag
                                icon={getIconForRank(rank)}
                                color={getMedalColor(rank)}
                                style={{
                                  padding: '2px 15px',
                                  fontSize: '16px',
                                  borderRadius: '15px',
                                  fontWeight: 'bold',
                                  margin: '8px 0 16px',
                                }}
                              >
                                {getRankLabel(rank)}
                              </Tag>
                            </motion.div>
                          )}

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: index * 0.3 + 0.6,
                              duration: 0.5,
                            }}
                          >
                            <Row
                              gutter={[8, 8]}
                              style={{ textAlign: 'center' }}
                            >
                              <Col span={12}>
                                <Card
                                  size="small"
                                  style={{
                                    background: '#f6ffed',
                                    borderColor: '#b7eb8f',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                    borderRadius: '8px',
                                  }}
                                >
                                  <Text type="secondary">Wins</Text>
                                  <div
                                    style={{
                                      fontSize: '18px',
                                      fontWeight: 'bold',
                                      color: 'green',
                                    }}
                                  >
                                    {player.totalWins}
                                  </div>
                                </Card>
                              </Col>
                              <Col span={12}>
                                <Card
                                  size="small"
                                  style={{
                                    background: isChampion
                                      ? 'linear-gradient(120deg, #ffd700, #f8c404)'
                                      : '#fff2e8',
                                    borderColor: isChampion
                                      ? '#ffd700'
                                      : '#ffbb96',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                    borderRadius: '8px',
                                  }}
                                >
                                  <Text
                                    type="secondary"
                                    style={{
                                      color: isChampion ? '#5c3c00' : undefined,
                                    }}
                                  >
                                    Points
                                  </Text>
                                  <div
                                    style={{
                                      fontSize: isChampion ? '22px' : '18px',
                                      fontWeight: 'bold',
                                      color: isChampion ? '#5c3c00' : '#fa541c',
                                    }}
                                  >
                                    {player.rankingPoint}
                                  </div>
                                </Card>
                              </Col>
                            </Row>
                          </motion.div>
                        </div>
                      </Card>
                    </motion.div>
                  </Badge.Ribbon>
                </motion.div>
              </Col>
            );
          })}
      </Row>

      {/* Current User Rank Card (if user exists in leaderboard) */}
      <AnimatePresence>
        {currentUserRank && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              bordered
              style={{
                marginBottom: 40,
                background:
                  'linear-gradient(135deg, rgba(22, 119, 255, 0.1), rgba(255, 255, 255, 0.05))',
                borderColor: '#1677ff',
                borderWidth: '1px',
                borderRadius: '12px',
              }}
            >
              <Row align="middle" gutter={16}>
                <Col xs={24} md={4} style={{ textAlign: 'center' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge.Ribbon text="YOUR RANK" color="#1677ff">
                      <Tag
                        style={{
                          fontSize: '30px',
                          padding: '10px 20px',
                          background:
                            'linear-gradient(135deg, #1677ff, #69c0ff)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 15px rgba(22, 119, 255, 0.4)',
                        }}
                      >
                        #{currentUserRank.rank}
                      </Tag>
                    </Badge.Ribbon>
                  </motion.div>
                </Col>

                <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Avatar
                      size={80}
                      src={
                        currentUserRank.player.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${currentUserRank.player.fullName}`
                      }
                      style={{
                        border: '4px solid #1677ff',
                        boxShadow:
                          '0 0 0 4px rgba(255,255,255,0.2), 0 5px 15px rgba(0,0,0,0.2)',
                      }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text strong style={{ color: 'white', fontSize: '18px' }}>
                        {currentUserRank.player.fullName}
                      </Text>
                    </div>
                  </motion.div>
                </Col>

                <Col xs={24} md={14}>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card
                        size="small"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          borderColor: 'rgba(255,255,255,0.2)',
                        }}
                      >
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                          Experience
                        </Text>
                        <div
                          style={{
                            fontSize: '22px',
                            fontWeight: 'bold',
                            color: '#69c0ff',
                          }}
                        >
                          {currentUserRank.player.exeprienceLevel}
                        </div>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card
                        size="small"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          borderColor: 'rgba(255,255,255,0.2)',
                        }}
                      >
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                          Wins
                        </Text>
                        <div
                          style={{
                            fontSize: '22px',
                            fontWeight: 'bold',
                            color: '#73d13d',
                          }}
                        >
                          {currentUserRank.player.totalWins}
                        </div>
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card
                        size="small"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          borderColor: 'rgba(255,255,255,0.2)',
                        }}
                      >
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                          Points
                        </Text>
                        <div
                          style={{
                            fontSize: '22px',
                            fontWeight: 'bold',
                            color: '#fff566',
                          }}
                        >
                          {currentUserRank.player.rankingPoint}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Divider
          style={{ borderColor: 'rgba(255, 255, 255, 0.15)', margin: '40px 0' }}
        >
          <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            FULL LEADERBOARD
          </Text>
        </Divider>

        <Card
          bordered
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderRadius: '12px',
            background: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <Table
            columns={columns}
            dataSource={leaderboard}
            rowKey="userId"
            pagination={{ pageSize: 10 }}
            style={{ marginTop: 16 }}
            onChange={handleTableChange}
            rowClassName={(record, index) => {
              if (record.userId === userId) {
                return 'current-user-row';
              }
              if (index < 3) {
                return `rank-${index + 1}-row`;
              }
              return '';
            }}
          />
        </Card>
      </motion.div>
      <style>
        {`
        @keyframes float {
          0% { transform: translateX(-50%) translateY(0px); }
          50% { transform: translateX(-50%) translateY(-10px); }
          100% { transform: translateX(-50%) translateY(0px); }
        }
        
        .rank-1-row {
          background: rgba(255, 215, 0, 0.05) !important;
        }
        
        .rank-2-row {
          background: rgba(192, 192, 192, 0.05) !important;
        }
        
        .rank-3-row {
          background: rgba(205, 127, 50, 0.05) !important;
        }
        
        .current-user-row {
          position: relative;
          background: rgba(225, 225, 255) !important;
        }
        
        .current-user-row::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: #1677ff;
          border-radius: 0 3px 3px 0;
        }
        
        .ant-table-wrapper .ant-table-tbody > tr.current-user-row:hover > td {
          background: rgba(22, 119, 255, 0.15) !important;
        }
        
        .rank-1-card:hover {
          transform: translateY(-25px) scale(1.1);
          box-shadow: 0 15px 30px rgba(255, 215, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2);
        }
        
        .rank-2-card:hover, .rank-3-card:hover {
          transform: translateY(-10px) scale(1.05);
        }
        
        .ant-card-bordered.ant-card-hoverable:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }
        `}
      </style>
    </motion.div>
  );
};

export default RankingPage;
