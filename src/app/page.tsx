'use client';

import React from 'react';
import { AnimatedBackground } from '@/components/shared/AnimatedBackground';
import { GrainOverlay } from '@/components/shared/GrainOverlay';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { WorkplacePreview } from '@/components/landing/WorkplacePreview';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { ScrollOrchestrator } from '@/components/landing/ScrollOrchestrator';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#fafafa] overflow-x-hidden selection:bg-[#c40505]/30 selection:text-white">
      {/* Background Interactive Layer */}
      <AnimatedBackground />
      <GrainOverlay />

      {/* Navigation Header */}
      <Navbar />

      {/* GSAP Scroll-Driven Animation Orchestrator */}
      <ScrollOrchestrator>
        {/* Page Sections with dividers */}
        <main className="relative z-10 flex flex-col">
          <Hero />

          <div className="section-divider max-w-4xl mx-auto w-full" aria-hidden="true" />
          <WorkplacePreview />

          <div className="section-divider max-w-4xl mx-auto w-full" aria-hidden="true" />
          <FeaturesGrid />

          <div className="section-divider max-w-4xl mx-auto w-full" aria-hidden="true" />
          <HowItWorks />

          <div className="section-divider max-w-4xl mx-auto w-full" aria-hidden="true" />
          <ComparisonSection />

          <div className="section-divider max-w-4xl mx-auto w-full" aria-hidden="true" />
          <CTASection />
        </main>

        {/* Footer */}
        <Footer />
      </ScrollOrchestrator>
    </div>
  );
}
