'use client';

import React from 'react';
import { motion } from 'motion/react';
import { FileCode2, Terminal, MessageSquare, Activity, Check } from 'lucide-react';

interface EvidenceItem {
  type: 'log' | 'code' | 'slack' | 'terminal';
  title: string;
  timestamp: string;
  snippet: string;
  impact: string;
}

const DEFAULT_EVIDENCE: EvidenceItem[] = [
  {
    type: 'log',
    title: 'Isolated Latency Conflict in Telemetry',
    timestamp: '02:14:58',
    snippet: 'INFO stripe-adapter: Stripe API average response time: 3200ms (p99: 4800ms)',
    impact: 'Identified that 2000ms timeout choked under realistic upstream gateway latency.',
  },
  {
    type: 'code',
    title: 'Hotfixed Runtime Configuration in config.ts',
    timestamp: '02:22:15',
    snippet: 'PAYMENT_CONFIG.timeout: 2000ms -> 5000ms',
    impact: 'Provided +1800ms headroom above Stripe p99 latency to prevent premature failure.',
  },
  {
    type: 'terminal',
    title: 'Verified Fix with Integration Test Suite',
    timestamp: '02:24:40',
    snippet: '$ npm test -> Tests: 3 passed, 0 failed (chargePayment handles slow Stripe latency)',
    impact: 'Ensured regression-free deployment prior to submitting resolution.',
  },
  {
    type: 'slack',
    title: 'Proactive Incident Channel Briefing',
    timestamp: '02:25:02',
    snippet: '"Priya: timeout adjusted to 5000ms and verified via test suite. Error rate stabilizing."',
    impact: 'Met manager communication standard under active SLA time pressure.',
  },
];

export function EvidenceCards({ evidence }: { evidence?: EvidenceItem[] }) {
  const items = evidence && evidence.length > 0 ? evidence : DEFAULT_EVIDENCE;

  const getIcon = (type: EvidenceItem['type']) => {
    switch (type) {
      case 'log':
        return <Activity className="w-4 h-4 text-[#3b82f6]" />;
      case 'code':
        return <FileCode2 className="w-4 h-4 text-[#22c55e]" />;
      case 'terminal':
        return <Terminal className="w-4 h-4 text-yellow-400" />;
      case 'slack':
        return <MessageSquare className="w-4 h-4 text-[#c40505]" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div>
          <span className="text-[11px] font-mono uppercase text-[#666666] font-semibold">
            Action Log Evidence
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Key Evaluation Artifacts
          </h3>
        </div>
        <span className="text-xs text-[#22c55e] font-mono flex items-center gap-1">
          <Check className="w-3.5 h-3.5" /> {items.length} Evaluated Signals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => {
          const isWarning =
            item.impact.toLowerCase().includes('fail') ||
            item.impact.toLowerCase().includes('risk') ||
            item.impact.toLowerCase().includes('unresolved') ||
            item.impact.toLowerCase().includes('blackout') ||
            item.impact.toLowerCase().includes('not executed');

          return (
            <motion.div
              key={item.title + index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="rounded-xl border border-white/10 bg-[#111318]/70 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#666666]">
                    {item.timestamp}
                  </span>
                </div>

                <div className="bg-[#090a0d] border border-white/[0.06] rounded-lg p-2.5 font-mono text-[11px] text-[#a1a1a1] mb-2 overflow-x-auto whitespace-nowrap">
                  {item.snippet}
                </div>
              </div>

              <p
                className={`text-[11px] flex items-center gap-1 mt-2 ${
                  isWarning ? 'text-amber-400' : 'text-[#22c55e]'
                }`}
              >
                <span>● {item.impact}</span>
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
