import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PLAYERS = [
  'Matvey',
  'Karim',
  'Karim A.',
  'Alex',
  'Colin Relton',
  'Oliver Thirlwell Georgallis',
  'Iliana Thirlwell Georgallis',
  'Rohan',
  'Natalie',
  'Marios Savva',
  'Dimi',
  'Steve Reynolds',
  'Kinan',
  'Andrey Sesyuk',
  'Sonya Loshak',
  'Andreas Ch',
  'Nico',
  'Saif',
  'Pandelis',
  'Josh Geddes',
  'Alex Geddes',
  'Jordan Geddes',
  'Dima Zubkov',
  'Stephan',
  'Marianthi',
  'Hannes',
  'Dean',
  'Richard',
  'Sophie Efstathiou',
  'Patrick',
  'Eka',
  'Wayss',
  'Maddy',
];

const COURTS = [
  { name: 'Championship', order: 1 },
  { name: 'Challenger', order: 2 },
  { name: 'Development', order: 3 },
];

// Default court assignments
const COURT_ASSIGNMENTS = {
  Championship: [
    'Dimi',
    'Rohan',
    'Marios Savva',
    'Colin Relton',
    'Patrick',
    'Alex Geddes',
    'Josh Geddes',
    'Steve Reynolds',
    'Karim A.',
    'Hannes',
  ],
  Challenger: [
    'Karim',
    'Andreas Ch',
    'Andrey Sesyuk',
    'Nico',
    'Saif',
    'Alex',
    'Dima Zubkov',
    'Wayss',
    'Jordan Geddes',
    'Pandelis',
  ],
  Development: [
    'Richard',
    'Dean',
    'Oliver Thirlwell Georgallis',
    'Natalie',
    'Sonya Loshak',
    'Iliana Thirlwell Georgallis',
    'Matvey',
    'Eka',
    'Sophie Efstathiou',
    'Stephan',
    'Maddy',
    'Marianthi',
  ],
};

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.gamePlayer.deleteMany();
  await prisma.game.deleteMany();
  await prisma.courtAssignment.deleteMany();
  await prisma.courtSession.deleteMany();
  await prisma.session.deleteMany();
  await prisma.court.deleteMany();
  await prisma.player.deleteMany();

  // Create courts
  console.log('Creating courts...');
  const courts: any = {};
  for (const court of COURTS) {
    courts[court.name] = await prisma.court.create({ data: court });
  }

  // Create players
  console.log('Creating players...');
  const players: any = {};
  for (const name of PLAYERS) {
    players[name] = await prisma.player.create({ data: { name } });
  }

  // Create sessions
  console.log('Creating sessions...');
  const sessions = [];
  for (let i = 1; i <= 3; i++) {
    sessions.push(
      await prisma.session.create({
        data: {
          sessionNumber: i,
          status: i === 1 ? 'active' : 'pending',
        },
      })
    );
  }

  // Create initial court session and assignments
  console.log('Creating initial court assignments...');
  const firstSession = sessions[0];

  for (const [courtName, playerNames] of Object.entries(COURT_ASSIGNMENTS)) {
    const court = courts[courtName];
    const courtSession = await prisma.courtSession.create({
      data: {
        sessionId: firstSession.id,
        courtId: court.id,
      },
    });

    // Assign players to this court
    for (const playerName of playerNames) {
      const player = players[playerName];
      if (player) {
        await prisma.courtAssignment.create({
          data: {
            courtSessionId: courtSession.id,
            playerId: player.id,
          },
        });
      }
    }

    // Generate games with Americano pairings
    console.log(`Generating games for ${courtName}...`);
    const courtPlayers = playerNames.map((name) => players[name]).filter(Boolean);

    if (courtPlayers.length === 10 || courtPlayers.length === 8 || courtPlayers.length === 12) {
      // Balanced Americano - each player plays exactly 2 games
      let pairings;
      let numPlayers = courtPlayers.length;

      if (courtPlayers.length === 10) {
        // 10 players: 5 games × 4 players = 20 player-slots / 10 players = 2 games each
        pairings = [
          { team1: [0, 1], team2: [2, 3] },  // Game 1: Players 0,1,2,3 play
          { team1: [4, 5], team2: [6, 7] },  // Game 2: Players 4,5,6,7 play
          { team1: [8, 9], team2: [0, 2] },  // Game 3: Players 8,9,0,2 play (0,2 2nd game)
          { team1: [1, 3], team2: [4, 6] },  // Game 4: Players 1,3,4,6 play (1,3,4,6 2nd game)
          { team1: [5, 7], team2: [8, 9] },  // Game 5: Players 5,7,8,9 play (5,7,8,9 2nd game)
        ];
      } else if (courtPlayers.length === 8) {
        // 8 players: 4 games × 4 players = 16 player-slots / 8 players = 2 games each
        pairings = [
          { team1: [0, 1], team2: [2, 3] },  // Game 1: Players 0,1,2,3 play
          { team1: [4, 5], team2: [6, 7] },  // Game 2: Players 4,5,6,7 play
          { team1: [0, 2], team2: [4, 6] },  // Game 3: Players 0,2,4,6 play (2nd game)
          { team1: [1, 3], team2: [5, 7] },  // Game 4: Players 1,3,5,7 play (2nd game)
        ];
      } else {
        // 12 players: 6 games × 4 players = 24 player-slots / 12 players = 2 games each
        pairings = [
          { team1: [0, 1], team2: [2, 3] },   // Game 1: Players 0,1,2,3 play
          { team1: [4, 5], team2: [6, 7] },   // Game 2: Players 4,5,6,7 play
          { team1: [8, 9], team2: [10, 11] }, // Game 3: Players 8,9,10,11 play
          { team1: [0, 2], team2: [4, 6] },   // Game 4: Players 0,2,4,6 play (2nd game)
          { team1: [1, 3], team2: [5, 7] },   // Game 5: Players 1,3,5,7 play (2nd game)
          { team1: [8, 10], team2: [9, 11] }, // Game 6: Players 8,9,10,11 play (2nd game)
        ];
      }

      // Verify distribution
      const gameCount = new Array(numPlayers).fill(0);
      pairings.forEach((p) => {
        gameCount[p.team1[0]]++;
        gameCount[p.team1[1]]++;
        gameCount[p.team2[0]]++;
        gameCount[p.team2[1]]++;
      });
      console.log(
        `${courtName} (${numPlayers} players) game distribution:`,
        gameCount.map((c, i) => `${playerNames[i]}: ${c} games`).join(', ')
      );

      for (let i = 0; i < pairings.length; i++) {
        const game = await prisma.game.create({
          data: {
            courtSessionId: courtSession.id,
            gameNumber: i + 1,
            status: 'pending',
          },
        });

        await prisma.gamePlayer.createMany({
          data: [
            {
              gameId: game.id,
              playerId: courtPlayers[pairings[i].team1[0]].id,
              team: 1,
            },
            {
              gameId: game.id,
              playerId: courtPlayers[pairings[i].team1[1]].id,
              team: 1,
            },
            {
              gameId: game.id,
              playerId: courtPlayers[pairings[i].team2[0]].id,
              team: 2,
            },
            {
              gameId: game.id,
              playerId: courtPlayers[pairings[i].team2[1]].id,
              team: 2,
            },
          ],
        });
      }
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
