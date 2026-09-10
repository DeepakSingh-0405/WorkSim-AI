'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  FileCode2,
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { GlowButton } from '@/components/shared/GlowButton';

type PreviewStep = 'slack' | 'logs' | 'code' | 'evaluation';

export function WorkplacePreview() {
  const [activeStep, setActiveStep] = useState<PreviewStep>('slack');
  const [autoCycle, setAutoCycle] = useState(true);

  // Auto-cycle tabs every 5 seconds unless user manually clicked
  useEffect(() => {
    if (!autoCycle) return;
    const steps: PreviewStep[] = ['slack', 'logs', 'code', 'evaluation'];
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const nextIndex = (steps.indexOf(prev) + 1) % steps.length;
        return steps[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [autoCycle]);

  return (
    <section id="preview" className="py-16 md:py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#c40505] mb-2 font-semibold">
            Interactive Workspace Preview
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-[#fafafa] tracking-tight mb-4">
            Look inside a high-stakes incident.
          </h3>
          <p className="text-[#a1a1a1] text-base leading-relaxed">
            Every simulation combines autonomous AI managers, real codebases, simulated production terminals, and automated telemetry.
          </p>

          {/* Stepper Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              { id: 'slack', label: '1. AI Manager Briefing', icon: MessageSquare },
              { id: 'logs', label: '2. Live Log Analysis', icon: Activity },
              { id: 'code', label: '3. Monaco Hotfix & Tests', icon: FileCode2 },
              { id: 'evaluation', label: '4. Verified Radar Output', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeStep === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveStep(tab.id as PreviewStep);
                    setAutoCycle(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                      : 'bg-[#111111] text-[#a1a1a1] border border-white/5 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c40505]' : 'text-[#666666]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Browser / Workspace Container */}
        <div className="rounded-xl border border-white/10 bg-[#0d0f12] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Workspace Titlebar */}
          <div className="bg-[#14171d] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
              <div className="w-3 h-3 rounded-full bg-[#eab308]/80" />
              <div className="w-3 h-3 rounded-full bg-[#22c55e]/80" />
              <span className="text-xs font-mono text-[#a1a1a1] ml-3 hidden sm:inline">
                TechFlow Inc. — Production Incident Workspace (#2491)
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-[#ef4444] bg-[#ef4444]/10 px-2.5 py-0.5 rounded border border-[#ef4444]/20">
                <Flame className="w-3 h-3" />
                <span>SEV-1 ACTIVE</span>
              </div>
              <div className="flex items-center gap-1 text-[#fafafa] bg-white/[0.05] px-2.5 py-0.5 rounded border border-white/10">
                <Clock className="w-3 h-3 text-[#a1a1a1]" />
                <span>28:44</span>
              </div>
            </div>
          </div>

          {/* Dynamic Content Area based on Active Tab */}
          <div className="p-4 sm:p-6 min-h-[420px] bg-[#0b0c10] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeStep === 'slack' && (
                <motion.div
                  key="slack"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {/* Channels Sidebar Mock */}
                  <div className="bg-[#111318] border border-white/[0.06] rounded-lg p-3 hidden md:block">
                    <div className="text-xs font-semibold text-[#fafafa] mb-3 px-2">Channels</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between px-2 py-1.5 rounded bg-[#c40505]/15 text-white font-medium border border-[#c40505]/30">
                        <span># incident-response</span>
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                      </div>
                      <div className="px-2 py-1.5 text-[#a1a1a1] hover:text-white cursor-pointer">
                        # engineering
                      </div>
                      <div className="px-2 py-1.5 text-[#a1a1a1] hover:text-white cursor-pointer">
                        # payment-service
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-[#fafafa] mt-6 mb-3 px-2">Teammates</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 px-2 text-[#fafafa]">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                        <span>Priya Sharma (EM)</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 text-[#a1a1a1]">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                        <span>Alex Chen (Senior SWE)</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="md:col-span-2 bg-[#111318] border border-white/[0.06] rounded-lg p-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Priya Message */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c40505]/20 border border-[#c40505]/40 flex items-center justify-center font-bold text-xs text-[#fafafa]">
                          PS
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-[#fafafa]">Priya Sharma</span>
                            <span className="text-[10px] text-[#666666]">Engineering Manager • 02:16 AM</span>
                          </div>
                          <div className="text-xs text-[#d1d5db] bg-white/[0.03] p-3 rounded-lg border border-white/[0.05] leading-relaxed">
                            @channel Payment charge failure rate jumped to 42% right after deployment <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">v2.4.1</code>. Stripe webhook processing is backing up. SLA breach will trigger in 30 minutes. Who is leading triage?
                          </div>
                        </div>
                      </div>

                      {/* Candidate Message */}
                      <div className="flex items-start gap-3 pl-8">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-xs text-[#fafafa]">
                          YOU
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-white">You</span>
                            <span className="text-[10px] text-[#666666]">Just now</span>
                          </div>
                          <div className="text-xs text-[#d1d5db] bg-blue-950/20 p-3 rounded-lg border border-blue-800/30 leading-relaxed">
                            I am on it Priya. Pulling the deployment diff and inspecting recent timeout logs on <code className="bg-white/10 px-1 py-0.5 rounded text-white font-mono">/api/payments/charge</code> right now.
                          </div>
                        </div>
                      </div>

                      {/* Alex Typing Indicator */}
                      <div className="flex items-center gap-2 text-xs text-[#a1a1a1] italic pl-11">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                        <span>Alex Chen is typing...</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#a1a1a1]">
                      <span>Autonomous multi-agent simulation powered by Gemini API</span>
                      <span className="text-[#22c55e] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Live Context Injection
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 'logs' && (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#0e1015] border border-white/[0.08] rounded-lg p-4 font-mono text-xs overflow-x-auto space-y-2 leading-relaxed"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 mb-3 text-[11px] text-[#666666]">
                    <span>STREAMING: payment-service-prod-ap-northeast-2</span>
                    <span className="text-[#ef4444] font-semibold">FILTER: status &gt;= 500</span>
                  </div>
                  <p className="text-[#a1a1a1]">
                    [2026-09-10 02:14:58] <span className="text-[#3b82f6]">INFO</span> stripe-adapter - Stripe API p99 response time: 3200ms
                  </p>
                  <p className="text-[#a1a1a1]">
                    [2026-09-10 02:15:00] <span className="text-[#3b82f6]">INFO</span> payment-service - Config loaded:{' '}
                    <span className="text-yellow-400 font-bold bg-yellow-400/10 px-1 py-0.5 rounded">PAYMENT_TIMEOUT=2000ms</span>, RETRY_COUNT=3
                  </p>
                  <p className="text-[#ef4444] bg-[#ef4444]/10 p-1.5 rounded border border-[#ef4444]/20">
                    [2026-09-10 02:15:03] <span className="font-bold">ERROR</span> payment-service - Request to /api/payments/charge failed: TimeoutError: operation timed out after 2000ms
                  </p>
                  <p className="text-[#a1a1a1] pl-4">
                    at Timeout._onTimeout (/services/payment/client.ts:42:15) | txn_id=txn_8f2a99
                  </p>
                  <p className="text-yellow-400">
                    [2026-09-10 02:15:05] <span className="font-bold">WARN</span> payment-service - Retry attempt 1/3 failed after 2000ms
                  </p>
                  <p className="text-[#ef4444] bg-[#ef4444]/10 p-1.5 rounded border border-[#ef4444]/20">
                    [2026-09-10 02:15:09] <span className="font-bold">FATAL</span> payment-service - All 3 retries exhausted. Returning HTTP 500 to gateway.
                  </p>
                  <div className="pt-3 text-[11px] text-[#22c55e] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Candidate clue detected: The Stripe p99 latency (3200ms) exceeds the new 2000ms timeout!</span>
                  </div>
                </motion.div>
              )}

              {activeStep === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs"
                >
                  {/* Monaco Mock Editor */}
                  <div className="bg-[#111318] border border-white/[0.08] rounded-lg p-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-3 text-[11px]">
                      <span className="text-[#fafafa] font-medium flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-[#3b82f6]" />
                        config.ts
                      </span>
                      <span className="text-yellow-400 text-[10px]">Uncommitted Changes</span>
                    </div>
                    <div className="space-y-1 text-[#d1d5db] leading-relaxed">
                      <p className="text-[#666666]">1  export const PAYMENT_CONFIG = &#123;</p>
                      <p className="text-[#ef4444] bg-[#ef4444]/15 px-1 py-0.5 rounded line-through">
                        2 -  timeout: 2000, // Bug introduced in v2.4.1
                      </p>
                      <p className="text-[#22c55e] bg-[#22c55e]/15 px-1 py-0.5 rounded font-bold">
                        2 +  timeout: 5000, // Safe headroom for Stripe p99
                      </p>
                      <p className="text-[#666666]">3    retryCount: 3,</p>
                      <p className="text-[#666666]">4    retryDelay: 1000,</p>
                      <p className="text-[#666666]">5  &#125;;</p>
                    </div>
                  </div>

                  {/* Terminal Execution */}
                  <div className="bg-[#0b0c10] border border-white/[0.08] rounded-lg p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 pb-2 border-b border-white/[0.06] mb-3 text-[11px] text-[#a1a1a1]">
                        <Terminal className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span>Interactive Terminal</span>
                      </div>
                      <div className="space-y-1.5 text-[11px]">
                        <p className="text-white">$ npm test</p>
                        <p className="text-[#a1a1a1]">&gt; Running payment-service integration suite...</p>
                        <p className="text-[#22c55e]">✓ chargePayment succeeds with valid payload (41ms)</p>
                        <p className="text-[#22c55e]">✓ chargePayment handles 3200ms Stripe latency (3210ms)</p>
                        <p className="text-[#22c55e]">✓ retry backoff logic conforms to SLA (104ms)</p>
                        <p className="text-[#fafafa] font-bold mt-2">
                          Tests: <span className="text-[#22c55e]">3 passed</span>, 0 failed
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#22c55e]">
                      <span>● Ready for Pull Request verification</span>
                      <span className="text-white underline cursor-pointer">Submit Hotfix</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 'evaluation' && (
                <motion.div
                  key="evaluation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#111318] border border-white/[0.08] rounded-lg p-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Overall Score Dial */}
                    <div className="text-center md:border-r md:border-white/[0.08] pr-0 md:pr-6">
                      <span className="text-xs font-mono uppercase text-[#a1a1a1]">Overall Readiness</span>
                      <div className="text-5xl font-black text-white mt-2 mb-1 tracking-tight">88<span className="text-2xl text-[#c40505]">%</span></div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Incident Resolved in 18m
                      </span>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="space-y-2.5 text-xs">
                      <div>
                        <div className="flex justify-between text-[#fafafa] mb-1">
                          <span>Root Cause Debugging</span>
                          <span className="font-mono text-[#22c55e]">92/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#22c55e] w-[92%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[#fafafa] mb-1">
                          <span>Manager Communication</span>
                          <span className="font-mono text-[#3b82f6]">85/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#3b82f6] w-[85%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[#fafafa] mb-1">
                          <span>Code Quality & Headroom</span>
                          <span className="font-mono text-[#eab308]">88/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#eab308] w-[88%]" />
                        </div>
                      </div>
                    </div>

                    {/* Key Manager Takeaway */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 text-xs">
                      <span className="font-mono text-[#a1a1a1] text-[10px] block mb-1">Priya Sharma's Evaluation</span>
                      <p className="text-[#d1d5db] leading-relaxed italic">
                        "Fast triage of the timeout anomaly under time pressure. Excellent communication in the incident channel before modifying code."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Action Footer of Preview */}
          <div className="bg-[#14171d] px-6 py-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-[#a1a1a1]">
              Ready to take on this exact incident yourself?
            </span>
            <Link href="/simulate/production-incident-payment-api">
              <GlowButton size="sm" variant="primary">
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Launch This Scenario (30 mins)
              </GlowButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
