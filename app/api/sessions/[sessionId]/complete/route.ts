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

    // For each court, get top 2 and bottom 2 players by total score
    for (let i = 0; i < session.courtSessions.length; i++) {
      const courtSession = session.courtSessions[i];
      const court = courtSession.court;

      // Sort players by total score
      const sortedPlayers = [...courtSession.assignments]
        .sort((a, b) => b.player.totalScore - a.player.totalScore);

      const top2 = sortedPlayers.slice(0, 2);
      const middle = sortedPlayers.slice(2, -2);
      const bottom2 = sortedPlayers.slice(-2);

      // Initialize court assignments if not exists
      if (!newAssignments[court.id]) {
        newAssignments[court.id] = [];
      }

      // Handle promotions and relegations
      if (court.order === 1) {
        // Championship court: top 2 stay, bottom 2 go down
        newAssignments[court.id].push(...top2.map((a) => a.player.id));
        newAssignments[court.id].push(...middle.map((a) => a.player.id));

        // Bottom 2 to next court
        if (courts[i + 1]) {
          if (!newAssignments[courts[i + 1].id]) {
            newAssignments[courts[i + 1].id] = [];
          }
          newAssignments[courts[i + 1].id].push(...bottom2.map((a) => a.player.id));
        }
      } else if (court.order === courts.length) {
        // Development court: bottom 2 stay, top 2 go up
        newAssignments[court.id].push(...middle.map((a) => a.player.id));
        newAssignments[court.id].push(...bottom2.map((a) => a.player.id));

        // Top 2 to previous court
        if (courts[i - 1]) {
          if (!newAssignments[courts[i - 1].id]) {
            newAssignments[courts[i - 1].id] = [];
          }
          newAssignments[courts[i - 1].id].push(...top2.map((a) => a.player.id));
        }
      } else {
        // Middle court: top 2 up, bottom 2 down, middle stay
        newAssignments[court.id].push(...middle.map((a) => a.player.id));

        // Top 2 to previous court
        if (courts[i - 1]) {
          if (!newAssignments[courts[i - 1].id]) {
            newAssignments[courts[i - 1].id] = [];
          }
          newAssignments[courts[i - 1].id].push(...top2.map((a) => a.player.id));
        }

        // Bottom 2 to next court
        if (courts[i + 1]) {
          if (!newAssignments[courts[i + 1].id]) {
            newAssignments[courts[i + 1].id] = [];
          }
          newAssignments[courts[i + 1].id].push(...bottom2.map((a) => a.player.id));
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

      // Generate games if we have 10 players
      if (playerIds.length === 10) {
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

    return NextResponse.json({ success: true, nextSessionId: nextSession.id });
  } catch (error) {
    console.error('Error completing session:', error);
    return NextResponse.json({ error: 'Failed to complete session' }, { status: 500 });
  }
}
