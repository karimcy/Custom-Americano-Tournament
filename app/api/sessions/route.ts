import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        courtSessions: {
          include: {
            court: true,
            assignments: {
              include: {
                player: true,
              },
            },
            games: {
              include: {
                gamePlayers: {
                  include: {
                    player: true,
                  },
                },
              },
              orderBy: { gameNumber: 'asc' },
            },
          },
        },
      },
      orderBy: { sessionNumber: 'asc' },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}
