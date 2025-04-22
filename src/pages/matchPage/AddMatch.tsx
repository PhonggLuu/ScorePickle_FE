import type React from 'react';
import { useEffect, useState } from 'react';
import {
  Input,
  Button,
  DatePicker,
  Avatar,
  Radio,
  Collapse,
  Typography,
  Select,
  Card,
  Image,
  Tag,
  AutoComplete,
  message,
} from 'antd';
import { UserOutlined, MinusCircleOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import type { CollapseProps } from 'antd';
import dayjs from 'dayjs';
import { RootState } from '@src/redux/store';
import { useSelector } from 'react-redux';
import { useGetFriendByUserId } from '@src/modules/Friend/hooks/useGetFriendByUserId';
import { useGetReferees } from '@src/modules/User/hooks/useGetAllReferee';
import { useGetVenueAll } from '@src/modules/Venues/hooks/useGetAllVenue';
import { GetFriendByUserIdResponse } from '@src/modules/Friend/models';
import {
  MatchCategory,
  MatchFormat,
  MatchRequest,
  MatchStatus,
} from '@src/modules/Match/models';
import { createMatch } from '@src/modules/Match/hooks/useCreateMatch';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
//const { TabPane } = Tabs;

interface Player {
  id: number;
  name: string;
  avatar: string;
  level: number;
}

interface PlayersSelected {
  players: Player[];
}

const AddMatches: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeKey, setActiveKey] = useState<string | string[]>(['1']);
  const [matchType, setMatchType] = useState<string>('team');
  const [matchCategory, setMatchCategory] = useState<string>('custom');
  const selectScore = [11, 15, 21];
  const [matchScore, setMatchScore] = useState<number>(selectScore[0]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
    dayjs(Date.now())
  );

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const { data: venueData } = useGetVenueAll();
  const [venue, setVenue] = useState<number>(venueData?.[0]?.id ?? 0);

  const { data: refereeData } = useGetReferees();
  const [referee, setReferee] = useState<number>(refereeData?.[0]?.id ?? 0);

  const { data: allFriend } = useGetFriendByUserId(user?.id ?? 0);
  const [friendData, setFriendData] = useState<GetFriendByUserIdResponse[]>([]);

  const disabledDate = (current: dayjs.Dayjs) => {
    // không cho chọn trước 0:00 phút của ngày hôm nay
    return current && current.isBefore(dayjs().startOf('day'));
  };

  // 2. Chặn giờ/phút đã qua nếu chọn đúng ngày hôm nay
  const disabledDateTime = (current: dayjs.Dayjs | null) => {
    if (!current) return {};
    const now = dayjs();

    // nếu đang chọn ngày hôm nay
    if (current.isSame(now, 'day')) {
      const disabledHours = Array.from({ length: now.hour() }, (_, i) => i);
      const disabledMinutes = (hour: number) => {
        // nếu giờ trùng với giờ hiện tại, chặn phút đã qua
        if (hour === now.hour()) {
          return Array.from({ length: now.minute() }, (_, i) => i);
        }
        return [];
      };
      return {
        disabledHours: () => disabledHours,
        disabledMinutes,
        disabledSeconds: () => [] as number[],
      };
    }

    // với ngày khác hôm nay thì không chặn time
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    };
  };

  useEffect(() => {
    if (allFriend) {
      setFriendData(allFriend);
    }
  }, [allFriend]);

  useEffect(() => {
    if (matchCategory === 'competitive') {
      setMatchType('single');
      setPlayersSelected(getInitialPlayers());
    }
  }, [matchCategory]);

  const [playersSelected, setPlayersSelected] = useState<PlayersSelected>({
    players: user
      ? [
          {
            id: user.id,
            name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
            avatar:
              user?.avatarUrl ||
              'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg',
            level: user?.userDetails?.experienceLevel ?? 0,
          },
        ]
      : [],
  });

  // Search and select a player
  const handlePlayerSelect = (value: string, index: number) => {
    const selectedFriend = friendData?.find((f) => f.userFriendName === value);

    if (selectedFriend) {
      setFriendData((prev) =>
        prev.filter((f) => f.userFriendId !== selectedFriend.userFriendId)
      );

      const newTeamPlayers = [...playersSelected.players];
      // Add or update player at the specified index
      newTeamPlayers[index] = {
        id: selectedFriend.userFriendId ?? 0, // Assuming userFriendId exists in friendData
        name: selectedFriend.userFriendName ?? '',
        avatar:
          selectedFriend.userFriendAvatar ??
          'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg',
        level: selectedFriend.exeprienceLevel ?? 0,
      }; // You can modify the rating here if it's part of friendData
      setPlayersSelected({ ...playersSelected, players: newTeamPlayers });
    }
  };

  //teamData === playersSelected
  //teamPlayers = players
  // Remove player from team
  const removePlayer = (index: number) => {
    const removedPlayer = playersSelected.players[index];
    // Add the removed player back to the friendData
    const player = allFriend?.find((f) => f.userFriendId === removedPlayer.id);
    if (player) {
      setFriendData((friendData) => [...friendData, player]);
    }

    //Remove player at the specified index
    const newTeamPlayers = [...playersSelected.players];
    newTeamPlayers.splice(index, 1);
    setPlayersSelected({ ...playersSelected, players: newTeamPlayers });
  };

  const [searchText, setSearchText] = useState<string>('');

  const handleSearch = () => {
    return (friendData || []).filter(
      (f) => f.userFriendName?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const handleSearchChange = (value) => {
    setSearchText(value); // Cập nhật từ khóa tìm kiếm khi người dùng gõ
  };

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const handleSubmit = async () => {
    let hasError = false;
    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    }
    if (!description.trim()) {
      setDescriptionError(true);
      hasError = true;
    }
    if (hasError) {
      message.error('Fill out Title and Description');
      return;
    }
    // Validate players selection for custom category
    if (matchCategory === 'custom') {
      if (matchType === 'single') {
        if (!playersSelected.players[1]) {
          message.error('At least 2 persons for a single match');
          return;
        }
      } else {
        if (
          playersSelected.players.length < 4 ||
          !playersSelected.players[1] ||
          !playersSelected.players[2] ||
          !playersSelected.players[3]
        ) {
          message.error('At least 4 persons for a double match');
          return;
        }
      }
    }
    const isComp =
      matchCategory === MatchCategory[MatchCategory.Competitive].toLowerCase();
    const isTeam = matchType === 'team';
    const payload: MatchRequest = {
      title: title,
      description: description,
      matchDate: selectedDate.toISOString(),
      status: MatchStatus.Scheduled,
      venueId: venue !== 0 ? venue : null,
      matchCategory: isComp ? MatchCategory.Competitive : MatchCategory.Custom,
      matchFormat: isComp
        ? user?.gender?.toLowerCase() === 'male'
          ? MatchFormat.SingleMale
          : MatchFormat.SingleFemale
        : MatchFormat.DoublesMix,
      winScore: matchScore,
      isPublic: !isComp,
      roomOnwer: user!.id,
      player1Id: user!.id,
      player2Id: isComp ? null : playersSelected.players[1].id ?? null,
      player3Id: isComp ? null : isTeam ? playersSelected.players[2].id : null,
      player4Id: isComp ? null : isTeam ? playersSelected.players[3].id : null,
      refereeId: referee !== 0 ? venue : null,
      tournamentId: null,
    };
    const data = await createMatch(payload);
    if (data) {
      message.success('Create match successfully');
      resetFields();
      navigate(`/match-detail/${data.id}`);
    } else message.info('Create match failed');
  };

  // Initial player selection: only the current user
  const getInitialPlayers = (): PlayersSelected => ({
    players: user
      ? [
          {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            avatar:
              user.avatarUrl ||
              'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg',
            level: user.userDetails?.experienceLevel ?? 0,
          },
        ]
      : [],
  });

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setSelectedDate(dayjs());
    setVenue(venueData?.[0]?.id ?? 0);
    setReferee(refereeData?.[0]?.id ?? 0);
    setPlayersSelected(getInitialPlayers());
    setFriendData(allFriend || []);
    setMatchCategory('custom');
    setMatchType('team');
    setMatchScore(selectScore[0]);
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Title level={4} style={{ margin: 0 }}>
          Match
        </Title>
      ),
      children: (
        <div className="match-form">
          <div className="row mb-4">
            <div className="col-md-4">
              <label className="form-label">Title</label>
              <Input
                className="rounded-pill p-3"
                placeholder="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError(false);
                }}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Description</label>
              <Input
                className="rounded-pill p-3"
                placeholder="Description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (descriptionError) setDescriptionError(false);
                }}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Date</label>
              <DatePicker
                className="w-100 rounded-pill p-3"
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                disabledDate={disabledDate}
                disabledTime={disabledDateTime}
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">
                {matchType === 'single' ? 'Player 1' : 'Team 1'}
              </label>

              {/* This player (PLAYER 1)*/}
              {playersSelected.players[0] && (
                <div
                  className="selected-player border p-2 rounded-pill mb-2"
                  style={{ background: 'rgba(177, 177, 177, 0.5)' }}
                >
                  <Avatar icon={<UserOutlined />} className="player-avatar" />
                  <span className="player-name ms-2">
                    {playersSelected.players[0].name}
                  </span>
                  <Tag color="blue" className="player-rating ms-3">
                    {playersSelected.players[0].level}
                  </Tag>
                  <Button
                    type="text"
                    icon={<MinusCircleOutlined />}
                    onClick={() => removePlayer(0)}
                    className="remove-player"
                    disabled
                  />
                </div>
              )}
              {matchCategory === 'custom' && (
                <>
                  {/* Player 2 if select match type team */}
                  {matchType === 'team' ? (
                    playersSelected.players[1] ? (
                      <div
                        className="selected-player border p-2 rounded-pill"
                        style={{ background: 'rgba(177, 177, 177, 0.5)' }}
                      >
                        <Avatar
                          icon={<UserOutlined />}
                          className="player-avatar"
                        />
                        <span className="player-name ms-2">
                          {playersSelected.players[1].name}
                        </span>
                        <Tag color="blue" className="player-rating ms-3">
                          {playersSelected.players[1].level}
                        </Tag>
                        <Button
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => removePlayer(1)}
                          className="remove-player"
                        />
                      </div>
                    ) : (
                      <AutoComplete
                        options={handleSearch()?.map((f) => ({
                          value: f.userFriendName ?? '',
                          label: (
                            <div className="d-flex flex-column my-2">
                              <span className="fw-bold">
                                {f.userFriendName}
                              </span>
                              <small className="text-muted">
                                Gender: {f.gender} | Level: {f.exeprienceLevel}
                              </small>
                            </div>
                          ),
                        }))}
                        onSelect={
                          (value) => handlePlayerSelect(value, 1) // Always selects player[1]
                        }
                        className="player-search w-100"
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Search Player"
                          className="rounded-pill p-2 mb-2"
                          onChange={(e) => handleSearchChange(e.target.value)}
                        />
                      </AutoComplete>
                    )
                  ) : (
                    <div></div>
                  )}

                  <label className="form-label mt-4">
                    {matchType === 'single' ? 'Player 2' : 'Team 2'}
                  </label>

                  {/* Player 3 if select match type team*/}
                  {matchType === 'team' ? (
                    playersSelected.players[2] ? (
                      <div
                        className="selected-player border p-2 rounded-pill mb-2"
                        style={{ background: 'rgba(177, 177, 177, 0.5)' }}
                      >
                        <Avatar
                          icon={<UserOutlined />}
                          className="player-avatar"
                        />
                        <span className="player-name ms-2">
                          {playersSelected.players[2].name}
                        </span>
                        <Tag color="blue" className="player-rating ms-3">
                          {playersSelected.players[2].level}
                        </Tag>
                        <Button
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => removePlayer(2)}
                          className="remove-player"
                        />
                      </div>
                    ) : (
                      <AutoComplete
                        options={handleSearch()?.map((f) => ({
                          value: f.userFriendName ?? '',
                          label: (
                            <div className="d-flex flex-column my-2">
                              <span className="fw-bold">
                                {f.userFriendName}
                              </span>
                              <small className="text-muted">
                                Gender: {f.gender} | Level: {f.exeprienceLevel}
                              </small>
                            </div>
                          ),
                        }))}
                        onSelect={
                          (value) => handlePlayerSelect(value, 2) // Always selects player[1]
                        }
                        className="player-search w-100 mb-2"
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Search Player"
                          className="rounded-pill p-2 mb-2"
                          onChange={(e) => handleSearchChange(e.target.value)}
                        />
                      </AutoComplete>
                    )
                  ) : // Player 2 if select match type team
                  playersSelected.players[1] ? (
                    <div
                      className="selected-player border p-2 rounded-pill mb-2"
                      style={{ background: 'rgba(177, 177, 177, 0.5)' }}
                    >
                      <Avatar
                        icon={<UserOutlined />}
                        className="player-avatar"
                      />
                      <span className="player-name ms-2">
                        {playersSelected.players[1].name}
                      </span>
                      <Tag color="blue" className="player-rating ms-3">
                        {playersSelected.players[1].level}
                      </Tag>
                      <Button
                        type="text"
                        icon={<MinusCircleOutlined />}
                        onClick={() => removePlayer(1)}
                        className="remove-player"
                      />
                    </div>
                  ) : (
                    <AutoComplete
                      options={handleSearch()?.map((f) => ({
                        value: f.userFriendName ?? '',
                        label: (
                          <div className="d-flex flex-column my-2">
                            <span className="fw-bold">{f.userFriendName}</span>
                            <small className="text-muted">
                              Gender: {f.gender} | Level: {f.exeprienceLevel}
                            </small>
                          </div>
                        ),
                      }))}
                      onSelect={
                        (value) => handlePlayerSelect(value, 1) // Always selects player[1]
                      }
                      className="player-search w-100 mb-2"
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Search Player"
                        className="rounded-pill p-2 mb-2"
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                    </AutoComplete>
                  )}

                  {/* Player 4 if select match type team */}
                  {matchType === 'team' ? (
                    playersSelected.players[3] ? (
                      <div
                        className="selected-player border p-2 rounded-pill mt-2"
                        style={{ background: 'rgba(177, 177, 177, 0.5)' }}
                      >
                        <Avatar
                          icon={<UserOutlined />}
                          className="player-avatar"
                        />
                        <span className="player-name ms-2">
                          {playersSelected.players[3].name}
                        </span>
                        <Tag color="blue" className="player-rating ms-3">
                          {playersSelected.players[3].level}
                        </Tag>
                        <Button
                          type="text"
                          icon={<MinusCircleOutlined />}
                          onClick={() => removePlayer(3)}
                          className="remove-player"
                        />
                      </div>
                    ) : (
                      <AutoComplete
                        options={handleSearch()?.map((f) => ({
                          value: f.userFriendName ?? '',
                          label: (
                            <div className="d-flex flex-column my-2">
                              <span className="fw-bold">
                                {f.userFriendName}
                              </span>
                              <small className="text-muted">
                                Gender: {f.gender} | Level: {f.exeprienceLevel}
                              </small>
                            </div>
                          ),
                        }))}
                        onSelect={
                          (value) => handlePlayerSelect(value, 3) // Always selects player[1]
                        }
                        className="player-search w-100 mt-2"
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="Search Player"
                          className="rounded-pill p-2"
                          onChange={(e) => handleSearchChange(e.target.value)}
                        />
                      </AutoComplete>
                    )
                  ) : (
                    <div className="selected-player"></div>
                  )}
                </>
              )}
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-between align-items-center my-3">
                <label className="form-label">Match Category</label>
                <Radio.Group
                  value={matchCategory}
                  onChange={(e) => setMatchCategory(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button
                    className="rounded-pill rounded-end-0"
                    value="competitive"
                  >
                    Competitive
                  </Radio.Button>
                  <Radio.Button
                    className="rounded-pill rounded-start-0"
                    value="custom"
                  >
                    Friendly
                  </Radio.Button>
                </Radio.Group>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label">Match Type</label>
                <Radio.Group
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button
                    className="rounded-pill rounded-end-0"
                    value="single"
                  >
                    Single
                  </Radio.Button>
                  <Radio.Button
                    className="rounded-pill rounded-start-0"
                    value="team"
                    disabled={matchCategory === 'competitive'}
                  >
                    Team
                  </Radio.Button>
                </Radio.Group>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label">Score</label>
                <Select
                  className="w-25"
                  value={matchScore}
                  onChange={(value) => setMatchScore(Number(value))}
                >
                  {selectScore.map((score) => (
                    <Select.Option key={score} value={score}>
                      {score}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label">Venue</label>
                <Select
                  className="w-50"
                  value={venue}
                  optionLabelProp="label"
                  onChange={(value) => setVenue(Number(value))}
                >
                  {venueData?.map((venue) => (
                    <Select.Option
                      key={venue.id}
                      value={venue.id}
                      label={venue.name}
                    >
                      <Card>
                        <Image src={venue.urlImage} />
                        <br />
                        <Text>{venue.name}</Text>
                      </Card>
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label">Referee</label>
                <Select
                  className="w-50"
                  value={referee}
                  onChange={(value) => setReferee(Number(value))}
                  optionLabelProp="label"
                >
                  {Array.isArray(refereeData) &&
                    refereeData.map((referee) => (
                      <Select.Option
                        key={referee.id}
                        value={referee.id}
                        label={referee?.firstName + ' ' + referee?.lastName}
                      >
                        <Card>
                          <Avatar
                            src={referee.avatarUrl}
                            icon={
                              !referee.avatarUrl ? <UserOutlined /> : undefined
                            }
                            className="me-2"
                          />
                          {referee.firstName + ' ' + referee.lastName}
                        </Card>
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container p-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="display-4 fw-bold mb-4 text-white">Add Matches</h1>
        <Button
          type="primary"
          className="rounded-pill bg-light"
          ghost
          onClick={handleSubmit}
        >
          <span className="fw-bold">Submit Matches</span>
        </Button>
      </div>

      <div className="p-3 bg-light">
        <Collapse
          items={items}
          activeKey={activeKey}
          onChange={setActiveKey as (key: string | string[]) => void}
          bordered={false}
        />
      </div>
    </div>
  );
};

export default AddMatches;
