import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MatchRequest } from '../models';
import Api from '@src/api/api';
import { CREATE_MATCH } from '../constants';

const createMatch = async (matchData: MatchRequest): Promise<void> => {
  await Api.post('/Match', matchData);
};

export function useCreateMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CREATE_MATCH] });
    },
  });
}
