# Padel Tournament Manager

A beautiful, modern web application for managing Americano-style padel tournaments with automatic player pairing, scoring, and promotion/relegation between courts.

## Features

- **Drag & Drop Court Assignment**: Easily assign 32 players to 3 courts with intuitive drag-and-drop interface
- **Automatic Americano Pairing**: Generates optimal pairings ensuring players partner with different people each game
- **Live Display View**: Beautiful TV-optimized view showing leaderboard, courts, and live scores
- **Mobile Score Entry**: Simple, mobile-optimized interface for entering scores from any device
- **Automatic Promotion/Relegation**: Top 2 players from each court move up, bottom 2 move down after each session
- **Real-time Updates**: Scores update automatically across all devices
- **Persistent Storage**: All data saved to PostgreSQL database

## Tournament Format

- **3 Courts**: Championship, Challenger, and Development
- **10 Players per Court**: 2 players on bench
- **3 Sessions**: Each session is 30 minutes
- **5 Games per Session**: Each game played to 7 points
- **Individual Scoring**: Your score from each game accumulates to your total
- **Example**: Win 7-3 means you get 7 points, opponents each get 3 points

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (already configured)

### Installation

The application is already set up! The database is seeded with your 32 players and 3 courts.

### Running the Application

The development server is already running at:
- **Local**: http://localhost:3001
- **Network**: http://192.168.10.139:3001 (access from other devices on your network)

If you need to restart it:
```bash
cd padel-tournament
npm run dev
```

## How to Use

### 1. Setup Tournament (Do this first on your computer)

1. Open http://localhost:3001 in your browser
2. Click "Setup Tournament"
3. Drag and drop players from "Available Players" to the three courts
4. Assign 10 players to each court (2 will remain on bench)
5. Click "Start Tournament"

The system will automatically:
- Generate 5 games with optimal Americano pairings for each court
- Ensure everyone plays with different partners

### 2. Display View (Open this on your TV)

1. Open http://192.168.10.139:3001/display on your TV browser
2. This shows:
   - Overall leaderboard (top 10 players)
   - All three courts with their games
   - Live scores for each game
   - Court standings

The display auto-refreshes every 5 seconds to show latest scores.

### 3. Enter Scores (Everyone can do this on their phones)

1. Open http://192.168.10.139:3001/score on your phone
2. Select the court and game number
3. Enter the final score for each player (0-7)
4. Submit

Each player enters their individual score from that game (not team scores).

### 4. Complete Session & Move to Next Round

After all 5 games on all courts are complete:

1. Go to the Score Entry page
2. Click "Complete Session & Promote/Relegate"
3. The system automatically:
   - Moves top 2 players from each court up to the next level
   - Moves bottom 2 players down to the lower level
   - Generates new Americano pairings for the next session

### 5. Repeat for Sessions 2 and 3

The process repeats for all 3 sessions!

## Players in System

The following 32 players are pre-loaded:

Matvey, Karim, Karim A., Alex, Colin Relton, Oliver Thirlwell Georgallis, Iliana Thirlwell Georgallis, Rohan, Natalie, Marios Savva, Dimi, Steve Reynolds, Lisa Groeger, Andrey Sesyuk, Sonya Loshak, Andreas Ch, Nico, Saif, Pandelis, Josh Geddes, Alex Geddes, Jordan Geddes, Dima Zubkov, Stephan, Marianthi, Hannes, Dean, Richard, Sophie Efstathiou, Patrick, Eka, Wayss, Maddy

## Database Management

### Resetting the Tournament

If you need to start fresh:

```bash
cd padel-tournament
npm run seed
```

This will:
- Clear all games and scores
- Reset all players to 0 points
- Create fresh sessions

### Viewing Database

The database connection is at:
```
postgresql://karimarnous@localhost:5432/padel_tournament
```

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS with beautiful gradients
- **Animations**: Framer Motion
- **Drag & Drop**: @hello-pangea/dnd
- **Database**: PostgreSQL + Prisma ORM
- **Real-time**: Polling (5 second intervals)

## Tips for Tournament Day

1. **Before Tournament**:
   - Test display on TV to ensure it's visible
   - Share the network URL with all players
   - Make sure everyone can access the score entry page

2. **During Tournament**:
   - Keep the display page open on TV at all times
   - Have multiple people ready to enter scores simultaneously
   - Announce when moving to next session

3. **After Each Game**:
   - Players should enter their scores immediately
   - Double-check scores before submitting
   - Scores are final once submitted

## Troubleshooting

**If the server stops**:
```bash
cd padel-tournament
npm run dev
```

**If you see database errors**:
```bash
cd padel-tournament
npx prisma migrate dev
npm run seed
```

**If styles look wrong**:
Hard refresh the browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

## Future Enhancements

Potential improvements for future tournaments:
- WebSocket for true real-time updates (currently polling)
- Player photo uploads
- Tournament history and statistics
- Export results to PDF
- Custom scoring rules
- More flexible player counts

---

Enjoy your tournament!
