'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/setup', label: 'Setup', icon: '⚙️' },
    { href: '/manage', label: 'Manage', icon: '📊' },
    { href: '/standings', label: 'Standings', icon: '🏆' },
    { href: '/display', label: 'TV Display', icon: '📺' },
    { href: '/rounds', label: 'Rounds', icon: '🔄' },
    { href: '/history', label: 'History', icon: '📚' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow-lg md:border-r md:border-t-0 md:left-0 md:top-0 md:bottom-0 md:right-auto md:w-20 md:border-r">
      <div className="flex h-16 items-center justify-around md:h-full md:flex-col md:justify-start md:gap-2 md:py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all md:w-16 md:h-16 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-semibold hidden sm:block md:hidden lg:block truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
