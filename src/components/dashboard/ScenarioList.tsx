'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Flame,
  Clock,
  Lock,
  Play,
  CheckCircle2,
  Building2,
  ArrowRight,
  Database,
  Radio,
  Server,
} from 'lucide-react';

const SCENARIOS = [
  {
    id: 'production-incident-payment-api',
    title: 'Payment API Failure Under Load',
    company: 'TechFlow Inc.',
    tier: 'P1 Critical',
    duration: '30 mins',
    status: 'ACTIVE',
    icon: Flame,
    color: '#ef4444',
    description: 'Diagnose downstream timeout bottleneck causing 43% failure rate on cart checkout.',
  },
  {
    id: 'postgres-deadlock-triage',
    title: 'PostgreSQL Lock Contention & Deadlock',
    company: 'TechFlow Inc.',
    tier: 'P1 Critical',
    duration: '45 mins',
    status: 'UP_NEXT',
    icon: Database,
    color: '#eab308',
    description: 'Resolve row-level exclusive locks in the order fulfillment ledger during flash sale traffic.',
  },
  {
    id: 'microservice-zero-downtime',
    title: 'Auth Service Zero-Downtime Migration',
    company: 'TechFlow Inc.',
    tier: 'P2 High',
    duration: '40 mins',
    status: 'LOCKED',
    icon: Server,
    color: '#3b82f6',
    description: 'Dual-write cutover to migrate 1.2M user sessions without dropping active JWT tokens.',
  },
  {
    id: 'websocket-gateway-leak',
    title: 'WebSocket Gateway Memory Spike',
    company: 'StreamPulse Media',
    tier: 'P1 Critical',
    duration: '35 mins',
    status: 'LOCKED',
    icon: Radio,
    color: '#a855f7',
    description: 'Isolate heap allocation leak in real-time notification socket handler causing OOM kills.',
  },
];

export function ScenarioList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div>
          <span className="text-[11px] font-mono uppercase text-[#666666] font-semibold">
            Career Progression Path
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Production Simulation Catalog
          </h3>
        </div>
        <span className="text-xs text-[#a1a1a1]">1 Active • 3 In Queue</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SCENARIOS.map((sc, index) => {
          const Icon = sc.icon;
          const isActive = sc.status === 'ACTIVE';
          const isUpNext = sc.status === 'UP_NEXT';

          return (
            <motion.div
              key={sc.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                isActive
                  ? 'border-[#c40505]/40 bg-[#12141a]/90 shadow-[0_0_20px_rgba(196,5,5,0.1)]'
                  : isUpNext
                  ? 'border-white/10 bg-[#111317]/60 hover:border-white/20'
                  : 'border-white/[0.05] bg-[#0e0f13]/40 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${sc.color}20`, color: sc.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#a1a1a1] flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#666666]" />
                        {sc.company}
                      </span>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
                      ACTIVE
                    </span>
                  ) : isUpNext ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      UP NEXT
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-[#666666] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      LOCKED
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-semibold text-white mb-1.5">
                  {sc.title}
                </h4>
                <p className="text-xs text-[#a1a1a1] leading-relaxed mb-4">
                  {sc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#666666] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {sc.duration}
                </span>

                {isActive ? (
                  <Link
                    href={`/simulate/${sc.id}`}
                    className="text-white hover:text-[#c40505] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Launch War Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-[11px] text-[#666666]">
                    Requires Payment API completion
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
