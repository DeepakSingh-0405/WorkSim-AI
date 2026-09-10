# WorkSim — 48-Hour Hackathon Implementation Plan

> **Goal:** Build a fully animated, motion-based AI-powered workplace simulation platform — from a jaw-dropping landing page to a working simulation workspace with real AI agent interactions, Supabase backend, and animated evaluation dashboard — all in 48 hours.

> **Core Thesis:** Practice work, not courses.

---

## Table of Contents

1. [Confirmed Decisions](#1-confirmed-decisions)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Animation & Motion Strategy](#5-animation--motion-strategy)
6. [AI Agent Architecture](#6-ai-agent-architecture)
7. [Scenario Design — Payment API Incident](#7-scenario-design--payment-api-incident)
8. [Page-by-Page Breakdown](#8-page-by-page-breakdown)
9. [API Routes](#9-api-routes)
10. [State Management](#10-state-management)
11. [MCP Servers & Plugins](#11-mcp-servers--plugins)
12. [Environment Variables & API Keys](#12-environment-variables--api-keys)
13. [Build Phases — 48-Hour Timeline](#13-build-phases--48-hour-timeline)
14. [Pre-Build Checklist](#14-pre-build-checklist)
15. [Verification Plan](#15-verification-plan)

---

## 1. Confirmed Decisions

All decisions confirmed through interactive planning interview.

| Decision | Choice |
|:---|:---|
| **Scope** | Full vertical slice: Landing → Auth → Dashboard → Simulation → Evaluation |
| **Timeline** | 48-hour hackathon sprint |
| **Build Order** | Landing page FIRST → Auth → Dashboard → Simulation → Evaluation → Polish |
| **Frontend** | Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui + 21st.dev |
| **UI & Motion Sourcing** | **21st.dev** (Rule: use 21st.dev for design purposes for animated & UI components) |
| **Animation** | Motion (Framer Motion v12+) — `import from "motion/react"` |
| **Background** | Canvas-based animated network grid + CSS grain overlay |
| **AI Provider** | Google Gemini (free tier) via Vercel AI SDK 4.0 |
| **Backend** | Supabase (Auth + PostgreSQL + Realtime) |
| **Orchestration** | Custom TypeScript orchestrator (skip LangGraph for hackathon) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Code Execution** | Simulated terminal (pre-built realistic responses) |
| **AI Interactions** | Real streaming AI via Gemini (Manager + Coworker agents) |
| **Evaluation** | Animated skill radar chart (Recharts) + evidence cards |
| **Scenario** | Production Incident: Payment API Failure |
| **Typography** | Inter (UI) + JetBrains Mono (code/terminal) |
| **Deployment** | Vercel |
| **Auth** | Supabase Auth (Google + Email/Password) |
| **Brand Color** | `#c40505` (used sparingly: CTA, active states, incident) |
| **Design** | Dark-first, premium, high information density, controlled glassmorphism |

---

## 2. Tech Stack & Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "typescript": "^5.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x",

    "motion": "^12.x",
    "@monaco-editor/react": "latest",
    "recharts": "^2.x",
    "lucide-react": "latest",

    "ai": "^4.x",
    "@ai-sdk/google": "latest",
    "@ai-sdk/react": "latest",

    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "latest",

    "zustand": "^5.x",
    "zod": "^3.x",
    "date-fns": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "class-variance-authority": "latest"
  }
}
```

### shadcn/ui Components to Install

```bash
npx shadcn@latest add button card input label dialog tabs avatar badge
npx shadcn@latest add separator scroll-area dropdown-menu tooltip sheet progress
```

### Why Each Choice

| Package | Rationale |
|:---|:---|
| **Next.js 15** | App Router, API routes, SSR, Server Actions — all-in-one full-stack |
| **Motion** | Spring physics, AnimatePresence, layout animations — best React animation lib |
| **Monaco** | VS Code editor in the browser — instant credibility with judges |
| **Recharts** | Declarative SVG charts, built-in animation, radar chart for skill graph |
| **Vercel AI SDK** | Provider-agnostic AI interface, `useChat` hook, streaming built-in |
| **Gemini** | Free tier, fast, good quality — ideal for hackathon budget |
| **Supabase** | Auth + PostgreSQL + Realtime in one service, 30-min setup |
| **Zustand** | Minimal boilerplate state management for simulation state |

---

## 3. Project Structure

```
d:\WorkSim\
├── .env.local                          # All API keys (gitignored)
├── .gitignore
├── next.config.ts
├── postcss.config.mjs                  # Tailwind v4 PostCSS
├── tsconfig.json
├── package.json
├── components.json                     # shadcn/ui config
│
├── public/
│   └── og-image.png                    # OpenGraph image for SEO
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout: fonts, metadata, providers
│   │   ├── page.tsx                    # Landing page (most important first impression)
│   │   ├── globals.css                 # Design tokens, base styles, custom properties
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx            # Login form
│   │   │   └── signup/
│   │   │       └── page.tsx            # Signup form
│   │   │
│   │   ├── (protected)/
│   │   │   ├── layout.tsx              # Auth-guarded layout wrapper
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx            # Student dashboard
│   │   │   ├── simulation/
│   │   │   │   └── [sessionId]/
│   │   │   │       └── page.tsx        # Simulation workspace (core product)
│   │   │   └── evaluation/
│   │   │       └── [sessionId]/
│   │   │           └── page.tsx        # Evaluation results + skill graph
│   │   │
│   │   └── api/
│   │       ├── chat/
│   │       │   └── route.ts            # AI streaming (Manager/Coworker)
│   │       ├── simulation/
│   │       │   ├── start/
│   │       │   │   └── route.ts        # POST: Create simulation session
│   │       │   ├── event/
│   │       │   │   └── route.ts        # POST: Log simulation event
│   │       │   └── complete/
│   │       │       └── route.ts        # POST: Complete + trigger evaluation
│   │       └── auth/
│   │           └── callback/
│   │               └── route.ts        # Supabase OAuth callback
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui (auto-generated)
│   │   │
│   │   ├── landing/
│   │   │   ├── Hero.tsx                # Staggered headline + subtext + CTA
│   │   │   ├── WorkplacePreview.tsx    # Animated mock of simulation workspace
│   │   │   ├── ComparisonSection.tsx   # Traditional EdTech vs WorkSim
│   │   │   ├── HowItWorks.tsx          # Step-by-step flow with animations
│   │   │   ├── FeaturesGrid.tsx        # Feature cards with hover effects
│   │   │   └── CTASection.tsx          # Final CTA with glow button
│   │   │
│   │   ├── simulation/
│   │   │   ├── SimulationWorkspace.tsx # Main workspace orchestrator
│   │   │   ├── SimulationHeader.tsx    # Company name, mission, timer, status
│   │   │   ├── ToolSidebar.tsx         # Left nav: Mission, Slack, Code, Logs, Terminal
│   │   │   ├── MissionPanel.tsx        # Objective, tasks, deadline, success criteria
│   │   │   ├── SlackPanel.tsx          # Channels + message threads
│   │   │   ├── AgentChat.tsx           # AI Manager/Coworker streaming chat
│   │   │   ├── CodeEditor.tsx          # Monaco editor wrapper (dynamic import)
│   │   │   ├── LogsViewer.tsx          # Searchable/filterable log viewer
│   │   │   ├── TerminalPanel.tsx       # Simulated terminal with typewriter output
│   │   │   └── EventTimeline.tsx       # Bottom bar showing student action history
│   │   │
│   │   ├── evaluation/
│   │   │   ├── SkillRadarChart.tsx     # Recharts animated radar chart
│   │   │   ├── OverallScore.tsx        # Count-up score animation
│   │   │   ├── EvidenceCard.tsx        # Individual evidence item
│   │   │   ├── StrengthsWeaknesses.tsx # Two-column strengths + improvements
│   │   │   └── NextMission.tsx         # Recommended next mission card
│   │   │
│   │   ├── dashboard/
│   │   │   ├── CurrentMission.tsx      # Active/recommended mission card
│   │   │   ├── SkillProfile.tsx        # Mini radar chart preview
│   │   │   └── RecentPerformance.tsx   # Past simulation summaries
│   │   │
│   │   └── shared/
│   │       ├── AnimatedBackground.tsx  # Canvas: grid + nodes + connections
│   │       ├── GrainOverlay.tsx        # CSS film grain texture
│   │       ├── AnimatedText.tsx        # Staggered word/line reveal
│   │       ├── GlowButton.tsx          # CTA button with hover glow + lift
│   │       ├── TypewriterText.tsx      # Character-by-character typing effect
│   │       ├── Logo.tsx               # WorkSim logo component
│   │       └── PageTransition.tsx     # AnimatePresence page wrapper
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # createBrowserClient()
│   │   │   ├── server.ts              # createServerClient() for RSC/Server Actions
│   │   │   └── middleware.ts          # updateSession() helper
│   │   │
│   │   ├── ai/
│   │   │   ├── agents.ts             # Agent configs: role, prompt, knowledge, rules
│   │   │   ├── orchestrator.ts        # Routes messages to correct agent
│   │   │   └── prompts.ts            # System prompt templates with variable injection
│   │   │
│   │   ├── simulation/
│   │   │   ├── scenario.ts           # Payment API incident config
│   │   │   ├── state.ts              # SimulationState type + transitions
│   │   │   ├── events.ts             # Event types + event creation helpers
│   │   │   ├── mock-data.ts          # Pre-built: log entries, code files, terminal output
│   │   │   └── evaluator.ts          # Evaluation prompt + score parsing
│   │   │
│   │   └── utils.ts                  # cn(), formatDate(), formatDuration()
│   │
│   ├── stores/
│   │   └── simulation-store.ts       # Zustand: active tool, messages, events, timer
│   │
│   ├── types/
│   │   ├── simulation.ts             # SimulationState, SimulationEvent, Scenario
│   │   ├── evaluation.ts             # Evaluation, SkillScore, Evidence
│   │   └── database.ts              # Database row types (matching Supabase schema)
│   │
│   └── middleware.ts                 # Next.js middleware: auth guard for /dashboard, /simulation, /evaluation
│
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql    # 4 tables + RLS policies
```

---

## 4. Database Schema

### Tables (4 total — minimal for hackathon)

#### `profiles` — extends Supabase auth.users
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  experience_level TEXT DEFAULT 'beginner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `simulation_sessions` — tracks each simulation run
```sql
CREATE TABLE simulation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scenario_id TEXT NOT NULL DEFAULT 'production-incident-payment-api',
  status TEXT NOT NULL DEFAULT 'active',    -- active | completed | failed
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}'::JSONB
);
```

#### `simulation_events` — immutable action log
```sql
CREATE TABLE simulation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES simulation_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,                       -- SLACK_OPENED, MESSAGE_SENT, FILE_OPENED, etc.
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::JSONB       -- event-specific data
);
```

#### `evaluations` — AI-generated evaluation results
```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES simulation_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER,
  skill_scores JSONB DEFAULT '{}'::JSONB,   -- { "debugging": 84, "communication": 64, ... }
  strengths JSONB DEFAULT '[]'::JSONB,
  improvements JSONB DEFAULT '[]'::JSONB,
  evidence JSONB DEFAULT '[]'::JSONB,
  next_mission JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Row Level Security
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users manage own sessions" ON simulation_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own events" ON simulation_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own evaluations" ON evaluations FOR ALL USING (auth.uid() = user_id);
```

#### Auto-create profile on signup (Supabase trigger)
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 5. Animation & Motion Strategy

### UI & Animated Component Sourcing (21st.dev Rule)

> **Core Rule:** Use **21st.dev** for design purposes for animated and UI components.
>
> When designing, selecting, or building interactive UI elements (such as animated buttons, interactive cards, bento grids, modal transitions, glowing borders, dock/navigation bars, and micro-animations), first search and retrieve components from [21st.dev](https://21st.dev) via the connected 21st MCP server (`search`, `get_component`) or the shadcn registry. Always adapt retrieved components to strictly adhere to WorkSim design tokens (`--color-brand: #c40505`, dark surfaces, and typography). Do not create custom animated components from scratch when 21st.dev provides a polished pattern.

### Animation Library

**Motion** (Framer Motion v12+) — `import { motion, AnimatePresence } from "motion/react"`

### Design System Motion Tokens

```css
:root {
  /* Brand */
  --color-brand: #c40505;
  --color-brand-glow: rgba(196, 5, 5, 0.3);
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-surface-hover: #1a1a1a;
  --color-border: rgba(255, 255, 255, 0.06);
  --color-border-hover: rgba(255, 255, 255, 0.12);
  --color-text: #fafafa;
  --color-text-muted: #888888;

  /* Springs */
  --spring-bounce: 0.05;
  --spring-duration: 0.6s;

  /* Stagger */
  --stagger-children: 0.08s;
  --stagger-hero: 0.15s;

  /* Easing */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-sine: cubic-bezier(0.37, 0, 0.63, 1);
}
```

### Canvas Background Specification

```
Canvas: "Intelligent digital infrastructure"
├── Base: #0a0a0a (near-black)
├── Grid: Orthogonal lines, opacity 0.03-0.06, slowly drifting
├── Nodes: 30-50 floating dots (2-4px radius)
│   ├── White dots: opacity 0.1-0.3
│   └── Red dots (#c40505): opacity 0.05-0.15
│   └── Movement: Brownian drift, max 0.3px/frame
├── Connections: Lines between nodes <150px apart
│   ├── Color: white, opacity = 1 - (distance / 150)
│   └── Red pulse: occasional traveling pulse on random connections
├── Grain: CSS ::after pseudo-element, SVG noise filter, opacity 0.03
└── Performance: requestAnimationFrame, skip if delta > 16ms
```

### Complete Component Motion Map

| Component | Animation Type | Details | Trigger |
|:---|:---|:---|:---|
| **AnimatedBackground** | Canvas 2D | Grid + nodes + connections + red pulses | Continuous 60fps |
| **GrainOverlay** | CSS | Noise texture, subtle opacity flicker | Continuous |
| **Hero headline** | Motion stagger | Each line: `y: 30→0, opacity: 0→1` | Page load, 0.15s stagger |
| **Hero subtext** | Motion fade | `opacity: 0→1, y: 20→0` | After headline completes |
| **Hero CTA** | Motion spring | `scale: 0.9→1, opacity: 0→1` | After subtext |
| **Workplace preview** | Auto-sequence | Slack msg → Log entry → Code change → Test → Skill update | After hero, 2s intervals |
| **Feature cards** | Scroll + hover | Fade-up on intersect; hover: `y: -5px, shadow↑, border glow` | IntersectionObserver + hover |
| **Comparison** | Scroll reveal | Left column slides from left, right from right | Scroll into view |
| **CTA button** | Hover glow | `y: -2px`, box-shadow pulse with brand color | Hover |
| **Auth forms** | Spring entrance | `scale: 0.95→1, opacity: 0→1` | Route mount |
| **Dashboard cards** | Stagger entrance | Cards cascade in, 0.08s apart | Page load |
| **Simulation sidebar** | Tool highlight | Active tool: border-left glow, slight scale | Tool selection |
| **Tool content** | Layout animation | AnimatePresence crossfade between tools | Tool switch |
| **Slack messages** | Slide-in | `y: 20→0, opacity: 0→1` from bottom | New message |
| **AI typing indicator** | Dot animation | Three dots pulse: `●◌○` cycling + subtle glow | AI processing |
| **Log entries** | Cascade | `y: -10→0, opacity: 0→1` from top | New log |
| **Terminal output** | Typewriter | Character-by-character with cursor blink | Command execution |
| **Code editor** | None (Monaco) | Monaco handles its own rendering | — |
| **Event timeline** | Slide-in | Items slide from right with fade | New event logged |
| **Completion splash** | Scale-up | Full-screen `scale: 0→1` with radial gradient | Simulation complete |
| **Score counter** | Count-up | Number animates `0→score` over 1.5s | Evaluation page load |
| **Radar chart** | SVG morph | Path morphs from center point → full shape | Page load, 1.5s duration |
| **Evidence cards** | Stagger cascade | Cards drop in from top, 0.1s stagger | After radar animation |
| **Next mission** | Scale reveal | `scale: 0.8→1` with glow border animation | After evidence cards |

### Motion Principles

1. Every animation communicates one of: **State, Causality, AI activity, Progress, Consequence, Discovery, Feedback**
2. **Professionalism > Flashiness**
3. **Meaningful motion > Decorative motion**
4. **Realism > Gamification**
5. Respect `prefers-reduced-motion` (use `useReducedMotion` hook)

---

## 6. AI Agent Architecture

### Architecture (Hackathon-simplified)

```
Student Message
      ↓
  API Route (/api/chat)
      ↓
  Orchestrator (orchestrator.ts)
      ↓ (selects agent based on channel/context)
  ┌───────────────────────┐
  │  Agent System Prompt   │
  │  + Simulation State    │
  │  + Conversation History│
  └───────────────────────┘
      ↓
  Vercel AI SDK streamText()
      ↓ (Gemini API)
  Streaming Response → Client
```

### Manager Agent — Priya Sharma

```markdown
**Role:** Priya Sharma, Engineering Manager at TechFlow Inc.
**Objective:** Guide student through production incident resolution.
**Personality:** Professional, direct, applies time pressure, asks for updates.

**Knowledge:**
- System architecture: microservices (Payment Service, User Service, Notification Service)
- Incident severity: P1, customer-impacting, SLA breach in 45 minutes
- Recent context: Payment API has been intermittently failing since 2:15 AM

**Knowledge Boundaries:**
- Does NOT know the root cause
- Does NOT know the exact code that's broken
- Cannot give the solution

**Behavior Rules:**
1. Ask for status updates every 2-3 student messages
2. Apply realistic time pressure ("The CEO just pinged me", "Customers are escalating")
3. If student seems stuck (>3 messages without progress), provide ONE small directional hint
4. Never provide the solution or root cause directly
5. Respond in 2-4 sentences max — real Slack message length
6. Use professional workplace communication
7. Acknowledge good investigation steps ("Good thinking checking the logs first")
8. Escalate urgency over time if issue isn't resolved
```

### Coworker Agent — Alex Chen

```markdown
**Role:** Alex Chen, Senior Backend Developer at TechFlow Inc.
**Objective:** Collaborate naturally, share partial context.
**Personality:** Helpful but busy, slightly distracted, realistic teammate.

**Knowledge:**
- Refactored payment retry logic last week (changed timeout from 5s to 2s)
- Knows the payment service connects to Stripe API
- Knows there was a dependency update recently
- Has seen similar timeout issues before

**Knowledge Boundaries:**
- Does NOT know the exact root cause
- Does NOT know if the timeout change caused the issue

**Behavior Rules:**
1. Share relevant context when asked directly ("Yeah, I touched the retry logic last week")
2. Provide partial clues, never the full answer
3. Occasionally respond with delay ("sorry, was in standup")
4. Sometimes share tangentially useful information
5. Keep tone casual and Slack-appropriate ("hey, yeah lemme check...")
6. If student asks directly "did your change break it?" — be defensive but honest
7. Offer to pair if student seems very stuck
```

### Orchestrator Logic

```typescript
// Simplified routing in orchestrator.ts
function getAgentConfig(channel: string): AgentConfig {
  switch (channel) {
    case 'manager':
    case '#incident-response':
      return MANAGER_AGENT;
    case 'coworker':
    case '#engineering':
    case '#payments':
      return COWORKER_AGENT;
    default:
      return MANAGER_AGENT;
  }
}
```

---

## 7. Scenario Design — Payment API Incident

### Scenario Config

```typescript
const PAYMENT_INCIDENT_SCENARIO = {
  id: 'production-incident-payment-api',
  title: 'Production Incident: Payment API Failure',
  company: 'TechFlow Inc.',
  difficulty: 'intermediate',
  estimatedMinutes: 30,

  objective: 'Investigate the intermittent Payment API failure, identify the root cause, implement a safe fix, and communicate the resolution.',

  successCriteria: [
    'Identify root cause (timeout change in retry logic)',
    'Validate hypothesis with evidence from logs',
    'Implement or describe the fix',
    'Communicate resolution to manager',
  ],

  skills: ['debugging', 'problem-solving', 'communication', 'technical-reasoning', 'prioritization'],
};
```

### Pre-built Mock Data

#### Log Entries (clues embedded)
```
[2026-09-10 02:15:03] ERROR payment-service - Request to /api/payments/charge failed: TimeoutError: operation timed out after 2000ms
[2026-09-10 02:15:03] INFO  payment-service - Retry attempt 1/3 for payment txn_8f2a...
[2026-09-10 02:15:05] ERROR payment-service - Retry 1 failed: TimeoutError: operation timed out after 2000ms
[2026-09-10 02:15:07] ERROR payment-service - Retry 2 failed: TimeoutError: operation timed out after 2000ms
[2026-09-10 02:15:09] ERROR payment-service - All retries exhausted for txn_8f2a... Returning 500
[2026-09-10 02:15:09] WARN  gateway - Payment charge failed for order ord_3d1c... status=500
[2026-09-10 02:14:58] INFO  stripe-adapter - Stripe API average response time: 3200ms (p99: 4800ms)
[2026-09-10 02:12:00] INFO  payment-service - Config loaded: PAYMENT_TIMEOUT=2000, RETRY_COUNT=3
[2026-09-10 02:10:00] INFO  deployment - Deployed payment-service v2.4.1 (prev: v2.3.8)
```

#### Code Files (with the bug)
```typescript
// src/services/payment/config.ts — THE BUG IS HERE
export const PAYMENT_CONFIG = {
  timeout: 2000,      // Changed from 5000 to 2000 in v2.4.1
  retryCount: 3,
  retryDelay: 1000,
};

// src/services/payment/client.ts
export async function chargePayment(orderId: string, amount: number) {
  const config = getPaymentConfig();
  for (let attempt = 0; attempt < config.retryCount; attempt++) {
    try {
      const response = await stripe.charges.create(
        { amount, currency: 'usd', source: orderId },
        { timeout: config.timeout }  // Uses the too-low timeout
      );
      return response;
    } catch (error) {
      if (attempt === config.retryCount - 1) throw error;
      await sleep(config.retryDelay);
    }
  }
}
```

#### Terminal Responses
```
$ npm test
> Running payment-service tests...
  ✓ chargePayment succeeds with valid order (42ms)
  ✗ chargePayment handles slow Stripe response (TIMEOUT - 2001ms > 2000ms)
  ✓ chargePayment retries on failure (128ms)
  ✗ chargePayment respects configured timeout (expected 5000, got 2000)

Tests: 2 passed, 2 failed
```

---

## 8. Page-by-Page Breakdown

### Landing Page (`/`)
**Goal:** Jaw-dropping first impression. Animated, alive, premium.

```
┌─────────────────────────────────────────────────┐
│  [AnimatedBackground: Canvas grid + nodes]       │
│  [GrainOverlay]                                  │
│                                                  │
│  ┌─ HERO ──────────────────────────────────────┐ │
│  │  Practice Work.                (stagger in)  │ │
│  │  Build Skills.                 (stagger in)  │ │
│  │  Prove Readiness.              (stagger in)  │ │
│  │                                              │ │
│  │  WorkSim puts you inside realistic           │ │
│  │  AI-powered workplaces...      (fade in)     │ │
│  │                                              │ │
│  │  [Start Practicing →]  (glow button)         │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ WORKPLACE PREVIEW ─────────────────────────┐ │
│  │  Animated mock: Slack → Logs → Code → Test   │ │
│  │  Auto-cycling every 3 seconds                │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ COMPARISON ────────────────────────────────┐ │
│  │  Traditional EdTech    │    WorkSim          │ │
│  │  Course → Quiz → Cert  │  Situation → Action │ │
│  │                        │  → Consequence →    │ │
│  │                        │  Evaluation → Next  │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ HOW IT WORKS ──────────────────────────────┐ │
│  │  1. Choose Career  →  2. Enter Workplace     │ │
│  │  3. Complete Mission → 4. Get Evaluated      │ │
│  │  5. See Skill Gaps  → 6. Next Mission        │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ FEATURES ──────────────────────────────────┐ │
│  │  [AI Agents] [Workplace Tools] [Evaluation]  │ │
│  │  [Skill Graph] [Adaptive] [Real Scenarios]   │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ CTA ───────────────────────────────────────┐ │
│  │  Ready to practice work?                     │ │
│  │  [Get Started Free →]                        │ │
│  └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Simulation Workspace (`/simulation/[sessionId]`)
**Goal:** Feel like entering a real company. Most important screen.

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: WorkSim │ TechFlow Inc. │ Production Incident │    │
│          ⏱ 28:43 │ Status: ACTIVE │ [Exit]                  │
├────────┬────────────────────────────────────┬───────────────┤
│SIDEBAR │         CENTER PANEL               │  RIGHT PANEL  │
│        │                                    │               │
│ Mission│  (Active tool content here)        │  AI Manager   │
│  Slack │                                    │  ● Online     │
│  Code  │  Shows whichever tool is selected: │  [Chat...]    │
│  Logs  │  - MissionPanel                    │               │
│Terminal│  - SlackPanel                      │  AI Coworker  │
│        │  - CodeEditor (Monaco)             │  ● Online     │
│        │  - LogsViewer                      │  [Chat...]    │
│        │  - TerminalPanel                   │               │
├────────┴────────────────────────────────────┴───────────────┤
│  EVENT TIMELINE: [Opened Logs] → [Sent Message] → [...]     │
└─────────────────────────────────────────────────────────────┘
```

### Evaluation (`/evaluation/[sessionId]`)
**Goal:** The payoff moment. Show the complete loop.

```
┌─────────────────────────────────────────────────┐
│  ✓ INCIDENT RESOLVED                            │
│  Time: 24 minutes │ Tests: 4/4 passed           │
│                                                  │
│  ┌─ OVERALL SCORE ─────────────────────────────┐ │
│  │        78%  (count-up animation)             │ │
│  │   Workplace Readiness                        │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ SKILL RADAR CHART ────────────────────────┐ │
│  │       (animated SVG morph)                   │ │
│  │   Debugging: 84                              │ │
│  │   Problem Solving: 82                        │ │
│  │   Communication: 64                          │ │
│  │   Technical Reasoning: 87                    │ │
│  │   Prioritization: 71                         │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ STRENGTHS ──────┐  ┌─ IMPROVEMENTS ───────┐ │
│  │ Strong debugging  │  │ Communicate more     │ │
│  │ Good log analysis │  │ Clarify requirements │ │
│  │ Validated fix     │  │ Update manager sooner│ │
│  └──────────────────┘  └─────────────────────┘  │
│                                                  │
│  ┌─ EVIDENCE ──────────────────────────────────┐ │
│  │ "Inspected payment-service logs within 2min" │ │
│  │ "Identified timeout config as root cause"    │ │
│  │ "Communicated fix plan to manager"           │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ NEXT MISSION ──────────────────────────────┐ │
│  │ CLIENT ESCALATION                            │ │
│  │ Why: Communication skills need improvement   │ │
│  │ [Start Mission →]                            │ │
│  └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 9. API Routes

### `POST /api/chat` — AI Streaming
```typescript
// Receives: { messages, agentType, simulationState }
// Uses: Vercel AI SDK streamText() with Gemini
// Returns: Streaming text response
```

### `POST /api/simulation/start` — Create Session
```typescript
// Receives: { scenarioId }
// Creates: simulation_sessions row in Supabase
// Returns: { sessionId }
```

### `POST /api/simulation/event` — Log Event
```typescript
// Receives: { sessionId, type, metadata }
// Creates: simulation_events row (immutable)
// Returns: { eventId }
```

### `POST /api/simulation/complete` — Complete + Evaluate
```typescript
// Receives: { sessionId }
// Does:
//   1. Updates simulation_sessions.status = 'completed'
//   2. Fetches all simulation_events for the session
//   3. Sends events to Gemini for evaluation
//   4. Parses evaluation response
//   5. Creates evaluations row
// Returns: { evaluationId }
```

### `GET /api/auth/callback` — OAuth Callback
```typescript
// Handles Supabase OAuth redirect
// Exchanges code for session
// Redirects to /dashboard
```

---

## 10. State Management

### Zustand Store — `simulation-store.ts`

```typescript
interface SimulationStore {
  // Session
  sessionId: string | null;
  status: 'idle' | 'active' | 'completed' | 'failed';

  // Active tool
  activeTool: 'mission' | 'slack' | 'code' | 'logs' | 'terminal';
  setActiveTool: (tool: ActiveTool) => void;

  // Timer
  startTime: Date | null;
  elapsedSeconds: number;
  tickTimer: () => void;

  // Slack messages (per channel)
  messages: Record<string, Message[]>;
  addMessage: (channel: string, message: Message) => void;

  // Events
  events: SimulationEvent[];
  addEvent: (event: SimulationEvent) => void;

  // Terminal
  terminalHistory: TerminalEntry[];
  addTerminalEntry: (entry: TerminalEntry) => void;

  // Discovered facts
  discoveredFacts: string[];
  addFact: (fact: string) => void;

  // Actions
  startSimulation: (sessionId: string) => void;
  completeSimulation: () => void;
  resetSimulation: () => void;
}
```

---

## 11. MCP Servers & Plugins

### Required MCP Servers

| MCP Server | Purpose | Config |
|:---|:---|:---|
| **21st.dev MCP** ⭐ | Discover and fetch animated UI components, templates, and themes | Remote HTTP (`https://21st.dev/api/mcp`) |
| **Supabase MCP** ⭐ | Database management, run migrations, test RLS, inspect tables | `npx -y @supabase/mcp-server` |
| **Vercel MCP** (optional) | Deployment monitoring, env var management | `npx -y @vercel/mcp` |

### 21st.dev MCP Config
```json
{
  "21st": {
    "url": "https://21st.dev/api/mcp",
    "headers": {
      "x-api-key": "21st_sk_d5e9c26876c6901ff8d2ad0b837aadd64532a86550d06d4b266ce391d4b29a74"
    }
  }
}
```

### Supabase MCP Config
```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server"],
    "env": {
      "SUPABASE_URL": "<your-supabase-project-url>",
      "SUPABASE_SERVICE_ROLE_KEY": "<your-service-role-key>"
    }
  }
}
```

### Vercel MCP Config (Optional)
```json
{
  "vercel": {
    "command": "npx",
    "args": ["-y", "@vercel/mcp"],
    "env": {
      "VERCEL_TOKEN": "<your-vercel-token>"
    }
  }
}
```

### Already Available — No Setup Needed

| Tool | Usage |
|:---|:---|
| **Chrome DevTools MCP** | Debug animations, inspect performance, test responsive |
| **Modern Web Guidance** | Latest CSS/HTML patterns for glassmorphism, animations |
| **Gemini API docs MCP** | SDK reference for Gemini integration |
| **Postman MCP** | Test API routes if needed |

### No Plugin Required For

Next.js, TypeScript, Tailwind, shadcn/ui, Monaco, Recharts, Motion, Zustand, Zod — these are libraries installed via npm, not external SaaS systems requiring MCP connections.

---

## 12. Environment Variables & API Keys

### Complete `.env.local`

```env
# ============================================
# SUPABASE (Required)
# Get from: https://database.new → Project Settings → API
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# ============================================
# GOOGLE GEMINI (Required)
# Get from: https://aistudio.google.com/ → Get API Key
# ============================================
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

# ============================================
# APP CONFIG
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### API Key Summary

| Key | Service | Where to Get | Required? |
|:---|:---|:---|:---|
| Supabase URL | Supabase | database.new → Settings → API | ✅ Yes |
| Supabase Anon Key | Supabase | Same page, `anon` `public` key | ✅ Yes |
| Supabase Service Role Key | Supabase | Same page, `service_role` key | ✅ Yes |
| Gemini API Key | Google AI | aistudio.google.com | ✅ Yes |
| Vercel Token | Vercel | vercel.com/account/tokens | ⚡ Optional |
| Google OAuth Client ID | Google Cloud | console.cloud.google.com → Credentials | ⚡ Optional |

**Minimum to start: 4 keys (Supabase × 3 + Gemini × 1)**

---

## 13. Build Phases — 48-Hour Timeline

### Phase 1 — Foundation (Hours 0-4)
```
[  ] npx create-next-app@latest ./ --typescript --tailwind --app --src-dir
[  ] npx shadcn@latest init
[  ] Install: motion, recharts, @monaco-editor/react, lucide-react
[  ] Install: ai, @ai-sdk/google, @ai-sdk/react
[  ] Install: @supabase/supabase-js, @supabase/ssr
[  ] Install: zustand, zod, date-fns, clsx, tailwind-merge, class-variance-authority
[  ] Add shadcn components: button card input label dialog tabs avatar badge etc.
[  ] Create .env.local with all keys
[  ] Set up lib/supabase/client.ts + server.ts + middleware.ts
[  ] Set up middleware.ts (auth guard)
[  ] Create globals.css design tokens (colors, fonts, spacing)
[  ] Build AnimatedBackground.tsx (canvas)
[  ] Build GrainOverlay.tsx
[  ] Build AnimatedText.tsx
[  ] Build GlowButton.tsx
[  ] Build Logo.tsx
```

### Phase 2 — Landing Page (Hours 4-12)
```
[  ] Hero.tsx — staggered text + CTA
[  ] WorkplacePreview.tsx — animated mock workspace
[  ] ComparisonSection.tsx — Traditional vs WorkSim
[  ] HowItWorks.tsx — step flow
[  ] FeaturesGrid.tsx — 6 feature cards
[  ] CTASection.tsx — final CTA
[  ] Assemble landing page in page.tsx
[  ] Responsive design pass
[  ] Motion choreography timing
```

### Phase 3 — Authentication (Hours 12-14)
```
[  ] Login page with animated form
[  ] Signup page
[  ] Auth callback route
[  ] Profile auto-creation (Supabase trigger)
[  ] Protected route middleware
```

### Phase 4 — Dashboard (Hours 14-18)
```
[  ] Dashboard layout with AnimatedBackground
[  ] CurrentMission.tsx
[  ] SkillProfile.tsx (mini radar)
[  ] RecentPerformance.tsx
[  ] "Start Mission" → POST /api/simulation/start → redirect
[  ] Staggered card animations
```

### Phase 5 — Simulation Workspace (Hours 18-34)
```
[  ] SimulationWorkspace.tsx layout
[  ] SimulationHeader.tsx (company, timer, status)
[  ] ToolSidebar.tsx (5 tools)
[  ] MissionPanel.tsx
[  ] SlackPanel.tsx + channels
[  ] AgentChat.tsx (streaming via /api/chat)
[  ] CodeEditor.tsx (Monaco, dynamic import, pre-loaded files)
[  ] LogsViewer.tsx (pre-built logs, search, filter)
[  ] TerminalPanel.tsx (simulated responses)
[  ] EventTimeline.tsx
[  ] simulation-store.ts (Zustand)
[  ] Mock data: logs, code files, terminal responses
[  ] Event logging to Supabase
[  ] Tool switching with AnimatePresence
[  ] "Submit Resolution" → POST /api/simulation/complete
```

### Phase 6 — Evaluation (Hours 34-40)
```
[  ] Completion splash animation
[  ] /api/simulation/complete → Gemini evaluation
[  ] OverallScore.tsx (count-up)
[  ] SkillRadarChart.tsx (Recharts animated)
[  ] EvidenceCard.tsx
[  ] StrengthsWeaknesses.tsx
[  ] NextMission.tsx
[  ] Save to Supabase evaluations table
```

### Phase 7 — Polish & Deploy (Hours 40-48)
```
[  ] Motion choreography review (all timing/easing)
[  ] Responsive: mobile + tablet
[  ] Loading states + error states
[  ] SEO: title, description, OG image
[  ] Deploy to Vercel
[  ] Test complete flow: Landing → Signup → Dashboard → Simulation → Evaluation
[  ] Bug fixes
```

---

## 14. Pre-Build Checklist

Before running `npx create-next-app`:

- [ ] **Create Supabase project** at [database.new](https://database.new)
- [ ] **Copy 3 Supabase keys**: URL, Anon Key, Service Role Key
- [ ] **Get Gemini API key** from [aistudio.google.com](https://aistudio.google.com/)
- [ ] **Configure Supabase MCP** in Antigravity IDE settings
- [ ] (Optional) Set up Google OAuth in Supabase → Auth → Providers → Google
- [ ] (Optional) Create Vercel account for deployment

---

## 15. Verification Plan

### Per-Phase Verification

| Phase | Verification |
|:---|:---|
| **Foundation** | `npm run dev` starts without errors, design tokens visible |
| **Landing** | All 6 sections render, animations fire at 60fps, responsive |
| **Auth** | Signup creates user + profile in Supabase, login redirects to dashboard |
| **Dashboard** | Cards animate in, "Start Mission" creates session in DB |
| **Simulation** | All 5 tools work, AI agents stream responses, events log to DB |
| **Evaluation** | Radar chart animates, scores display, evidence cards render |
| **Deploy** | Live on Vercel, full flow works on production URL |

### Performance Targets

| Metric | Target |
|:---|:---|
| Landing page load | < 3 seconds |
| Animation framerate | 60fps (no jank) |
| AI response start | < 1 second (streaming) |
| Lighthouse Performance | > 80 |
| Layout shifts (CLS) | 0 |
