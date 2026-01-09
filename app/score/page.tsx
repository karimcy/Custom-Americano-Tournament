'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Player {
  id: string;
  name: string;
  totalScore: number;
}

interface GamePlayer {
  player: Player;
  team: number;
  score: number;
}

interface Game {
  id: string;
  gameNumber: number;
  status: string;
  gamePlayers: GamePlayer[];
}

interface CourtSession {
  id: string;
  court: { name: string; order: number };
  games: Game[];
}

interface Session {
  id: string;
  sessionNumber: number;
  status: string;
  courtSessions: CourtSession[];
}

export default function ScorePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [scores, setScores] = useState<{ [playerId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setSessions(data);

      const active = data.find((s: Session) => s.status === 'active');
      setCurrentSession(active || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const handleScoreChange = (playerId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setScores({ ...scores, [playerId]: numValue });
  };

  const submitScores = async () => {
    if (!selectedGame) return;

    try {
      const response = await fetch(`/api/games/${selectedGame.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores }),
      });

      if (response.ok) {
        alert('Scores submitted successfully!');
        setSelectedGame(null);
        setScores({});
        fetchSessions();
      } else {
        alert('Failed to submit scores');
      }
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Failed to submit scores');
    }
  };

  const completeSession = async () => {
    if (!currentSession) return;

    if (!confirm('Are you sure you want to complete this session? This will promote/relegate players.')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${currentSession.id}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Session completed! Players have been promoted/relegated.');
        router.push('/display');
      } else {
        alert('Failed to complete session');
      }
    } catch (error) {
      console.error('Error completing session:', error);
      alert('Failed to complete session');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-2xl font-semibold text-purple-600">Loading...</div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
        <h1 className="mb-4 text-4xl font-bold text-purple-600">No Active Session</h1>
        <button
          onClick={() => router.push('/')}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (selectedGame) {
    const team1Players = selectedGame.gamePlayers.filter((gp) => gp.team === 1);
    const team2Players = selectedGame.gamePlayers.filter((gp) => gp.team === 2);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white p-6 shadow-xl md:p-8"
          >
            <button
              onClick={() => {
                setSelectedGame(null);
                setScores({});
              }}
              className="mb-4 text-purple-600 hover:text-purple-800"
            >
              ← Back
            </button>

            <h1 className="mb-6 text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Enter Scores - Game {selectedGame.gameNumber}
            </h1>

            <div className="space-y-6">
              {/* Team 1 */}
              <div className="rounded-xl bg-blue-50 p-6">
                <h2 className="mb-4 text-2xl font-bold text-blue-800">Team 1</h2>
                {team1Players.map((gp) => (
                  <div key={gp.player.id} className="mb-4">
                    <label className="mb-2 block text-lg font-semibold text-gray-700">
                      {gp.player.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={scores[gp.player.id] || ''}
                      onChange={(e) => handleScoreChange(gp.player.id, e.target.value)}
                      className="w-full rounded-lg border-2 border-blue-300 p-4 text-2xl text-center focus:border-blue-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {/* Team 2 */}
              <div className="rounded-xl bg-purple-50 p-6">
                <h2 className="mb-4 text-2xl font-bold text-purple-800">Team 2</h2>
                {team2Players.map((gp) => (
                  <div key={gp.player.id} className="mb-4">
                    <label className="mb-2 block text-lg font-semibold text-gray-700">
                      {gp.player.name}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={scores[gp.player.id] || ''}
                      onChange={(e) => handleScoreChange(gp.player.id, e.target.value)}
                      className="w-full rounded-lg border-2 border-purple-300 p-4 text-2xl text-center focus:border-purple-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submitScores}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 text-xl font-semibold text-white shadow-lg"
              >
                Submit Scores
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Game selection view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Enter Scores - Session {currentSession.sessionNumber}
        </h1>

        <div className="space-y-6">
          {currentSession.courtSessions.map((courtSession) => (
            <motion.div
              key={courtSession.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                {courtSession.court.name}
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courtSession.games.map((game) => (
                  <motion.button
                    key={game.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedGame(game);
                      const initialScores: { [key: string]: number } = {};
                      game.gamePlayers.forEach((gp) => {
                        initialScores[gp.player.id] = gp.score;
                      });
                      setScores(initialScores);
                    }}
                    disabled={game.status === 'completed'}
                    className={`rounded-xl p-6 text-left transition-all ${
                      game.status === 'completed'
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-gradient-to-br from-blue-100 to-purple-100 text-purple-800 hover:shadow-lg'
                    }`}
                  >
                    <div className="mb-2 text-lg font-bold">Game {game.gameNumber}</div>
                    <div className="text-sm">
                      {game.status === 'completed' ? 'Completed ✓' : 'Enter Score'}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={completeSession}
            className="rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-12 py-4 text-xl font-semibold text-white shadow-lg"
          >
            Complete Session & Promote/Relegate
          </motion.button>
        </div>
      </div>
    </div>
  );
}
