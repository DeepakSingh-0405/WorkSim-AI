'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Logo } from '@/components/shared/Logo';
import { GlowButton } from '@/components/shared/GlowButton';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { GrainOverlay } from '@/components/shared/GrainOverlay';
import { SkillRadarChart } from '@/components/evaluation/SkillRadarChart';
import { CountUpScore } from '@/components/evaluation/CountUpScore';
import { EvidenceCards } from '@/components/evaluation/EvidenceCards';
import {
  CheckCircle2,
  AlertCircle,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Share2,
  Cpu,
  ShieldCheck,
  Zap,
  Copy,
  Check,
} from 'lucide-react';

export default function EvaluationPage() {
  const [evalData, setEvalData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('worksim_latest_evaluation');
      if (stored) {
        try {
          setEvalData(JSON.parse(stored));
          return;
        } catch {
          // fallback
        }
      }
    }

    // Default mock evaluation data if opened directly
    setEvalData({
      isResolved: true,
      overallScore: 88,
      skillScores: {
        debugging: 92,
        problemSolving: 88,
        communication: 85,
        technicalReasoning: 90,
        prioritization: 84,
      },
      strengths: [
        'Correctly correlated Stripe p99 latency (3200ms) with the premature 2000ms timeout bug in config.ts',
        'Maintained structured incident communication with Priya Sharma in Slack under SLA pressure',
        'Verified patch against the integration test suite in the diagnostic terminal before resolving',
      ],
      improvements: [
        'Could provide interim ETA updates before staging the configuration fix',
        'Consider proposing adaptive timeouts with exponential backoff for extreme traffic surges',
      ],
      managerVerdict:
        'Strong technical instincts and calm execution under SLA deadline pressure. Ready for production on-call rotations.',
      executiveSummary:
        'Candidate identified the root cause in config.ts, verified against upstream logs, and restored payment success rates to 99.8%.',
    });
  }, []);

  const handleCopyBadge = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(
        `🏆 WorkSim Verified: Candidate completed P1 Production Incident with a ${evalData?.overallScore || 88}% Score! https://worksim.dev/evaluation/demo-session`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!evalData) return null;

  const isResolved = evalData.isResolved ?? evalData.overallScore >= 65;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans overflow-x-hidden p-4 sm:p-8">
      <AnimatedBackground />
      <GrainOverlay />

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        {/* Top Navbar */}
        <header className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <Logo size="md" href="/dashboard" />
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyBadge}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span className="text-[#22c55e]">Badge Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#a1a1a1]" />
                  <span>Share Verified Badge</span>
                </>
              )}
            </button>
            {isResolved ? (
              <span className="text-xs font-mono text-[#22c55e] bg-[#22c55e]/10 px-3 py-1.5 rounded-full border border-[#22c55e]/20 flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Incident Resolved
              </span>
            ) : (
              <span className="text-xs font-mono text-[#ef4444] bg-[#ef4444]/10 px-3 py-1.5 rounded-full border border-[#ef4444]/20 flex items-center gap-1.5 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                Incident Unresolved
              </span>
            )}
          </div>
        </header>

        {/* Hero Banner */}
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-[#a1a1a1] mb-3"
          >
            <Award className="w-3.5 h-3.5 text-[#c40505]" />
            <span>Autonomous AI Telemetry Evaluation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-2"
          >
            Workplace Readiness Scorecard
          </motion.h1>
          <p className="text-sm text-[#a1a1a1]">
            TechFlow Inc. — Production Incident: Payment API Failure (#2491)
          </p>
        </div>

        {/* Row 1: Overall Score Dial & Recharts Radar Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Overall Dial & Manager Verdict */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 rounded-2xl border border-white/10 bg-[#111317]/80 backdrop-blur-md p-6 flex flex-col justify-between"
          >
            <div className="text-center">
              <span className="text-xs font-mono uppercase text-[#a1a1a1]">
                Overall Performance Score
              </span>
              <div className="text-6xl font-black text-white mt-4 mb-2 tracking-tight">
                <CountUpScore target={evalData.overallScore} />
                <span className="text-3xl text-[#c40505]">%</span>
              </div>
              {evalData.overallScore >= 80 ? (
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30">
                  Senior Ready
                </span>
              ) : evalData.overallScore >= 65 ? (
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30">
                  Mid-Level Competent
                </span>
              ) : (
                <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30">
                  Needs Improvement
                </span>
              )}
            </div>

            {/* Priya's Verdict */}
            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <span className="text-[11px] font-mono uppercase text-[#666666] block mb-2 font-semibold">
                Manager Assessment (Priya Sharma)
              </span>
              <p className="text-xs text-[#d1d5db] italic leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                "{evalData.managerVerdict}"
              </p>
            </div>
          </motion.div>

          {/* Right Column: Recharts 5-Dimension Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#111317]/80 backdrop-blur-md p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#c40505]" />
                  5-Dimension Skill Radar
                </h3>
                <span className="text-xs font-mono text-[#a1a1a1]">
                  Calibrated against Senior Benchmarks
                </span>
              </div>

              {/* Recharts Component */}
              <SkillRadarChart scores={evalData.skillScores} />
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#a1a1a1]">
              <span>Assessed across Debugging, Tech Reasoning, Problem Solving, Communication, Prioritization</span>
              <span className="font-mono text-[#22c55e]">Verified Telemetry</span>
            </div>
          </motion.div>
        </div>

        {/* Row 2: Action Evidence Artifacts */}
        <EvidenceCards evidence={evalData.evidence} />

        {/* Row 3: Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl border border-white/10 bg-[#111317]/60 p-6"
          >
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
              Key Strengths Demonstrated
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d1d5db]">
              {evalData.strengths.map((str: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl border border-white/10 bg-[#111317]/60 p-6"
          >
            <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Areas for Senior Progression
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d1d5db]">
              {evalData.improvements.map((imp: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{imp}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Row 4: Next Challenge CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-white/10 bg-[#14161d]">
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              Ready for your next simulation?
            </h4>
            <p className="text-xs text-[#a1a1a1]">
              Next mission: PostgreSQL Lock Contention & Deadlock Triage (TechFlow Inc.)
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-medium text-[#a1a1a1] hover:text-white border border-white/10 hover:border-white/20 transition-colors">
                Return to Dashboard
              </button>
            </Link>
            <Link href="/simulate/production-incident-payment-api" className="w-full sm:w-auto">
              <GlowButton size="md" variant="primary" className="w-full sm:w-auto">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Retake Scenario
              </GlowButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
