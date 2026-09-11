'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';

export function Footer() {
  return (
    <footer data-section="footer" className="border-t border-white/[0.08] bg-[#08080a] py-12 relative z-10 text-xs text-[#a1a1a1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Logo size="sm" />
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="text-[#a1a1a1]">
            Practice work, not courses. Next-gen AI workplace simulations.
          </span>
        </div>

        {/* System Health Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
          <span className="font-mono text-[11px] text-[#fafafa]">
            All Simulation Systems Operational
          </span>
        </div>

        {/* Navigation & Copyright */}
        <div className="flex items-center gap-6">
          <Link href="#preview" className="hover:text-white transition-colors">
            Preview
          </Link>
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <span className="text-[#666666]">© 2026 WorkSim</span>
        </div>
      </div>
    </footer>
  );
}
