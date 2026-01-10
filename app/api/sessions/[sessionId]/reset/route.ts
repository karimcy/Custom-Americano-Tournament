import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Get all court sessions for this session
    const courtSessions = await prisma.courtSession.findMany({
      where: { sessionId },
      include: {
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
    });

    // For each game, subtract the scores from player totals and reset
    for (const courtSession of courtSessions) {
      for (const game of courtSession.games) {
        // Calculate team totals for this game
        const team1Players = game.gamePlayers.filter((gp) => gp.team === 1);
        const team2Players = game.gamePlayers.filter((gp) => gp.team === 2);
        const team1Total = team1Players.reduce((sum, gp) => sum + gp.score, 0);
        const team2Total = team2Players.reduce((sum, gp) => sum + gp.score, 0);

        // Subtract scores from player totals
        for (const gamePlayer of game.gamePlayers) {
          const opponentTotal = gamePlayer.team === 1 ? team2Total : team1Total;

          await prisma.player.update({
            where: { id: gamePlayer.playerId },
            data: {
              totalScore: { decrement: gamePlayer.score },
              pointsFor: { decrement: gamePlayer.score },
              pointsAgainst: { decrement: opponentTotal },
            },
          });
        }

        // Reset all game player scores to 0
        await prisma.gamePlayer.updateMany({
          where: { gameId: game.id },
          data: { score: 0 },
        });

        // Reset game status to pending
        await prisma.game.update({
          where: { id: game.id },
          data: { status: 'pending' },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error resetting session:', error);
    return NextResponse.json({ error: 'Failed to reset session' }, { status: 500 });
  }
}
