import React, { useState, useEffect } from 'react';
import { Input, Card, Avatar, Button, message } from 'antd';
import { useInView } from 'react-intersection-observer';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  LoadingOutlined,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { useGetAllUserPlayer } from '@src/modules/User/hooks/useGetAllUserPlayer';
import './player-page.css';
import { addFriend } from '@src/modules/Friend/hooks/useAddFriend';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';

const PlayerCard = ({
  firstName,
  secondName,
  lastName,
  avatarUrl,
  province,
  city,
  dateOfBirth,
  gender,
  level,
  onAddFriendClick,
}) => (
  <Card className="profile-card border rounded shadow-sm mb-2 card">
    <div className="d-flex align-items-center">
      <div className="avatar-container">
        <Avatar
          style={{ marginLeft: '10px' }}
          size={40}
          src={
            avatarUrl ??
            'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
          }
          className="bg-primary"
        />
      </div>
      <div className="ms-3 user-info">
        <div className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
          {firstName} {secondName} {lastName}
        </div>
        <p className="d-flex small text-muted">
          {province}, {city}
        </p>
        <p className="d-flex small text-muted">
          {dateOfBirth && (
            <span>
              {new Date().getFullYear() - new Date(dateOfBirth).getFullYear()}
            </span>
          )}
          {dateOfBirth && gender && <span className="mx-1">•</span>}
          {gender && <span>{gender}</span>}
        </p>
      </div>
      <Button
        type="text"
        className="ms-auto d-flex justify-content-center align-items-center"
        style={{ marginRight: '60px', background: '#05155E1A' }}
        aria-readonly
      >
        <span className="fw-200">Level {level}</span>
      </Button>
      <Button
        className="position-absolute end-0 translate-middle-y me-3 d-flex justify-content-center align-items-center"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        onClick={onAddFriendClick}
      >
        <UserAddOutlined />
      </Button>
    </div>
  </Card>
);

export const PlayersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useGetAllUserPlayer();
  const [visiblePlayers, setVisiblePlayers] = useState<any[]>([]); // Danh sách người chơi hiển thị
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const user = useSelector((state: RootState) => state.auth.user);

  const { ref, inView } = useInView({
    triggerOnce: false, // Kiểm tra liên tục khi cuộn
    threshold: 0.9, // Kích hoạt khi 90% phần tử xuất hiện trong màn hình
    rootMargin: '0px 0px 100px 0px', // Kích hoạt sớm khi phần tử gần xuất hiện
  });

  // Số lượng phần tử hiển thị mỗi lần (ví dụ: 10)
  const loadMore = () => {
    if (loading || !data || visiblePlayers.length >= data.length) return; // Nếu đang tải hoặc không có dữ liệu thì không làm gì

    setLoading(true);

    // Giả sử dữ liệu đã được tải hoàn toàn (data có chứa tất cả người chơi)
    setTimeout(() => {
      setVisiblePlayers((prevPlayers) => [
        ...prevPlayers,
        ...data.slice(prevPlayers.length, prevPlayers.length + 10), // Lấy 10 phần tử tiếp theo
      ]);
      setLoading(false);
    }, 100); // Giả lập độ trễ khi tải thêm
  };

  // Khi dữ liệu có sẵn, hiển thị 10 phần tử đầu tiên
  useEffect(() => {
    if (data && data.length > 0) {
      setVisiblePlayers(data.slice(0, 10)); // Hiển thị 10 phần tử đầu tiên
    }
  }, [data]);

  // Tải thêm dữ liệu khi phần tử cuối cùng xuất hiện
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView]);

  function handleAddFriend(id: number) {
    if (user?.id !== undefined) {
      addFriend({ user1Id: user.id, user2Id: id });
    } else {
      message.error(
        'You have no permission to use this. Please login to add friend.'
      );
    }
    console.log(id);
  }

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Lọc dữ liệu
    const filtered = (data ?? []).filter((item) => {
      return (
        (item.secondName !== undefined &&
          item.secondName.toLowerCase().includes(term.toLowerCase())) ||
        item.lastName.toLowerCase().includes(term.toLowerCase()) ||
        item.firstName.toLowerCase().includes(term.toLowerCase())
      );
    });
    setVisiblePlayers(filtered);
  };

  return (
    <div className="d-flex flex-column min-vh-100 text-white justify-content-center">
      <div className="flex-grow-1 container py-4">
        <h1 className="display-4 fw-bold mb-4">Players</h1>

        <div
          className="row justify-content-center"
          style={{ minHeight: '100vh', overflowX: 'hidden' }}
        >
          <div className="main-content col-12 col-md-6">
            <div className="container-fluid p-0">
              <div
                className="d-flex flex-column"
                style={{
                  color: 'white',
                }}
              >
                <h1 className="mb-3 fw-bold">Players</h1>

                <div className="position-relative mb-3">
                  <Input
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e)}
                    className="rounded-pill py-2 ps-3"
                    style={{
                      backgroundColor: 'white',
                      border: 'none',
                      boxShadow: 'none',
                      width: '50%',
                    }}
                  />
                </div>

                {isLoading && (
                  <div className="d-flex justify-content-center align-items-center">
                    <LoadingOutlined style={{ fontSize: '50px' }} />
                  </div>
                )}
                <div className="container-fluid" style={{ padding: '0' }}>
                  {visiblePlayers
                    .filter((player) =>
                      `${player.firstName} ${player.secondName} ${player.lastName}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((player) => (
                      <PlayerCard
                        key={player.id}
                        firstName={player.firstName}
                        secondName={player.secondName}
                        lastName={player.lastName}
                        avatarUrl={player.avatarUrl}
                        province={player.userDetails.province}
                        city={player.userDetails.city}
                        dateOfBirth={player.dateOfBirth}
                        gender={player.gender}
                        level={player.userDetails.experienceLevel}
                        onAddFriendClick={() => handleAddFriend(player.id)}
                      />
                    ))}
                </div>

                {!loading && visiblePlayers.length < (data?.length ?? 0) && (
                  <div ref={ref}>
                    {loading && (
                      <LoadingOutlined style={{ fontSize: '50px' }} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayersPage;
