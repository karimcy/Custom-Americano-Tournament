'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const interval = setInterval(fetchSessions, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setSessions(data);

      // Find active session or latest
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="mb-2 text-6xl font-bold text-white">Padel Tournament</h1>
          <p className="text-3xl text-purple-200">
            Session {currentSession.sessionNumber} - Americano Format
          </p>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 rounded-2xl bg-white/10 backdrop-blur-lg p-6"
        >
          <h2 className="mb-4 text-3xl font-bold text-white">Leaderboard</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {allPlayers.slice(0, 10).map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`rounded-xl p-4 text-center ${
                  index === 0
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    : index === 1
                    ? 'bg-gradient-to-br from-gray-300 to-gray-400'
                    : index === 2
                    ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                    : 'bg-white/20'
                }`}
              >
                <div className="text-2xl font-bold">{index + 1}</div>
                <div className="text-lg font-semibold">{player.name}</div>
                <div className="text-3xl font-bold">{player.totalScore}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Courts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AnimatePresence>
            {currentSession.courtSessions.map((courtSession, index) => (
              <motion.div
                key={courtSession.court.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="rounded-2xl bg-white/10 backdrop-blur-lg p-6"
              >
                <h2
                  className={`mb-6 text-3xl font-bold ${
                    courtSession.court.order === 1
                      ? 'text-yellow-300'
                      : courtSession.court.order === 2
                      ? 'text-blue-300'
                      : 'text-green-300'
                  }`}
                >
                  {courtSession.court.name}
                </h2>

                <div className="space-y-4">
                  {courtSession.games.map((game) => {
                    const team1Players = game.gamePlayers.filter((gp) => gp.team === 1);
                    const team2Players = game.gamePlayers.filter((gp) => gp.team === 2);
                    const team1Score = team1Players.reduce((sum, gp) => sum + gp.score, 0);
                    const team2Score = team2Players.reduce((sum, gp) => sum + gp.score, 0);

                    return (
                      <motion.div
                        key={game.id}
                        whileHover={{ scale: 1.02 }}
                        className={`rounded-xl p-4 ${
                          game.status === 'completed'
                            ? 'bg-green-500/30'
                            : game.status === 'active'
                            ? 'bg-blue-500/30'
                            : 'bg-gray-500/30'
                        }`}
                      >
                        <div className="mb-2 text-sm font-semibold text-white/70">
                          Game {game.gameNumber}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-white">
                              {team1Players.map((gp) => gp.player.name).join(' & ')}
                            </div>
                            <div className="text-2xl font-bold text-white">{team1Score}</div>
                          </div>
                          <div className="border-t border-white/30"></div>
                          <div className="flex items-center justify-between">
                            <div className="text-white">
                              {team2Players.map((gp) => gp.player.name).join(' & ')}
                            </div>
                            <div className="text-2xl font-bold text-white">{team2Score}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Court Standings */}
                <div className="mt-6">
                  <h3 className="mb-3 text-xl font-bold text-white">Court Standings</h3>
                  <div className="space-y-2">
                    {courtSession.assignments
                      .sort((a, b) => b.player.totalScore - a.player.totalScore)
                      .map((assignment, idx) => (
                        <div
                          key={assignment.player.id}
                          className="flex items-center justify-between rounded-lg bg-white/10 p-2"
                        >
                          <span className="font-semibold text-white">
                            {idx + 1}. {assignment.player.name}
                          </span>
                          <span className="text-xl font-bold text-white">
                            {assignment.player.totalScore}
                          </span>
                        </div>
                      ))}
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
