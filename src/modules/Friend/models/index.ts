export interface GetFriendByUserIdResponse {
  id: number;
  user1Id: number;
  user2Id: number;
  userFriendId?: number | null;
  userFriendName?: string | null;
  userFriendAvatar?: string | null;
  status: FriendStatus;
  createdAt: Date;
}

enum FriendStatus {
  Pending,
  Accepted,
  Blocked,
}
