'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { GlowButton } from '@/components/shared/GlowButton';
import {
  Flame,
  Clock,
  ArrowRight,
  ShieldAlert,
  Users,
  CheckCircle2,
  FileCode2,
  Terminal,
  Building2,
} from 'lucide-react';

export function CurrentMission() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-[#c40505]/30 bg-gradient-to-br from-[#151216] via-[#111318] to-[#0d0f14] p-6 sm:p-8 overflow-hidden shadow-[0_0_40px_rgba(196,5,5,0.12)]"
    >
      {/* Background glow orb */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c40505]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-xs font-mono font-semibold">
              <Flame className="w-3.5 h-3.5" />
              ACTIVE P1 INCIDENT
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-[#a1a1a1] bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/10">
              <Building2 className="w-3 h-3 text-[#666666]" />
              TechFlow Inc.
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-[#a1a1a1] bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/10">
              <Clock className="w-3 h-3 text-[#666666]" />
              35 min SLA
            </span>
          </div>

          {/* Title & Description */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
            Production Incident: Payment API Failure
          </h2>
          <p className="text-sm text-[#a1a1a1] leading-relaxed mb-6">
            Payment API failure rate spiked to 43.8% immediately following deployment <code className="text-white bg-white/10 px-1 py-0.5 rounded font-mono text-xs">v2.4.1</code>. Stripe webhook processing is backing up, causing cart abandonment. Executive escalation triggers in under 30 minutes.
          </p>

          {/* Mission Objectives Checklist */}
          <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4 mb-6 space-y-2">
            <span className="text-[11px] font-mono text-[#666666] uppercase tracking-wider block mb-2 font-semibold">
              Assigned Incident Checklist
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#d1d5db]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>Correlate logs with Stripe p99 latency</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>Isolate timeout bug in config.ts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>Communicate status to Priya Sharma</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                <span>Verify patch with integration test suite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA row */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[#a1a1a1]">
            <div className="flex -space-x-1.5 overflow-hidden">
              <div className="w-6 h-6 rounded-full bg-[#c40505] flex items-center justify-center font-bold text-[9px] text-white ring-2 ring-[#111318]">
                PS
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[9px] text-white ring-2 ring-[#111318]">
                AC
              </div>
            </div>
            <span>Priya Sharma & Alex Chen active in #incident-response</span>
          </div>

          <Link href="/simulate/production-incident-payment-api" className="w-full sm:w-auto">
            <GlowButton size="md" variant="primary" className="w-full sm:w-auto">
              <span>Enter Incident War Room</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlowButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
