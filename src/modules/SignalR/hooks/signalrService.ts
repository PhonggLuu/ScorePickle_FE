// src/services/signalrService.ts
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';

export interface MatchCompetitiveRequest {
  userId: number;
  gender: string;
  city: string;
  matchFormat: number;
  ranking: number;
}

export interface Rival {
  userId: number;
  gender: string;
  city: string;
  matchFormat: number;
  ranking: number;
  connectionId: string;
}

export type Callbacks = {
  onWaiting: () => void;
  onMatchFound: (rival: Rival) => void;
  onRoomCreated: (roomId: string) => void;
  onRoomCreationFailed: (message: string) => void;
  onPlayerConfirmed: (userId: number) => void;
  onScoreConfirmed: (message: string) => void;
};

class SignalRService {
  private connection: HubConnection | null = null;
  private callbacks?: Callbacks;

  public async start(hubUrl: string, callbacks: Callbacks) {
    this.callbacks = callbacks;
    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.registerCallbacks();

    await this.connection.start();
    console.log('SignalR Connected.');
  }

  private registerCallbacks() {
    if (!this.connection || !this.callbacks) return;

    this.connection.on('WaitingForMatch', () => {
      this.callbacks!.onWaiting();
    });

    this.connection.on('MatchFound', (data: { rival: Rival }) => {
      this.callbacks!.onMatchFound(data.rival);
    });

    this.connection.on('RoomCreated', (roomId: string) => {
      this.callbacks!.onRoomCreated(roomId);
    });

    this.connection.on('RoomCreationFailed', (message: string) => {
      this.callbacks!.onRoomCreationFailed(message);
    });

    this.connection.on('PlayerConfirmed', (userId: number) => {
      this.callbacks!.onPlayerConfirmed(userId);
    });

    this.connection.on('ScoreConfirmed', (message: string) => {
      this.callbacks!.onScoreConfirmed(message);
    });
  }

  public async findMatch(request: MatchCompetitiveRequest) {
    if (!this.connection)
      throw new Error('SignalR connection not established.');
    await this.connection.invoke('FindMatch', request);
  }

  public async confirmScore(matchId: number, userId: number) {
    if (!this.connection)
      throw new Error('SignalR connection not established.');
    await this.connection.invoke('ConfirmScore', matchId, userId);
  }
}

export const signalRService = new SignalRService();
