'use client';

import React from 'react';
import { motion } from 'motion/react';
import { X, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GlowButton } from '@/components/shared/GlowButton';

const TRADITIONAL_ITEMS = [
  'Passive 40-hour video courses with low completion rates',
  'Multiple-choice trivia quizzes testing rote syntax memorization',
  'Synthetic "todo app" sandboxes with no messy real-world legacy code',
  'Isolated solo work with zero team collaboration or manager updates',
  'Generic PDF completion certificates that hiring managers ignore',
];

const WORKSIM_ITEMS = [
  'Active 30-minute incident triage putting you in the driver seat',
  'Real production codebases, live stack traces, and simulated terminals',
  'Complex legacy bugs requiring deep log investigation and hypothesis testing',
  'Autonomous AI teammates that test communication and composure under SLA pressure',
  'Verifiable 5-dimension radar scorecards based on real engineering telemetry',
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="py-20 md:py-28 relative z-10 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#c40505] mb-2 font-semibold">
            Why WorkSim
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-tight mb-4">
            The difference between studying and doing.
          </h3>
          <p className="text-[#a1a1a1] text-base leading-relaxed">
            Hiring managers don't care how many videos you watched. They want to know if you can resolve an outage when the company is losing revenue every minute.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional EdTech Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/[0.06] bg-[#0e0f13]/70 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06]">
                <h4 className="text-lg font-semibold text-[#a1a1a1]">
                  Traditional Coding Courses
                </h4>
                <span className="text-xs font-mono text-[#ef4444] bg-[#ef4444]/10 px-2.5 py-0.5 rounded border border-[#ef4444]/20">
                  Passive Learning
                </span>
              </div>

              <ul className="space-y-4">
                {TRADITIONAL_ITEMS.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#a1a1a1]">
                    <div className="w-5 h-5 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center text-[#ef4444] shrink-0 mt-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] text-xs font-mono text-[#666666]">
              Result: Low retention & inability to debug unguided production issues.
            </div>
          </motion.div>

          {/* WorkSim Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#c40505]/40 bg-[#141215]/80 p-6 sm:p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(196,5,5,0.15)] relative overflow-hidden"
          >
            {/* Subtle glow orb */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#c40505]/20 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  WorkSim Simulation
                </h4>
                <span className="text-xs font-mono text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-0.5 rounded border border-[#22c55e]/20">
                  Active Mastery
                </span>
              </div>

              <ul className="space-y-4">
                {WORKSIM_ITEMS.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#fafafa]">
                    <div className="w-5 h-5 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-mono text-[#22c55e]">
                Result: Battle-tested confidence & proven workplace instinct.
              </span>
              <Link href="/simulate/production-incident-payment-api">
                <span className="text-xs font-medium text-white hover:text-[#c40505] transition-colors flex items-center gap-1">
                  Experience it →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
