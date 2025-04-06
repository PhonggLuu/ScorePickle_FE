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
