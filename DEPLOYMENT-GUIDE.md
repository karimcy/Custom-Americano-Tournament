# Deployment Guide - Database-Safe Redeployment

## ✅ Guaranteed Database Persistence

Your PostgreSQL database is **completely separate** from the application code. When you redeploy the application, the database will **NOT** be affected.

### Why Your Data is Safe:

1. **Separate Database**: PostgreSQL runs as a system service, independent of the Next.js app
2. **Persistent Storage**: Database files stored at `/opt/homebrew/var/postgresql@14`
3. **Environment Variables**: Database connection via `.env` file (not in code)
4. **No Destructive Migrations**: Prisma migrations are additive (add columns, don't drop data)

---

## 🔧 Safe Redeployment Process

### Option 1: Local Redeployment (Recommended for Testing)

```bash
# 1. Create backup (safety first!)
./backup-database.sh

# 2. Kill current server
pkill -f "next dev"

# 3. Pull latest code changes (if using Git)
git pull

# 4. Install any new dependencies
npm install

# 5. Run Prisma migrations (adds new fields, doesn't delete data)
npx prisma migrate deploy

# 6. Restart server
npm run dev
```

**Result**: Application updated, **all tournament data preserved**

---

### Option 2: Production Deployment (Vercel/Similar)

#### Step 1: Prepare Production Database

**Option A: Use Same Local Database** (if hosting on same machine)
```bash
# Your .env already points to local PostgreSQL
DATABASE_URL="postgresql://karimarnous@localhost:5432/padel_tournament"

# No changes needed - app will connect to same database
```

**Option B: Use External Database** (if deploying to cloud)

1. **Create PostgreSQL Database** (e.g., on Supabase, Railway, or your host)
   - Get connection string: `postgresql://user:password@host:5432/database`

2. **Migrate Your Data**:
```bash
# Export current data
pg_dump -U karimarnous padel_tournament > tournament_export.sql

# Import to new database
psql -U <new_user> -h <new_host> -d <new_database> < tournament_export.sql

# Or use backup script
./backup-database.sh
# Then restore on new database:
psql <new_database_url> < database-backups/padel_tournament_TIMESTAMP.sql
```

3. **Update Environment Variable**:
```env
# In production .env or hosting platform
DATABASE_URL="postgresql://user:password@host:5432/database"
```

#### Step 2: Deploy Application

```bash
# 1. Build production version
npm run build

# 2. Run migrations on production database
DATABASE_URL="<production_url>" npx prisma migrate deploy

# 3. Deploy to your hosting platform
# (Vercel, Railway, etc.)
```

---

### Option 3: Same-Machine Production Deployment

If you're hosting on the same Mac:

```bash
# 1. Backup first
./backup-database.sh

# 2. Build for production
npm run build

# 3. Start production server (instead of dev)
npm start
# Or use PM2 for auto-restart:
npm install -g pm2
pm2 start npm --name "padel-tournament" -- start
pm2 save
pm2 startup  # Enable auto-restart on reboot
```

**Database stays exactly the same** - no data loss!

---

## 🔐 Environment Variable Management

### Current Setup:
```env
DATABASE_URL="postgresql://karimarnous@localhost:5432/padel_tournament"
```

### For Production:
```env
# Production .env (never commit to Git!)
DATABASE_URL="postgresql://user:password@production-host:5432/padel_tournament"

# Optional: Different database for staging
STAGING_DATABASE_URL="postgresql://user:password@staging-host:5432/padel_tournament_staging"
```

---

## ⚠️ What NOT To Do

### ❌ NEVER Run These Commands in Production:
```bash
# This deletes all data!
npx prisma migrate reset   # ❌ DON'T RUN THIS

# This deletes all data!
npx prisma db push --force-reset   # ❌ DON'T RUN THIS

# This reseeds (overwrites existing data)
npx prisma db seed   # ❌ Only for fresh setup
```

### ✅ Safe Commands to Run:
```bash
# Adds new database changes without deleting
npx prisma migrate deploy  # ✅ SAFE

# Updates Prisma Client code (doesn't touch database)
npx prisma generate  # ✅ SAFE

# Creates a backup
./backup-database.sh  # ✅ ALWAYS RECOMMENDED
```

---

## 🚀 Quick Redeploy Checklist

### Before Every Deployment:
- [ ] Create database backup: `./backup-database.sh`
- [ ] Test locally first: `npm run dev`
- [ ] Verify all features work
- [ ] Check environment variables are correct

### During Deployment:
- [ ] Install dependencies: `npm install`
- [ ] Run safe migrations: `npx prisma migrate deploy`
- [ ] Build application: `npm run build`
- [ ] Deploy/restart server

### After Deployment:
- [ ] Verify app loads: Open homepage
- [ ] Check database connection: View standings page
- [ ] Verify data persists: Check Total Points tab
- [ ] Create post-deployment backup: `./backup-database.sh`

---

## 📦 Git Setup (Optional but Recommended)

To track code changes without committing database:

```bash
# Initialize Git repository
git init

# .gitignore should already exclude:
# - .env (database credentials)
# - database-backups/ (sensitive data)
# - .next/ (build files)
# - node_modules/ (dependencies)

# Commit your code
git add .
git commit -m "Initial tournament application"

# Push to remote repository
git remote add origin <your-repo-url>
git push -u origin main
```

When you pull updates:
```bash
git pull          # Gets code changes
npm install       # Installs new dependencies
npx prisma migrate deploy  # Applies new database fields
npm run build     # Rebuilds application
pm2 restart padel-tournament  # Restarts server
```

**Database remains untouched!**

---

## 🔄 Zero-Downtime Redeployment

For minimal disruption during tournament:

```bash
# 1. Build new version in background
npm run build

# 2. Test it works
npm start  # Check on different port

# 3. Switch servers
pm2 stop padel-tournament
pm2 start npm --name "padel-tournament" -- start
pm2 save
```

**Alternative**: Use 2 servers with a reverse proxy (nginx) for true zero-downtime.

---

## 📊 Database Migration Safety

### Current Migrations:
All migrations are **additive** and safe:
- ✅ Added `pointsFor` field (doesn't delete data)
- ✅ Added `pointsAgainst` field (doesn't delete data)
- ✅ All migrations preserve existing data

### Future Code Changes:
When adding new features:
```bash
# 1. Modify schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_feature

# 3. Review migration file
# Make sure it only ADDs fields, doesn't DROP

# 4. Apply to production
DATABASE_URL="<production>" npx prisma migrate deploy
```

---

## 🛡️ Disaster Recovery

### If Something Goes Wrong:

**Option 1: Restore from Backup**
```bash
# List available backups
ls -lh database-backups/

# Restore latest backup
./restore-database.sh database-backups/padel_tournament_TIMESTAMP.sql
```

**Option 2: Export Current Data**
```bash
# Export to JSON (via History page)
# Click "Download JSON Data" button
# Saves all data as JSON file
```

**Option 3: Direct Database Access**
```bash
# Connect to database
psql -U karimarnous -d padel_tournament

# View all data
SELECT * FROM "Player";
SELECT * FROM "Session";
# etc.
```

---

## 📱 Mobile/Remote Access

To access from other devices (phones, tablets):

```bash
# Find your IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# Share URL with devices on same network
http://192.168.10.139:3000
```

For internet access (from anywhere):
1. Use ngrok: `ngrok http 3000`
2. Or deploy to cloud (Vercel, Railway, etc.)
3. Or set up port forwarding on your router

---

## ✅ Summary

### Your Data is Safe Because:
1. ✅ Database is separate from application code
2. ✅ Stored persistently on disk
3. ✅ Migrations are additive only
4. ✅ Backups available
5. ✅ Environment variables control connection
6. ✅ Can redeploy code without touching database

### To Redeploy Safely:
```bash
./backup-database.sh               # 1. Backup
git pull && npm install           # 2. Update code
npx prisma migrate deploy         # 3. Safe migrations
npm run build && pm2 restart all  # 4. Restart
./backup-database.sh               # 5. Post-deployment backup
```

**Result**: New code deployed, **all tournament data preserved!**

---

**Need Help?** Check existing data anytime:
- Web: http://localhost:3000/history
- CLI: `psql -U karimarnous -d padel_tournament`
- Backup: `ls database-backups/`

**Confidence**: 💯 Your data will NOT be lost during redeployment!
