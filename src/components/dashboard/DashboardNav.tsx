'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/shared/Logo';
import { GlowButton } from '@/components/shared/GlowButton';
import { createClient } from '@/lib/supabase/client';
import {
  LogOut,
  User,
  ShieldCheck,
  Terminal,
  Award,
  Edit2,
  Check,
  X,
  Mail,
} from 'lucide-react';

interface DashboardNavProps {
  userName?: string;
  userEmail?: string;
  readinessScore?: number;
}

export function DashboardNav({
  userName: initialUserName,
  userEmail: initialUserEmail,
  readinessScore = 88,
}: DashboardNavProps) {
  const router = useRouter();
  const [userName, setUserName] = useState<string>(initialUserName || '');
  const [userEmail, setUserEmail] = useState<string>(initialUserEmail || '');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 1. Check localStorage for instant hydration
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('worksim_user_name');
      const storedEmail = localStorage.getItem('worksim_user_email');
      if (storedName) {
        setUserName(storedName);
        setEditingName(storedName);
      }
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }

    // 2. Query Supabase authenticated user session
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const email = data.user.email || 'engineer@techflow.dev';
          const metaName =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name;

          let resolvedName = metaName;
          if (!resolvedName) {
            const local =
              typeof window !== 'undefined'
                ? localStorage.getItem('worksim_user_name')
                : null;
            if (local) {
              resolvedName = local;
            } else {
              // Convert email username to clean display name (e.g. john.doe -> John Doe)
              const prefix = email.split('@')[0];
              resolvedName = prefix
                .split(/[._-]/)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
            }
          }

          setUserName(resolvedName);
          setEditingName(resolvedName);
          setUserEmail(email);

          if (typeof window !== 'undefined') {
            localStorage.setItem('worksim_user_name', resolvedName);
            localStorage.setItem('worksim_user_email', email);
          }
        } else {
          // Guest mode fallback
          setUserName((prev) => {
            if (prev) return prev;
            const local =
              typeof window !== 'undefined'
                ? localStorage.getItem('worksim_user_name')
                : null;
            return local || 'Candidate Engineer';
          });
          setUserEmail((prev) => {
            if (prev) return prev;
            const local =
              typeof window !== 'undefined'
                ? localStorage.getItem('worksim_user_email')
                : null;
            return local || 'candidate@worksim.dev';
          });
        }
      });
    } catch {
      // ignore
    }
  }, [initialUserName, initialUserEmail]);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('worksim_user_name');
      localStorage.removeItem('worksim_user_email');
    }
    router.push('/');
    router.refresh();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editingName.trim();
    if (!trimmed) return;

    setIsSaving(true);
    setUserName(trimmed);

    if (typeof window !== 'undefined') {
      localStorage.setItem('worksim_user_name', trimmed);
      window.dispatchEvent(new Event('worksim_user_updated'));
    }

    try {
      const supabase = createClient();
      await supabase.auth.updateUser({
        data: { full_name: trimmed },
      });
    } catch {
      // ignore
    } finally {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsProfileOpen(false);
      }, 1000);
    }
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'ME';
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase() || 'ME';
  };

  const displayName = userName || 'Candidate Engineer';
  const displayEmail = userEmail || 'candidate@worksim.dev';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a0c10]/85 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo + Breadcrumb */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <span className="hidden sm:inline text-white/20">/</span>
            <span className="hidden sm:inline text-xs font-mono text-[#a1a1a1]">
              Engineering Career Track
            </span>
          </div>

          {/* Center: Readiness Score Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
            <Award className="w-3.5 h-3.5 text-[#c40505]" />
            <span className="text-[#a1a1a1]">Readiness:</span>
            <span className="font-bold text-white">{readinessScore}%</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            <span className="text-[#22c55e] text-[11px]">Senior On-Call Tier</span>
          </div>

          {/* Right: Actions & User Info */}
          <div className="flex items-center gap-3">
            <Link href="/simulate/production-incident-payment-api">
              <GlowButton size="sm" variant="primary" className="text-xs">
                <Terminal className="w-3.5 h-3.5 mr-1.5" />
                Resume Incident
              </GlowButton>
            </Link>

            {/* Dynamic User Profile Badge */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
              <button
                onClick={() => {
                  setEditingName(displayName);
                  setIsProfileOpen(true);
                }}
                className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-white/[0.05] transition-colors text-left group"
                title="Click to edit profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c40505]/40 to-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white group-hover:border-[#c40505]/60 transition-colors">
                  {getInitials(displayName)}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white leading-none group-hover:text-[#fafafa]">
                      {displayName}
                    </span>
                    <Edit2 className="w-2.5 h-2.5 text-[#666666] group-hover:text-white/80 transition-colors" />
                  </div>
                  <span className="text-[10px] text-[#666666] leading-none mt-1 truncate max-w-[150px]">
                    {displayEmail}
                  </span>
                </div>
              </button>

              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="p-1.5 rounded-md text-[#666666] hover:text-[#ef4444] hover:bg-white/[0.05] transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#111317] p-6 shadow-2xl"
            >
              <button
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#666666] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/[0.08]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#c40505]/40 to-white/10 border border-white/20 flex items-center justify-center font-bold text-base text-white">
                  {getInitials(editingName || displayName)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Candidate Profile</h3>
                  <p className="text-xs text-[#a1a1a1] flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
                    Verified Candidate Tier
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1a1] mb-1.5">
                    Display Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2 bg-[#090a0d] border border-white/10 rounded-lg text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#c40505]/60 transition-colors"
                    />
                    <User className="w-4 h-4 text-[#666666] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#a1a1a1] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={displayEmail}
                      className="w-full pl-9 pr-3 py-2 bg-[#090a0d]/60 border border-white/[0.06] rounded-lg text-xs text-[#777777] cursor-not-allowed"
                    />
                    <Mail className="w-4 h-4 text-[#555555] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="px-3 py-1.5 text-xs text-[#a1a1a1] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <GlowButton
                    type="submit"
                    size="sm"
                    variant="primary"
                    disabled={isSaving}
                    className="text-xs"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-[#22c55e]" />
                        Saved!
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </GlowButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
