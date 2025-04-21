import { useQuery } from '@tanstack/react-query';
import { GET_MATCH_BY_USER_ID } from '../constants';
import { MatchRequest } from '../models';
import Api from '@src/api/api';

const fetchMatchtByUserId = async (
  matchId: number
): Promise<MatchRequest[]> => {
  try {
    const response = await Api.get(`/Match/${matchId}`);
    return response.data as MatchRequest[];
  } catch (error) {
    throw new Error('No matches found');
  }
};

export function useGetMatchDetail(id: number) {
  return useQuery<MatchRequest[]>({
    queryKey: [GET_MATCH_BY_USER_ID, id],
    queryFn: () => fetchMatchtByUserId(id),
  });
}
