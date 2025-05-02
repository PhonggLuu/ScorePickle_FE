import {
  MatchRequest,
  useMatchHub,
} from '@src/modules/SignalR/hooks/useMatchHub';
import { useState } from 'react';

interface CompetitiveProps {
  userId: number;
  gender: string;
  city: string;
  ranking: number;
  matchFormat?: number;
}

const CompetitiveLayout = ({
  userId,
  gender,
  city,
  ranking,
  matchFormat = 1,
}: CompetitiveProps) => {
  const [status, setStatus] = useState<string>('Idle');
  const [rival, setRival] = useState<any>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [confirmedPlayers, setConfirmedPlayers] = useState<number[]>([]);
  const [scoreConfirmed, setScoreConfirmed] = useState(false);

  const { isConnected, findMatch, confirmScore } = useMatchHub({
    onMatchFound: (rival) => {
      setRival(rival);
      setStatus('🎯 Match Found');
    },
    onRoomCreated: (id) => {
      setRoomId(id);
      setStatus(`✅ Room Created (ID: ${id})`);
    },
    onRoomCreationFailed: (msg) => {
      setStatus(`❌ Room Creation Failed: ${msg}`);
    },
    onWaiting: () => {
      setStatus('⏳ Waiting for opponent...');
    },
    onPlayerConfirmed: (userId) => {
      setConfirmedPlayers((prev) => [...prev, userId]);
    },
    onScoreConfirmed: () => {
      setScoreConfirmed(true);
      setStatus('🏁 Score confirmed by both players');
    },
  });

  const handleFindMatch = () => {
    const req: MatchRequest = {
      userId,
      gender,
      city,
      ranking,
      matchFormat,
    };
    findMatch(req);
  };

  const handleConfirmScore = () => {
    if (roomId) {
      confirmScore(roomId, userId);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🏆 Competitive Match</h2>
      <p>
        <strong>Status:</strong> {status}
      </p>
      {isConnected ? (
        <>
          <button onClick={handleFindMatch}>🔍 Find Match</button>
          {rival && (
            <div>
              <p>
                <strong>Rival:</strong>{' '}
                {rival.fullName || `User ${rival.userId}`}
              </p>
            </div>
          )}
          {roomId && (
            <div>
              <p>
                <strong>Room ID:</strong> {roomId}
              </p>
              <button onClick={handleConfirmScore}>✅ Confirm Score</button>
              <p>Confirmed Players: {confirmedPlayers.join(', ')}</p>
              {scoreConfirmed && (
                <p style={{ color: 'green' }}>🎉 Score confirmed!</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p style={{ color: 'gray' }}>🔌 Connecting to SignalR...</p>
      )}
    </div>
  );
};

export default CompetitiveLayout;
