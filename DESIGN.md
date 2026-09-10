# WorkSim — Design System

> **Read this file before creating or modifying any UI.**
>
> This document is the single source of truth for every visual decision in WorkSim. It codifies the brand, colors, typography, spacing, component patterns, animation system, hover effects, background effects, and accessibility rules. Do not deviate from this spec without an explicit decision.

---

## Design Philosophy

WorkSim is an **AI-powered workplace simulation platform**, not a course, chatbot, or quiz system. Every design decision must reinforce one feeling:

> "I am entering a real company."

**Never:**
> "I am opening an online course."

### Core Visual Identity

| Quality | Expression |
|:---|:---|
| **Professional** | Enterprise-grade UI, not playful or childish |
| **Realistic** | Real workplace tools (Slack, IDE, Terminal), not toy versions |
| **Intelligent** | Subtle AI activity indicators, living infrastructure feel |
| **Immersive** | Full-screen workspace, minimal chrome, no distracting headers |
| **Technical** | Developer-focused density, monospace in appropriate contexts |
| **Trustworthy** | Clean, consistent, predictable patterns |
| **Future-focused** | Modern SaaS aesthetic, premium finish |

### Conceptual Inspiration

```
Linear + Slack + VS Code + AI Agent Workspace + Learning Analytics
```

Do **not** copy any of them. Extract the *feeling* — professional, dense, responsive, alive.

### Anti-Patterns — WorkSim Must NOT Look Like

- Coursera / Udemy / any LMS
- Quiz platforms
- Generic AI chatbot interfaces
- Childish gamification (badges, confetti, cartoon mascots)
- Generic purple AI blob backgrounds
- Flat, lifeless dashboards

---

## Visual Direction

- **Dark-first** — the entire application defaults to dark mode
- **Premium** — every surface, border, and shadow should feel considered
- **High information density without clutter** — show a lot, overwhelm nothing
- **Controlled glassmorphism** — use sparingly on overlays and elevated surfaces
- **Minimal gradients** — subtle and purposeful, never decorative
- **Thin borders** — `1px` max, low opacity, never heavy or distracting
- **Subtle shadows** — used for elevation hierarchy, not decoration

---

## Colors

### Brand

```css
--color-brand:            #c40505;
--color-brand-hover:      #a50404;
--color-brand-active:     #8b0303;
--color-brand-glow:       rgba(196, 5, 5, 0.3);
--color-brand-glow-subtle:rgba(196, 5, 5, 0.12);
```

**Usage rules for `#c40505`:**
- Primary CTA buttons
- Active/selected states (sidebar icons, tabs)
- Incident/critical status indicators
- Brand logo accent
- Important highlights and badges (e.g., `Priority: HIGH`)
- Hover glow on primary actions

**Do NOT** make the entire UI red. Red is an accent — it draws attention precisely because it's rare.

### Backgrounds

```css
--color-bg:               #0a0a0a;   /* Page background */
--color-bg-elevated:      #0f0f0f;   /* Cards, panels slightly above base */
--color-surface:          #111111;   /* Primary surface (cards, sidebar) */
--color-surface-hover:    #1a1a1a;   /* Hover state for surfaces */
--color-surface-active:   #222222;   /* Active/pressed state */
--color-surface-glass:    rgba(17, 17, 17, 0.7);  /* Glassmorphism panels */
```

### Borders

```css
--color-border:           rgba(255, 255, 255, 0.06);   /* Default border */
--color-border-hover:     rgba(255, 255, 255, 0.12);   /* Hover border */
--color-border-active:    rgba(255, 255, 255, 0.20);   /* Active/focused */
--color-border-brand:     rgba(196, 5, 5, 0.4);        /* Brand-accent border */
```

### Text

```css
--color-text:             #fafafa;   /* Primary text — headings, body */
--color-text-secondary:   #a1a1a1;   /* Secondary labels, descriptions */
--color-text-muted:       #666666;   /* Tertiary, placeholders, timestamps */
--color-text-disabled:    #444444;   /* Disabled controls */
--color-text-brand:       #c40505;   /* Brand-colored text (use rarely) */
--color-text-on-brand:    #ffffff;   /* Text on brand-colored backgrounds */
```

### Semantic / Status

```css
--color-success:          #22c55e;   /* Tests passed, resolved, online */
--color-success-muted:    rgba(34, 197, 94, 0.15);
--color-warning:          #eab308;   /* Deadline warnings, degraded */
--color-warning-muted:    rgba(234, 179, 8, 0.15);
--color-error:            #ef4444;   /* Errors, failures, critical */
--color-error-muted:      rgba(239, 68, 68, 0.15);
--color-info:             #3b82f6;   /* Informational, links */
--color-info-muted:       rgba(59, 130, 246, 0.15);
```

### Agent Status Colors

```css
--color-agent-online:     #22c55e;   /* ● Online */
--color-agent-thinking:   #eab308;   /* ◌ Analyzing... */
--color-agent-offline:    #666666;   /* ○ Offline */
```

---

## Typography

### Font Stack

```css
--font-sans:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono:  'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
```

- **Inter** — all UI text: headings, body, labels, buttons, navigation
- **JetBrains Mono** — code editor, terminal, log entries, technical data, timestamps

Load via Google Fonts in `layout.tsx`:
```typescript
import { Inter, JetBrains_Mono } from 'next/font/google';
```

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|:---|:---|:---|:---|:---|
| `text-hero` | 56px / 3.5rem | 700 (Bold) | 1.1 | Landing page hero headline |
| `text-h1` | 36px / 2.25rem | 700 (Bold) | 1.2 | Page titles |
| `text-h2` | 28px / 1.75rem | 600 (Semibold) | 1.3 | Section headings |
| `text-h3` | 22px / 1.375rem | 600 (Semibold) | 1.4 | Card titles, panel headers |
| `text-h4` | 18px / 1.125rem | 600 (Semibold) | 1.4 | Sub-section headings |
| `text-body` | 16px / 1rem | 400 (Regular) | 1.6 | Body text, descriptions |
| `text-body-sm` | 14px / 0.875rem | 400 (Regular) | 1.5 | Secondary text, sidebar labels |
| `text-caption` | 12px / 0.75rem | 500 (Medium) | 1.4 | Timestamps, badges, metadata |
| `text-code` | 14px / 0.875rem | 400 (Regular) | 1.6 | Code, terminal, log lines (monospace) |
| `text-code-sm` | 12px / 0.75rem | 400 (Regular) | 1.5 | Small code annotations (monospace) |

### Typography Rules

- Never use decorative or display fonts
- Maximum two font weights per context (Regular + Semibold/Bold)
- Code and terminal content always use `--font-mono`
- Slack messages use `--font-sans` at `text-body-sm`
- Log entries use `--font-mono` at `text-code`
- Headings never exceed `text-hero` size

---

## Spacing

Use a **4px base grid** system. All spacing should be multiples of 4px.

```css
--space-1:   4px;    /* 0.25rem — tight padding, icon gaps */
--space-2:   8px;    /* 0.5rem  — compact padding */
--space-3:   12px;   /* 0.75rem — input padding, small gaps */
--space-4:   16px;   /* 1rem    — standard padding, card padding */
--space-5:   20px;   /* 1.25rem — medium gaps */
--space-6:   24px;   /* 1.5rem  — section padding */
--space-8:   32px;   /* 2rem    — large gaps, section margins */
--space-10:  40px;   /* 2.5rem  — hero spacing */
--space-12:  48px;   /* 3rem    — major section breaks */
--space-16:  64px;   /* 4rem    — page-level spacing */
--space-20:  80px;   /* 5rem    — hero vertical padding */
--space-24:  96px;   /* 6rem    — landing page section gaps */
```

### Spacing Rules

- Card inner padding: `--space-4` to `--space-6`
- Section gaps on landing page: `--space-16` to `--space-24`
- Sidebar icon gaps: `--space-2` to `--space-3`
- Form field gaps: `--space-3`
- Button inner padding: `--space-3` vertical × `--space-5` horizontal
- Modal inner padding: `--space-6`

---

## Border Radius

```css
--radius-sm:   4px;    /* Small chips, badges, tooltips */
--radius-md:   8px;    /* Buttons, inputs, cards */
--radius-lg:   12px;   /* Panels, modals, larger cards */
--radius-xl:   16px;   /* Hero cards, feature cards */
--radius-full: 9999px; /* Avatars, status dots, pills */
```

### Radius Rules

- Buttons: `--radius-md` (8px)
- Input fields: `--radius-md` (8px)
- Cards: `--radius-lg` (12px)
- Landing page feature cards: `--radius-xl` (16px)
- Avatars: `--radius-full`
- Status indicators: `--radius-full`
- Modals / Dialogs: `--radius-lg` (12px)
- Sidebar: no radius (flush to edge)

---

## Shadows

Shadows are used **only for elevation hierarchy**. Never decorative.

```css
--shadow-sm:     0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md:     0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg:     0 8px 24px rgba(0, 0, 0, 0.5);
--shadow-xl:     0 16px 48px rgba(0, 0, 0, 0.6);

/* Glow shadows — used on hover/active for brand elements */
--shadow-glow-brand:   0 0 20px rgba(196, 5, 5, 0.25);
--shadow-glow-brand-lg:0 0 40px rgba(196, 5, 5, 0.3);

/* Glow shadows — used on status indicators */
--shadow-glow-success: 0 0 8px rgba(34, 197, 94, 0.4);
--shadow-glow-warning: 0 0 8px rgba(234, 179, 8, 0.4);
--shadow-glow-error:   0 0 8px rgba(239, 68, 68, 0.4);
```

### Shadow Rules

- Default cards: `--shadow-sm` or no shadow (use border instead)
- Hovered cards: `--shadow-md`
- Modals / Dialogs: `--shadow-xl`
- Primary CTA on hover: `--shadow-glow-brand`
- Agent online status dot: `--shadow-glow-success`
- Never stack multiple shadow layers on the same element

---

## Layout

### Global Layout Rules

- Full-viewport dark background (`#0a0a0a`) on every page
- `AnimatedBackground` canvas is positioned `fixed` behind all content
- `GrainOverlay` is positioned `fixed` above canvas, below content (`z-index: 1`)
- Content sits above both (`z-index: 2+`)
- Maximum content width on landing page: `1200px`, centered
- Simulation workspace: full viewport, no max-width constraint

### Simulation Workspace Layout

```
┌──────────────────────────────────────────────────────────────┐
│  HEADER (h: 48px, fixed top)                                 │
│  Logo │ Company │ Mission Title │ Timer │ Status │ Exit       │
├──────────┬───────────────────────────────────┬───────────────┤
│ SIDEBAR  │        CENTER PANEL               │  RIGHT PANEL  │
│ (w:56px) │   (flex: 1, min-w: 0)            │  (w: 320px)   │
│          │                                    │               │
│  Icons:  │   Rendered tool content:           │  Agent chats: │
│ Mission  │   - MissionPanel                   │  - Manager    │
│ Slack    │   - SlackPanel                     │  - Coworker   │
│ Code     │   - CodeEditor                     │               │
│ Logs     │   - LogsViewer                     │               │
│ Terminal │   - TerminalPanel                  │               │
│          │                                    │               │
├──────────┴───────────────────────────────────┴───────────────┤
│  EVENT TIMELINE (h: 40px, fixed bottom)                       │
│  Horizontally scrolling list of action events                 │
└──────────────────────────────────────────────────────────────┘
```

- **Sidebar:** 56px wide, icon-only, vertical, dark surface, border-right
- **Center panel:** flex-grow, displays currently active tool
- **Right panel:** 320px wide, contains AI agent chat panels, border-left
- **Header:** 48px tall, thin border-bottom
- **Event timeline:** 40px tall, thin border-top

### Dashboard Layout

- Max width: `1200px`, centered with `--space-6` horizontal padding
- Grid: 2-column for mission + skill profile, full-width for recent performance
- Cards float on `--color-surface` with `--color-border` borders

---

## Responsive Breakpoints

```css
--breakpoint-sm:   640px;
--breakpoint-md:   768px;
--breakpoint-lg:   1024px;
--breakpoint-xl:   1280px;
--breakpoint-2xl:  1536px;
```

### Responsive Behavior

| Breakpoint | Behavior |
|:---|:---|
| `< 640px` (mobile) | Landing: single column, stacked sections. Simulation: not supported (show "Desktop required" message) |
| `640–768px` | Landing: single column with wider spacing |
| `768–1024px` | Landing: 2-column grids. Dashboard: 2-column |
| `1024–1280px` | Full layout. Simulation workspace: right panel collapses to drawer |
| `> 1280px` | Full layout, all panels visible |

### Simulation Workspace Responsive Rules

- Minimum supported width: `1024px`
- Below `1024px`: show a message: "WorkSim simulation requires a desktop browser."
- Right panel (agent chats): becomes a slide-over drawer below `1280px`
- Sidebar: always visible as icon-only column (56px)

---

## Component Patterns

All components use **shadcn/ui** and **21st.dev** as the foundational component ecosystem.

### Component Design Rule: 21st.dev First

> **Core Rule:** Use **21st.dev** for design purposes for animated and UI components.
>
> When designing, selecting, or building interactive UI elements (such as animated buttons, interactive cards, bento grids, modal transitions, glowing borders, dock/navigation bars, and micro-animations), first search and retrieve components from [21st.dev](https://21st.dev) via the connected 21st MCP server (`search`, `get_component`) or the shadcn registry. Always adapt retrieved components to strictly adhere to WorkSim design tokens (`--color-brand: #c40505`, dark surfaces, and typography). Do not create custom animated components from scratch when 21st.dev provides a polished pattern.

### Icon Library

**Lucide React** — the only icon library used.

```typescript
import { Terminal, MessageSquare, Code, FileText, AlertTriangle } from 'lucide-react';
```

- Size: `16px` for inline, `20px` for sidebar icons, `24px` for feature cards
- Color: `--color-text-secondary` default, `--color-text` on hover/active
- Active sidebar icon: `--color-brand`

---

## Buttons

### Variants

| Variant | Background | Text | Border | Usage |
|:---|:---|:---|:---|:---|
| **Primary** | `--color-brand` | `--color-text-on-brand` | none | CTA, start mission, submit resolution |
| **Secondary** | `transparent` | `--color-text` | `--color-border` | Cancel, secondary actions |
| **Ghost** | `transparent` | `--color-text-secondary` | none | Toolbar actions, icon buttons |
| **Destructive** | `--color-error` | white | none | Exit simulation, delete |
| **Outline** | `transparent` | `--color-text` | `--color-border` | Filter toggles, option selection |

### Button Hover Effects

```typescript
// Primary CTA (GlowButton)
<motion.button
  whileHover={{
    y: -2,
    boxShadow: '0 0 20px rgba(196, 5, 5, 0.25)',
  }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', bounce: 0.05, duration: 0.3 }}
>
```

- **Primary hover:** lift `y: -2px` + brand glow shadow + slight brightness increase
- **Secondary hover:** background → `--color-surface-hover`, border → `--color-border-hover`
- **Ghost hover:** background → `rgba(255,255,255,0.05)`
- All buttons: `cursor: pointer`, `transition: all 150ms ease`

### Button Sizes

| Size | Padding | Font Size | Height |
|:---|:---|:---|:---|
| `sm` | `6px 12px` | 13px | 32px |
| `md` (default) | `10px 20px` | 14px | 40px |
| `lg` | `14px 28px` | 16px | 48px |

---

## Forms

### Input Fields

- Background: `--color-surface`
- Border: `1px solid var(--color-border)`
- Border on focus: `--color-border-active` + `box-shadow: 0 0 0 2px rgba(196, 5, 5, 0.15)`
- Text: `--color-text`
- Placeholder: `--color-text-muted`
- Radius: `--radius-md`
- Height: `40px`
- Padding: `10px 12px`
- Font: `--font-sans`, `14px`

### Auth Form Pattern

```
┌────────────────────────────────────┐
│  [AnimatedBackground]              │
│  [GrainOverlay]                    │
│                                    │
│      ┌────────────────────┐        │
│      │  WorkSim Logo       │        │
│      │                     │        │
│      │  Welcome back       │        │
│      │  Sign in to continue│        │
│      │                     │        │
│      │  [Email input     ] │        │
│      │  [Password input  ] │        │
│      │                     │        │
│      │  [Sign In →]  (CTA) │        │
│      │                     │        │
│      │  ── or ──           │        │
│      │  [Google Sign In]   │        │
│      │                     │        │
│      │  Don't have account?│        │
│      │  Sign up            │        │
│      └────────────────────┘        │
│                                    │
└────────────────────────────────────┘
```

- Form card: `--color-surface`, `--radius-lg`, `--shadow-lg`
- Max width: `420px`, centered
- Entrance animation: `scale: 0.95→1, opacity: 0→1` (spring, 0.6s)

---

## Cards

### Standard Card

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);     /* 12px */
  padding: var(--space-4) to var(--space-6);
}
```

### Card Hover Effects

```typescript
// Interactive cards (feature cards, mission cards)
<motion.div
  whileHover={{
    y: -4,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  }}
  transition={{ type: 'spring', bounce: 0.05, duration: 0.3 }}
>
```

- Lift: `y: -3px` to `y: -5px`
- Border: opacity increases from `0.06` → `0.12`
- Shadow: `--shadow-sm` → `--shadow-md`
- Internal icon/arrow: translate right by `4px` on hover
- Duration: `0.3s` spring with `bounce: 0.05`

### Card Variants

| Variant | Extra Styling | Usage |
|:---|:---|:---|
| **Default** | Standard card | Dashboard cards, evaluation sections |
| **Feature** | `--radius-xl`, larger padding | Landing page feature grid |
| **Mission** | Brand left-border accent (2px) | Current mission, next mission |
| **Glass** | `--color-surface-glass` + `backdrop-filter: blur(12px)` | Overlays, elevated panels |

---

## Navigation

### Top Header (Simulation)

- Height: `48px`
- Background: `--color-surface`
- Border-bottom: `1px solid var(--color-border)`
- Content: Logo (left) → Company name → Mission title → Countdown timer → Status badge → Exit button (right)
- Timer: `--font-mono`, `--color-warning` when < 5 minutes
- Status badge: `ACTIVE` (green), `COMPLETED` (blue), `FAILED` (red)

### Sidebar (Simulation)

- Width: `56px`
- Background: `--color-surface`
- Border-right: `1px solid var(--color-border)`
- Icons: `20px` Lucide icons, centered, stacked vertically
- Default state: `--color-text-muted`
- Hover: `--color-text`, background `rgba(255,255,255,0.05)`
- Active: `--color-brand`, left border accent `2px solid var(--color-brand)`
- Tooltip on hover showing tool name

### Landing Page Navigation

- Sticky top, `--color-bg` with slight transparency and blur
- Logo left, nav links center, CTA right
- On scroll: add `border-bottom` and increase background opacity

---

## Modals

- Backdrop: `rgba(0, 0, 0, 0.6)` + `backdrop-filter: blur(4px)`
- Modal surface: `--color-surface`, `--radius-lg`, `--shadow-xl`
- Max width: `480px` (small), `640px` (medium), `800px` (large)
- Padding: `--space-6`
- Entrance: `scale: 0.95→1, opacity: 0→1` (spring, 0.4s)
- Exit: `scale: 1→0.95, opacity: 1→0` (ease-out, 0.2s)
- Close button: top-right, ghost button, `X` icon
- Use shadcn/ui `<Dialog>` component

---

## Tables

Used in: log viewer, simulation history, admin panels.

- Header row: `--color-text-muted`, `text-caption` size, uppercase, `--font-sans`
- Body rows: `--color-text`, `text-body-sm`
- Row border: `border-bottom: 1px solid var(--color-border)`
- Row hover: `background: var(--color-surface-hover)`
- Alternating row stripes: do NOT use (it breaks the premium dark aesthetic)
- Monospace columns (timestamps, IDs, status codes): `--font-mono`
- Use shadcn/ui `<Table>` when available

---

## Loading States

- **Skeleton loaders** — shimmer effect on `--color-surface-hover`, pulsing opacity `0.5→1`
- **AI thinking indicator** — three dots cycling: `● ◌ ○` with subtle pulsing glow
- **Progress bar** — thin (2px) at top of panel, brand color, animated width
- **Spinner** — do NOT use spinners. Use skeleton or AI indicator instead.
- **Terminal loading** — blinking cursor: `█` blink at 530ms interval

```css
@keyframes skeleton-shimmer {
  0%   { opacity: 0.5; }
  50%  { opacity: 1; }
  100% { opacity: 0.5; }
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

---

## Empty States

- Center-aligned in the available space
- Lucide icon (muted, 48px) + heading + description + optional CTA
- Icon: `--color-text-muted`
- Heading: `text-h4`, `--color-text`
- Description: `text-body-sm`, `--color-text-secondary`
- Do NOT leave blank areas — always show an empty state

Example:
```
        [MessageSquare icon, 48px, muted]
        No messages yet
        Start a conversation with your team
```

---

## Error States

- Inline errors (form validation): `--color-error` text below field, `text-caption`
- Toast notifications: bottom-right, `--color-surface` background, left border colored by severity
- Error cards: `border: 1px solid var(--color-error-muted)`, `background: var(--color-error-muted)`
- API error fallback: center-aligned error message + "Try Again" button
- Never show raw error messages to the user. Always wrap in human-readable text.

---

## Animations

### Animated Components Sourcing (21st.dev)

- **Mandatory Rule:** Use **21st.dev** for design purposes for animated and UI components.
- Query 21st.dev via the 21st MCP client (`search`, `get_component`, `get_theme`) to inspect and pull state-of-the-art Motion/Tailwind components and interactive micro-animations before writing manual animation implementations.

### Animation Library

**Motion** (Framer Motion v12+)

```typescript
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
```

### Spring Configuration

```typescript
// Standard spring — used for most UI interactions
const springDefault = { type: 'spring', bounce: 0.05, duration: 0.6 };

// Quick spring — used for hover states, small interactions
const springQuick = { type: 'spring', bounce: 0.05, duration: 0.3 };

// Slow spring — used for hero animations, page entrances
const springSlow = { type: 'spring', bounce: 0.05, duration: 0.8 };
```

### Stagger Configuration

```typescript
// Hero headline lines
const staggerHero = { delayChildren: 0.2, staggerChildren: 0.15 };

// Card grids, list items
const staggerChildren = { delayChildren: 0.1, staggerChildren: 0.08 };

// Evaluation evidence cards
const staggerCascade = { delayChildren: 0.3, staggerChildren: 0.1 };
```

### Easing Curves

```css
--ease-out-expo:      cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-sine:   cubic-bezier(0.37, 0, 0.63, 1);
```

### Animated Background — Canvas Specification

The background is a `<canvas>` element rendered at full viewport behind all content. It communicates: **"Intelligent digital infrastructure running underneath the application."**

```
Component: AnimatedBackground.tsx
Position: fixed, z-index: 0, covers full viewport
Render: requestAnimationFrame loop

Elements:
├── BASE
│   └── Fill: #0a0a0a (near-black)
│
├── GRID
│   ├── Style: Orthogonal lines (horizontal + vertical)
│   ├── Opacity: 0.03–0.06
│   ├── Spacing: ~60px
│   └── Movement: Very slow drift (0.05px/frame), creates subtle parallax
│
├── NODES (30–50 floating dots)
│   ├── Size: 2–4px radius
│   ├── White nodes: opacity 0.1–0.3 (majority)
│   ├── Red nodes (#c40505): opacity 0.05–0.15 (sparse, ~20%)
│   ├── Movement: Brownian drift, max speed 0.3px/frame
│   └── Subtle pulse: radius oscillates ±0.5px over 3–5 seconds
│
├── CONNECTIONS
│   ├── Draw lines between nodes within 150px of each other
│   ├── Color: white
│   ├── Opacity: proportional to distance — closer = brighter
│   │   └── Formula: opacity = (1 - distance/150) * 0.15
│   └── Red pulse: every 5–8 seconds, a brief red light travels along a random connection
│
└── PERFORMANCE
    ├── Use requestAnimationFrame
    ├── Skip frame if delta > 16ms (maintain 60fps)
    ├── Pause when tab is not visible (document.hidden)
    └── Canvas resolution: match devicePixelRatio
```

**Do NOT:** Use generic particle libraries. Build this as a custom canvas component for full control.

### Grain Overlay — CSS Specification

```
Component: GrainOverlay.tsx
Position: fixed, z-index: 1, covers full viewport
Pointer-events: none (click-through)

Implementation:
├── CSS ::after pseudo-element
├── Background: SVG noise filter (inline or data URI)
├── Opacity: 0.03
├── Mix-blend-mode: overlay
└── Optional: very subtle opacity flicker (0.02–0.04) at ~0.5Hz
```

### Component Motion Map

#### Page Load / Entrance Animations

| Component | Initial | Animate | Transition |
|:---|:---|:---|:---|
| Hero headline (each line) | `{ y: 30, opacity: 0 }` | `{ y: 0, opacity: 1 }` | Spring, stagger 0.15s |
| Hero subtext | `{ y: 20, opacity: 0 }` | `{ y: 0, opacity: 1 }` | Spring, delay after headline |
| Hero CTA button | `{ scale: 0.9, opacity: 0 }` | `{ scale: 1, opacity: 1 }` | Spring, delay after subtext |
| Auth form card | `{ scale: 0.95, opacity: 0 }` | `{ scale: 1, opacity: 1 }` | Spring 0.6s |
| Dashboard cards | `{ y: 20, opacity: 0 }` | `{ y: 0, opacity: 1 }` | Spring, stagger 0.08s |
| Evaluation scores | `{ number: 0 }` | `{ number: finalScore }` | Tween 1.5s ease-out |
| Radar chart | SVG path morph from center point | Full radar shape | 1.5s ease-out |
| Evidence cards | `{ y: -20, opacity: 0 }` | `{ y: 0, opacity: 1 }` | Stagger 0.1s, after radar |
| Next mission card | `{ scale: 0.8, opacity: 0 }` | `{ scale: 1, opacity: 1 }` | Spring, glow border fade-in |

#### Scroll-Triggered Animations

| Component | Animation | Trigger |
|:---|:---|:---|
| Feature cards | Fade-up: `y: 40→0, opacity: 0→1` | IntersectionObserver, threshold 0.2 |
| Comparison section | Left column slides from left, right from right | IntersectionObserver |
| How It Works steps | Sequential fade-in, stagger 0.12s | IntersectionObserver |
| CTA section | Fade-up | IntersectionObserver |

Use `motion/react`'s `whileInView` prop with `viewport={{ once: true, amount: 0.2 }}`.

#### Interactive / Live Animations

| Component | Animation | Trigger |
|:---|:---|:---|
| Slack messages | `{ y: 20, opacity: 0 } → { y: 0, opacity: 1 }` | New message arrival |
| AI typing indicator | Three dots pulse: `● ◌ ○` cycling | AI agent is generating |
| Log entries | `{ y: -10, opacity: 0 } → { y: 0, opacity: 1 }` | New log added |
| Terminal output | Typewriter: character-by-character, 20-30ms per char | Command executed |
| Terminal cursor | Blinking `█`, 530ms interval | Always visible in terminal |
| Event timeline items | `{ x: 20, opacity: 0 } → { x: 0, opacity: 1 }` | New event logged |
| Completion splash | Full-screen `scale: 0→1` with radial gradient | Simulation completed |
| Tool panel switch | `AnimatePresence` crossfade: exit left, enter right | User clicks sidebar tool |

#### Hover / Interaction States

| Element | Hover Effect |
|:---|:---|
| **Primary CTA button** | `y: -2px`, `box-shadow: var(--shadow-glow-brand)`, brightness +5% |
| **Secondary button** | `background: var(--color-surface-hover)`, `border-color: var(--color-border-hover)` |
| **Ghost button** | `background: rgba(255,255,255,0.05)` |
| **Feature card** | `y: -4px`, `border-color: var(--color-border-hover)`, `shadow: var(--shadow-md)`, arrow icon moves right 4px |
| **Dashboard card** | `y: -3px`, `shadow: var(--shadow-md)`, `border-color: var(--color-border-hover)` |
| **Sidebar tool icon** | `color: var(--color-text)`, `background: rgba(255,255,255,0.05)` |
| **Sidebar active icon** | `color: var(--color-brand)`, left border `2px solid var(--color-brand)` |
| **Slack channel** | `background: var(--color-surface-hover)` |
| **Log row** | `background: var(--color-surface-hover)` |
| **Timeline event** | Subtle brightness increase |

#### Workplace Preview (Landing Page)

Auto-cycling animation showcasing the simulation workspace:

```
Sequence (loop every ~15 seconds):
1. [0s]   Slack message slides in from AI Manager
2. [3s]   Log entries cascade in
3. [6s]   Code editor shows a line change (highlight diff)
4. [9s]   Terminal shows test execution + results
5. [12s]  Skill graph radar updates with animation
6. [15s]  Reset and loop
```

Each step: fade out previous → fade in next, 0.5s crossfade.

### AI Agent Status Indicators

```
● Online    — solid green dot with subtle glow shadow
◌ Analyzing — animated dot, pulsing opacity (0.4→1→0.4), yellow/amber
○ Offline   — hollow grey dot, no glow

Typing indicator (in chat):
  Three dots, sequential opacity pulse
  Each dot: 0.3→1→0.3, offset by 0.2s
  Subtle brand-color glow underneath
```

### Motion Principles (Enforced)

1. **Every animation must communicate one of:** State, Causality, AI activity, Progress, Consequence, Discovery, or Feedback
2. **Professionalism > Flashiness** — no bouncy, playful animations
3. **Meaningful motion > Decorative motion** — if removing the animation loses no information, remove it
4. **Realism > Gamification** — no confetti, no badge pop-ups, no cartoon effects
5. **Spring bounce: 0.05 max** — barely perceptible bounce, never playful
6. **Duration: 0.2s–0.8s** — never longer than 0.8s for UI interactions
7. **Stagger: 0.06s–0.15s** — fast enough to feel fluid, slow enough to be perceived

---

## Accessibility

### Required

- **`prefers-reduced-motion`**: All motion/animation must be disabled when this media query is active. Use the `useReducedMotion` hook from `motion/react`. When reduced motion is preferred, set `duration: 0` on all animations.
- **Focus indicators**: All interactive elements must have visible focus rings. Default: `outline: 2px solid var(--color-brand)`, offset `2px`.
- **Color contrast**: Text on dark backgrounds must meet WCAG AA (4.5:1 for body text, 3:1 for large text). `#fafafa` on `#0a0a0a` = 19.4:1 ✓. `#a1a1a1` on `#111111` = 6.8:1 ✓. `#666666` on `#111111` = 3.4:1 ✓ (large text only).
- **Semantic HTML**: Use `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<aside>` appropriately. Single `<h1>` per page.
- **ARIA labels**: All icon-only buttons must have `aria-label`. Status indicators must have `aria-live="polite"`.
- **Keyboard navigation**: All interactive elements must be reachable via Tab. Sidebar tools must be keyboard-navigable. Modal must trap focus.

### Color-Blind Safe

- Do not rely on color alone to communicate status. Always pair with text, icon, or shape.
- ● `Online` (green) + text label "Online"
- ▲ `Warning` (yellow) + text label
- ✕ `Error` (red) + text label

---

## Do Not

- ❌ Do not use light mode or provide a light mode toggle (dark-first, dark-only for hackathon)
- ❌ Do not use spinners — use skeleton loaders or AI typing indicators
- ❌ Do not use alternating table row stripes
- ❌ Do not use generic purple AI blob backgrounds
- ❌ Do not make the entire UI red — `#c40505` is an accent only
- ❌ Do not use decorative animations that communicate nothing
- ❌ Do not use bounce values above `0.05` in spring animations
- ❌ Do not use animation durations longer than `0.8s` for UI interactions
- ❌ Do not use display/decorative/handwriting fonts
- ❌ Do not use font weights below 400 or above 700
- ❌ Do not use `border-radius` larger than `16px` (except `9999px` for circles)
- ❌ Do not use hard drop shadows — always soft, spread, low-opacity
- ❌ Do not copy Coursera, Udemy, or any LMS design
- ❌ Do not use gamification UI (badges, XP bars, confetti, cartoon characters)
- ❌ Do not use `!important` in CSS
- ❌ Do not create custom components when shadcn/ui provides one
- ❌ Do not build animated or complex UI components from scratch without checking **21st.dev** first (Rule: use 21st.dev for design purposes for animated and UI components)
- ❌ Do not use any icon library other than Lucide React
- ❌ Do not add horizontal scrolling (except event timeline)
- ❌ Do not leave empty areas without an empty state
- ❌ Do not show raw API errors to users
