import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetScores() {
  console.log('🔄 Resetting all scores to zero...');

  // Reset all player scores
  await prisma.player.updateMany({
    data: {
      totalScore: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    },
  });
  console.log('✅ All player scores reset to 0');

  // Reset all game player scores and set games to pending
  await prisma.gamePlayer.updateMany({
    data: {
      score: 0,
    },
  });
  console.log('✅ All game player scores reset to 0');

  // Set all games to pending
  await prisma.game.updateMany({
    data: {
      status: 'pending',
    },
  });
  console.log('✅ All games set to pending status');

  console.log('🎉 Score reset complete!');
}

resetScores()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
