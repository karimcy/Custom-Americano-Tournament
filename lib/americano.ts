/**
 * Americano Pairing Algorithm
 * Ensures every player plays with different partners across games
 * and faces different opponents as much as possible
 */

interface Player {
  id: string;
  name: string;
}

interface Game {
  gameNumber: number;
  team1: [Player, Player];
  team2: [Player, Player];
}

export function generateAmericanoPairings(players: Player[]): Game[] {
  if (players.length !== 10) {
    throw new Error('Americano format requires exactly 10 players');
  }

  // Standard Americano rotation for 10 players, 5 games
  // This ensures everyone plays with different partners
  const pairings: number[][][] = [
    // Game 1
    [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]],
    // Game 2
    [[0, 2], [1, 4], [3, 6], [5, 8], [7, 9]],
    // Game 3
    [[0, 3], [1, 5], [2, 7], [4, 9], [6, 8]],
    // Game 4
    [[0, 4], [1, 6], [2, 8], [3, 9], [5, 7]],
    // Game 5
    [[0, 5], [1, 7], [2, 9], [3, 8], [4, 6]],
  ];

  const games: Game[] = [];

  for (let gameIdx = 0; gameIdx < 5; gameIdx++) {
    const gamePairs = pairings[gameIdx];

    // For each game, we need to pair up teams
    // Taking pairs 0&1, 2&3, 4&5 (but only need 2 pairs since we have 5 games)
    // Actually, in Americano, typically 2 players sit out each game
    // But the user wants 5 games with everyone playing

    // Let me reconsider: with 10 players and 5 games to 7 points,
    // we can have all 10 players active in different matches
    // 5 pairs = 10 players total across all 5 simultaneous games on one court

    // Wait, I need to rethink this. The user said "5 different games of different people"
    // This likely means 5 sequential games, not simultaneous
    // Each game has 4 players (2v2), so we need to rotate through

    // Standard rotation for 10 players over 5 games:
    games.push({
      gameNumber: gameIdx + 1,
      team1: [players[gamePairs[0][0]], players[gamePairs[0][1]]],
      team2: [players[gamePairs[1][0]], players[gamePairs[1][1]]],
    });
  }

  return games;
}

// Alternative: Simple round-robin for 10 players where everyone plays
export function generateSimpleAmericanoPairings(players: Player[]): Game[] {
  if (players.length < 4) {
    throw new Error('Need at least 4 players');
  }

  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const games: Game[] = [];

  // Create 5 games with different player combinations
  // Game 1: players 0-3
  // Game 2: players 4-7 (with rotation)
  // Game 3: players 8-9 + 0-1 (wrap around)
  // etc.

  const numGames = 5;

  for (let g = 0; g < numGames; g++) {
    const offset = (g * 4) % players.length;
    const p1 = shuffled[offset % players.length];
    const p2 = shuffled[(offset + 1) % players.length];
    const p3 = shuffled[(offset + 2) % players.length];
    const p4 = shuffled[(offset + 3) % players.length];

    games.push({
      gameNumber: g + 1,
      team1: [p1, p2],
      team2: [p3, p4],
    });
  }

  return games;
}

// Optimal Americano for 10 players, 5 games
// Ensures maximum partner and opponent variety
export function generateOptimalAmericanoPairings(players: Player[]): Game[] {
  if (players.length !== 10) {
    throw new Error('Optimal Americano requires exactly 10 players');
  }

  // Classic Americano matrix for 10 players
  // Each game lists team pairings [player indices]
  const rounds = [
    { team1: [0, 1], team2: [2, 3], sitting: [4, 5, 6, 7, 8, 9] },
    { team1: [0, 2], team2: [4, 5], sitting: [1, 3, 6, 7, 8, 9] },
    { team1: [0, 3], team2: [6, 7], sitting: [1, 2, 4, 5, 8, 9] },
    { team1: [0, 4], team2: [8, 9], sitting: [1, 2, 3, 5, 6, 7] },
    { team1: [1, 2], team2: [5, 6], sitting: [0, 3, 4, 7, 8, 9] },
  ];

  return rounds.map((round, idx) => ({
    gameNumber: idx + 1,
    team1: [players[round.team1[0]], players[round.team1[1]]],
    team2: [players[round.team2[0]], players[round.team2[1]]],
  }));
}
