import React, { useState, useEffect } from 'react'; // Ensure React is imported for JSX
import { Input, Card, Avatar, Button } from 'antd';
import { useInView } from 'react-intersection-observer';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { useGetFriendByUserId } from '@src/modules/Friend/hooks/useGetFriendByUserId';

const PlayerCard = ({
  userFriendName,
  userFriendAvatar,
  gender,
  exeprienceLevel,
}) => (
  <Card className="profile-card border rounded shadow-sm mb-2">
    <div className="d-flex align-items-center" style={{ padding: '10px' }}>
      <div className="avatar-container">
        <Avatar
          style={{ marginLeft: '10px' }}
          size={40}
          src={
            userFriendAvatar ??
            'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
          }
          className="bg-primary"
        />
      </div>
      <div className="ms-3 user-info">
        <div className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
          {userFriendName}
        </div>
        <p className="d-flex small text-muted">
          {/* {dateOfBirth && (
            <span>
              {new Date().getFullYear() - new Date(dateOfBirth).getFullYear()}
            </span>
          )}
          {dateOfBirth && gender && <span className="mx-1">•</span>} */}
          {gender && <span>{gender}</span>}
        </p>
      </div>
      <Button
        type="text"
        className="ms-auto d-flex justify-content-center align-items-center"
        style={{ marginRight: '10px', background: '#05155E1A' }}
        aria-readonly
      >
        <span className="fw-200">Level {exeprienceLevel}</span>
      </Button>
    </div>
  </Card>
);

export const FriendPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePlayers, setVisiblePlayers] = useState<any[]>([]); // Danh sách người chơi hiển thị
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isLoading } = useGetFriendByUserId(user?.id ?? 0);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Lọc dữ liệu và cập nhật lại visiblePlayers
    const filtered = (data ?? []).filter((item) => {
      return item.userFriendName?.toLowerCase().includes(term.toLowerCase());
    });

    setVisiblePlayers(filtered); // Cập nhật visiblePlayers với danh sách đã lọc
  };

  return (
    <div className="d-flex flex-column min-vh-100 text-white justify-content-center">
      <div className="flex-grow-1 container py-4">
        <h1 className="display-4 fw-bold mb-4">Friends</h1>

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
                      `${player.userFriendName}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((player) => (
                      <PlayerCard
                        key={player.id}
                        userFriendName={player.userFriendName}
                        userFriendAvatar={player.userFriendAvatar}
                        gender={player.gender}
                        exeprienceLevel={player.exeprienceLevel}
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

export default FriendPage;
