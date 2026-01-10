#!/bin/bash
# Backup script for padel tournament database
# Run this before and after the tournament to save data

BACKUP_DIR="./database-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/padel_tournament_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup the database
echo "🗄️  Backing up padel tournament database..."
pg_dump -U karimarnous padel_tournament > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup successful!"
    echo "📁 Saved to: $BACKUP_FILE"
    echo "📊 Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Keep only last 10 backups
echo "🧹 Cleaning old backups (keeping last 10)..."
ls -t "$BACKUP_DIR"/padel_tournament_*.sql | tail -n +11 | xargs rm -f 2>/dev/null

echo "✅ Done!"
