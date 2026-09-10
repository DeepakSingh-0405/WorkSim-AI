'use client';

import React from 'react';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { GrainOverlay } from '@/components/shared/GrainOverlay';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { CurrentMission } from '@/components/dashboard/CurrentMission';
import { SkillProfile } from '@/components/dashboard/SkillProfile';
import { ScenarioList } from '@/components/dashboard/ScenarioList';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#fafafa] font-sans overflow-x-hidden selection:bg-[#c40505]/30 selection:text-white">
      {/* Background Ambience */}
      <AnimatedBackground />
      <GrainOverlay />

      {/* Top Sticky Header */}
      <DashboardNav />

      {/* Dashboard Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Row 1: Active Mission (2 cols on large screens) + Verified Skill Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CurrentMission />
          </div>
          <div className="lg:col-span-1">
            <SkillProfile />
          </div>
        </div>

        {/* Row 2: Scenario Catalog */}
        <div className="pt-4">
          <ScenarioList />
        </div>

        {/* Row 3: Audit Trail & Historical Runs */}
        <div className="pt-4">
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
