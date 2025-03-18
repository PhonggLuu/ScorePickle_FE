import { useQuery } from '@tanstack/react-query';
import { GET_ALL_TOURNAMENTS } from '../constants';
import { Tournament } from '../models';
import api from '@src//api/api';
import { Pagination } from '@src/modules/Pagination/models';

const fetchTournaments = async (
  PageNumber?: number,
  PageSize?: number
): Promise<Pagination<Tournament>> => {
  try {
    const response = await api.getByQueryParams('/Tourament/GetAllTournament', {
      PageNumber,
      PageSize,
    });
    console.log('Pagination Tournament Response: ', response);
    const pagination: Pagination<Tournament> = {
      data: response.data as Tournament[],
      currentPage: PageNumber ?? 1,
      pageSize: PageSize ?? 10,
      totalItems: response.totalItems ?? 0,
      totalPages: response.totalPages ?? 0,
    };
    console.log('Pagination: ', pagination);
    return pagination as Pagination<Tournament>;
  } catch (error) {
    throw new Error('Error fetching tournaments');
  }
};

export function useGetAllTournaments(
  PageNumber: number = 1,
  PageSize: number = 10
) {
  return useQuery<Pagination<Tournament>>({
    queryKey: [GET_ALL_TOURNAMENTS, PageNumber, PageSize],
    queryFn: () => fetchTournaments(PageNumber, PageSize),
    refetchInterval: 3000,
  });
}
