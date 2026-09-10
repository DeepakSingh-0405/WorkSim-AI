'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { GlowButton } from '@/components/shared/GlowButton';
import { ArrowRight, Terminal, ShieldCheck, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 md:py-28 relative z-10 overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-[#161418] to-[#0d0c0e] p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_80px_rgba(196,5,5,0.15)]"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#c40505]/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-[#a1a1a1] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#c40505]" />
              <span>Free Alpha Access • 30-Minute Scenario</span>
            </div>

            <h3 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
              Stop watching videos.{' '}
              <span className="text-[#c40505]">Start resolving incidents.</span>
            </h3>

            <p className="text-[#a1a1a1] text-base sm:text-lg mb-8 leading-relaxed">
              Step into TechFlow's war room right now. Priya Sharma is waiting in Slack, the payment service is throwing 500 errors, and the timer is running.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/simulate/production-incident-payment-api" className="w-full sm:w-auto">
                <GlowButton size="lg" variant="primary" className="w-full sm:w-auto text-base px-8 py-3.5">
                  <Terminal className="w-4 h-4 mr-2" />
                  Launch Payment Incident Simulator
                  <ArrowRight className="w-4 h-4 ml-2" />
                </GlowButton>
              </Link>
            </div>

            {/* Micro guarantees */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap justify-center items-center gap-6 text-xs text-[#a1a1a1]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" /> No installation or credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Runs 100% in your browser
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Powered by Gemini API
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
