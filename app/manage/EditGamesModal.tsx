'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Player {
  id: string;
  name: string;
}

interface GamePlayer {
  playerId: string;
  team: number;
}

interface Game {
  id: string;
  gameNumber: number;
  players: GamePlayer[];
}

interface CourtSession {
  id: string;
  court: { name: string };
  assignments: { player: Player }[];
  games: {
    id: string;
    gameNumber: number;
    gamePlayers: {
      player: Player;
      team: number;
    }[];
  }[];
}

interface EditGamesModalProps {
  courtSession: CourtSession;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function EditGamesModal({ courtSession, isOpen, onClose, onSave }: EditGamesModalProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [playerGameCounts, setPlayerGameCounts] = useState<{ [playerId: string]: number }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Initialize games from courtSession
      const initialGames = courtSession.games.map((game) => ({
        id: game.id,
        gameNumber: game.gameNumber,
        players: game.gamePlayers.map((gp) => ({
          playerId: gp.player.id,
          team: gp.team,
        })),
      }));
      setGames(initialGames);
      calculatePlayerCounts(initialGames);
    }
  }, [isOpen, courtSession]);

  const calculatePlayerCounts = (gamesData: Game[]) => {
    const counts: { [playerId: string]: number } = {};
    gamesData.forEach((game) => {
      game.players.forEach((p) => {
        counts[p.playerId] = (counts[p.playerId] || 0) + 1;
      });
    });
    setPlayerGameCounts(counts);
  };

  const swapPlayer = (gameIndex: number, playerIndex: number, newPlayerId: string) => {
    const newGames = [...games];
    const game = newGames[gameIndex];
    const oldPlayerId = game.players[playerIndex].playerId;

    // Find the new player in another game
    let foundSwap = false;
    for (let i = 0; i < newGames.length && !foundSwap; i++) {
      for (let j = 0; j < newGames[i].players.length && !foundSwap; j++) {
        if (newGames[i].players[j].playerId === newPlayerId) {
          // Swap the two players
          newGames[i].players[j].playerId = oldPlayerId;
          newGames[gameIndex].players[playerIndex].playerId = newPlayerId;
          foundSwap = true;
        }
      }
    }

    setGames(newGames);
    calculatePlayerCounts(newGames);
  };

  const isValid = () => {
    return Object.values(playerGameCounts).every((count) => count === 2);
  };

  const handleSave = async () => {
    if (!isValid()) {
      alert('❌ Each player must play exactly 2 games!');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/court-sessions/${courtSession.id}/games`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ games }),
      });

      if (response.ok) {
        alert('✅ Games updated successfully!');
        onSave();
        onClose();
      } else {
        const error = await response.json();
        const errorMsg = error.details ? error.details.join(', ') : error.error;
        alert(`❌ Failed to update games: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error saving games:', error);
      alert('❌ Failed to save games');
    } finally {
      setSaving(false);
    }
  };

  const getPlayerName = (playerId: string) => {
    return courtSession.assignments.find((a) => a.player.id === playerId)?.player.name || 'Unknown';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-800">
            Edit Games - {courtSession.court.name} Court
          </h2>

          {/* Validation Status */}
          <div className={`mb-4 rounded-lg p-4 ${isValid() ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <h3 className="mb-2 font-bold">
              {isValid() ? '✅ Valid Configuration' : '⚠️ Validation Issues'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 md:grid-cols-6">
              {courtSession.assignments.map((assignment) => {
                const count = playerGameCounts[assignment.player.id] || 0;
                const isInvalid = count !== 2;
                return (
                  <div
                    key={assignment.player.id}
                    className={`rounded p-2 ${
                      isInvalid ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {assignment.player.name.split(' ')[0]}: {count} games
                  </div>
                );
              })}
            </div>
          </div>

          {/* Games Grid */}
          <div className="space-y-4">
            {games.map((game, gameIndex) => {
              const team1 = game.players.filter((p) => p.team === 1);
              const team2 = game.players.filter((p) => p.team === 2);

              return (
                <div key={game.id} className="rounded-xl bg-gray-50 p-4">
                  <h3 className="mb-3 text-lg font-bold text-gray-800">Game {game.gameNumber}</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Team 1 */}
                    <div className="rounded-lg bg-blue-50 p-3">
                      <h4 className="mb-2 font-semibold text-blue-800">Team 1</h4>
                      {team1.map((player, playerIndex) => {
                        const actualIndex = game.players.findIndex((p) => p === player);
                        return (
                          <div key={actualIndex} className="mb-2">
                            <select
                              value={player.playerId}
                              onChange={(e) => swapPlayer(gameIndex, actualIndex, e.target.value)}
                              className="w-full rounded-lg border-2 border-blue-300 bg-white p-2 text-sm font-semibold"
                            >
                              {courtSession.assignments.map((assignment) => (
                                <option key={assignment.player.id} value={assignment.player.id}>
                                  {assignment.player.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>

                    {/* Team 2 */}
                    <div className="rounded-lg bg-red-50 p-3">
                      <h4 className="mb-2 font-semibold text-red-800">Team 2</h4>
                      {team2.map((player, playerIndex) => {
                        const actualIndex = game.players.findIndex((p) => p === player);
                        return (
                          <div key={actualIndex} className="mb-2">
                            <select
                              value={player.playerId}
                              onChange={(e) => swapPlayer(gameIndex, actualIndex, e.target.value)}
                              className="w-full rounded-lg border-2 border-red-300 bg-white p-2 text-sm font-semibold"
                            >
                              {courtSession.assignments.map((assignment) => (
                                <option key={assignment.player.id} value={assignment.player.id}>
                                  {assignment.player.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="rounded-xl bg-gray-300 px-6 py-3 font-semibold text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid() || saving}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
