'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  showBadge?: boolean;
}

export function Logo({ size = 'md', href, showBadge = false }: LogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-bold tracking-tight',
  };

  const content = (
    <div className="flex items-center gap-2.5 group select-none">
      {/* Dynamic Geometric Brand Icon */}
      <div className={`relative flex items-center justify-center rounded-lg bg-[#111111] border border-white/10 group-hover:border-[#c40505]/40 transition-colors duration-200 ${iconSizes[size]}`}>
        {/* Subtle red core glow */}
        <div className="absolute inset-0 rounded-lg bg-[#c40505]/10 group-hover:bg-[#c40505]/20 transition-colors duration-200" />
        
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-white group-hover:text-[#fafafa] transition-colors"
        >
          {/* WorkSim stylized W / Terminal node icon */}
          <path
            d="M4 6L8 16L12 9L16 16L20 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9" r="2" fill="#c40505" />
        </svg>

        {/* Pulsing micro indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c40505] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c40505]" />
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className={`${textSizes[size]} text-white`}>
          Work<span className="text-[#c40505]">Sim</span>
        </span>
        {showBadge && (
          <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-[#c40505]/15 text-[#c40505] border border-[#c40505]/30">
            INCIDENT
          </span>
        )}
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-block transition-transform active:scale-98">
      {content}
    </Link>
  );
}
