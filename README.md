# 🎾 Padel Tournament Manager

A comprehensive web application for managing Americano-format padel tournaments with automatic promotion/relegation, real-time scoring, and multi-device support.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css)

## ✨ Features

### 🏆 Tournament Management
- **3-Court System**: Championship, Challenger, and Development courts
- **Flexible Player Counts**: Supports 8, 10, or 12 players per court
- **Americano Format**: Fair rotation ensuring each player plays exactly 2 games per session
- **Automatic Promotion/Relegation**: Top 3 players promoted, bottom 3 relegated after each session
- **Net Points Ranking**: Rankings based on Points For - Points Against (with tiebreakers)

### 📊 Real-Time Scoring
- **Team-Based Score Entry**: One input per team for faster data entry
- **Live Updates**: Auto-refresh every 5 seconds across all devices
- **Points Tracking**: Individual Points For/Against/Net tracking
- **Session Management**: Complete sessions, reset scores, edit game pairings

### 🎮 Multiple Interfaces

#### Management Interface (`/manage`)
- 5-tab layout: Overview, Total Points, and individual Court tabs
- Inline score entry with team-based inputs
- Court standings with promotion/relegation indicators
- Game pairing editor with 2-game limit validation
- Session completion and reset buttons

#### TV Display (`/display`)
- Full-screen optimized view for large displays
- Auto-refreshing leaderboards
- Color-coded promotion (green) and relegation (red) zones
- Clean, distraction-free layout

#### Standings Page (`/standings`)
- Premier League-style standings tables
- Visual promotion/relegation zones
- Championship leader marked with crown 👑
- Detailed For/Against/Net Points display

#### Rounds History (`/rounds`)
- View all sessions/rounds
- Switch between rounds with tabs
- Complete game history with scores
- Session-specific standings

#### Setup Page (`/setup`)
- Drag-and-drop player assignment
- Visual court allocation
- Pre-loaded default assignments
- Validation for player counts (8, 10, or 12)

### 💾 Data Persistence & Backup
- **PostgreSQL Database**: Production-grade data storage
- **Automatic Backups**: Create SQL dumps with one click
- **JSON Export**: Download all tournament data
- **Safe Redeployment**: Database persists separately from application

### 🎨 User Experience
- **Universal Navigation**: Bottom bar on mobile, sidebar on desktop
- **Responsive Design**: Works on phones, tablets, and computers
- **Beautiful Animations**: Smooth transitions with Framer Motion
- **Champion Indicators**: Crown icon for Championship court leader

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/karimcy/Custom-Americano-Tournament.git
cd Custom-Americano-Tournament
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**
```bash
# Start PostgreSQL (if not already running)
brew services start postgresql@14

# Create database
createdb padel_tournament
```

4. **Configure environment variables**
```bash
# Create .env file
echo 'DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/padel_tournament"' > .env
```

5. **Run database migrations**
```bash
npx prisma migrate deploy
npx prisma generate
```

6. **Seed the database**
```bash
npx prisma db seed
```

7. **Start the development server**
```bash
npm run dev
```

8. **Open in browser**
- Management: http://localhost:3000/manage
- TV Display: http://localhost:3000/display
- Standings: http://localhost:3000/standings

## 📱 Multi-Device Setup

### Computer (Score Entry)
1. Navigate to http://localhost:3000/manage
2. Enter scores after each game
3. Complete sessions when round finishes

### TV/Display (Spectator View)
1. Find your local IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Open http://YOUR_IP:3000/display on TV
3. Display auto-refreshes every 5 seconds

### Mobile Devices (Monitoring)
- Same network: http://YOUR_IP:3000
- Access any page via navigation bar

## 🎯 Tournament Workflow

### Before Tournament
1. **Setup Players** (`/setup`): Drag players to courts
2. **Verify Assignments**: Check court allocations
3. **Start Tournament**: Click "Start Tournament"

### During Session
1. **View Games** (`/manage`): See court-specific game pairings
2. **Enter Scores**: Input team scores after each game
3. **Monitor Progress**: Watch TV display for live updates

### After Session
1. **Complete Session** (`/manage`): Click "Complete Session & Promote/Relegate"
2. **Automatic Processing**:
   - Ranks players by net points
   - Promotes top 3 (Challenger → Championship, Development → Challenger)
   - Relegates bottom 3 (Championship → Challenger, Challenger → Development)
   - Creates next session with new court assignments
   - Generates new game pairings

### Review History
1. **View Rounds** (`/rounds`): Switch between sessions
2. **Check Standings**: See historical rankings
3. **Export Data** (`/history`): Download backups

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Database**: PostgreSQL 14, Prisma ORM
- **Drag & Drop**: @hello-pangea/dnd

### Key Algorithms

#### Americano Pairing
- **8 players**: 4 games (2 games per player)
- **10 players**: 5 games (2 games per player)
- **12 players**: 6 games (2 games per player)
- Fair rotation ensuring balanced matchups

#### Ranking System
1. **Primary**: Net Points (Points For - Points Against)
2. **Tie-breaker 1**: Total Score
3. **Tie-breaker 2**: Alphabetical by name

#### Promotion/Relegation
- Championship (Court 1): No promotion, bottom 3 relegated
- Challenger (Court 2): Top 3 promoted, bottom 3 relegated
- Development (Court 3): Top 3 promoted, bottom 3 in relegation zone (visual only)

## 📂 Project Structure

```
padel-tournament/
├── app/
│   ├── api/                 # API routes
│   │   ├── games/          # Score submission
│   │   ├── sessions/       # Session management
│   │   ├── players/        # Player data
│   │   └── courts/         # Court data
│   ├── components/         # Shared components
│   │   └── Navigation.tsx  # Universal nav bar
│   ├── manage/            # Management interface
│   ├── display/           # TV display
│   ├── standings/         # Standings page
│   ├── rounds/            # Session history
│   ├── setup/             # Player assignment
│   └── history/           # Backup & export
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Initial data
│   └── migrations/        # Database migrations
└── lib/
    └── americano.ts       # Pairing algorithm
```

## 🎮 Default Player Setup

### Championship Court (10 players)
Dimi, Rohan, Marios Savva, Colin Relton, Patrick, Alex Geddes, Josh Geddes, Steve Reynolds, Karim A., Hannes

### Challenger Court (10 players)
Karim, Andreas Ch, Andrey Sesyuk, Nico, Saif, Alex, Dima Zubkov, Wayss, Jordan Geddes, Pandelis

### Development Court (12 players)
Richard, Dean, Oliver Thirlwell Georgallis, Natalie, Sonya Loshak, Iliana Thirlwell Georgallis, Matvey, Eka, Sophie Efstathiou, Stephan, Maddy, Marianthi

## 🔧 Configuration

### Database Backup
```bash
# Manual backup
./backup-database.sh

# Or via UI
Navigate to /history → Click "Create PostgreSQL Backup"
```

### Reset Scores
```bash
# Reset all scores to zero
npx tsx prisma/reset-scores.ts
```

### Environment Variables
```env
DATABASE_URL="postgresql://username@localhost:5432/padel_tournament"
```

## 📊 Game Scoring

### How Scoring Works
1. Teams play to 7 points (or tournament-defined limit)
2. Enter **team total** (e.g., Team 1: 14, Team 2: 6)
3. Score divided equally among team players
4. Example: Team 1 scores 14 with 2 players → each gets 7 points
5. Points For/Against tracking:
   - Team 1 players: +7 For, +6 Against
   - Team 2 players: +3 For, +14 Against

### Net Points Calculation
```
Net Points = Points For - Points Against
```
- Win 14-6: +8 net points (14 - 6)
- Lose 6-14: -8 net points (6 - 14)

## 🎨 Visual Indicators

- 👑 **Crown**: Championship court leader
- 🟢 **Green**: Promotion zone (top 3)
- 🔴 **Red**: Relegation zone (bottom 3)
- ✓ **Checkmark**: Completed games
- 🏆 **Gold Medal**: Overall tournament leader

## 📖 Documentation

- **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)**: Safe redeployment instructions
- **[CHANGES-SUMMARY.md](CHANGES-SUMMARY.md)**: Recent feature updates
- **[FINAL-SUMMARY.md](FINAL-SUMMARY.md)**: Complete feature list

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill existing Next.js process
pkill -f "next dev"

# Restart
npm run dev
```

### Database Connection Error
```bash
# Check PostgreSQL is running
brew services list

# Restart PostgreSQL
brew services restart postgresql@14
```

### Reset Everything
```bash
# Reset database
npx prisma migrate reset

# Reseed
npx prisma db seed
```

## 🚢 Production Deployment

### Option 1: Vercel (Recommended)
1. Push to GitHub
2. Connect Vercel to repository
3. Set environment variables (PostgreSQL connection)
4. Deploy

### Option 2: Self-Hosted
```bash
# Build for production
npm run build

# Start production server
npm start

# Or use PM2
npm install -g pm2
pm2 start npm --name "padel-tournament" -- start
pm2 save
pm2 startup
```

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use for your tournaments!

## 🙏 Acknowledgments

- Built with Next.js and React
- Database powered by PostgreSQL
- Styled with Tailwind CSS
- Animations by Framer Motion

## 📧 Support

For questions or issues:
- Open a GitHub issue
- Check documentation in `/docs` folder

---

**Ready to start your tournament?** 🎾

```bash
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Visit http://localhost:3000 and enjoy! 🚀
