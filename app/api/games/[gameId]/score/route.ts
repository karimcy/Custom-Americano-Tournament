import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const body = await request.json();
    const { scores } = body; // { playerId: score }

    // Update scores for each player
    for (const [playerId, score] of Object.entries(scores)) {
      await prisma.gamePlayer.updateMany({
        where: {
          gameId,
          playerId,
        },
        data: {
          score: Number(score),
        },
      });

      // Update player's total score
      const player = await prisma.player.findUnique({
        where: { id: playerId },
      });

      if (player) {
        await prisma.player.update({
          where: { id: playerId },
          data: {
            totalScore: player.totalScore + Number(score),
          },
        });
      }
    }

    // Mark game as completed
    await prisma.game.update({
      where: { id: gameId },
      data: { status: 'completed' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating scores:', error);
    return NextResponse.json({ error: 'Failed to update scores' }, { status: 500 });
  }
}
