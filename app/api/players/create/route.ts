import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }

    // Check if player already exists
    const existingPlayer = await prisma.player.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive',
        },
      },
    });

    if (existingPlayer) {
      return NextResponse.json({ error: 'Player already exists' }, { status: 400 });
    }

    // Create new player
    const newPlayer = await prisma.player.create({
      data: {
        name: name.trim(),
        totalScore: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        isOnBench: false,
      },
    });

    return NextResponse.json({
      success: true,
      player: newPlayer,
    });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 });
  }
}
