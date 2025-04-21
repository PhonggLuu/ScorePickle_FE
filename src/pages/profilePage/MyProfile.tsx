import type React from 'react';
import { Avatar, Button, Tag, Input, Select, Card } from 'antd';
import {
  LikeOutlined,
  DislikeOutlined,
  StockOutlined,
  FireOutlined,
} from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './profile-page.css';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';

const { Option } = Select;
const { Search } = Input;

interface MatchData {
  key: string;
  type: string;
  date: string;
  location: string;
  score: string;
  opponent: string;
  rating: number;
}

const MyProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const matchData: MatchData[] = [
    {
      key: '1',
      type: 'Win',
      date: '02/10/2025',
      location: 'Tân Phú, District 7, Ho Chi Minh City, Vietnam',
      score: '11-12-11 / 9-10-9',
      opponent: 'Giao Hữu',
      rating: 3.745,
    },
  ];

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="container p-5">
        <div className="profile-header">
          <div className="row align-items-center">
            <div className="col-md-6 d-flex align-items-center">
              <Avatar
                size={80}
                src={user?.avatarUrl ?? '/placeholder.svg?height=80&width=80'}
              />
              <div className="profile-info ms-3">
                <h2 className="profile-name">
                  {user?.firstName + ' ' + user?.lastName}
                </h2>
                <p className="profile-details">
                  {user?.gender} •{' '}
                  {user?.dateOfBirth
                    ? Math.floor(
                        (Date.now() - new Date(user.dateOfBirth).getTime()) /
                          (1000 * 60 * 60 * 24 * 365.25)
                      )
                    : ''}{' '}
                  •{' '}
                  {user?.userDetails?.province + ', ' + user?.userDetails?.city}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end align-items-center">
                <div className="stats-box me-4 bg-info px-5 py-2 rounded-pill">
                  <h3 className="stats-number">
                    Level {user?.userDetails?.experienceLevel}
                  </h3>
                </div>
              </div>
            </div>

            {/* <div className="col-md-6">
              <div className="d-flex justify-content-end align-items-center">
                <div className="stats-box me-4">
                  <h3 className="stats-number">0</h3>
                  <p className="stats-label text-white">Following</p>
                </div>
                <div className="stats-box">
                  <h3 className="stats-number">0</h3>
                  <p className="stats-label text-white">Followers</p>
                </div>
              </div>
            </div> */}
          </div>
          {/* <div className="row mt-3">
            <div className="col-12 d-flex">
              <Button icon={<ShareAltOutlined />} className="me-2">
                Share
              </Button>
              <div className="id-box d-flex align-items-center me-2">
                <span>ID: LV90RJ</span>
                <CopyOutlined className="ms-2" />
              </div>
              <Button type="primary" shape="circle" icon={<PlusOutlined />} />
            </div>
          </div> */}
        </div>

        <div className="profile-content">
          <div className="performance-content" style={{ color: 'transparent' }}>
            <div className="row mt-4">
              <div className="col-md-4">
                <Card title="Rating" headStyle={{ color: '#fff' }}>
                  <div className="row">
                    <div className="col-6">
                      <div className="rating-box">
                        <div className="rating-label">
                          <StockOutlined /> Level
                        </div>
                        <div className="rating-value text-black">
                          {user?.userDetails?.experienceLevel}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="rating-box">
                        <div className="rating-label">
                          <FireOutlined /> Point
                        </div>
                        <div className="rating-value text-black">
                          {user?.userDetails?.rankingPoint}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="stats-list mt-4 text-white">
                    <div className="stats-item">
                      <div className="stats-icon">
                        <LikeOutlined />
                      </div>
                      <div className="stats-label text-white">Wins</div>
                      <div className="stats-value">
                        {user?.userDetails?.totalWins}
                      </div>
                    </div>
                    <div className="stats-item">
                      <div className="stats-icon">
                        <DislikeOutlined />
                      </div>
                      <div className="stats-label text-white">Losses</div>
                      <div className="stats-value">
                        {(user?.userDetails?.totalMatch ?? 0) -
                          (user?.userDetails?.totalWins ?? 0)}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="col-md-8">
                <Card title="Matches" headStyle={{ color: '#fff' }}>
                  <div className="filter-row mb-3">
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <Select defaultValue="any" style={{ width: '100%' }}>
                          <Option value="any">Any</Option>
                          <Option value="single">Single</Option>
                          <Option value="double">Doubles</Option>
                        </Select>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-6 mb-2">
                        <Search placeholder="Event Name" />
                      </div>
                    </div>
                  </div>

                  {matchData.map((match) => (
                    <Card key={match.key} className="match-card mb-3">
                      <div className="match-header">
                        <Tag color="green" className="match-type">
                          {match.type}
                        </Tag>
                        <span className="match-rating">{match.rating}</span>
                      </div>
                      <div className="match-body">
                        <h5 className="match-opponent">{match.opponent}</h5>
                        <p className="match-date">
                          {match.date} • {match.location}
                        </p>

                        <div className="match-players">
                          <div className="player">
                            <Avatar
                              size={24}
                              src="/placeholder.svg?height=24&width=24"
                            />
                            <span className="player-name">Phong Luu</span>
                            <span className="player-rating">3.745</span>
                          </div>
                          <div className="player mt-2">
                            <Avatar
                              size={24}
                              src="/placeholder.svg?height=24&width=24"
                            />
                            <span className="player-name">Phong Luu</span>
                            <span className="player-rating">3.255</span>
                          </div>
                        </div>

                        <div className="match-score">
                          <div className="score-set">11 12 11</div>
                          <div className="score-set">9 10 9</div>
                        </div>

                        <div className="match-footer">
                          <div className="match-id">ID: CD425K9N2</div>
                          <Button size="small">Share To Feed</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
