import { useState } from 'react';
import { Table, Input, Radio, Checkbox, Button, Select, Avatar } from 'antd';
import type { RadioChangeEvent } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './RankingPage.css';

interface PlayerData {
  key: string;
  rank: number;
  player: string;
  avatar: string;
  location: string;
  gender: string;
  age: number;
  rating: number;
  change: string;
  wl: string;
  winPercentage: string;
}

export const RankingPage = () => {
  // State for filters
  const [playerType, setPlayerType] = useState<string>('all');
  const [gender, setGender] = useState<string>('all');
  const [ageGroups, setAgeGroups] = useState<string[]>(['open']);
  const [ratingRange, setRatingRange] = useState<string>('all');

  // Sample data
  const data: PlayerData[] = [
    {
      key: '1',
      rank: 1,
      player: 'Alex Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
      location: 'Phoenix, AZ',
      gender: 'Male',
      age: 28,
      rating: 5.5,
      change: '+0.1',
      wl: '42-5',
      winPercentage: '89.4%',
    },
    {
      key: '2',
      rank: 2,
      player: 'Maria Garcia',
      avatar: '/placeholder.svg?height=40&width=40',
      location: 'Miami, FL',
      gender: 'Female',
      age: 26,
      rating: 5.4,
      change: '+0.1',
      wl: '38-7',
      winPercentage: '84.4%',
    },
    {
      key: '3',
      rank: 3,
      player: 'David Kim',
      avatar: '/placeholder.svg?height=40&width=40',
      location: 'Los Angeles, CA',
      gender: 'Male',
      age: 31,
      rating: 5.3,
      change: '-',
      wl: '36-8',
      winPercentage: '81.8%',
    },
    {
      key: '4',
      rank: 4,
      player: 'Sarah Williams',
      avatar: '/placeholder.svg?height=40&width=40',
      location: 'Chicago, IL',
      gender: 'Female',
      age: 29,
      rating: 5.2,
      change: '+0.1',
      wl: '34-9',
      winPercentage: '79.1%',
    },
    {
      key: '5',
      rank: 5,
      player: 'Michael Chen',
      avatar: '/placeholder.svg?height=40&width=40',
      location: 'Seattle, WA',
      gender: 'Male',
      age: 27,
      rating: 5.2,
      change: '-',
      wl: '32-10',
      winPercentage: '76.2%',
    },
    {
      key: '6',
      rank: 6,
      player: 'Jennifer Lopez',
      avatar: '/placeholder.svg?height=40&width=40',
      location: 'Dallas, TX',
      gender: 'Female',
      age: 30,
      rating: 5.1,
      change: '+0.1',
      wl: '30-11',
      winPercentage: '73.2%',
    },
    {
      key: '7',
      rank: 7,
      player: 'Robert Garcia',
      avatar: '/placeholder.svg?height=40&width=40',
      location: 'Denver, CO',
      gender: 'Male',
      age: 33,
      rating: 5.1,
      change: '-0.1',
      wl: '28-12',
      winPercentage: '70.0%',
    },
    {
      key: '8',
      rank: 8,
      player: 'Emily Davis',
      avatar: '/placeholder.svg?height=40&width=40',
      location: 'Atlanta, GA',
      gender: 'Female',
      age: 25,
      rating: 5.0,
      change: '+0.1',
      wl: '26-13',
      winPercentage: '66.7%',
    },
  ];

  // Table columns
  const columns: ColumnsType<PlayerData> = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
    },
    {
      title: 'Player',
      dataIndex: 'player',
      key: 'player',
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <Avatar src={record.avatar} className="me-2" />
          <span>{record.player}</span>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: (a, b) => a.rating - b.rating,
      sortDirections: ['descend', 'ascend'],
      render: (rating) => <div>{rating}</div>,
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      render: (change) => {
        if (change === '-') return <span>-</span>;

        const isPositive = change.startsWith('+');
        return (
          <div
            className={`d-flex align-items-center ${
              isPositive ? 'text-success' : 'text-danger'
            }`}
          >
            {isPositive ? (
              <span className="me-1">▲</span>
            ) : (
              <span className="me-1">▼</span>
            )}
            {change.substring(1)}
          </div>
        );
      },
    },
    {
      title: 'W/L',
      dataIndex: 'wl',
      key: 'wl',
    },
    {
      title: 'Win %',
      dataIndex: 'winPercentage',
      key: 'winPercentage',
    },
  ];

  // Handle filter changes
  const handlePlayerTypeChange = (e: RadioChangeEvent) => {
    setPlayerType(e.target.value);
  };

  const handleGenderChange = (e: RadioChangeEvent) => {
    setGender(e.target.value);
  };

  const handleAgeGroupChange = (checkedValues: any) => {
    setAgeGroups(checkedValues);
  };

  const handleRatingRangeChange = (value: string) => {
    setRatingRange(value);
  };

  const resetFilters = () => {
    setPlayerType('all');
    setGender('all');
    setAgeGroups(['open']);
    setRatingRange('all');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container py-4">
        <h1 className="display-4 fw-bold mb-4">Rankings</h1>

        {/* Filters Section */}
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="mb-4">
              <h2 className="h5 fw-medium mb-3">Filters</h2>
              <Button onClick={resetFilters} className="w-100 mb-4">
                Reset Filters
              </Button>
            </div>

            <div className="mb-4">
              <h6>Player Type</h6>
              <Radio.Group
                value={playerType}
                onChange={handlePlayerTypeChange}
                className="d-flex flex-column"
              >
                <Radio value="all">All Players</Radio>
                <Radio value="singles">Singles</Radio>
                <Radio value="doubles">Doubles</Radio>
                <Radio value="mixed">Mixed Doubles</Radio>
              </Radio.Group>
            </div>

            <div className="mb-4">
              <h6>Gender</h6>
              <Radio.Group
                value={gender}
                onChange={handleGenderChange}
                className="d-flex flex-column"
              >
                <Radio value="all">All</Radio>
                <Radio value="men">Men</Radio>
                <Radio value="women">Women</Radio>
              </Radio.Group>
            </div>
            <div className="mb-4">
              <h6>Age Group</h6>
              <Checkbox.Group
                value={ageGroups}
                onChange={handleAgeGroupChange}
                className="d-flex flex-column"
              >
                <Checkbox value="open">Open</Checkbox>
                <Checkbox value="junior">Junior (Under 18)</Checkbox>
                <Checkbox value="senior">Senior (50+)</Checkbox>
              </Checkbox.Group>
            </div>

            <div className="mb-4">
              <h6>Rating Range</h6>
              <Select
                value={ratingRange}
                onChange={handleRatingRangeChange}
                className="w-100"
              >
                <Select.Option value="all">All Ratings</Select.Option>
                <Select.Option value="5+">5.0+</Select.Option>
                <Select.Option value="4-5">4.0 - 5.0</Select.Option>
                <Select.Option value="3-4">3.0 - 4.0</Select.Option>
                <Select.Option value="2-3">2.0 - 3.0</Select.Option>
              </Select>
            </div>
            <Button className="bg-dark text-white" block>
              Apply Filters
            </Button>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="rankings-container">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h2 className="mb-0">Top Players</h2>
                </div>
                <Input
                  placeholder="Search players..."
                  prefix={<span>🔍</span>}
                  style={{ width: 250 }}
                />
              </div>

              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                className="player-rankings-table"
                rowClassName="player-row"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RankingPage;
