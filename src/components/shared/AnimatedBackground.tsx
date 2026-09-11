'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  isRed: boolean;
  pulseSpeed: number;
  pulsePhase: number;
  tailLength: number;
}

interface PulsePacket {
  fromNode: Node;
  toNode: Node;
  progress: number;
  speed: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const scrollRef = useRef({ progress: 0, delta: 0, lastY: 0 });
  const ripplesRef = useRef<Ripple[]>([]);
  const reducedMotionRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { ...mouseRef.current, active: false };
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    ripplesRef.current.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 360,
      opacity: 0.75,
    });
  }, []);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const delta = currentY - scrollRef.current.lastY;

    scrollRef.current = {
      progress: currentY / maxScroll,
      delta: Math.max(-50, Math.min(50, delta)),
      lastY: currentY,
    };
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = prefersReduced.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    prefersReduced.addEventListener('change', handleMotionChange);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let isVisible = true;
    let gridOffsetX = 0;
    let gridOffsetY = 0;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) lastTime = performance.now();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Particle nodes definition
    const nodeCount = Math.min(Math.max(Math.floor((width * height) / 18000), 50), 90);
    let nodes: Node[] = [];
    const pulses: PulsePacket[] = [];
    let lastPulseSpawn = performance.now();

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const isRed = Math.random() < 0.3;
        // Prominent, well-sized circular particles
        const baseRadius = isRed ? 3.5 + Math.random() * 2.5 : 2.2 + Math.random() * 2.0;
        const x = Math.random() * width;
        const y = Math.random() * height;
        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: baseRadius,
          baseRadius,
          isRed,
          pulseSpeed: 1.5 + Math.random() * 2,
          pulsePhase: Math.random() * Math.PI * 2,
          tailLength: isRed ? 8 : 4,
        });
      }
    };

    initNodes();

    let scrollDecayDelta = 0;

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;

      if (reducedMotionRef.current) {
        ctx.fillStyle = '#070709';
        ctx.fillRect(0, 0, width, height);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const mouse = mouseRef.current;
      const scrollProgress = scrollRef.current.progress;

      // Smooth scroll delta dampening
      scrollDecayDelta = scrollDecayDelta * 0.92 + scrollRef.current.delta * 0.08;
      scrollRef.current.delta *= 0.85;

      // ============================================
      // 1. BASE BACKGROUND & ATMOSPHERIC NEBULA GLOW
      // ============================================
      // Deep dark space base
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      // Top Primary Crimson Nebula (shifts with scroll)
      const topGlowY = height * 0.2 - scrollProgress * height * 0.15;
      const topGrd = ctx.createRadialGradient(
        width * 0.5,
        topGlowY,
        0,
        width * 0.5,
        topGlowY,
        Math.max(width * 0.65, 500)
      );
      topGrd.addColorStop(0, `rgba(220, 20, 20, ${0.16 + scrollProgress * 0.06})`);
      topGrd.addColorStop(0.4, `rgba(180, 10, 10, ${0.08 + scrollProgress * 0.04})`);
      topGrd.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = topGrd;
      ctx.fillRect(0, 0, width, height);

      // Secondary Mid/Lower Ambient Aurora (cyan/violet or deep crimson hue based on section)
      const lowerGlowY = height * 0.75 - scrollProgress * height * 0.2;
      const lowerGrd = ctx.createRadialGradient(
        width * (0.3 + scrollProgress * 0.4),
        lowerGlowY,
        0,
        width * (0.3 + scrollProgress * 0.4),
        lowerGlowY,
        Math.max(width * 0.5, 400)
      );
      lowerGrd.addColorStop(0, `rgba(196, 5, 5, ${0.12 + (1 - scrollProgress) * 0.06})`);
      lowerGrd.addColorStop(0.5, 'rgba(120, 10, 40, 0.04)');
      lowerGrd.addColorStop(1, 'rgba(6, 6, 8, 0)');
      ctx.fillStyle = lowerGrd;
      ctx.fillRect(0, 0, width, height);

      // ============================================
      // 2. HIGH-TECH GRID & CROSSHAIRS
      // ============================================
      const gridSpacing = 70;
      gridOffsetX = (gridOffsetX + 0.08) % gridSpacing;
      gridOffsetY = (gridOffsetY + 0.05 + scrollDecayDelta * 0.02) % gridSpacing;

      // Subtle fine grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = gridOffsetX; x < width; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = gridOffsetY; y < height; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Tactical Crosshairs (+) at double spacing intervals
      const crosshairSpacing = gridSpacing * 2;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.28)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = gridOffsetX + gridSpacing; x < width; x += crosshairSpacing) {
        for (let y = gridOffsetY + gridSpacing; y < height; y += crosshairSpacing) {
          ctx.moveTo(x - 5, y);
          ctx.lineTo(x + 5, y);
          ctx.moveTo(x, y - 5);
          ctx.lineTo(x, y + 5);
        }
      }
      ctx.stroke();

      // ============================================
      // 3. CURSOR GLOW ORB & GRAVITY
      // ============================================
      if (mouse.active) {
        const cursorRadius = 190;
        const mouseGrd = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          cursorRadius
        );
        mouseGrd.addColorStop(0, 'rgba(239, 68, 68, 0.11)');
        mouseGrd.addColorStop(0.35, 'rgba(220, 20, 20, 0.05)');
        mouseGrd.addColorStop(0.75, 'rgba(180, 10, 10, 0.015)');
        mouseGrd.addColorStop(1, 'rgba(180, 10, 10, 0)');
        ctx.fillStyle = mouseGrd;
        ctx.fillRect(
          mouse.x - cursorRadius,
          mouse.y - cursorRadius,
          cursorRadius * 2,
          cursorRadius * 2
        );

        // Soft cursor halo ring
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.20)';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // ============================================
      // 4. NODES PHYSICS & PARALLAX SCROLL DRIFT
      // ============================================
      const scrollImpulse = scrollDecayDelta * 0.35;
      const connectionMaxDist = 210;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Intrinsic drift
        node.x += node.vx;
        node.y += node.vy;

        // Scroll parallax drift: scrolling down causes stars/nodes to fly upward
        node.y -= scrollImpulse;

        // Wrap around viewport edges seamlessly
        if (node.x < -20) node.x = width + 20;
        else if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        else if (node.y > height + 20) node.y = -20;

        // Mouse magnetic pull
        if (mouse.active) {
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          const attractRadius = 220;

          if (mdist < attractRadius && mdist > 8) {
            const force = (1 - mdist / attractRadius) * 0.9;
            node.vx += (mdx / mdist) * force * dt * 25;
            node.vy += (mdy / mdist) * force * dt * 25;
          }
        }

        // Friction damping
        node.vx *= 0.97;
        node.vy *= 0.97;

        // Breathing pulse animation
        node.pulsePhase += node.pulseSpeed * dt;
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.9;

        // Proximity glow multiplier (subtle)
        let cursorProximity = 0;
        if (mouse.active) {
          const cdx = mouse.x - node.x;
          const cdy = mouse.y - node.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          cursorProximity = Math.max(0, 1 - cdist / 190) * 0.6;
        }

        // Velocity tail (ensures particles feel elongated and dynamic during motion)
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 0.4 || Math.abs(scrollImpulse) > 1) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(
            node.x - node.vx * node.tailLength,
            node.y - (node.vy + scrollImpulse * 0.5) * node.tailLength
          );
          ctx.strokeStyle = node.isRed
            ? 'rgba(239, 68, 68, 0.35)'
            : 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = node.radius * 0.6;
          ctx.stroke();
        }

        // Draw particle node
        const renderRadius = Math.max(node.radius + cursorProximity * 2.2, 1.8);
        ctx.beginPath();
        ctx.arc(node.x, node.y, renderRadius, 0, Math.PI * 2);

        if (node.isRed) {
          const alpha = 0.75 + cursorProximity * 0.25;
          ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
          ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
          ctx.shadowBlur = 16 + cursorProximity * 16;
          ctx.fill();

          // Bright center core for intense shine
          ctx.beginPath();
          ctx.arc(node.x, node.y, renderRadius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.shadowBlur = 0;
          ctx.fill();
        } else {
          const alpha = 0.55 + cursorProximity * 0.35;
          ctx.fillStyle = `rgba(240, 240, 245, ${alpha})`;
          ctx.shadowColor = cursorProximity > 0.2 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 255, 255, 0.4)';
          ctx.shadowBlur = cursorProximity > 0.2 ? 14 : 8;
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;

      // ============================================
      // 5. NETWORK CONNECTIONS (Longer, Brighter Links)
      // ============================================
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionMaxDist) {
            const baseAlpha = (1 - dist / connectionMaxDist) * 0.32;

            let connCursorBoost = 0;
            if (mouse.active) {
              const midX = (nodes[i].x + nodes[j].x) / 2;
              const midY = (nodes[i].y + nodes[j].y) / 2;
              const cmDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
              connCursorBoost = Math.max(0, 1 - cmDist / 190) * 0.22;
            }

            const alpha = baseAlpha + connCursorBoost;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            if (nodes[i].isRed || nodes[j].isRed || connCursorBoost > 0.1) {
              ctx.strokeStyle = `rgba(239, 68, 68, ${Math.min(alpha * 1.5, 0.85)})`;
              ctx.lineWidth = 1.3 + connCursorBoost * 1.5;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.5)})`;
              ctx.lineWidth = 1.0;
            }
            ctx.stroke();
          }
        }
      }

      // ============================================
      // 6. ACTIVE PACKET PULSES
      // ============================================
      const validConnections: [Node, Node][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionMaxDist) {
            validConnections.push([nodes[i], nodes[j]]);
          }
        }
      }

      if (time - lastPulseSpawn > 1800 && validConnections.length > 0) {
        lastPulseSpawn = time;
        const randomConn = validConnections[Math.floor(Math.random() * validConnections.length)];
        pulses.push({
          fromNode: randomConn[0],
          toNode: randomConn[1],
          progress: 0,
          speed: 0.9 + Math.random() * 0.8,
        });
      }

      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.progress += p.speed * dt;

        if (p.progress >= 1) {
          pulses.splice(k, 1);
          continue;
        }

        const px = p.fromNode.x + (p.toNode.x - p.fromNode.x) * p.progress;
        const py = p.fromNode.y + (p.toNode.y - p.fromNode.y) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 18;
        ctx.fill();

        // Trail dot
        const trailProgress = Math.max(0, p.progress - 0.08);
        const tpx = p.fromNode.x + (p.toNode.x - p.fromNode.x) * trailProgress;
        const tpy = p.fromNode.y + (p.toNode.y - p.fromNode.y) * trailProgress;
        ctx.beginPath();
        ctx.arc(tpx, tpy, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // ============================================
      // 7. INTERACTIVE CLICK RIPPLES
      // ============================================
      const ripples = ripplesRef.current;
      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.radius += 450 * dt;
        ripple.opacity -= 0.85 * dt;

        if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        // Push particles outward
        for (const node of nodes) {
          const rdx = node.x - ripple.x;
          const rdy = node.y - ripple.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const rippleEdge = ripple.radius;

          if (Math.abs(rdist - rippleEdge) < 70 && rdist > 5) {
            const pushForce = (1 - Math.abs(rdist - rippleEdge) / 70) * 4.5;
            node.vx += (rdx / rdist) * pushForce;
            node.vy += (rdy / rdist) * pushForce;
          }
        }

        // Draw outer shockwave ring
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${ripple.opacity})`;
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      prefersReduced.removeEventListener('change', handleMotionChange);
    };
  }, [handleMouseMove, handleMouseLeave, handleClick, handleScroll]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 block w-full h-full pointer-events-none"
    />
  );
}
