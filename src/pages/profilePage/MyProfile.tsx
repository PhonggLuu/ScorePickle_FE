import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Tag,
  Input,
  Select,
  Card,
  Spin,
  Modal,
  Row,
  Col,
  Divider,
  message,
  Button,
} from 'antd';
import {
  LikeOutlined,
  DislikeOutlined,
  StockOutlined,
  FireOutlined,
  PlusCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './profile-page.css';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { MatchCategory, MatchFormat } from '@src/modules/Match/models';
import { useGetListMatchAndScore } from '@src/modules/Match/hooks/useGetListMatchesAndScore';
import { useParams } from 'react-router-dom';
import { useGetUserById } from '@src/modules/User/hooks/useGetUserById';
import { useAddFriend } from '@src/modules/Friend/hooks/useAddFriend';
import { AddFriendRequest } from '@src/modules/Friend/models';
import { useJoinMatch } from '@src/modules/Match/hooks/useJoinMatch';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { Search } = Input;

const MyProfile: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { id } = useParams<{ id: string }>();
  const { data: matchesData, isLoading } = useGetListMatchAndScore(
    Number(id || 0)
  );
  const { data: user } = useGetUserById(Number(id || 0));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate: addFriend } = useAddFriend();
  const { mutate: joinMatch } = useJoinMatch();
  const MatchCategoryColors: Record<MatchCategory, string> = {
    [MatchCategory.Custom]: 'green',
    [MatchCategory.Tournament]: 'blue',
    [MatchCategory.Competitive]: 'orange',
  };
  const [matches, setMatches] = useState(matchesData || []);
  const [matchType, setMatchType] = useState('any');

  useEffect(() => {
    if (Array.isArray(matchesData)) {
      setMatches(matchesData);
    }
  }, [matchesData]);

  if (!id) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin size="large" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spin size="large" />
      </div>
    );
  }

  const formattedDate = (d: any) => {
    const date = new Date(d);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleMouseEnter = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleJoinMatch = (matchId: number) => {
    const payload = {
      matchId: matchId,
      userJoinId: currentUser?.id ?? 0,
    };
    joinMatch({ data: payload });
    // Thêm logic tham gia trận đấu
    setIsModalVisible(false);
  };
  function handleAddFriend() {
    const payload: AddFriendRequest = {
      user1Id: currentUser?.id ?? 0,
      user2Id: Number(id || 0),
    };
    if (currentUser?.id !== undefined) {
      addFriend({ data: payload });
    } else {
      message.error(
        'You have no permission to use this. Please login to add friend.'
      );
    }
    console.log(id);
  }

  // Hàm xử lý filter khi người dùng thay đổi giá trị trong Select
  const handleFilter = (value) => {
    setMatchType(value);

    let filteredMatches = matchesData || [];

    switch (value) {
      case 'tournament':
        filteredMatches = filteredMatches.filter(
          (m) => m.info.matchCategory === MatchCategory.Tournament
        );
        break;
      case 'custom':
        filteredMatches = filteredMatches.filter(
          (m) => m.info.matchCategory === MatchCategory.Custom
        );
        break;
      case 'competitive':
        filteredMatches = filteredMatches.filter(
          (m) => m.info.matchCategory === MatchCategory.Competitive
        );
        break;
      default:
        break;
    }

    setMatches(filteredMatches);
  };

  return (
    <div className="container px-3 px-md-5 py-4">
      {/* Header */}
      <Row gutter={[16, 16]} align="middle" className="profile-header">
        <Col xs={24} md={12}>
          <div className="d-flex flex-column flex-md-row align-items-center">
            <Avatar
              size={80}
              src={user?.avatarUrl ?? '/placeholder.svg?height=80&width=80'}
            />
            <div className="ms-md-3 mt-2 mt-md-0 text-center text-md-start">
              <h2 className="profile-name mb-1">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="profile-details mb-0">
                {user?.gender} •{' '}
                {user?.dateOfBirth
                  ? Math.floor(
                      (Date.now() - new Date(user.dateOfBirth).getTime()) /
                        (1000 * 60 * 60 * 24 * 365.25)
                    )
                  : ''}{' '}
                • {user?.userDetails?.province}, {user?.userDetails?.city}
              </p>
            </div>
          </div>
          <div className="mt-2">
            {currentUser?.id !== Number(id) && (
              <Button
                type="primary"
                onClick={handleAddFriend}
                icon={<UserAddOutlined />}
              >
                <span>Add Friend</span>
              </Button>
            )}
          </div>
        </Col>

        <Col xs={24} md={12} className="text-center text-md-end">
          <div className="stats-box bg-info px-4 py-2 rounded-pill d-inline-block">
            <h3 className="stats-number mb-0">
              Level {user?.userDetails?.experienceLevel}
            </h3>
          </div>
        </Col>
      </Row>

      {/* Content */}
      <div className="profile-content mt-4">
        <Row gutter={[24, 24]}>
          {/* Rating */}
          <Col xs={24} lg={8}>
            <Card title="Rating" headStyle={{ color: '#fff' }}>
              <Row>
                <Col span={12}>
                  <div className="rating-box">
                    <div className="rating-label">
                      <StockOutlined /> Level
                    </div>
                    <div className="rating-value text-black">
                      {user?.userDetails?.experienceLevel}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="rating-box">
                    <div className="rating-label">
                      <FireOutlined /> Point
                    </div>
                    <div className="rating-value text-black">
                      {user?.userDetails?.rankingPoint}
                    </div>
                  </div>
                </Col>
              </Row>

              <div className="stats-list mt-4">
                <div className="stats-item d-flex align-items-center mb-2">
                  <LikeOutlined className="me-2" />
                  <span className="me-auto">Wins</span>
                  <span>{user?.userDetails?.totalWins}</span>
                </div>
                <div className="stats-item d-flex align-items-center">
                  <DislikeOutlined className="me-2" />
                  <span className="me-auto">Losses</span>
                  <span>
                    {(user?.userDetails?.totalMatch ?? 0) -
                      (user?.userDetails?.totalWins ?? 0)}
                  </span>
                </div>
              </div>
            </Card>
          </Col>

          {/* Matches */}
          <Col xs={24} lg={16}>
            <Card
              title="Matches"
              headStyle={{ color: '#fff' }}
              className="h-100"
            >
              <div className="filter-row mb-3">
                <Row gutter={[16, 16]}>
                  <Col xs={12} md={6}>
                    <Select
                      value={matchType}
                      style={{ width: '100%' }}
                      onChange={(value) => handleFilter(value)}
                    >
                      <Option value="any">Any</Option>
                      <Option value="tounament">Tournament</Option>
                      <Option value="custom">Friendly</Option>
                      <Option value="competitive">Competitive</Option>
                    </Select>
                  </Col>
                  <Col xs={12} md={6}>
                    <Search placeholder="Event Name" allowClear />
                  </Col>
                </Row>
              </div>

              {(matches ?? []).map((match) => (
                <Link
                  to={`/match-detail/${match.info.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card key={match.info.id} className="match-card mb-3">
                    <div className="match-header mb-2">
                      <Tag
                        color={MatchCategoryColors[match.info.matchCategory]}
                        className="match-type"
                      >
                        {MatchCategory[match.info.matchCategory]}
                      </Tag>
                    </div>
                    <div className="match-body">
                      <h5 className="match-opponent mb-1">
                        {match.info.title}
                      </h5>
                      <p className="match-date">
                        {formattedDate(match.info.matchDate)}
                        {match.info.venueAddress &&
                          ` • ${match.info.venueAddress}`}
                      </p>

                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={11}>
                          {/* Players */}
                          <label className="form-label mt-1">
                            {MatchFormat[match.info.matchFormat]
                              .toLowerCase()
                              .includes('single')
                              ? 'Player 1'
                              : 'Team 1'}
                          </label>
                          <div className="player d-flex align-items-center mb-2">
                            <Avatar
                              size={30}
                              src="/placeholder.svg?height=24&width=24"
                            />
                            <span className="player-name ms-2">
                              {/* {match.info.teams[0].members[0].playerId} */}
                              {(match.info.player1?.firstName ?? '') +
                                ' ' +
                                ' ' +
                                (match.info.player1?.secondName ?? '') +
                                ' ' +
                                ' ' +
                                (match.info.player1?.lastName ?? '')}
                            </span>
                            {/* <span className="player-rating ms-auto bg-success rounded-pill p-1 px-2">
                            3.745
                          </span> */}
                          </div>
                          {match.info.teams[0].members[1] ? (
                            <div className="player mt-2">
                              <Avatar
                                size={30}
                                src="/placeholder.svg?height=24&width=24"
                              />
                              <span className="player-name">
                                {/* {match.info.teams[0].members[1]?.playerId ?? ''} */}
                                {match.info.player2 &&
                                  (match.info.player2?.firstName ?? '') +
                                    ' ' +
                                    ' ' +
                                    (match.info.player2?.secondName ?? '') +
                                    ' ' +
                                    ' ' +
                                    (match.info.player2?.lastName ?? '')}
                              </span>
                              {/* <span className="player-rating bg-success rounded-pill p-1 px-2">
                              3.255
                            </span> */}
                            </div>
                          ) : (
                            <div className="player mt-2">
                              {MatchFormat[match.info.matchFormat]
                                .toLowerCase()
                                .includes('double') && (
                                <>
                                  <PlusCircleOutlined
                                    style={{
                                      fontSize: '30px',
                                      cursor: 'pointer',
                                    }}
                                    onClick={handleMouseEnter}
                                  />

                                  <Modal
                                    title="Join Match"
                                    visible={isModalVisible}
                                    onCancel={handleCancel}
                                    footer={[
                                      <Button key="no" onClick={handleCancel}>
                                        No
                                      </Button>,
                                      <Button
                                        key="yes"
                                        type="primary"
                                        onClick={() =>
                                          handleJoinMatch(match.info.id)
                                        }
                                      >
                                        Yes
                                      </Button>,
                                    ]}
                                  >
                                    <p>Do you wanna join this match?</p>
                                  </Modal>
                                </>
                              )}
                            </div>
                          )}
                          <label className="form-label mt-4">
                            {MatchFormat[match.info.matchFormat]
                              .toLowerCase()
                              .includes('single')
                              ? 'Player 2'
                              : 'Team 2'}
                          </label>
                          {match.info.teams[1].members[0] ? (
                            <div className="player mt-2">
                              <Avatar
                                size={30}
                                src="/placeholder.svg?height=24&width=24"
                              />
                              <span className="player-name">
                                {/* {match.info.teams[1].members[0]?.playerId ?? ''} */}
                                {match.info.player3 &&
                                  (match.info.player3?.firstName ?? '') +
                                    ' ' +
                                    ' ' +
                                    (match.info.player3?.secondName ?? '') +
                                    ' ' +
                                    ' ' +
                                    (match.info.player3?.lastName ?? '')}
                              </span>
                              {/* <span className="player-rating bg-success rounded-pill p-1 px-2">
                              3.255
                            </span> */}
                            </div>
                          ) : (
                            <div className="player mt-2">
                              {currentUser?.id !== match.info.player1?.id &&
                                currentUser?.id !== match.info.player2?.id &&
                                currentUser?.id !== match.info.player3?.id &&
                                currentUser?.id !== match.info.player4?.id && (
                                  <>
                                    <PlusCircleOutlined
                                      style={{
                                        fontSize: '30px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={handleMouseEnter}
                                    />

                                    <Modal
                                      title="Join Match"
                                      visible={isModalVisible}
                                      onCancel={handleCancel}
                                      footer={[
                                        <Button key="no" onClick={handleCancel}>
                                          No
                                        </Button>,
                                        <Button
                                          key="yes"
                                          type="primary"
                                          onClick={() =>
                                            handleJoinMatch(match.info.id)
                                          }
                                        >
                                          Yes
                                        </Button>,
                                      ]}
                                    >
                                      <p>Do you wanna join this match?</p>
                                    </Modal>
                                  </>
                                )}
                            </div>
                          )}
                          {match.info.teams[1].members[1] ? (
                            <div className="player mt-2">
                              <Avatar
                                size={30}
                                src="/placeholder.svg?height=24&width=24"
                              />
                              <span className="player-name">
                                {/* {match.info.teams[1].members[1]?.playerId ?? ''} */}
                                {match.info.player4 &&
                                  (match.info.player4?.firstName ?? '') +
                                    ' ' +
                                    ' ' +
                                    (match.info.player4?.secondName ?? '') +
                                    ' ' +
                                    ' ' +
                                    (match.info.player4?.lastName ?? '')}
                              </span>
                              {/* <span className="player-rating bg-success rounded-pill p-1 px-2">
                              3.255
                            </span> */}
                            </div>
                          ) : (
                            <div className="player mt-2">
                              {MatchFormat[match.info.matchFormat]
                                .toLowerCase()
                                .includes('double') &&
                                currentUser?.id !== match.info.player1?.id &&
                                currentUser?.id !== match.info.player2?.id &&
                                currentUser?.id !== match.info.player3?.id &&
                                currentUser?.id !== match.info.player4?.id && (
                                  <>
                                    <PlusCircleOutlined
                                      style={{
                                        fontSize: '30px',
                                        cursor: 'pointer',
                                      }}
                                      onClick={handleMouseEnter}
                                    />

                                    <Modal
                                      title="Join Match"
                                      visible={isModalVisible}
                                      onCancel={handleCancel}
                                      footer={[
                                        <Button key="no" onClick={handleCancel}>
                                          No
                                        </Button>,
                                        <Button
                                          key="yes"
                                          type="primary"
                                          onClick={() =>
                                            handleJoinMatch(match.info.id)
                                          }
                                        >
                                          Yes
                                        </Button>,
                                      ]}
                                    >
                                      <p>Do you wanna join this match?</p>
                                    </Modal>
                                  </>
                                )}
                            </div>
                          )}
                        </Col>
                        <Divider
                          type="vertical"
                          style={{
                            height: 'auto',
                            backgroundColor: '#ccc',
                            width: 1,
                          }}
                        />
                        <Col xs={24} md={11}>
                          {match.score && (
                            <div className="match-score">
                              <div className="table-responsive">
                                <table className="table score-table mt-3">
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>Half 1</th>
                                      <th>Half 2</th>
                                      <th>Half 3</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>
                                        {MatchFormat[match.info.matchFormat]
                                          .toLowerCase()
                                          .includes('single')
                                          ? 'Player 1'
                                          : 'Team 1'}
                                      </td>
                                      <td>
                                        {
                                          match.score.matchScoreDetails?.[0]
                                            ?.team1Score
                                        }
                                      </td>
                                      <td>
                                        {
                                          match.score.matchScoreDetails?.[1]
                                            ?.team1Score
                                        }
                                      </td>
                                      <td>
                                        {
                                          match.score.matchScoreDetails?.[2]
                                            ?.team1Score
                                        }
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        {MatchFormat[match.info.matchFormat]
                                          .toLowerCase()
                                          .includes('single')
                                          ? 'Player 2'
                                          : 'Team 2'}
                                      </td>
                                      <td>
                                        {
                                          match.score.matchScoreDetails?.[0]
                                            ?.team2Score
                                        }
                                      </td>
                                      <td>
                                        {
                                          match.score.matchScoreDetails?.[1]
                                            ?.team2Score
                                        }
                                      </td>
                                      <td>
                                        {
                                          match.score.matchScoreDetails?.[2]
                                            ?.team2Score
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>

                      {/* Join logic for doubles */}
                      {/* {MatchFormat[match.info.matchFormat]
                      .toLowerCase()
                      .includes('double') && (
                      <div className="mt-3 text-end">
                        <PlusCircleOutlined
                          style={{ fontSize: '24px', cursor: 'pointer' }}
                          onClick={handleMouseEnter}
                        />
                        <Modal
                          title="Join Match"
                          visible={isModalVisible}
                          onCancel={handleCancel}
                          onOk={handleJoinMatch}
                          footer={null}
                        >
                          <p>Do you want to join this match?</p>
                        </Modal>
                      </div>
                    )} */}
                    </div>
                  </Card>
                </Link>
              ))}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MyProfile;
