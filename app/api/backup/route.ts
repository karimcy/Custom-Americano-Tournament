import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T').join('_').split('.')[0];
    const backupFile = `database-backups/padel_tournament_${timestamp}.sql`;

    // Run the backup script
    const { stdout, stderr } = await execAsync('./backup-database.sh');

    if (stderr && !stderr.includes('Backing up')) {
      console.error('Backup error:', stderr);
      return NextResponse.json({ error: 'Backup failed', details: stderr }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      filename: backupFile,
      output: stdout
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json({
      error: 'Failed to create backup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
