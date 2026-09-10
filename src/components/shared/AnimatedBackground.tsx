'use client';

import React, { useEffect, useRef } from 'react';

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
}

interface PulsePacket {
  fromNode: Node;
  toNode: Node;
  progress: number;
  speed: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let isVisible = true;
    let gridOffsetX = 0;
    let gridOffsetY = 0;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize nodes
    const nodeCount = Math.min(Math.max(Math.floor((width * height) / 35000), 28), 50);
    let nodes: Node[] = [];
    const pulses: PulsePacket[] = [];
    let lastPulseSpawn = performance.now();

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const isRed = Math.random() < 0.2;
        const baseRadius = isRed ? 2.5 + Math.random() * 1.5 : 1.5 + Math.random() * 1.5;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: baseRadius,
          baseRadius,
          isRed,
          pulseSpeed: 1 + Math.random() * 2,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initNodes();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Clear base
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Grid rendering with subtle drift
      gridOffsetX = (gridOffsetX + 0.05) % 60;
      gridOffsetY = (gridOffsetY + 0.03) % 60;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let x = gridOffsetX; x < width; x += 60) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = gridOffsetY; y < height; y += 60) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Brownian movement
        node.x += node.vx;
        node.y += node.vy;

        // Bounce on boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Pulse size
        node.pulsePhase += node.pulseSpeed * dt;
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.5;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(node.radius, 1), 0, Math.PI * 2);

        if (node.isRed) {
          ctx.fillStyle = 'rgba(196, 5, 5, 0.4)';
          ctx.shadowColor = 'rgba(196, 5, 5, 0.5)';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = 'rgba(250, 250, 250, 0.25)';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Draw connections
      const maxDistance = 160;
      const validConnections: [Node, Node][] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            validConnections.push([nodes[i], nodes[j]]);
            const alpha = (1 - dist / maxDistance) * 0.12;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            if (nodes[i].isRed || nodes[j].isRed) {
              ctx.strokeStyle = `rgba(196, 5, 5, ${alpha * 1.5})`;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            }
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Spawn traveling pulse packets periodically
      if (time - lastPulseSpawn > 4000 && validConnections.length > 0) {
        lastPulseSpawn = time;
        const randomConn = validConnections[Math.floor(Math.random() * validConnections.length)];
        pulses.push({
          fromNode: randomConn[0],
          toNode: randomConn[1],
          progress: 0,
          speed: 0.8 + Math.random() * 0.6,
        });
      }

      // Update and draw traveling pulse packets
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
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#c40505';
        ctx.shadowColor = '#c40505';
        ctx.shadowBlur = 10;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 block w-full h-full"
    />
  );
}
