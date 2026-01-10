'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  court: { name: string; order: number };
  games: Game[];
  assignments: { player: Player }[];
}

interface Session {
  id: string;
  sessionNumber: number;
  status: string;
  courtSessions: CourtSession[];
}

export default function DisplayPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
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
      setSessions(data);

      const active = data.find((s: Session) => s.status === 'active');
      setCurrentSession(active || data[data.length - 1]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-4xl font-bold text-white"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-4xl font-bold text-white">No active session</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center"
        >
          <h1 className="mb-1 text-5xl font-bold text-white">Padel Tournament</h1>
          <p className="text-2xl text-purple-200">
            Session {currentSession.sessionNumber} of 3 - Americano Format
          </p>
        </motion.div>

        {/* Scoring Explainer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 rounded-xl bg-white/10 backdrop-blur-lg p-3 text-center"
        >
          <p className="text-lg font-semibold text-white">
            📊 Each player plays 2 games to 7 points | Your individual score adds to your total | Win 7-3 = You get 7 points
          </p>
        </motion.div>

        {/* Courts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AnimatePresence>
            {currentSession.courtSessions.map((courtSession, index) => (
              <motion.div
                key={courtSession.court.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="rounded-2xl bg-white/10 backdrop-blur-lg p-4"
              >
                <h2
                  className={`mb-3 text-center text-2xl font-bold ${
                    courtSession.court.order === 1
                      ? 'text-yellow-300'
                      : courtSession.court.order === 2
                      ? 'text-blue-300'
                      : 'text-green-300'
                  }`}
                >
                  {courtSession.court.name}
                </h2>

                {/* Court Standings FIRST */}
                <div className="mb-4">
                  <h3 className="mb-2 text-lg font-bold text-white">Standings</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-white text-xs">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left p-1 font-semibold">#</th>
                          <th className="text-left p-1 font-semibold">Player</th>
                          <th className="text-center p-1 font-semibold">For</th>
                          <th className="text-center p-1 font-semibold">Agn</th>
                          <th className="text-center p-1 font-semibold">Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courtSession.assignments
                          .map((assignment) => ({
                            ...assignment,
                            netPoints: assignment.player.pointsFor - assignment.player.pointsAgainst,
                          }))
                          .sort((a, b) => b.netPoints - a.netPoints)
                          .map((assignment, idx) => (
                            <tr
                              key={assignment.player.id}
                              className={`${
                                idx < 3 && courtSession.court.order > 1
                                  ? 'bg-green-500/30'
                                  : idx >= courtSession.assignments.length - 3
                                  ? 'bg-red-500/30'
                                  : 'bg-white/5'
                              }`}
                            >
                              <td className="p-1 font-semibold">{idx + 1}</td>
                              <td className="p-1 truncate">{assignment.player.name}</td>
                              <td className="p-1 text-center">{assignment.player.pointsFor}</td>
                              <td className="p-1 text-center">{assignment.player.pointsAgainst}</td>
                              <td className="p-1 text-center font-bold">{assignment.netPoints}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Games SECOND */}
                <div>
                  <h3 className="mb-2 text-lg font-bold text-white">Games</h3>
                  <div className="space-y-2">
                    {courtSession.games.map((game) => {
                      const team1Players = game.gamePlayers.filter((gp) => gp.team === 1);
                      const team2Players = game.gamePlayers.filter((gp) => gp.team === 2);
                      const team1Score = team1Players.reduce((sum, gp) => sum + gp.score, 0);
                      const team2Score = team2Players.reduce((sum, gp) => sum + gp.score, 0);

                      return (
                        <div
                          key={game.id}
                          className={`rounded-lg p-2 text-sm ${
                            game.status === 'completed'
                              ? 'bg-green-500/30'
                              : 'bg-gray-500/30'
                          }`}
                        >
                          <div className="mb-1 text-xs font-semibold text-white/70">
                            Game {game.gameNumber}
                          </div>
                          <div className="flex items-center justify-between text-white">
                            <div className="truncate">
                              {team1Players.map((gp) => gp.player.name.split(' ')[0]).join(' & ')}
                            </div>
                            <div className="text-xl font-bold">{team1Score}</div>
                          </div>
                          <div className="flex items-center justify-between text-white">
                            <div className="truncate">
                              {team2Players.map((gp) => gp.player.name.split(' ')[0]).join(' & ')}
                            </div>
                            <div className="text-xl font-bold">{team2Score}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

