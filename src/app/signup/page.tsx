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
import { ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        if (typeof window !== 'undefined') {
          localStorage.setItem('worksim_user_name', fullName.trim());
          localStorage.setItem('worksim_user_email', email.trim());
        }
        setSuccessMsg('Account created! Please check your email to verify or sign in.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
            Create your WorkSim Account
          </h2>
          <p className="text-xs text-[#a1a1a1] mt-1">
            Start solving simulated production incidents and building your radar profile
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs text-[#ef4444] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/30 text-xs text-[#22c55e] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#a1a1a1] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Mercer"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#0a0a0c] border border-white/10 text-sm text-white placeholder:text-[#666666] focus:outline-none focus:border-[#c40505] transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-xs font-medium text-[#a1a1a1] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </GlowButton>
        </form>

        {/* Login redirect */}
        <div className="mt-6 text-center text-xs text-[#a1a1a1]">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:text-[#c40505] font-medium transition-colors">
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
