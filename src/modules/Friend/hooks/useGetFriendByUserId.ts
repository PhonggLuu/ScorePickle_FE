import { useQuery } from '@tanstack/react-query';
import api from '@src/api/api';
import { GET_FRIEND_BY_ID } from '../constants';
import { GetFriendByUserIdResponse } from '../models';

const getFriendById = async (
  userId: number,
  Gender?: string,
  MinLevel?: number,
  Maxlevel?: number
) => {
  try {
    const response = await api.getByQueryParams(`/Friend/GetFriend/${userId}`);
    return response.data as GetFriendByUserIdResponse[];
  } catch (error) {
    throw new Error('Error fetching tournament by ID');
  }
};

export function useGetFriendByUserId(
  id: number,
  Gender?: string,
  MinLevel?: number,
  Maxlevel?: number
) {
  return useQuery<GetFriendByUserIdResponse[]>({
    queryKey: [GET_FRIEND_BY_ID, id],
    queryFn: () => getFriendById(id, Gender, MinLevel, Maxlevel),
  });
}
