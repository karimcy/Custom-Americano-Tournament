#!/bin/bash
# Restore script for padel tournament database
# Usage: ./restore-database.sh <backup-file.sql>

if [ -z "$1" ]; then
    echo "❌ Error: Please provide a backup file to restore"
    echo "Usage: ./restore-database.sh <backup-file.sql>"
    echo ""
    echo "Available backups:"
    ls -lh database-backups/*.sql 2>/dev/null || echo "  No backups found"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will replace all current tournament data!"
echo "📁 Restoring from: $BACKUP_FILE"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 0
fi

echo "🗄️  Restoring database..."
psql -U karimarnous padel_tournament < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Restore successful!"
else
    echo "❌ Restore failed!"
    exit 1
fi
