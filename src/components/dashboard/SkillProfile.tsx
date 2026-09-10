'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { TrendingUp, ShieldCheck, ArrowRight, Award, Zap } from 'lucide-react';

const SKILLS = [
  { name: 'Root Cause Debugging', score: 92, level: 'Advanced' },
  { name: 'Technical Reasoning', score: 90, level: 'Advanced' },
  { name: 'Problem Solving', score: 88, level: 'Proficient' },
  { name: 'Manager Communication', score: 85, level: 'Proficient' },
  { name: 'Incident Prioritization', score: 84, level: 'Proficient' },
];

export function SkillProfile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-[#111318]/80 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
          <div>
            <span className="text-[11px] font-mono uppercase text-[#c40505] font-semibold">
              Live Readiness Telemetry
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Verified Skill Profile
            </h3>
          </div>
          <span className="text-xs font-mono text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-full border border-[#22c55e]/20 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Top 12%
          </span>
        </div>

        {/* Skill Progress Bars */}
        <div className="space-y-4">
          {SKILLS.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between text-xs text-[#fafafa] mb-1.5">
                <span className="font-medium">{skill.name}</span>
                <span className="font-mono text-white font-semibold">
                  {skill.score}/100
                </span>
              </div>
              <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#c40505] to-[#22c55e] rounded-full transition-all duration-500"
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-[#a1a1a1]">Based on recent incident evaluations</span>
        <Link
          href="/evaluation/demo-session"
          className="text-white hover:text-[#c40505] font-medium transition-colors flex items-center gap-1"
        >
          <span>View Detailed Radar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
