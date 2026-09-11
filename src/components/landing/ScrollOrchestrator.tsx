'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface ScrollOrchestratorProps {
  children: React.ReactNode;
}

export function ScrollOrchestrator({ children }: ScrollOrchestratorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize Lenis smooth scroll
    let lenis: Lenis | null = null;
    let lenisRaf: ((time: number) => void) | null = null;
    let handleAnchorClick: ((e: MouseEvent) => void) | null = null;

    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.8,
      });

      // Synchronize ScrollTrigger with Lenis
      lenis.on('scroll', ScrollTrigger.update);

      lenisRaf = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(lenisRaf);
      gsap.ticker.lagSmoothing(0);

      // Intercept anchor hash clicks for ultra-smooth easing
      handleAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (href && href.length > 1) {
          const el = document.querySelector(href);
          if (el) {
            e.preventDefault();
            lenis?.scrollTo(el as HTMLElement, { offset: -70, duration: 1.2 });
          }
        }
      };

      document.addEventListener('click', handleAnchorClick);
    }

    const container = containerRef.current;
    if (!container) {
      return () => {
        if (handleAnchorClick) document.removeEventListener('click', handleAnchorClick);
        if (lenisRaf) gsap.ticker.remove(lenisRaf);
        lenis?.destroy();
      };
    }

    const ctx = gsap.context(() => {
      // ============================================
      // HERO — Parallax depth layers + fade-out
      // ============================================
      const heroSection = container.querySelector('[data-section="hero"]');
      if (heroSection) {
        // Parallax layers at different scroll speeds
        gsap.utils.toArray<HTMLElement>('[data-parallax-speed]').forEach((el) => {
          const speed = parseFloat(el.dataset.parallaxSpeed || '0.5');
          gsap.to(el, {
            yPercent: -(speed * 80),
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        });

        // Hero fade-out + scale-down as user scrolls past
        gsap.to(heroSection, {
          opacity: 0,
          scale: 0.95,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: '60% top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      // ============================================
      // WORKPLACE PREVIEW — 3D perspective reveal
      // ============================================
      const previewSection = container.querySelector('[data-section="preview"]');
      const previewCard = container.querySelector('[data-preview-card]');
      if (previewSection && previewCard) {
        gsap.fromTo(
          previewCard,
          { rotateX: 6, y: 60, opacity: 0, transformPerspective: 1200 },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: previewSection,
              start: 'top 80%',
              end: 'top 30%',
              scrub: 0.6,
            },
          }
        );
      }

      // ============================================
      // FEATURES GRID — Cascading waterfall stagger
      // ============================================
      const featuresSection = container.querySelector('[data-section="features"]');
      if (featuresSection) {
        const featureCards = featuresSection.querySelectorAll('[data-feature-card]');
        featureCards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { y: 60 + index * 10, opacity: 0, scale: 0.97 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 55%',
                scrub: 0.4,
              },
            }
          );
        });
      }

      // ============================================
      // HOW IT WORKS — SVG path draw + step reveal
      // ============================================
      const howSection = container.querySelector('[data-section="how-it-works"]');
      if (howSection) {
        const path = howSection.querySelector('[data-connect-path]') as SVGPathElement;
        if (path) {
          const pathLength = path.getTotalLength();
          gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: howSection,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: 0.8,
            },
          });
        }

        // Traveling dot along the path
        const dot = howSection.querySelector('[data-path-dot]');
        if (dot && path) {
          gsap.to(dot, {
            motionPath: {
              path: path,
              align: path,
              alignOrigin: [0.5, 0.5],
            },
            ease: 'none',
            scrollTrigger: {
              trigger: howSection,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: 0.8,
            },
          });
        }

        // Step cards stagger
        const stepCards = howSection.querySelectorAll('[data-step-card]');
        stepCards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                end: 'top 60%',
                scrub: 0.4,
              },
            }
          );
        });
      }

      // ============================================
      // COMPARISON — Horizontal slide-in
      // ============================================
      const compSection = container.querySelector('[data-section="comparison"]');
      if (compSection) {
        const leftCol = compSection.querySelector('[data-comp-left]');
        const rightCol = compSection.querySelector('[data-comp-right]');

        if (leftCol) {
          gsap.fromTo(
            leftCol,
            { x: -80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: compSection,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 0.5,
              },
            }
          );
        }
        if (rightCol) {
          gsap.fromTo(
            rightCol,
            { x: 80, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: compSection,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 0.5,
              },
            }
          );
        }
      }

      // ============================================
      // CTA — Pin and zoom
      // ============================================
      const ctaSection = container.querySelector('[data-section="cta"]');
      const ctaCard = container.querySelector('[data-cta-card]');
      if (ctaSection && ctaCard) {
        gsap.fromTo(
          ctaCard,
          { scale: 0.92, opacity: 0.7 },
          {
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: ctaSection,
              start: 'top 70%',
              end: 'top 20%',
              scrub: 0.5,
            },
          }
        );
      }

      // ============================================
      // FOOTER — Simple fade up
      // ============================================
      const footer = container.querySelector('[data-section="footer"]');
      if (footer) {
        gsap.fromTo(
          footer,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footer,
              start: 'top 95%',
              end: 'top 70%',
              scrub: 0.3,
            },
          }
        );
      }

      // ============================================
      // SECTION DIVIDERS — Glow fade-in
      // ============================================
      gsap.utils.toArray<HTMLElement>('.section-divider').forEach((div) => {
        gsap.fromTo(
          div,
          { opacity: 0, scaleX: 0.3 },
          {
            opacity: 1,
            scaleX: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: div,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 0.3,
            },
          }
        );
      });
    }, container);

    return () => {
      if (handleAnchorClick) document.removeEventListener('click', handleAnchorClick);
      if (lenisRaf) gsap.ticker.remove(lenisRaf);
      lenis?.destroy();
      ctx.revert();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
