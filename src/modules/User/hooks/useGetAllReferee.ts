import { useQuery } from '@tanstack/react-query';
import { User } from '../models';
import Api from '../../../api/api';
import { FETCH_ALL_REFEREES, FETCH_REFEREES } from '../constants';

export const fetchAllReferees = async (): Promise<User[]> => {
  const response = await Api.get('/User/GetAllRefee');
  return response.data as User[];
};

export function useGetAllReferees() {
  return useQuery<User[]>({
    queryKey: [FETCH_ALL_REFEREES],
    queryFn: fetchAllReferees,
  });
}

export const fetchReferees = async (): Promise<User[]> => {
  const response = await Api.get('/User/getAllRefeeForMobile');
  return response.data as Referee[];
};

export function useGetReferees() {
  return useQuery<User[]>({
    queryKey: [FETCH_REFEREES],
    queryFn: fetchReferees,
  });
}
