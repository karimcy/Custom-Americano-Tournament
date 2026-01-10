'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

export default function RoundsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setSessions(data);

      // Select the active session or the latest one
      const active = data.find((s: Session) => s.status === 'active');
      setSelectedSessionId(active?.id || data[data.length - 1]?.id);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 md:pl-24">
          <div className="text-2xl font-semibold text-purple-600">Loading...</div>
        </div>
      </>
    );
  }

  if (sessions.length === 0) {
    return (
      <>
        <Navigation />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 md:pl-24">
          <div className="text-2xl font-semibold text-purple-600">No sessions found</div>
        </div>
      </>
    );
  }

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-20 md:p-8 md:pl-24 md:pb-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Session History
            </h1>
            <p className="text-xl text-gray-700">
              View scores and standings from all sessions
            </p>
          </div>

          {/* Session Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className={`rounded-lg px-6 py-3 text-lg font-semibold transition-all ${
                  selectedSessionId === session.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Session {session.sessionNumber}
                {session.status === 'active' && (
                  <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
                    Active
                  </span>
                )}
                {session.status === 'completed' && (
                  <span className="ml-2 rounded-full bg-gray-500 px-2 py-0.5 text-xs text-white">
                    Completed
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Selected Session Content */}
          {selectedSession && (
            <div className="space-y-6">
              {/* Courts */}
              {selectedSession.courtSessions.map((courtSession) => {
                const sortedPlayers = [...courtSession.assignments]
                  .map((assignment) => ({
                    ...assignment,
                    netPoints: assignment.player.pointsFor - assignment.player.pointsAgainst,
                  }))
                  .sort((a, b) => b.netPoints - a.netPoints);

                return (
                  <motion.div
                    key={courtSession.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white p-6 shadow-lg"
                  >
                    <h2
                      className={`mb-6 text-3xl font-bold ${
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
                    <div className="mb-6">
                      <h3 className="mb-3 text-xl font-bold text-gray-800">Standings</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b-2 border-gray-300">
                              <th className="p-3 text-left font-bold text-gray-700">Rank</th>
                              <th className="p-3 text-left font-bold text-gray-700">Player</th>
                              <th className="p-3 text-center font-bold text-gray-700">For</th>
                              <th className="p-3 text-center font-bold text-gray-700">Against</th>
                              <th className="p-3 text-center font-bold text-gray-700">Net</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedPlayers.map((assignment, idx) => (
                              <tr
                                key={assignment.player.id}
                                className={`border-b border-gray-100 ${
                                  idx < 3 && courtSession.court.order > 1
                                    ? 'bg-green-50'
                                    : idx >= sortedPlayers.length - 3
                                    ? 'bg-red-50'
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
                                <td className="p-3 font-semibold text-gray-800">{assignment.player.name}</td>
                                <td className="p-3 text-center text-gray-700">{assignment.player.pointsFor}</td>
                                <td className="p-3 text-center text-gray-700">{assignment.player.pointsAgainst}</td>
                                <td className="p-3 text-center font-bold text-purple-600">
                                  {assignment.netPoints}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Games */}
                    <div>
                      <h3 className="mb-3 text-xl font-bold text-gray-800">Games</h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {courtSession.games.map((game) => {
                          const team1Players = game.gamePlayers.filter((gp) => gp.team === 1);
                          const team2Players = game.gamePlayers.filter((gp) => gp.team === 2);
                          const team1Score = team1Players.reduce((sum, gp) => sum + gp.score, 0);
                          const team2Score = team2Players.reduce((sum, gp) => sum + gp.score, 0);

                          return (
                            <div
                              key={game.id}
                              className={`rounded-xl p-4 ${
                                game.status === 'completed'
                                  ? 'bg-green-50 border-2 border-green-400'
                                  : 'bg-gray-50 border-2 border-gray-200'
                              }`}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-700">Game {game.gameNumber}</span>
                                {game.status === 'completed' && (
                                  <span className="text-xs font-semibold text-green-600">✓ Completed</span>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-2">
                                  <div className="text-sm text-gray-700">
                                    {team1Players.map((gp) => gp.player.name).join(' & ')}
                                  </div>
                                  <div className="text-xl font-bold text-blue-600">{team1Score}</div>
                                </div>
                                <div className="flex items-center justify-between rounded-lg bg-purple-50 p-2">
                                  <div className="text-sm text-gray-700">
                                    {team2Players.map((gp) => gp.player.name).join(' & ')}
                                  </div>
                                  <div className="text-xl font-bold text-purple-600">{team2Score}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
