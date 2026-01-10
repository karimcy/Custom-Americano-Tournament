import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Get the highest session number
    const lastSession = await prisma.session.findFirst({
      orderBy: { sessionNumber: 'desc' },
    });

    const newSessionNumber = (lastSession?.sessionNumber || 0) + 1;

    // Create new session
    const newSession = await prisma.session.create({
      data: {
        sessionNumber: newSessionNumber,
        status: 'pending',
      },
    });

    // Get current active session's court assignments to copy
    const activeSession = await prisma.session.findFirst({
      where: { status: 'active' },
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
        },
      },
    });

    if (activeSession) {
      // Copy court structure and assignments from active session
      for (const cs of activeSession.courtSessions) {
        const courtSession = await prisma.courtSession.create({
          data: {
            sessionId: newSession.id,
            courtId: cs.courtId,
          },
        });

        // Copy assignments
        for (const assignment of cs.assignments) {
          await prisma.courtAssignment.create({
            data: {
              courtSessionId: courtSession.id,
              playerId: assignment.playerId,
            },
          });
        }

        // Generate games using same logic as session completion
        const { generateOptimalAmericanoPairings } = await import('@/lib/americano');
        const players = cs.assignments.map((a) => a.player);
        const games = generateOptimalAmericanoPairings(players);

        for (let i = 0; i < games.length; i++) {
          const game = games[i];
          const createdGame = await prisma.game.create({
            data: {
              courtSessionId: courtSession.id,
              gameNumber: i + 1,
              status: 'pending',
            },
          });

          // Team 1 players
          for (const player of game.team1) {
            await prisma.gamePlayer.create({
              data: {
                gameId: createdGame.id,
                playerId: player.id,
                team: 1,
                score: 0,
              },
            });
          }

          // Team 2 players
          for (const player of game.team2) {
            await prisma.gamePlayer.create({
              data: {
                gameId: createdGame.id,
                playerId: player.id,
                team: 2,
                score: 0,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      session: newSession,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
