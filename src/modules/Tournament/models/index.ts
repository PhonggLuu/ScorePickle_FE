export interface Tournament {
  id: number;
  status: string;
  name: string;
  location: string;
  maxPlayer: number;
  description: string | null;
  banner: string;
  note: string;
  totalPrize: number;
  startDate: string;
  endDate: string;
  type: string;
  organizerId: number;
  isAccept: boolean;
  entryFee: number;
  isFree: boolean;
  isMaxRanking: number;
  isMinRanking: number;
  social: string;
  sponerDetails: TournamentDetail[] | null;
  registrationDetails: RegistrationDetail[];
  touramentDetails: TournamentDetail[];
}

export interface TournamentDetail {
  id: number;
  playerId1: number;
  playerId2: number;
  playerId3: number;
  playerId4: number;
  scheduledTime: string;
  score: string;
  result: string;
}

export interface RegistrationDetail {
  [x: string]: any;
  status: TouramentregistrationStatus;
  partnerId?: number;
  id: number;
  playerId: number;
  paymentId: number;
}

export interface PlayerDetail {
  firstName: string;
  lastName: string;
  secondName: string | null;
  email: string;
  ranking: number;
  avatarUrl: string;
}

export interface Match {
  id: number;
  title: string;
  description: string;
  matchDate: string;
  venueId: number | null;
  status: number;
  matchCategory: number;
  matchFormat: number;
  winScore: number;
  isPublic: boolean;
  refereeId: number | null;
  teamResponse: Team[];
}

export interface Team {
  id: number;
  name: string;
  captainId: number | null;
  matchingId: number;
  members: Member[];
}

export interface Member {
  playerDetails: unknown;
  id: number;
  playerId: number;
  teamId: number;
  joinedAt: string;
}

export type TournamentRequest = Omit<
  Tournament,
  'id' | 'status' | 'isAccept' | 'touramentDetails' | 'registrationDetails'
>;

export enum TournamentType {
  Singles = 'Singles',
  Doubles = 'Doubles',
}

export interface UpdateApprovalDTO {
  isApproved: TouramentregistrationStatus;
  tournamentId: number;
  playerId: number;
  partnerId?: number;
}

export enum TouramentregistrationStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Waiting = 4,
  Eliminated = 5,
}

export interface PlayerTournament {
  touramentId: number;
  status: number;
}

export interface RankPlayer {
  userId: number;
  fullName: string;
  avatar: string;
  rankingPoint: number;
  exeprienceLevel: number;
  totalMatch: number;
  totalWins: number;
  point: number;
  position: number;
}
