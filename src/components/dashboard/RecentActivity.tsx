'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { getEvaluationHistory, subscribeScoreUpdates, EvaluationRecord } from '@/lib/scores';

export function RecentActivity() {
  const [sessions, setSessions] = useState<EvaluationRecord[]>([]);

  useEffect(() => {
    setSessions(getEvaluationHistory());
    const unsubscribe = subscribeScoreUpdates((metrics) => {
      setSessions(metrics.history);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div>
          <span className="text-[11px] font-mono uppercase text-[#666666] font-semibold">
            Audit Trail
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Recent Simulation History
          </h3>
        </div>
        <span className="text-xs text-[#a1a1a1]">
          {sessions.length} Recorded {sessions.length === 1 ? 'Run' : 'Runs'}
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((sess) => {
          const isSuccess = sess.status === 'Resolved' || sess.score >= 80;
          return (
            <div
              key={sess.id}
              className="rounded-xl border border-white/10 bg-[#111318]/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                    isSuccess
                      ? 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#22c55e]'
                      : 'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]'
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white">
                      {sess.scenarioTitle}
                    </h4>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                        isSuccess
                          ? 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30'
                          : 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30'
                      }`}
                    >
                      {sess.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#a1a1a1]">
                    <span>{sess.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3 h-3 text-[#666666]" />
                      {sess.resolvedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-[#666666]" />
                      {sess.duration}
                    </span>
                    <span>•</span>
                    <span
                      className={`flex items-center gap-1 font-mono text-[11px] ${
                        isSuccess ? 'text-[#22c55e]' : 'text-amber-400'
                      }`}
                    >
                      {sess.testsPassed}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/[0.06]">
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-[#666666] block">
                    Score
                  </span>
                  <span
                    className={`text-lg font-bold font-mono ${
                      isSuccess ? 'text-white' : 'text-amber-400'
                    }`}
                  >
                    {sess.score}%
                  </span>
                </div>

                <Link
                  href="/evaluation/demo-session"
                  className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Scorecard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
