export interface GetFriendByUserIdResponse {
  id: number;
  user1Id: number;
  user2Id: number;
  userFriendId?: number | null;
  userFriendName?: string | null;
  userFriendAvatar?: string | null;
  status: FriendStatus;
  createdAt: Date;
  gender: string;
  exeprienceLevel: number;
}

enum FriendStatus {
  Pending,
  Accepted,
  Blocked,
}
