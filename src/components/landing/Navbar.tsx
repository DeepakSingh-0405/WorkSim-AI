'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/shared/Logo';
import { GlowButton } from '@/components/shared/GlowButton';
import { createClient } from '@/lib/supabase/client';
import { Menu, X, ArrowRight, User } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser(data.user);
        }
      });
    } catch {
      // ignore
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/85 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Logo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#a1a1a1]">
          <Link
            href="#preview"
            className="hover:text-white transition-colors duration-150"
          >
            Live Preview
          </Link>
          <Link
            href="#features"
            className="hover:text-white transition-colors duration-150"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-white transition-colors duration-150"
          >
            How It Works
          </Link>
          <Link
            href="#comparison"
            className="hover:text-white transition-colors duration-150"
          >
            Why WorkSim
          </Link>
        </nav>

        {/* Right CTA / Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <GlowButton size="sm" variant="primary" className="font-semibold">
                Dashboard
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </GlowButton>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-[#a1a1a1] hover:text-white px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/[0.04] transition-all"
              >
                Log In
              </Link>
              <Link href="/signup">
                <GlowButton size="sm" variant="primary" className="font-semibold">
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </GlowButton>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#a1a1a1] hover:text-white transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-white/10 px-6 py-5 space-y-4"
          >
            <nav className="flex flex-col space-y-3 text-base text-[#a1a1a1]">
              <Link
                href="#preview"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-1"
              >
                Live Preview
              </Link>
              <Link
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-1"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-1"
              >
                How It Works
              </Link>
              <Link
                href="#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white transition-colors py-1"
              >
                Why WorkSim
              </Link>
            </nav>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <GlowButton size="md" variant="primary" className="w-full justify-center">
                    Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GlowButton>
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button className="w-full py-2.5 text-xs font-medium text-[#d1d5db] hover:text-white border border-white/10 hover:bg-white/[0.04] rounded-lg transition-colors text-center">
                      Log In
                    </button>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <GlowButton size="md" variant="primary" className="w-full justify-center">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </GlowButton>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
