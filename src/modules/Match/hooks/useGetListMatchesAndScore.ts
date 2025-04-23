import { useQuery } from '@tanstack/react-query';
import { GET_LIST_MATCH_AND_SCORE } from '../constants';
import { FullMatchInfo, MatchAndScore, Matches } from '../models';
import Api from '@src/api/api';
import { fetchVenueById } from '@src/modules/Venues/hooks/useGetVenueById';
import { fetchUserById } from '@src/modules/User/hooks/useGetUserById';

const fetchMatchDetail = async (id: number): Promise<MatchAndScore> => {
  try {
    const response = await Api.get<MatchAndScore>(
      `/Match/GetMatchDetails/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error('No tournament matches found');
  }
};

const fetchMatchByUserId = async (id: number): Promise<FullMatchInfo[]> => {
  try {
    const response = await Api.get<Matches[]>(`/Match/user/room/${id}`);
    const matches = response.data;
    const matchesInfo = await Promise.all(
      matches.map(async (item) => {
        const venue =
          item.venueId !== null ? await fetchVenueById(item.venueId) : null;

        const player1 = item.teams[0].members[0].playerId
          ? await fetchUserById(item.teams[0].members[0].playerId)
          : null;
        const player2 = item.teams[0].members[1]
          ? await fetchUserById(item.teams[0].members[1].playerId)
          : null;
        const player3 = item.teams[1].members[0]
          ? await fetchUserById(item.teams[1].members[0].playerId)
          : null;
        const player4 = item.teams[1].members[1]
          ? await fetchUserById(item.teams[1].members[1].playerId)
          : null;
        return {
          ...item,
          venueName: venue?.name,
          venueAddress: venue?.address,
          venueImage: venue?.urlImage,
          player1: player1 ?? undefined,
          player2: player2 ?? undefined,
          player3: player3 ?? undefined,
          player4: player4 ?? undefined,
        };
      })
    );
    const fullInfo: FullMatchInfo[] = await Promise.all(
      matchesInfo.map(async (item) => {
        const score = item.id !== null ? await fetchMatchDetail(item.id) : null;
        return {
          info: item,
          score,
        };
      })
    );
    return fullInfo;
  } catch (error) {
    throw new Error('No tournament matches found');
  }
};

export function useGetListMatchAndScore(id: number) {
  return useQuery<FullMatchInfo[]>({
    queryKey: [GET_LIST_MATCH_AND_SCORE, id],
    queryFn: () => fetchMatchByUserId(id),
  });
}
