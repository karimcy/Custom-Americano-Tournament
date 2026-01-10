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

interface CourtSession {
  id: string;
  court: { id: string; name: string; order: number };
  assignments: { player: Player }[];
}

interface Session {
  id: string;
  sessionNumber: number;
  status: string;
  courtSessions: CourtSession[];
}

export default function StandingsPage() {
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

      const active = data.find((s: Session) => s.status === 'active');
      setCurrentSession(active || data[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
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

  // Sort courts by order
  const sortedCourtSessions = [...currentSession.courtSessions].sort(
    (a, b) => a.court.order - b.court.order
  );

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-20 md:p-8 md:pl-24 md:pb-8">
        <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Court Standings
            </h1>
            <p className="text-xl text-gray-700">
              Session {currentSession.sessionNumber}
            </p>
          </div>
          <Link href="/">
            <button className="rounded-xl bg-white px-6 py-3 text-lg font-semibold text-gray-700 shadow-lg hover:shadow-xl">
              ← Home
            </button>
          </Link>
        </div>

        {/* Legend */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Zone Legend</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-green-500"></div>
              <span className="font-semibold text-gray-700">Promotion Zone (Top 3)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
              <span className="font-semibold text-gray-700">Safe Zone</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-500"></div>
              <span className="font-semibold text-gray-700">Relegation Zone (Bottom 3)</span>
            </div>
          </div>
        </div>

        {/* Courts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {sortedCourtSessions.map((courtSession) => {
            // Sort players by net points
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
                  className={`mb-6 text-3xl font-bold text-center ${
                    courtSession.court.order === 1
                      ? 'text-yellow-600'
                      : courtSession.court.order === 2
                      ? 'text-purple-600'
                      : 'text-green-600'
                  }`}
                >
                  {courtSession.court.name}
                </h2>

                {/* Special notes for top and bottom courts */}
                {courtSession.court.order === 1 && (
                  <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-center text-sm font-semibold text-yellow-800">
                    Top Court - Bottom 3 relegated
                  </div>
                )}
                {courtSession.court.order === 3 && (
                  <div className="mb-4 rounded-lg bg-green-50 p-3 text-center text-sm font-semibold text-green-800">
                    Bottom Court - Top 3 promoted | Bottom 3 in relegation zone
                  </div>
                )}
                {courtSession.court.order === 2 && (
                  <div className="mb-4 rounded-lg bg-purple-50 p-3 text-center text-sm font-semibold text-purple-800">
                    Top 3 ↑ promoted | Bottom 3 ↓ relegated
                  </div>
                )}

                <div className="space-y-2">
                  {sortedPlayers.map((assignment, idx) => {
                    let bgColor = 'bg-gray-50';
                    let borderColor = 'border-gray-200';
                    let textColor = 'text-gray-800';
                    let badge = null;

                    // Promotion zone (top 3) - for Challenger (2) and Development (3) courts
                    if (idx < 3 && courtSession.court.order > 1) {
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-400';
                      textColor = 'text-green-900';
                      badge = (
                        <span className="rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">
                          ↑
                        </span>
                      );
                    }
                    // Relegation zone (bottom 3) - for all courts (visual indicator)
                    else if (idx >= sortedPlayers.length - 3) {
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-400';
                      textColor = 'text-red-900';
                      badge = (
                        <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                          ↓
                        </span>
                      );
                    }

                    return (
                      <motion.div
                        key={assignment.player.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-center justify-between rounded-lg border-2 ${borderColor} ${bgColor} p-4`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              idx === 0
                                ? 'bg-yellow-500 text-white'
                                : idx === 1
                                ? 'bg-gray-400 text-white'
                                : idx === 2
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            } text-lg font-bold flex-shrink-0`}
                          >
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className={`text-lg font-bold ${textColor} flex items-center gap-2`}>
                              {assignment.player.name}
                              {idx === 0 && courtSession.court.order === 1 && (
                                <span className="text-yellow-500 text-xl" title="Championship Leader">👑</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 flex gap-3">
                              <span>For: {assignment.player.pointsFor}</span>
                              <span>Agn: {assignment.player.pointsAgainst}</span>
                              <span className="font-bold">Net: {assignment.netPoints}</span>
                            </div>
                          </div>
                        </div>
                        {badge}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </>
  );
}
