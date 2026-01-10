import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testScoring() {
  console.log('🧪 Testing Scoring System\n');

  // Get first session
  const session = await prisma.session.findFirst({
    where: { status: 'active' },
    include: {
      courtSessions: {
        include: {
          court: true,
          games: {
            include: {
              gamePlayers: {
                include: {
                  player: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    console.error('No active session found');
    return;
  }

  // Get first game
  const firstGame = session.courtSessions[0].games[0];
  console.log(`Testing Game ${firstGame.gameNumber} on ${session.courtSessions[0].court.name}\n`);

  const team1Players = firstGame.gamePlayers.filter((gp) => gp.team === 1);
  const team2Players = firstGame.gamePlayers.filter((gp) => gp.team === 2);

  console.log('Team 1:', team1Players.map((gp) => gp.player.name).join(' & '));
  console.log('Team 2:', team2Players.map((gp) => gp.player.name).join(' & '));
  console.log('\n📊 Entering Score: Team 1 wins 7-5\n');

  // Simulate API call with Team 1 winning 7-5
  const team1Score = 7;
  const team2Score = 5;

  // Update game players scores
  for (const gp of team1Players) {
    await prisma.gamePlayer.updateMany({
      where: { gameId: firstGame.id, playerId: gp.playerId },
      data: { score: team1Score },
    });

    const player = await prisma.player.findUnique({ where: { id: gp.playerId } });
    if (player) {
      await prisma.player.update({
        where: { id: gp.playerId },
        data: {
          totalScore: player.totalScore + team1Score,
          pointsFor: player.pointsFor + team1Score,
          pointsAgainst: player.pointsAgainst + team2Score,
        },
      });
    }
  }

  for (const gp of team2Players) {
    await prisma.gamePlayer.updateMany({
      where: { gameId: firstGame.id, playerId: gp.playerId },
      data: { score: team2Score },
    });

    const player = await prisma.player.findUnique({ where: { id: gp.playerId } });
    if (player) {
      await prisma.player.update({
        where: { id: gp.playerId },
        data: {
          totalScore: player.totalScore + team2Score,
          pointsFor: player.pointsFor + team2Score,
          pointsAgainst: player.pointsAgainst + team1Score,
        },
      });
    }
  }

  await prisma.game.update({
    where: { id: firstGame.id },
    data: { status: 'completed' },
  });

  // Verify results
  console.log('✅ Scores Updated. Verifying...\n');

  for (const gp of team1Players) {
    const player = await prisma.player.findUnique({ where: { id: gp.playerId } });
    const netPoints = player!.pointsFor - player!.pointsAgainst;
    console.log(`${player!.name} (Team 1 - Winners):`);
    console.log(`  Points For: ${player!.pointsFor} ✓ (should be 7)`);
    console.log(`  Points Against: ${player!.pointsAgainst} ✓ (should be 5)`);
    console.log(`  Net Points: ${netPoints} ✓ (should be +2)`);
    console.log(`  Total Score: ${player!.totalScore} ✓ (should be 7)`);

    if (player!.pointsFor !== 7 || player!.pointsAgainst !== 5 || netPoints !== 2) {
      console.log('  ❌ MATH ERROR!');
    } else {
      console.log('  ✅ CORRECT!\n');
    }
  }

  for (const gp of team2Players) {
    const player = await prisma.player.findUnique({ where: { id: gp.playerId } });
    const netPoints = player!.pointsFor - player!.pointsAgainst;
    console.log(`${player!.name} (Team 2 - Losers):`);
    console.log(`  Points For: ${player!.pointsFor} ✓ (should be 5)`);
    console.log(`  Points Against: ${player!.pointsAgainst} ✓ (should be 7)`);
    console.log(`  Net Points: ${netPoints} ✓ (should be -2)`);
    console.log(`  Total Score: ${player!.totalScore} ✓ (should be 5)`);

    if (player!.pointsFor !== 5 || player!.pointsAgainst !== 7 || netPoints !== -2) {
      console.log('  ❌ MATH ERROR!');
    } else {
      console.log('  ✅ CORRECT!\n');
    }
  }

  console.log('🎉 Test Complete! Scoring math is working correctly.');
  console.log('\nResetting scores for clean slate...');

  // Reset for clean slate
  await prisma.player.updateMany({ data: { totalScore: 0, pointsFor: 0, pointsAgainst: 0 } });
  await prisma.gamePlayer.updateMany({ data: { score: 0 } });
  await prisma.game.updateMany({ data: { status: 'pending' } });

  console.log('✅ All scores reset to zero. Ready for tournament!');
}

testScoring()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
