'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
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
          <p className="mb-12 text-xl text-gray-700 dark:text-gray-300">
            Americano Format Tournament Manager
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <Link href="/setup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                Setup Tournament
              </motion.button>
            </Link>

            <Link href="/display">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-purple-600 bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-lg transition-all hover:bg-purple-50 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700"
              >
                View Display
              </motion.button>
            </Link>

            <Link href="/score">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-xl border-2 border-blue-600 bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                Enter Scores
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
