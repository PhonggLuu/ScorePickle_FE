import { useGetFriendRequestByUserId } from '@src/modules/Friend/hooks/useGetFriendRequestByUserId';
import { FriendStatus } from '@src/modules/Friend/models';
import { Avatar, Button, message } from 'antd';
import { useRespondFriendRequest } from '@src/modules/Friend/hooks/useRespondFriendRequest';
import { useNavigate } from 'react-router-dom';

const FriendRequest = ({ userId }) => {
  const { data, error, isLoading, refetch } =
    useGetFriendRequestByUserId(userId);
  const { mutate: responseFriendRequest } = useRespondFriendRequest();
  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p>No add friend request available.</p>;
  }

  const handleAcceptFriend = async (FriendId) => {
    try {
      await responseFriendRequest({
        user1Id: userId,
        user2Id: FriendId,
        isAccept: true,
      });
      message.success('Accepted Friend successfully!');
      refetch();
    } catch (err) {
      message.error('Failed to accept Friend!');
    }
  };

  const handleRejectFriend = async (FriendId) => {
    try {
      await responseFriendRequest({
        user1Id: userId,
        user2Id: FriendId,
        isAccept: false,
      });
      message.success('Rejected Friend successfully!');
      refetch();
    } catch (err) {
      message.error('Failed to reject Friend!');
    }
  };

  return (
    <ul>
      {data.map((Friend, index) => (
        <li key={index} className="row mb-2">
          <strong
            className="col-8"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/profile/${Friend.user1Id}`)}
          >
            <Avatar src={Friend.userFriendAvatar} size={40} />
            <span className="ms-1" style={{ color: 'coral' }}>
              {Friend.userFriendName}
            </span>{' '}
            send you a friend request
            {/* 
            Friend Request By{' '}
            <span style={{ color: 'coral' }}>
              {Friend.userFriendName ?? Friend.user1Id}
            </span>{' '} */}
            {/* <span>{Friend.status === FriendStatus.Accepted ? "was accepted" : "was rejected"}</span> */}
          </strong>
          {Friend.status === FriendStatus.Pending ? (
            <div className="col-4 d-flex justify-content-end">
              <Button
                style={{ borderColor: 'green', color: 'green' }}
                onClick={() => {
                  handleAcceptFriend(Friend.user1Id);
                }}
              >
                <span>Accept</span>
              </Button>
              <Button
                style={{ borderColor: 'red', color: 'red' }}
                onClick={() => {
                  handleRejectFriend(Friend.user1Id);
                }}
                className="ms-2"
              >
                Reject
              </Button>
            </div>
          ) : Friend.status === FriendStatus.Accepted ? (
            <div className="col-4 d-flex justify-content-end">
              <Button style={{ borderColor: 'green', color: 'green' }}>
                <span>Accepted</span>
              </Button>
            </div>
          ) : (
            <div className="col-4 d-flex justify-content-end">
              <Button style={{ borderColor: 'red', color: 'red' }}>
                <span>Rejected</span>
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FriendRequest;
