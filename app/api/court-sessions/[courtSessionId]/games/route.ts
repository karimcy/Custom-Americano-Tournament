import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Update game pairings
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ courtSessionId: string }> }
) {
  try {
    const { courtSessionId } = await params;
    const body = await request.json();
    const { games } = body; // Array of { gameId, players: [{playerId, team}] }

    // Validate that each player plays exactly 2 games
    const playerGameCounts: { [playerId: string]: number } = {};

    for (const game of games) {
      for (const player of game.players) {
        if (!playerGameCounts[player.playerId]) {
          playerGameCounts[player.playerId] = 0;
        }
        playerGameCounts[player.playerId]++;
      }
    }

    // Check if any player plays more or less than 2 games
    const invalidPlayers = Object.entries(playerGameCounts).filter(
      ([_, count]) => count !== 2
    );

    if (invalidPlayers.length > 0) {
      const playerDetails = await prisma.player.findMany({
        where: { id: { in: invalidPlayers.map(([id]) => id) } },
      });

      const errors = invalidPlayers.map(([playerId, count]) => {
        const player = playerDetails.find((p) => p.id === playerId);
        return `${player?.name || playerId}: ${count} games (must be 2)`;
      });

      return NextResponse.json(
        {
          error: 'Invalid game distribution',
          details: errors,
        },
        { status: 400 }
      );
    }

    // Update all game players
    for (const game of games) {
      // Delete existing game players
      await prisma.gamePlayer.deleteMany({
        where: { gameId: game.gameId },
      });

      // Create new game players
      await prisma.gamePlayer.createMany({
        data: game.players.map((p: any) => ({
          gameId: game.gameId,
          playerId: p.playerId,
          team: p.team,
          score: 0,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating games:', error);
    return NextResponse.json({ error: 'Failed to update games' }, { status: 500 });
  }
}
