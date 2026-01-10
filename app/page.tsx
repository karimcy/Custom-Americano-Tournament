'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 md:pl-24 md:pb-8">
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="mb-4 text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Padel Tournament
          </h1>
          <p className="mb-12 text-xl text-gray-700">
            Americano Format - 3 Sessions
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/setup">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer rounded-2xl bg-white p-8 shadow-lg hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">⚙️</div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">Setup</h2>
                <p className="text-gray-600">Drag & drop players to courts</p>
              </motion.div>
            </Link>

            <Link href="/manage">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-8 shadow-lg hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">🎯</div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">Manage</h2>
                <p className="text-gray-700">Enter scores & manage tournament</p>
              </motion.div>
            </Link>

            <Link href="/standings">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer rounded-2xl bg-gradient-to-br from-green-100 to-teal-100 p-8 shadow-lg hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">🏆</div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">Standings</h2>
                <p className="text-gray-700">View court rankings & zones</p>
              </motion.div>
            </Link>

            <Link href="/display">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 p-8 shadow-lg hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">📺</div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">TV Display</h2>
                <p className="text-gray-700">Full-screen leaderboard view</p>
              </motion.div>
            </Link>

            <Link href="/rounds">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 p-8 shadow-lg hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">🔄</div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">Rounds</h2>
                <p className="text-gray-700">View all sessions & scores</p>
              </motion.div>
            </Link>

            <Link href="/history">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer rounded-2xl bg-gradient-to-br from-pink-100 to-red-100 p-8 shadow-lg hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">💾</div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">History & Backup</h2>
                <p className="text-gray-700">View all data & create backups</p>
              </motion.div>
            </Link>
          </div>
        </motion.div>
        </div>
      </div>
    </>
  );
}
