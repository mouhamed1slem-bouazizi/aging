'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_CONFIG } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';
import { CreditsDisplay } from '@/components';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-300 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/transform"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Transform
            </Link>
            <Link
              href="/subscription"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Subscribe
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <CreditsDisplay />
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">
                    {user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/signin"
                  className="px-6 py-2.5 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-300 transition-all hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/transform"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                >
                  Transform
                </Link>
                <Link
                  href="/subscription"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </Link>
                {user ? (
                  <>
                    <div className="mx-4 mb-2">
                      <CreditsDisplay />
                    </div>
                    <div className="mx-4 px-4 py-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 text-purple-700">
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 mx-4 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full w-[calc(100%-2rem)]"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block mx-4 px-6 py-3 text-gray-700 font-semibold rounded-full text-center hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block mx-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
