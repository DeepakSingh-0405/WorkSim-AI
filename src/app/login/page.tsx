'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Logo } from '@/components/shared/Logo';
import { GlowButton } from '@/components/shared/GlowButton';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { GrainOverlay } from '@/components/shared/GrainOverlay';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, Terminal } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        if (typeof window !== 'undefined') {
          const metaName = data?.user?.user_metadata?.full_name || data?.user?.user_metadata?.name;
          if (metaName) {
            localStorage.setItem('worksim_user_name', metaName);
          } else if (!localStorage.getItem('worksim_user_name')) {
            const prefix = email.split('@')[0];
            const clean = prefix
              .split(/[._-]/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            localStorage.setItem('worksim_user_name', clean);
          }
          localStorage.setItem('worksim_user_email', email.trim());
        }
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = () => {
    // Allows judges to immediately bypass login to test simulation
    router.push('/simulate/production-incident-payment-api');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a] text-[#fafafa] overflow-hidden">
      <AnimatedBackground />
      <GrainOverlay />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#111317]/90 p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Logo size="md" />
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign in to WorkSim
          </h2>
          <p className="text-xs text-[#a1a1a1] mt-1">
            Access your workplace simulations and performance radar
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs text-[#ef4444] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#a1a1a1] mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="engineer@company.com"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0a0a0c] border border-white/10 text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#c40505] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-[#a1a1a1]">
                Password
              </label>
              <span className="text-[11px] text-[#666666] hover:text-[#a1a1a1] cursor-pointer">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0a0a0c] border border-white/10 text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#c40505] transition-colors"
              />
            </div>
          </div>

          <GlowButton
            type="submit"
            size="md"
            variant="primary"
            loading={loading}
            className="w-full justify-center mt-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </GlowButton>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.08]" />
          </div>
          <span className="relative bg-[#111317] px-3 text-[11px] font-mono text-[#666666] uppercase">
            Fast Track For Evaluators
          </span>
        </div>

        {/* Instant Access Button */}
        <button
          type="button"
          onClick={handleGuestAccess}
          className="w-full h-10 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-medium text-white hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center gap-2"
        >
          <Terminal className="w-3.5 h-3.5 text-[#22c55e]" />
          <span>Launch Simulation as Guest Evaluator</span>
        </button>

        {/* Signup Redirect Footer */}
        <div className="mt-6 text-center text-xs text-[#a1a1a1]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-white hover:text-[#c40505] font-medium transition-colors">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
