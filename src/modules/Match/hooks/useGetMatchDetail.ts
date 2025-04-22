import { useQuery } from '@tanstack/react-query';
import { GET_MATCH_BY_ID } from '../constants';
import { Matches } from '../models';
import Api from '@src/api/api';

const fetchMatchtById = async (matchId: number): Promise<Matches> => {
  try {
    const response = await Api.get(`/Match/${matchId}`);
    return response.data as Matches;
  } catch (error) {
    throw new Error('No matches found');
  }
};

export function useGetMatchDetail(id: number) {
  return useQuery<Matches>({
    queryKey: [GET_MATCH_BY_ID, id],
    queryFn: () => fetchMatchtById(id),
  });
}
