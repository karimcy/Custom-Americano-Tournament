import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOptimalAmericanoPairings } from '@/lib/americano';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { assignments } = body; // { courtId: playerId[] }

    // Clear existing assignments for this session
    await prisma.courtSession.deleteMany({
      where: { sessionId },
    });

    // Create court sessions and assign players
    for (const [courtId, playerIds] of Object.entries(assignments)) {
      if (!Array.isArray(playerIds) || playerIds.length === 0) continue;

      // Create court session
      const courtSession = await prisma.courtSession.create({
        data: {
          sessionId,
          courtId,
        },
      });

      // Assign players to this court
      for (const playerId of playerIds) {
        await prisma.courtAssignment.create({
          data: {
            courtSessionId: courtSession.id,
            playerId,
          },
        });
      }

      // Generate games with Americano pairings if we have 10 players
      if (playerIds.length === 10) {
        const players = await prisma.player.findMany({
          where: { id: { in: playerIds } },
        });

        const games = generateOptimalAmericanoPairings(players);

        // Create games
        for (const game of games) {
          const createdGame = await prisma.game.create({
            data: {
              courtSessionId: courtSession.id,
              gameNumber: game.gameNumber,
              status: 'pending',
            },
          });

          // Add players to game
          await prisma.gamePlayer.createMany({
            data: [
              {
                gameId: createdGame.id,
                playerId: game.team1[0].id,
                team: 1,
              },
              {
                gameId: createdGame.id,
                playerId: game.team1[1].id,
                team: 1,
              },
              {
                gameId: createdGame.id,
                playerId: game.team2[0].id,
                team: 2,
              },
              {
                gameId: createdGame.id,
                playerId: game.team2[1].id,
                team: 2,
              },
            ],
          });
        }
      }
    }

    // Update session status
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'active' },
    });

    // Update player bench status
    const allAssignedPlayerIds = Object.values(assignments).flat() as string[];
    await prisma.player.updateMany({
      data: { isOnBench: false },
    });
    await prisma.player.updateMany({
      where: { id: { notIn: allAssignedPlayerIds } },
      data: { isOnBench: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error assigning players:', error);
    return NextResponse.json({ error: 'Failed to assign players' }, { status: 500 });
  }
}
