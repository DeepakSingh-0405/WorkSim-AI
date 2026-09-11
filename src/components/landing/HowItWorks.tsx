'use client';

import React from 'react';
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
    <section id="how-it-works" data-section="how-it-works" className="py-20 md:py-28 relative z-10 border-t border-white/[0.06]">
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

        {/* Steps Grid with connecting SVG */}
        <div className="relative">
          {/* SVG connecting path — draws itself on scroll via GSAP */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
            viewBox="0 0 1200 280"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              data-connect-path
              d="M 150 140 C 300 140, 300 140, 450 140 C 600 140, 600 140, 750 140 C 900 140, 900 140, 1050 140"
              stroke="url(#pathGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Glowing dot that travels along the path */}
            <circle
              data-path-dot
              cx="0"
              cy="0"
              r="5"
              fill="#c40505"
              filter="url(#dotGlow)"
            />
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(196, 5, 5, 0.1)" />
                <stop offset="50%" stopColor="rgba(196, 5, 5, 0.5)" />
                <stop offset="100%" stopColor="rgba(196, 5, 5, 0.1)" />
              </linearGradient>
              <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  data-step-card
                  className="relative bg-[#111317]/60 border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between hover:border-white/20 hover:shadow-[0_0_30px_rgba(196,5,5,0.1)] transition-all duration-300 group"
                >
                  {/* Step number connector dot */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0a0a0a] border-2 border-[#c40505]/40 flex items-center justify-center z-20 group-hover:border-[#c40505] group-hover:shadow-[0_0_12px_rgba(196,5,5,0.4)] transition-all hidden md:flex">
                    <span className="w-2 h-2 rounded-full bg-[#c40505]" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-xs text-[#c40505] font-bold px-2 py-0.5 rounded bg-[#c40505]/10 border border-[#c40505]/20">
                        STEP {item.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-[#a1a1a1] group-hover:text-[#c40505] group-hover:bg-[#c40505]/10 transition-colors">
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
                </div>
              );
            })}
          </div>
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
