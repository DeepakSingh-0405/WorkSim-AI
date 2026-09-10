'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Target, MessageSquare, Wrench, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { GlowButton } from '@/components/shared/GlowButton';

const STEPS = [
  {
    step: '01',
    title: 'Select a Real Incident',
    icon: Target,
    desc: 'Choose from production outages, concurrency bugs, and architectural refactors designed from real engineering postmortems.',
  },
  {
    step: '02',
    title: 'Enter the War Room',
    icon: MessageSquare,
    desc: 'Jump into Slack where your AI Engineering Manager Priya Sharma briefs you on the SLA deadline and customer impact.',
  },
  {
    step: '03',
    title: 'Diagnose & Ship Hotfix',
    icon: Wrench,
    desc: 'Correlate log spikes, inspect source code in Monaco, test your fix in the terminal, and submit your pull request.',
  },
  {
    step: '04',
    title: 'Receive Radar Telemetry',
    icon: BarChart3,
    desc: 'Get evaluated across 5 core competencies with concrete behavioral feedback and actionable steps to reach senior level.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 relative z-10 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#c40505] mb-2 font-semibold">
            The WorkSim Loop
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-tight mb-4">
            How a 30-minute simulation works.
          </h3>
          <p className="text-[#a1a1a1] text-base leading-relaxed">
            No passive lectures. No multiple choice quizzes. You learn by doing what engineers actually do when production is on fire.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-[#111317]/60 border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-[#c40505] font-bold px-2 py-0.5 rounded bg-[#c40505]/10 border border-[#c40505]/20">
                      STEP {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-[#a1a1a1]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-[#fafafa] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#a1a1a1] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.04] flex items-center text-[11px] font-mono text-[#666666]">
                  <span>Avg. time: 5-8 mins</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Prompt */}
        <div className="mt-14 text-center">
          <Link href="/simulate/production-incident-payment-api">
            <GlowButton size="md" variant="primary">
              <span>Try Step 01 Right Now (No Signup Required)</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </GlowButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
