import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOptimalAmericanoPairings } from '@/lib/americano';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Get current session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        courtSessions: {
          include: {
            court: true,
            assignments: {
              include: {
                player: true,
              },
            },
          },
          orderBy: {
            court: { order: 'asc' },
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Mark session as completed
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: 'completed' },
    });

    // Get next session
    const nextSession = await prisma.session.findFirst({
      where: { sessionNumber: session.sessionNumber + 1 },
    });

    if (!nextSession) {
      return NextResponse.json({ success: true, message: 'Tournament completed' });
    }

    // Process promotions and relegations
    const newAssignments: { [courtId: string]: string[] } = {};
    const courts = await prisma.court.findMany({
      orderBy: { order: 'asc' },
    });

    // For each court, get top 3 and bottom 3 players by net points
    for (let i = 0; i < session.courtSessions.length; i++) {
      const courtSession = session.courtSessions[i];
      const court = courtSession.court;

      // Sort players by net points (pointsFor - pointsAgainst), then by totalScore, then by name
      const sortedPlayers = [...courtSession.assignments]
        .sort((a, b) => {
          const aNet = a.player.pointsFor - a.player.pointsAgainst;
          const bNet = b.player.pointsFor - b.player.pointsAgainst;
          if (bNet !== aNet) return bNet - aNet;
          if (b.player.totalScore !== a.player.totalScore) return b.player.totalScore - a.player.totalScore;
          return a.player.name.localeCompare(b.player.name);
        });

      const top3 = sortedPlayers.slice(0, 3);
      const middle = sortedPlayers.slice(3, -3);
      const bottom3 = sortedPlayers.slice(-3);

      // Initialize court assignments if not exists
      if (!newAssignments[court.id]) {
        newAssignments[court.id] = [];
      }

      // Handle promotions and relegations
      if (court.order === 1) {
        // Championship court: top players stay, bottom 3 go down
        newAssignments[court.id].push(...top3.map((a) => a.player.id));
        newAssignments[court.id].push(...middle.map((a) => a.player.id));

        // Bottom 3 to next court
        if (courts[i + 1]) {
          if (!newAssignments[courts[i + 1].id]) {
            newAssignments[courts[i + 1].id] = [];
          }
          newAssignments[courts[i + 1].id].push(...bottom3.map((a) => a.player.id));
        }
      } else if (court.order === courts.length) {
        // Development court: bottom players stay, top 3 go up
        newAssignments[court.id].push(...middle.map((a) => a.player.id));
        newAssignments[court.id].push(...bottom3.map((a) => a.player.id));

        // Top 3 to previous court
        if (courts[i - 1]) {
          if (!newAssignments[courts[i - 1].id]) {
            newAssignments[courts[i - 1].id] = [];
          }
          newAssignments[courts[i - 1].id].push(...top3.map((a) => a.player.id));
        }
      } else {
        // Middle court: top 3 up, bottom 3 down, middle stay
        newAssignments[court.id].push(...middle.map((a) => a.player.id));

        // Top 3 to previous court
        if (courts[i - 1]) {
          if (!newAssignments[courts[i - 1].id]) {
            newAssignments[courts[i - 1].id] = [];
          }
          newAssignments[courts[i - 1].id].push(...top3.map((a) => a.player.id));
        }

        // Bottom 3 to next court
        if (courts[i + 1]) {
          if (!newAssignments[courts[i + 1].id]) {
            newAssignments[courts[i + 1].id] = [];
          }
          newAssignments[courts[i + 1].id].push(...bottom3.map((a) => a.player.id));
        }
      }
    }

    // Assign players to courts for next session
    for (const [courtId, playerIds] of Object.entries(newAssignments)) {
      if (playerIds.length === 0) continue;

      // Create court session
      const courtSession = await prisma.courtSession.create({
        data: {
          sessionId: nextSession.id,
          courtId,
        },
      });

      // Assign players
      for (const playerId of playerIds) {
        await prisma.courtAssignment.create({
          data: {
            courtSessionId: courtSession.id,
            playerId,
          },
        });
      }

      // Generate games if we have 8, 10, or 12 players
      if (playerIds.length === 8 || playerIds.length === 10 || playerIds.length === 12) {
        const players = await prisma.player.findMany({
          where: { id: { in: playerIds } },
        });

        const games = generateOptimalAmericanoPairings(players);

        for (const game of games) {
          const createdGame = await prisma.game.create({
            data: {
              courtSessionId: courtSession.id,
              gameNumber: game.gameNumber,
              status: 'pending',
            },
          });

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

    // Activate next session
    await prisma.session.update({
      where: { id: nextSession.id },
      data: { status: 'active' },
    });

    return NextResponse.json({ success: true, nextSessionId: nextSession.id });
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json({ error: 'Failed to complete session' }, { status: 500 });
  }
}
