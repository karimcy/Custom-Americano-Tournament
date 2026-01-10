import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await params;
    const body = await request.json();
    const { team1Score, team2Score } = body;

    // Get all game players to determine teams
    const gamePlayers = await prisma.gamePlayer.findMany({
      where: { gameId },
      include: { player: true },
    });

    const team1Players = gamePlayers.filter((gp) => gp.team === 1);
    const team2Players = gamePlayers.filter((gp) => gp.team === 2);

    // Each player on the team gets the FULL team score (not divided)
    // If you win 7-5, you get 7 for and 5 against (net +2)
    // If you lose 5-7, you get 5 for and 7 against (net -2)

    // Update scores for team 1 players
    for (const gp of team1Players) {
      await prisma.gamePlayer.updateMany({
        where: {
          gameId,
          playerId: gp.playerId,
        },
        data: {
          score: team1Score, // Full team score, not divided
        },
      });

      const player = await prisma.player.findUnique({
        where: { id: gp.playerId },
      });

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

    // Update scores for team 2 players
    for (const gp of team2Players) {
      await prisma.gamePlayer.updateMany({
        where: {
          gameId,
          playerId: gp.playerId,
        },
        data: {
          score: team2Score, // Full team score, not divided
        },
      });

      const player = await prisma.player.findUnique({
        where: { id: gp.playerId },
      });

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
