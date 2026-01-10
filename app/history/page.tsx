'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [backupStatus, setBackupStatus] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsRes, playersRes] = await Promise.all([
        fetch('/api/sessions'),
        fetch('/api/players'),
      ]);

      const sessionsData = await sessionsRes.json();
      const playersData = await playersRes.json();

      setSessions(sessionsData);
      setPlayers(playersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setBackupStatus('Creating backup...');
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setBackupStatus(`✅ Backup created: ${data.filename}`);
        setTimeout(() => setBackupStatus(''), 5000);
      } else {
        setBackupStatus('❌ Backup failed. Check console for errors.');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      setBackupStatus('❌ Backup failed. Check console for errors.');
    }
  };

  const downloadData = () => {
    const dataToExport = {
      sessions,
      players,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-20 md:p-8 md:pl-24 md:pb-8">
        <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tournament History & Backup
            </h1>
            <p className="text-xl text-gray-700">
              All tournament data is stored permanently in PostgreSQL
            </p>
          </div>
          <Link href="/">
            <button className="rounded-xl bg-white px-6 py-3 text-lg font-semibold text-gray-700 shadow-lg hover:shadow-xl">
              ← Home
            </button>
          </Link>
        </div>

        {/* Backup Section */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Data Backup</h2>
          <p className="mb-4 text-gray-600">
            Create a PostgreSQL backup or download tournament data as JSON. All data is automatically saved to the database in real-time.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createBackup}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl"
            >
              🗄️ Create PostgreSQL Backup
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadData}
              className="rounded-xl bg-gradient-to-r from-green-500 to-teal-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl"
            >
              📥 Download JSON Data
            </motion.button>
          </div>
          {backupStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg bg-blue-50 p-4 text-blue-800 font-semibold"
            >
              {backupStatus}
            </motion.div>
          )}
        </div>

        {/* All Players Summary */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">All Players</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="p-3 text-left font-bold text-gray-700">#</th>
                  <th className="p-3 text-left font-bold text-gray-700">Player</th>
                  <th className="p-3 text-center font-bold text-gray-700">Points For</th>
                  <th className="p-3 text-center font-bold text-gray-700">Points Against</th>
                  <th className="p-3 text-center font-bold text-gray-700">Net Points</th>
                  <th className="p-3 text-center font-bold text-gray-700">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {players
                  .sort((a, b) => (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst))
                  .map((player, idx) => (
                    <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-semibold text-gray-800">{idx + 1}</td>
                      <td className="p-3 font-semibold text-gray-800">{player.name}</td>
                      <td className="p-3 text-center text-gray-700">{player.pointsFor}</td>
                      <td className="p-3 text-center text-gray-700">{player.pointsAgainst}</td>
                      <td className="p-3 text-center font-bold text-purple-600">
                        {player.pointsFor - player.pointsAgainst}
                      </td>
                      <td className="p-3 text-center text-gray-700">{player.totalScore}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Sessions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">All Sessions</h2>
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-purple-600">
                  Session {session.sessionNumber}
                </h3>
                <span
                  className={`rounded-full px-4 py-1 text-sm font-bold ${
                    session.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {session.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {session.courtSessions.map((courtSession) => (
                  <div key={courtSession.id} className="rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-3 text-lg font-bold text-gray-800">
                      {courtSession.court.name}
                    </h4>
                    <div className="mb-3 space-y-1">
                      <p className="text-sm font-semibold text-gray-700">Players:</p>
                      {courtSession.assignments
                        .sort((a, b) => (b.player.pointsFor - b.player.pointsAgainst) - (a.player.pointsFor - a.player.pointsAgainst))
                        .map((assignment) => (
                          <div key={assignment.player.id} className="text-sm text-gray-600">
                            {assignment.player.name} (Net: {assignment.player.pointsFor - assignment.player.pointsAgainst})
                          </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Games:</p>
                      {courtSession.games.map((game) => {
                        const team1 = game.gamePlayers.filter((gp) => gp.team === 1);
                        const team2 = game.gamePlayers.filter((gp) => gp.team === 2);
                        const team1Score = team1.reduce((sum, gp) => sum + gp.score, 0);
                        const team2Score = team2.reduce((sum, gp) => sum + gp.score, 0);

                        return (
                          <div
                            key={game.id}
                            className={`rounded p-2 text-xs ${
                              game.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                            }`}
                          >
                            <div className="font-semibold">Game {game.gameNumber}</div>
                            <div>
                              {team1.map((gp) => gp.player.name.split(' ')[0]).join(' & ')} - {team1Score}
                            </div>
                            <div>
                              {team2.map((gp) => gp.player.name.split(' ')[0]).join(' & ')} - {team2Score}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </>
  );
}
