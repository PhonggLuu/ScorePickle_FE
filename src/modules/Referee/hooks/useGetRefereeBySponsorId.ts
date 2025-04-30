import { useQuery } from '@tanstack/react-query';
import api from '@src/api/api';
import { RefereeResponse } from '../models';
import { GET_REFEREE_BY_SPONSOR } from '../constants';

const fetchRefereeByCode = async (code: string): Promise<RefereeResponse[]> => {
  try {
    const response = await api.get<RefereeResponse[]>(`/Refree/code/${code}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching referee data');
  }
};

export function useGetRefereeBySponsorId(code: string) {
  return useQuery<RefereeResponse[]>({
    queryKey: [GET_REFEREE_BY_SPONSOR, code],
    queryFn: () => fetchRefereeByCode(code),
    refetchInterval: 3000,
  });
}
