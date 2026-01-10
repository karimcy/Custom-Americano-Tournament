'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
  court: { id: string; name: string; order: number };
  games: Game[];
  assignments: { player: Player }[];
}

interface Session {
  id: string;
  sessionNumber: number;
  status: string;
  courtSessions: CourtSession[];
}

export default function ManagePage() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [gameScores, setGameScores] = useState<{ [gameId: string]: { [playerId: string]: number } }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      const data = await response.json();

      const active = data.find((s: Session) => s.status === 'active');
      setCurrentSession(active || data[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const handleScoreChange = (gameId: string, playerId: string, value: string) => {
    const numValue = Math.max(0, Math.min(7, parseInt(value) || 0));
    setGameScores({
      ...gameScores,
      [gameId]: {
        ...(gameScores[gameId] || {}),
        [playerId]: numValue,
      },
    });
  };

  const submitGameScore = async (game: Game) => {
    const scores = gameScores[game.id] || {};

    // Check if all players have scores
    const allPlayersHaveScores = game.gamePlayers.every(gp =>
      scores[gp.player.id] !== undefined && scores[gp.player.id] !== null
    );

    if (!allPlayersHaveScores) {
      alert('Please enter scores for all players');
      return;
    }

    try {
      const response = await fetch(`/api/games/${game.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores }),
      });

      if (response.ok) {
        alert('Scores submitted!');
        // Clear this game's scores from state
        const newScores = { ...gameScores };
        delete newScores[game.id];
        setGameScores(newScores);
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

    // Check if all games are completed
    const allGamesCompleted = currentSession.courtSessions.every(cs =>
      cs.games.every(g => g.status === 'completed')
    );

    if (!allGamesCompleted) {
      if (!confirm('Not all games are completed. Are you sure you want to complete this session?')) {
        return;
      }
    }

    if (!confirm('Complete this session and promote/relegate players?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${currentSession.id}/complete`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Session completed! Players promoted/relegated.');
        fetchSessions();
        setActiveTab('overview');
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-2xl font-semibold text-purple-600">No session found</div>
      </div>
    );
  }

  // Get all players sorted by score
  const allPlayers: Player[] = [];
  currentSession.courtSessions.forEach((cs) => {
    cs.assignments.forEach((a) => {
      if (!allPlayers.find((p) => p.id === a.player.id)) {
        allPlayers.push(a.player);
      }
    });
  });
  allPlayers.sort((a, b) => b.totalScore - a.totalScore);

  const tabs = [
    { id: 'overview', name: 'Overview' },
    ...currentSession.courtSessions.map(cs => ({
      id: cs.court.id,
      name: cs.court.name,
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Padel Tournament Manager
            </h1>
            <p className="text-xl text-gray-700">
              Session {currentSession.sessionNumber} of 3 - Americano Format
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/standings"
              className="rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl"
            >
              🏆 Standings
            </a>
            <a
              href="/"
              className="rounded-xl bg-white px-6 py-3 text-lg font-semibold text-gray-700 shadow-lg hover:shadow-xl"
            >
              ← Home
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-6 py-3 text-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-3xl font-bold text-gray-800">Leaderboard</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {allPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl p-4 text-center ${
                      index === 0
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                        : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900'
                        : index === 2
                        ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-2xl font-bold">{index + 1}</div>
                    <div className="text-sm font-semibold">{player.name}</div>
                    <div className="text-3xl font-bold">{player.totalScore}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {currentSession.courtSessions.map((cs) => {
                const completedGames = cs.games.filter(g => g.status === 'completed').length;
                const totalGames = cs.games.length;

                return (
                  <div
                    key={cs.id}
                    className={`rounded-2xl p-6 shadow-lg ${
                      cs.court.order === 1
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100'
                        : cs.court.order === 2
                        ? 'bg-gradient-to-br from-blue-100 to-purple-100'
                        : 'bg-gradient-to-br from-green-100 to-teal-100'
                    }`}
                  >
                    <h3 className="mb-3 text-2xl font-bold">
                      {cs.court.name} Court
                    </h3>
                    <div className="mb-3 text-lg">
                      <span className="font-bold">{completedGames}</span> / {totalGames} games completed
                    </div>
                    <button
                      onClick={() => setActiveTab(cs.court.id)}
                      className="rounded-lg bg-white px-4 py-2 font-semibold shadow hover:shadow-md"
                    >
                      View Games →
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Complete Session Button */}
            <div className="text-center">
              <button
                onClick={completeSession}
                className="rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-12 py-4 text-xl font-semibold text-white shadow-lg hover:shadow-xl"
              >
                Complete Session & Promote/Relegate
              </button>
            </div>
          </div>
        )}

        {/* Court Tabs */}
        {currentSession.courtSessions.map((courtSession) => {
          if (activeTab !== courtSession.court.id) return null;

          return (
            <div key={courtSession.id} className="space-y-6">
              {/* Court Header */}
              <div className="rounded-2xl bg-white p-6 shadow-lg">
                <h2
                  className={`mb-4 text-3xl font-bold ${
                    courtSession.court.order === 1
                      ? 'text-yellow-600'
                      : courtSession.court.order === 2
                      ? 'text-purple-600'
                      : 'text-green-600'
                  }`}
                >
                  {courtSession.court.name} Court
                </h2>

                {/* Court Standings */}
                <h3 className="mb-3 text-xl font-bold text-gray-800">Court Standings:</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                  {courtSession.assignments
                    .sort((a, b) => b.player.totalScore - a.player.totalScore)
                    .map((assignment, idx) => (
                      <div
                        key={assignment.player.id}
                        className={`rounded-lg p-3 text-center ${
                          courtSession.court.order === 1
                            ? 'bg-yellow-100 text-yellow-800'
                            : courtSession.court.order === 2
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        <div className="text-xl font-bold">{idx + 1}</div>
                        <div className="text-sm font-semibold">{assignment.player.name}</div>
                        <div className="text-2xl font-bold">{assignment.player.totalScore}</div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Games */}
              <div className="space-y-4">
                {courtSession.games.map((game) => {
                  const team1Players = game.gamePlayers.filter((gp) => gp.team === 1);
                  const team2Players = game.gamePlayers.filter((gp) => gp.team === 2);
                  const currentScores = gameScores[game.id] || {};

                  return (
                    <div
                      key={game.id}
                      className={`rounded-2xl p-6 shadow-lg ${
                        game.status === 'completed'
                          ? 'bg-green-50 border-2 border-green-400'
                          : 'bg-white'
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-800">
                          Game {game.gameNumber}
                        </h3>
                        {game.status === 'completed' && (
                          <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white">
                            ✓ Completed
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Team 1 */}
                        <div className="rounded-xl bg-blue-50 p-4">
                          <h4 className="mb-3 text-xl font-bold text-blue-900">Team 1</h4>
                          {team1Players.map((gp) => (
                            <div key={gp.player.id} className="mb-3">
                              <label className="mb-1 block text-sm font-semibold text-gray-700">
                                {gp.player.name}
                              </label>
                              {game.status === 'completed' ? (
                                <div className="rounded-lg bg-white p-3 text-center text-2xl font-bold">
                                  {gp.score}
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  max="7"
                                  value={currentScores[gp.player.id] ?? gp.score}
                                  onChange={(e) => handleScoreChange(game.id, gp.player.id, e.target.value)}
                                  className="w-full rounded-lg border-2 border-blue-300 p-3 text-center text-2xl font-bold focus:border-blue-500 focus:outline-none"
                                  placeholder="0"
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Team 2 */}
                        <div className="rounded-xl bg-purple-50 p-4">
                          <h4 className="mb-3 text-xl font-bold text-purple-900">Team 2</h4>
                          {team2Players.map((gp) => (
                            <div key={gp.player.id} className="mb-3">
                              <label className="mb-1 block text-sm font-semibold text-gray-700">
                                {gp.player.name}
                              </label>
                              {game.status === 'completed' ? (
                                <div className="rounded-lg bg-white p-3 text-center text-2xl font-bold">
                                  {gp.score}
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  max="7"
                                  value={currentScores[gp.player.id] ?? gp.score}
                                  onChange={(e) => handleScoreChange(game.id, gp.player.id, e.target.value)}
                                  className="w-full rounded-lg border-2 border-purple-300 p-3 text-center text-2xl font-bold focus:border-purple-500 focus:outline-none"
                                  placeholder="0"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {game.status !== 'completed' && (
                        <button
                          onClick={() => submitGameScore(game)}
                          className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-lg font-semibold text-white shadow-lg hover:shadow-xl"
                        >
                          Submit Game {game.gameNumber} Scores
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
