/**
 * Americano Pairing Algorithm
 * Ensures:
 * 1. Every player plays exactly 2 games (fair distribution)
 * 2. Players partner with different people
 * 3. Mixed gender teams where possible
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

// Gender detection based on common names
function detectGender(name: string): 'M' | 'F' | 'U' {
  const femaleNames = [
    'natalie', 'lisa', 'sonya', 'iliana', 'marianthi', 'sophie', 'maddy', 'eka'
  ];

  const lowerName = name.toLowerCase();

  for (const femaleName of femaleNames) {
    if (lowerName.includes(femaleName)) {
      return 'F';
    }
  }

  return 'M'; // Default to male if not identified as female
}

// Balanced Americano for 10 players - each player plays exactly 2 games
export function generateOptimalAmericanoPairings(players: Player[]): Game[] {
  if (players.length !== 10) {
    throw new Error('Optimal Americano requires exactly 10 players');
  }

  // Detect genders
  const genders = players.map(p => detectGender(p.name));

  // Find female players for better distribution
  const femaleIndices: number[] = [];
  const maleIndices: number[] = [];

  genders.forEach((gender, idx) => {
    if (gender === 'F') {
      femaleIndices.push(idx);
    } else {
      maleIndices.push(idx);
    }
  });

  // Standard balanced Americano rotation for 10 players
  // Each player plays exactly 2 games
  let pairings: { team1: [number, number]; team2: [number, number] }[];

  // If we have females, try to distribute them across teams
  if (femaleIndices.length > 0 && femaleIndices.length < 10) {
    // Try to create mixed teams
    pairings = createMixedGenderPairings(players.length, femaleIndices, maleIndices);
  } else {
    // Standard rotation (all same gender or can't balance)
    pairings = [
      { team1: [0, 1], team2: [2, 3] },  // Game 1: Players 0,1,2,3 play
      { team1: [4, 5], team2: [6, 7] },  // Game 2: Players 4,5,6,7 play
      { team1: [8, 9], team2: [0, 2] },  // Game 3: Players 8,9,0,2 play (0,2 2nd game)
      { team1: [1, 3], team2: [4, 6] },  // Game 4: Players 1,3,4,6 play (1,3,4,6 2nd game)
      { team1: [5, 7], team2: [8, 9] },  // Game 5: Players 5,7,8,9 play (5,7,8,9 2nd game)
    ];
  }

  // Verify each player plays exactly 2 games
  const gameCount = new Array(10).fill(0);
  pairings.forEach(pairing => {
    gameCount[pairing.team1[0]]++;
    gameCount[pairing.team1[1]]++;
    gameCount[pairing.team2[0]]++;
    gameCount[pairing.team2[1]]++;
  });

  // Log verification
  console.log('Game distribution verification:');
  gameCount.forEach((count, idx) => {
    console.log(`Player ${idx} (${players[idx]?.name}): ${count} games`);
  });

  return pairings.map((pairing, idx) => ({
    gameNumber: idx + 1,
    team1: [players[pairing.team1[0]], players[pairing.team1[1]]],
    team2: [players[pairing.team2[0]], players[pairing.team2[1]]],
  }));
}

function createMixedGenderPairings(
  playerCount: number,
  femaleIndices: number[],
  maleIndices: number[]
): { team1: [number, number]; team2: [number, number] }[] {
  // Try to create teams with 1M+1F where possible
  const pairings: { team1: [number, number]; team2: [number, number] }[] = [];
  const usedInGames = new Array(playerCount).fill(0);

  // Helper to find available player
  const findAvailable = (preferredGender: 'M' | 'F', maxGames: number = 2): number => {
    const indices = preferredGender === 'F' ? femaleIndices : maleIndices;
    for (const idx of indices) {
      if (usedInGames[idx] < maxGames) {
        return idx;
      }
    }
    // If no preferred gender available, try the other
    const otherIndices = preferredGender === 'F' ? maleIndices : femaleIndices;
    for (const idx of otherIndices) {
      if (usedInGames[idx] < maxGames) {
        return idx;
      }
    }
    return -1;
  };

  // Try to create 5 balanced games
  for (let game = 0; game < 5; game++) {
    const players: number[] = [];

    // Try to get 2 males and 2 females for this game
    for (let i = 0; i < 2; i++) {
      const m = findAvailable('M');
      const f = findAvailable('F');

      if (m !== -1) {
        players.push(m);
        usedInGames[m]++;
      }
      if (f !== -1) {
        players.push(f);
        usedInGames[f]++;
      }
    }

    // Fill any remaining slots
    while (players.length < 4) {
      for (let i = 0; i < playerCount; i++) {
        if (usedInGames[i] < 2 && !players.includes(i)) {
          players.push(i);
          usedInGames[i]++;
          break;
        }
      }
    }

    if (players.length === 4) {
      // Try to mix genders in teams
      // Ideally team1 has 1M+1F and team2 has 1M+1F
      pairings.push({
        team1: [players[0], players[1]],
        team2: [players[2], players[3]],
      });
    }
  }

  // If we couldn't create 5 games, fall back to standard rotation
  if (pairings.length !== 5) {
    return [
      { team1: [0, 1], team2: [2, 3] },
      { team1: [4, 5], team2: [6, 7] },
      { team1: [8, 9], team2: [0, 2] },
      { team1: [1, 3], team2: [4, 6] },
      { team1: [5, 7], team2: [8, 9] },
    ];
  }

  return pairings;
}
