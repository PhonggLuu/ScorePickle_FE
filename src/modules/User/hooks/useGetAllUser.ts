import { useQuery } from '@tanstack/react-query';
import { FETCH_ALL_USERS } from '../constants';
import { User } from '../models';
import api from '@src//api/api';
import { Pagination } from '@src/modules/Pagination/models';

const fetchUsers = async (
  PageNumber?: number,
  PageSize?: number,
  isOrderByCreateAt: boolean = true
): Promise<Pagination<User>> => {
  try {
    const response = await api.getByQueryParams('/User/GetAllUser', {
      PageNumber,
      PageSize,
      isOrderByCreateAt,
    });
    const pagination: Pagination<User> = {
      tournaments: response.data as User[],
      currentPage: PageNumber ?? 1,
      pageSize: PageSize ?? 10,
      totalItems: response.totalItems ?? 0,
      totalPages: response.totalPages ?? 0,
    };
    return pagination as Pagination<User>;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

export function useGetAllUsers(
  PageNumber: number = 1,
  PageSize: number = 10,
  isOrderByCreateAt: boolean = true
) {
  return useQuery<Pagination<User>>({
    queryKey: [FETCH_ALL_USERS, PageNumber, PageSize, isOrderByCreateAt],
    queryFn: () => fetchUsers(PageNumber, PageSize, isOrderByCreateAt),
    refetchInterval: 3000,
  });
}
