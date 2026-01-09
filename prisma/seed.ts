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
  'Lisa Groeger',
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
    'Iliana Thirlwell Georgallis',
    'Hannes',
  ],
  Challenger: [
    'Karim',
    'Andreas Ch',
    'Andrey Sesyuk',
    'Nico',
    'Saif',
    'Dima Zubkov',
    'Wayss',
    'Jordan Geddes',
    'Maddy',
    'Pandelis',
  ],
  Development: [
    'Richard',
    'Dean',
    'Natalie',
    'Lisa Groeger',
    'Sonya Loshak',
    'Matvey',
    'Eka',
    'Sophie Efstathiou',
    'Stephan',
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

    if (courtPlayers.length === 10) {
      // Use the Americano pairing algorithm
      const pairings = [
        { team1: [0, 1], team2: [2, 3] },
        { team1: [0, 2], team2: [4, 5] },
        { team1: [0, 3], team2: [6, 7] },
        { team1: [0, 4], team2: [8, 9] },
        { team1: [1, 2], team2: [5, 6] },
      ];

      for (let i = 0; i < 5; i++) {
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
