'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'HOME' },
  { href: '/projects', label: 'PROJECTS' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b-2 border-black bg-white px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-xl font-bold"
        >
          <Link href="/" className="pixel-text">CODAVRA</Link>
        </motion.div>
        
        <ul className="flex space-x-8">
          {navItems.map((item) => (
            <motion.li
              key={item.href}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              className="pixel-text"
            >
              <Link href={item.href} className="hover:text-gray-600">
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 