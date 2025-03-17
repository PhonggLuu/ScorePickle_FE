export interface IMatch {
  teamResponse: any;
  id: number;
  title: string;
  description: string;
  matchDate: string;
  venueId: number;
  status: number;
  matchCategory: number;
  matchFormat: number;
  winScore: number;
  isPublic: boolean;
  refereeId: number;
  touramentId: number;
  team1Score?: number;
  team2Score?: number;
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
  playerDetails: any;
  id: number;
  playerId: number;
  teamId: number;
  joinedAt: string;
}
