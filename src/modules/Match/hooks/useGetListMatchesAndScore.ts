// import { useQuery } from '@tanstack/react-query';
// import { GET_LIST_MATCH_AND_SCORE } from '../constants';
// import { FullMatchInfo, MatchAndScore, Matches } from '../models';
// import Api from '@src/api/api';
// import { fetchVenueById } from '@src/modules/Venues/hooks/useGetVenueById';
// import { fetchUserById } from '@src/modules/User/hooks/useGetUserById';

// const fetchMatchDetail = async (id: number): Promise<MatchAndScore> => {
//   try {
//     const response = await Api.get<MatchAndScore>(
//       `/Match/GetMatchDetails/${id}`
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error('No tournament matches found');
//   }
// };

// const fetchMatchByUserId = async (id: number): Promise<FullMatchInfo[]> => {
//   try {
//     const response = await Api.get<Matches[]>(`/Match/user/room/${id}`);
//     const matches = response.data;
//     const matchesInfo = await Promise.all(
//       matches.map(async (item) => {
//         const venue =
//           item.venueId !== null ? await fetchVenueById(item.venueId) : null;

//         const player1 = item.teams[0].members[0].playerId
//           ? await fetchUserById(item.teams[0].members[0].playerId)
//           : null;
//         const player2 = item.teams[0].members[1]
//           ? await fetchUserById(item.teams[0].members[1].playerId)
//           : null;
//         const player3 = item.teams[1].members[0]
//           ? await fetchUserById(item.teams[1].members[0].playerId)
//           : null;
//         const player4 = item.teams[1].members[1]
//           ? await fetchUserById(item.teams[1].members[1].playerId)
//           : null;
//         return {
//           ...item,
//           venueName: venue?.name,
//           venueAddress: venue?.address,
//           venueImage: venue?.urlImage,
//           player1: player1 ?? undefined,
//           player2: player2 ?? undefined,
//           player3: player3 ?? undefined,
//           player4: player4 ?? undefined,
//         };
//       })
//     );
//     const fullInfo: FullMatchInfo[] = await Promise.all(
//       matchesInfo.map(async (item) => {
//         const score = item.id !== null ? await fetchMatchDetail(item.id) : null;
//         return {
//           info: item,
//           score,
//         };
//       })
//     );
//     return fullInfo;
//   } catch (error) {
//     throw new Error('No tournament matches found');
//   }
// };

// export function useGetListMatchAndScore(id: number) {
//   return useQuery<FullMatchInfo[]>({
//     queryKey: [GET_LIST_MATCH_AND_SCORE, id],
//     queryFn: () => fetchMatchByUserId(id),
//   });
// }
import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_LIST_MATCH_AND_SCORE } from '../constants';
import { FullMatchInfo, MatchAndScore, Matches } from '../models';
import Api from '@src/api/api';
import { fetchVenueById } from '@src/modules/Venues/hooks/useGetVenueById';
import { fetchUserById } from '@src/modules/User/hooks/useGetUserById';
import { User } from '@src/modules/User/models';
import { Venue } from '@src/modules/Venues/models';
import { QueryClient } from '@tanstack/react-query';

const fetchMatchDetail = async (id: number): Promise<MatchAndScore> => {
  const { data } = await Api.get<MatchAndScore>(`/Match/GetMatchDetails/${id}`);
  return data;
};

export function useGetListMatchAndScore(userId: number) {
  const queryClient = useQueryClient();

  // 1. Fetch danh sách matches cơ bản
  const matchesQuery = useQuery<Matches[]>({
    queryKey: [GET_LIST_MATCH_AND_SCORE, userId],
    queryFn: () =>
      Api.get<Matches[]>(`/Match/user/room/${userId}`).then((res) => res.data),
    staleTime: 30 * 60 * 1000, // 30 phút
  });

  // 2. Prefetch các resource phụ: venues, players, matchDetails
  useEffect(() => {
    if (!matchesQuery.data) return;

    const prefetchAll = async () => {
      await Promise.all(
        matchesQuery.data.map(async (match) => {
          // prefetch venue
          if (match.venueId) {
            await queryClient.prefetchQuery({
              queryKey: ['venue', match.venueId],
              queryFn: () => fetchVenueById(match.venueId!),
              staleTime: 10 * 60 * 1000, // cache 10 phút
            });
          }
          // prefetch từng player
          match.teams.forEach((team) =>
            team.members.forEach((member) => {
              const pid = member.playerId;
              if (pid) {
                queryClient.prefetchQuery({
                  queryKey: ['player', pid],
                  queryFn: () => fetchUserById(pid),
                  staleTime: 10 * 60 * 1000, // cache player 10 phút
                });
              }
            })
          );
          // prefetch match detail (score)
          if (match.id) {
            await queryClient.prefetchQuery({
              queryKey: ['matchDetail', match.id],
              queryFn: () => fetchMatchDetail(match.id),
              staleTime: 5 * 60 * 1000, // cache detail 5 phút
            });
          }
        })
      );
    };

    prefetchAll();
  }, [matchesQuery.data, queryClient]);

  // 3. Build FullMatchInfo từ cache
  const data: FullMatchInfo[] = useMemo(() => {
    if (!matchesQuery.data) return [];

    return matchesQuery.data.map((match) => {
      // Lấy venue từ cache, kiểu là Venue | undefined
      const venue = match.venueId
        ? queryClient.getQueryData<Venue>(['venue', match.venueId])
        : undefined;

      // Lấy player từ cache, giả sử kiểu User
      const getPlayerFromCache = (id?: number) =>
        id ? queryClient.getQueryData<User>(['player', id]) : undefined;

      const p1 = getPlayerFromCache(match.teams[0].members[0]?.playerId);
      const p2 = getPlayerFromCache(match.teams[0].members[1]?.playerId);
      const p3 = getPlayerFromCache(match.teams[1].members[0]?.playerId);
      const p4 = getPlayerFromCache(match.teams[1].members[1]?.playerId);

      // Lấy score từ cache, kiểu là MatchAndScore | undefined
      const score = match.id
        ? queryClient.getQueryData<MatchAndScore>(['matchDetail', match.id])
        : undefined;

      return {
        info: {
          ...match,
          venueName: venue?.name,
          venueAddress: venue?.address,
          venueImage: venue?.urlImage,
          player1: p1,
          player2: p2,
          player3: p3,
          player4: p4,
        },
        score,
      };
    });
  }, [matchesQuery.data, queryClient]);

  // 4. Trả về cả trạng thái và data đã enrich
  return {
    ...matchesQuery,
    data,
  } as {
    data: FullMatchInfo[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
}

export async function prefetchListMatchAndScore(userId: number) {
  const queryClient = new QueryClient();
  const matchesRes = await Api.get<Matches[]>(`/Match/user/room/${userId}`);
  const matches = matchesRes.data;

  // Đặt vào cache danh sách match
  await queryClient.setQueryData(['GET_LIST_MATCH_AND_SCORE', userId], matches);

  // Prefetch phụ
  await Promise.all(
    matches.map(async (match) => {
      if (match.venueId) {
        await queryClient.prefetchQuery({
          queryKey: ['venue', match.venueId],
          queryFn: () => fetchVenueById(match.venueId!),
          staleTime: 10 * 60 * 1000,
        });
      }

      match.teams.forEach((team) =>
        team.members.forEach((member) => {
          const pid = member.playerId;
          if (pid) {
            queryClient.prefetchQuery({
              queryKey: ['player', pid],
              queryFn: () => fetchUserById(pid),
              staleTime: 10 * 60 * 1000,
            });
          }
        })
      );

      if (match.id) {
        await queryClient.prefetchQuery({
          queryKey: ['matchDetail', match.id],
          queryFn: () => fetchMatchDetail(match.id),
          staleTime: 5 * 60 * 1000,
        });
      }
    })
  );
}
