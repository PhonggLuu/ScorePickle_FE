export interface CreateTournamentRegistrationPayload {
  tournamentId: number;
  playerId: number;
  isAccept?: boolean;
  partnerId?: number;
}

export interface CreateTournamentRegistrationResponse {
  id: number;
  tournamentId: number;
  playerId: number;
  isAccept: boolean;
  partnerId: number;
  registeredAt: Date;
}

export interface TournamentInvitation {
  id: number;
  registrationId: number;
  requesterId: number;
  requesterName: string;
  partnerId: number;
  tournamentId: number;
  tournamentName: string;
  status: InvitationStatus;
  createdAt: Date;
}

export enum InvitationStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
}
