'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { GlowButton } from '@/components/shared/GlowButton';
import { ArrowRight, Sparkles, Terminal, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Top Status Pill / Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-mono text-[#a1a1a1] mb-8 hover:border-[#c40505]/40 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c40505] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c40505]" />
          </span>
          <span className="text-[#fafafa] font-semibold">Incident Simulation Alpha</span>
          <span className="text-white/20">|</span>
          <span className="text-[#a1a1a1]">P1 Payment Outage Scenario Live</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#fafafa] max-w-4xl leading-[1.1] text-balance mb-6"
        >
          Practice Real Work.{' '}
          <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Not Video Courses.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-[#a1a1a1] max-w-2xl text-balance leading-relaxed mb-10"
        >
          Step into a live workplace environment. Triage high-stakes production outages,
          collaborate with autonomous AI engineering managers, debug real codebases,
          and prove your readiness with verified skill telemetry.
        </motion.p>

        {/* Primary & Secondary Action CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/simulate/production-incident-payment-api" className="w-full sm:w-auto">
            <GlowButton size="lg" variant="primary" className="w-full sm:w-auto text-base px-8 py-3.5">
              <span>Enter Live Simulation</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlowButton>
          </Link>
          <a href="#preview" className="w-full sm:w-auto">
            <GlowButton size="lg" variant="secondary" className="w-full sm:w-auto text-base">
              <Terminal className="w-4 h-4 mr-2 text-[#a1a1a1]" />
              <span>Watch 30s Workspace Walkthrough</span>
            </GlowButton>
          </a>
        </motion.div>

        {/* Real-time Telemetry Metadata Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/[0.06] w-full max-w-3xl text-left"
        >
          <div className="flex flex-col">
            <span className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-1">Company</span>
            <span className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#a1a1a1]" />
              TechFlow Inc.
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-1">Incident Tier</span>
            <span className="text-sm font-semibold text-[#ef4444] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              P1 Critical SLA
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-1">Teammates</span>
            <span className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              Priya & Alex (AI)
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-mono text-[#666666] uppercase tracking-wider mb-1">Feedback</span>
            <span className="text-sm font-semibold text-[#fafafa] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6]" />
              5-Dimension Radar
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
