import { useQuery } from '@tanstack/react-query';
import { GET_MATCH_BY_USER_ID } from '../constants';
import { Matches } from '../models';
import Api from '@src/api/api';

const fetchMatchtByUserId = async (id: number): Promise<Matches[]> => {
  try {
    const response = await Api.get(`/Match/user/room/${id}`);
    return response.data as Matches[];
  } catch (error) {
    throw new Error('No tournament matches found');
  }
};

export function useGetMatchByUserId(id: number) {
  return useQuery<Matches[]>({
    queryKey: [GET_MATCH_BY_USER_ID, id],
    queryFn: () => fetchMatchtByUserId(id),
  });
}
