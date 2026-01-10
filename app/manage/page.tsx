'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EditGamesModal from './EditGamesModal';
import Navigation from '../components/Navigation';

interface Player {
  id: string;
  name: string;
  totalScore: number;
  pointsFor: number;
  pointsAgainst: number;
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
  const [gameScores, setGameScores] = useState<{ [gameId: string]: { team1: number; team2: number } }>({});
  const [loading, setLoading] = useState(true);
  const [editingCourtSessionId, setEditingCourtSessionId] = useState<string | null>(null);

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

  const handleTeamScoreChange = (gameId: string, team: 'team1' | 'team2', value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setGameScores({
      ...gameScores,
      [gameId]: {
        ...(gameScores[gameId] || { team1: 0, team2: 0 }),
        [team]: numValue,
      },
    });
  };

  const submitGameScore = async (game: Game) => {
    const scores = gameScores[game.id];

    if (!scores || scores.team1 === undefined || scores.team2 === undefined) {
      alert('Please enter scores for both teams');
      return;
    }

    try {
      const response = await fetch(`/api/games/${game.id}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team1Score: scores.team1, team2Score: scores.team2 }),
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

  const resetSession = async () => {
    if (!currentSession) return;

    if (!confirm('⚠️ WARNING: This will reset ALL scores for this session. This cannot be undone. Are you sure?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${currentSession.id}/reset`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('✅ Session reset successfully!');
        fetchSessions();
        setGameScores({});
      } else {
        alert('❌ Failed to reset session');
      }
    } catch (error) {
      console.error('Error resetting session:', error);
      alert('❌ Failed to reset session');
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

  // Get all players sorted by net points
  const allPlayers: Player[] = [];
  currentSession.courtSessions.forEach((cs) => {
    cs.assignments.forEach((a) => {
      if (!allPlayers.find((p) => p.id === a.player.id)) {
        allPlayers.push(a.player);
      }
    });
  });
  allPlayers.sort((a, b) => (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst));

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'total-points', name: 'Total Points' },
    ...currentSession.courtSessions.map(cs => ({
      id: cs.court.id,
      name: cs.court.name,
    })),
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-20 md:p-8 md:pl-24 md:pb-8">
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

            {/* Session Control Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={completeSession}
                className="rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-12 py-4 text-xl font-semibold text-white shadow-lg hover:shadow-xl"
              >
                Complete Session & Promote/Relegate
              </button>
              <button
                onClick={resetSession}
                className="rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-12 py-4 text-xl font-semibold text-white shadow-lg hover:shadow-xl"
              >
                🔄 RESET Session
              </button>
            </div>
          </div>
        )}

        {/* Total Points Tab */}
        {activeTab === 'total-points' && (
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">Total Points - All Players</h2>
            <p className="mb-6 text-gray-600">Cumulative points across all sessions</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="p-3 text-left font-bold text-gray-700">Rank</th>
                    <th className="p-3 text-left font-bold text-gray-700">Player</th>
                    <th className="p-3 text-center font-bold text-gray-700">Points For</th>
                    <th className="p-3 text-center font-bold text-gray-700">Points Against</th>
                    <th className="p-3 text-center font-bold text-gray-700">Net Points</th>
                    <th className="p-3 text-center font-bold text-gray-700">Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {allPlayers.map((player, idx) => (
                    <motion.tr
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`border-b border-gray-100 ${
                        idx === 0
                          ? 'bg-yellow-50'
                          : idx === 1
                          ? 'bg-gray-100'
                          : idx === 2
                          ? 'bg-orange-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="p-3">
                        <div
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                            idx === 0
                              ? 'bg-yellow-500 text-white'
                              : idx === 1
                              ? 'bg-gray-400 text-white'
                              : idx === 2
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-800">{player.name}</td>
                      <td className="p-3 text-center text-gray-700">{player.pointsFor}</td>
                      <td className="p-3 text-center text-gray-700">{player.pointsAgainst}</td>
                      <td className="p-3 text-center font-bold text-purple-600">
                        {player.pointsFor - player.pointsAgainst}
                      </td>
                      <td className="p-3 text-center text-gray-700">{player.totalScore}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
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
                <div className="mb-4 flex items-center justify-between">
                  <h2
                    className={`text-3xl font-bold ${
                      courtSession.court.order === 1
                        ? 'text-yellow-600'
                        : courtSession.court.order === 2
                        ? 'text-purple-600'
                        : 'text-green-600'
                    }`}
                  >
                    {courtSession.court.name} Court
                  </h2>
                  <button
                    onClick={() => setEditingCourtSessionId(courtSession.id)}
                    className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl"
                  >
                    ✏️ Edit Games
                  </button>
                </div>

                {/* Court Standings */}
                <h3 className="mb-3 text-xl font-bold text-gray-800">Court Standings:</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
                  {courtSession.assignments
                    .sort((a, b) => (b.player.pointsFor - b.player.pointsAgainst) - (a.player.pointsFor - a.player.pointsAgainst))
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
                  const currentScores = gameScores[game.id] || { team1: 0, team2: 0 };
                  const team1Total = team1Players.reduce((sum, gp) => sum + gp.score, 0);
                  const team2Total = team2Players.reduce((sum, gp) => sum + gp.score, 0);

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
                          <div className="mb-3 text-sm text-gray-700">
                            {team1Players.map((gp) => gp.player.name).join(' & ')}
                          </div>
                          {game.status === 'completed' ? (
                            <div className="rounded-lg bg-white p-4 text-center text-3xl font-bold text-blue-600">
                              {team1Total}
                            </div>
                          ) : (
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Team Score
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={currentScores.team1 ?? 0}
                                onChange={(e) => handleTeamScoreChange(game.id, 'team1', e.target.value)}
                                className="w-full rounded-lg border-2 border-blue-300 p-4 text-center text-3xl font-bold focus:border-blue-500 focus:outline-none"
                                placeholder="0"
                              />
                            </div>
                          )}
                        </div>

                        {/* Team 2 */}
                        <div className="rounded-xl bg-purple-50 p-4">
                          <h4 className="mb-3 text-xl font-bold text-purple-900">Team 2</h4>
                          <div className="mb-3 text-sm text-gray-700">
                            {team2Players.map((gp) => gp.player.name).join(' & ')}
                          </div>
                          {game.status === 'completed' ? (
                            <div className="rounded-lg bg-white p-4 text-center text-3xl font-bold text-purple-600">
                              {team2Total}
                            </div>
                          ) : (
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Team Score
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={currentScores.team2 ?? 0}
                                onChange={(e) => handleTeamScoreChange(game.id, 'team2', e.target.value)}
                                className="w-full rounded-lg border-2 border-purple-300 p-4 text-center text-3xl font-bold focus:border-purple-500 focus:outline-none"
                                placeholder="0"
                              />
                            </div>
                          )}
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

        {/* Edit Games Modal */}
        {editingCourtSessionId && currentSession && (
          <EditGamesModal
            courtSession={currentSession.courtSessions.find((cs) => cs.id === editingCourtSessionId)!}
            isOpen={editingCourtSessionId !== null}
            onClose={() => setEditingCourtSessionId(null)}
            onSave={fetchSessions}
          />
        )}
        </div>
      </div>
    </>
  );
}
