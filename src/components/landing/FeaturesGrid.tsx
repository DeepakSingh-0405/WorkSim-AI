'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Code2,
  Activity,
  Radar,
  GitFork,
  Award,
  Sparkles,
  Terminal,
  ShieldCheck,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Users,
    title: 'Autonomous AI Teammates',
    tag: 'Gemini 1.5 Flash',
    description:
      'Collaborate with an Engineering Manager (Priya Sharma) and Senior Coworker (Alex Chen). They hold realistic knowledge boundaries, press for updates, and test your communication under pressure.',
    highlight: 'Real conversational streaming',
    colSpan: 'md:col-span-2',
  },
  {
    icon: Code2,
    title: 'Full Monaco Code Editor',
    tag: 'VS Code Engine',
    description:
      'Inspect production services, write hotfixes, and review git diffs right inside your browser without local environment friction.',
    highlight: 'Zero install needed',
    colSpan: 'md:col-span-1',
  },
  {
    icon: Activity,
    title: 'Live Telemetry & Log Stream',
    tag: 'Production Observability',
    description:
      'Analyze realistic server traces, grep error spikes, and isolate p99 latency anomalies in simulated Datadog-style log streams.',
    highlight: 'Real-time trace clues',
    colSpan: 'md:col-span-1',
  },
  {
    icon: Radar,
    title: '5-Dimension Radar Scoring',
    tag: 'Automated Rubric',
    description:
      'Telemetry assesses Debugging, Communication, Technical Reasoning, Problem Solving, and Prioritization using structured AI reasoning.',
    highlight: 'Comprehensive feedback',
    colSpan: 'md:col-span-2',
  },
  {
    icon: GitFork,
    title: 'Consequential Simulations',
    tag: 'Adaptive Engine',
    description:
      'Your choices have real fallout. Delay an update and your manager escalates. Push a sloppy fix and production error rates spike.',
    highlight: 'True workplace dynamics',
    colSpan: 'md:col-span-1',
  },
  {
    icon: Award,
    title: 'Verifiable Proof-of-Work',
    tag: 'Career Portfolio',
    description:
      'Replace resume bullet points with concrete evidence: git diffs, incident resolution times, and granular radar evaluations recruiters trust.',
    highlight: 'Hiring-grade telemetry',
    colSpan: 'md:col-span-2',
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 md:py-28 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#c40505] mb-2 font-semibold">
            Architected for Mastery
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-tight mb-4">
            Everything you need to practice real engineering.
          </h3>
          <p className="text-[#a1a1a1] text-base leading-relaxed">
            Built from first principles to recreate what actually matters at senior tech companies: diagnosing ambiguity, collaborating with teams, and delivering safe solutions.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group relative rounded-xl border border-white/[0.08] bg-[#111317]/80 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-[#c40505]/40 hover:shadow-[0_0_30px_rgba(196,5,5,0.15)] transition-all ${feature.colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white group-hover:text-[#c40505] group-hover:bg-[#c40505]/10 group-hover:border-[#c40505]/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[#a1a1a1]">
                      {feature.tag}
                    </span>
                  </div>

                  <h4 className="text-lg font-semibold text-[#fafafa] mb-2 tracking-tight">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-[#a1a1a1] leading-relaxed mb-4">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs">
                  <span className="text-[#666666] group-hover:text-neutral-400 transition-colors">
                    {feature.highlight}
                  </span>
                  <span className="text-[#c40505] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-mono text-[11px]">
                    Explore →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
