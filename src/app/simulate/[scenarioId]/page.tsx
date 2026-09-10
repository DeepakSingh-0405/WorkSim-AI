'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';
import {
  PAYMENT_INCIDENT_SCENARIO,
  ScenarioFile,
} from '@/lib/scenarios/payment-incident';
import { Logo } from '@/components/shared/Logo';
import { GlowButton } from '@/components/shared/GlowButton';
import {
  FileCode2,
  Terminal as TerminalIcon,
  Activity,
  MessageSquare,
  ShieldAlert,
  Clock,
  Send,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Flame,
  ArrowRight,
  ChevronRight,
  Info,
  Building2,
  UserCheck,
} from 'lucide-react';

// Dynamic import for Monaco to prevent SSR window issues
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#111318] text-[#a1a1a1] text-xs font-mono">
      Loading Monaco Editor...
    </div>
  ),
});

type ToolTab = 'mission' | 'code' | 'logs' | 'terminal' | 'slack';
type AgentId = 'priya' | 'alex' | 'client';

interface ChatMessage {
  id: string;
  sender: 'user' | 'priya' | 'alex' | 'client';
  text: string;
  timestamp: string;
}

export default function SimulationWorkspacePage() {
  const router = useRouter();
  const scenario = PAYMENT_INCIDENT_SCENARIO;

  // Workspace Navigation & State
  const [activeTool, setActiveTool] = useState<ToolTab>('code');
  const [activeFile, setActiveFile] = useState<ScenarioFile>(scenario.files[0]);
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'config.ts': scenario.files[0].content,
    'client.ts': scenario.files[1].content,
  });

  // Timer: 35 minutes countdown
  const [secondsRemaining, setSecondsRemaining] = useState(35 * 60);

  // Active AI Agent: Priya (Manager), Alex (Coworker), or Client (Marcus Vance)
  const [activeAgent, setActiveAgent] = useState<AgentId>('priya');
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Dedicated Threads for Each Agent
  const [agentThreads, setAgentThreads] = useState<Record<AgentId, ChatMessage[]>>({
    priya: [
      {
        id: 'priya-init',
        sender: 'priya',
        text: "The Payment API error rate reached 43.8% right after deployment v2.4.1. Executive escalation triggers in under 30 minutes. What is the current status of your investigation, and what is your ETA for a fix?",
        timestamp: '02:16 AM',
      },
    ],
    alex: [
      {
        id: 'alex-init',
        sender: 'alex',
        text: "Hey! Saw the P1 alert. I can give you quick second eyes if you get stuck, but you'll have to drive the fix. Check the logs and run 'npm test' in the terminal.",
        timestamp: '02:17 AM',
      },
    ],
    client: [
      {
        id: 'client-init',
        sender: 'client',
        text: "This is Marcus Vance from BuyFast. Our checkout is failing with HTTP 500 errors for hundreds of shoppers right now! We are bleeding $15,000 every minute. What is your status and when will checkout be back up?!",
        timestamp: '02:18 AM',
      },
    ],
  });

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'TechFlow Production Diagnostic Shell (pod-payment-service-8f99a)',
    'Type "npm test" to run integration suite or "help" for commands.',
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  // Log filter
  const [logFilter, setLogFilter] = useState<'ALL' | 'ERROR'>('ALL');

  // Timeline Events
  const [events, setEvents] = useState<string[]>([
    'Simulation initialized: P1 Payment Incident',
  ]);

  // Resolution / Evaluation Modal
  const [submittingModalOpen, setSubmittingModalOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addEvent = (text: string) => {
    setEvents((prev) => [...prev, text]);
  };

  // Chat Submission to /api/chat with streaming
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;

    const userText = chatInput.trim();
    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentThread = agentThreads[activeAgent] || [];
    const updatedThread = [...currentThread, newMsg];

    setAgentThreads((prev) => ({
      ...prev,
      [activeAgent]: updatedThread,
    }));
    setChatInput('');
    setIsAiTyping(true);

    const agentName =
      activeAgent === 'priya'
        ? 'Priya (Manager)'
        : activeAgent === 'alex'
        ? 'Alex (Coworker)'
        : 'Marcus (Client)';
    addEvent(`Sent message to ${agentName}`);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedThread.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          agentId: activeAgent,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiText = '';
      const aiMsgId = `ai-${Date.now()}`;
      // Append initial message to thread so stream renders progressively
      setAgentThreads((prev) => ({
        ...prev,
        [activeAgent]: [
          ...(prev[activeAgent] || []),
          {
            id: aiMsgId,
            sender: activeAgent,
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      }));

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const rawChunk = decoder.decode(value, { stream: true });

          let chunkText = '';
          if (rawChunk.includes('0:')) {
            const lines = rawChunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('0:')) {
                try {
                  chunkText += JSON.parse(line.slice(2));
                } catch {
                  chunkText += line.slice(2);
                }
              } else if (line.trim().length > 0 && !line.startsWith('d:')) {
                chunkText += line;
              }
            }
          } else {
            chunkText = rawChunk;
          }

          aiText += chunkText;
          const currentText = aiText;

          // Progressive UI update: words appear immediately!
          setAgentThreads((prev) => {
            const thread = prev[activeAgent] || [];
            return {
              ...prev,
              [activeAgent]: thread.map((m) =>
                m.id === aiMsgId ? { ...m, text: currentText } : m
              ),
            };
          });
        }
      }

      // If text arrived empty, set a fallback message
      if (!aiText.trim()) {
        setAgentThreads((prev) => {
          const thread = prev[activeAgent] || [];
          return {
            ...prev,
            [activeAgent]: thread.map((m) =>
              m.id === aiMsgId
                ? {
                    ...m,
                    text:
                      activeAgent === 'priya'
                        ? 'Status update acknowledged. Continue investigating.'
                        : activeAgent === 'alex'
                        ? 'Keep me posted on what you find.'
                        : 'What is your ETA to restore checkout?',
                  }
                : m
            ),
          };
        });
      }
    } catch (err) {
      console.error('Chat stream error:', err);
      const fallbackReply: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: activeAgent,
        text:
          activeAgent === 'priya'
            ? 'What is your current status on the payment API investigation? Give me a concrete update.'
            : activeAgent === 'alex'
            ? 'Take a look at the Stripe p99 latency in the logs and compare with config.ts.'
            : 'When will checkout be back up? Our executive team is demanding an immediate ETA.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAgentThreads((prev) => ({
        ...prev,
        [activeAgent]: [...(prev[activeAgent] || []), fallbackReply],
      }));
    } finally {
      setIsAiTyping(false);
    }
  };

  // Terminal Command Execution
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd) return;

    setTerminalHistory((prev) => [...prev, `$ ${cmd}`]);
    setTerminalInput('');

    const configCode = fileContents['config.ts'] || '';
    const match = configCode.match(/timeout\s*:\s*(\d+)/i);
    const parsedTimeout = match ? parseInt(match[1], 10) : 2000;
    const isTimeoutFixed = parsedTimeout >= 3200;

    if (cmd === 'npm test' || cmd === 'test') {
      if (isTimeoutFixed) {
        addEvent(`Ran test suite in terminal: ALL TESTS PASSING (${parsedTimeout}ms timeout)`);
        setTerminalHistory((prev) => [
          ...prev,
          '> Running payment-service integration test suite...',
          '  ✓ chargePayment succeeds with valid payload (41ms)',
          `  ✓ chargePayment handles slow Stripe latency up to 3200ms (${parsedTimeout}ms configured)`,
          '  ✓ retry backoff logic conforms to TechFlow SLA (110ms)',
          '',
          'Tests: 3 passed, 0 failed',
          `Status: ALL TESTS PASSING. Headroom: +${parsedTimeout - 3200}ms above Stripe p99 latency. Ready to submit hotfix!`,
        ]);
      } else {
        addEvent(`Ran test suite in terminal: FAILED (${parsedTimeout}ms < 3200ms)`);
        setTerminalHistory((prev) => [
          ...prev,
          '> Running payment-service integration test suite...',
          '  ✓ chargePayment succeeds with valid payload (41ms)',
          `  ✗ chargePayment handles slow Stripe latency (TIMEOUT - 3200ms Stripe latency > ${parsedTimeout}ms threshold)`,
          '  ✗ chargePayment retry threshold respects upstream p99 latency',
          '',
          'Tests: 1 passed, 2 failed',
          `Failure: Operation timed out after ${parsedTimeout}ms. Stripe upstream p99 latency is 3200ms. Adjust timeout threshold in config.ts to at least 3200ms (recommended 5000ms).`,
        ]);
      }
    } else if (cmd === 'git diff') {
      addEvent('Inspected git diff in terminal');
      if (parsedTimeout !== 2000) {
        setTerminalHistory((prev) => [
          ...prev,
          'diff --git a/src/services/payment/config.ts b/src/services/payment/config.ts',
          '--- a/src/services/payment/config.ts',
          '+++ b/src/services/payment/config.ts',
          `@@ -8,3 +8,3 @@`,
          `-  timeout: 2000,`,
          `+  timeout: ${parsedTimeout},`,
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          'diff --git a/src/services/payment/config.ts b/src/services/payment/config.ts',
          '# No modified changes staged. Timeout is currently default (2000ms).',
        ]);
      }
    } else if (cmd === 'help') {
      setTerminalHistory((prev) => [
        ...prev,
        'Available commands:',
        '  npm test      - Run integration test suite against current config',
        '  git diff      - Inspect code diff',
        '  clear         - Clear terminal screen',
      ]);
    } else if (cmd === 'clear') {
      setTerminalHistory(['TechFlow Production Diagnostic Shell']);
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        `command not found: ${cmd}. Type "npm test" or "help".`,
      ]);
    }
  };

  // Submit Hotfix & Route to Evaluation
  const handleFinalSubmit = async () => {
    setIsEvaluating(true);
    addEvent('Submitted hotfix for automated evaluation');

    const allChatHistory = [
      ...agentThreads.priya,
      ...agentThreads.alex,
      ...agentThreads.client,
    ];

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'demo-session-' + Date.now(),
          scenarioId: 'production-incident-payment-api',
          files: fileContents,
          submittedCode: fileContents['config.ts'],
          chatThreads: agentThreads,
          chatHistory: allChatHistory,
          events,
          durationSeconds: 35 * 60 - secondsRemaining,
        }),
      });

      const data = await response.json();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('worksim_latest_evaluation', JSON.stringify(data));
      }
      router.push('/evaluation/demo-session');
    } catch {
      router.push('/evaluation/demo-session');
    }
  };

  const currentMessages = agentThreads[activeAgent] || [];

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0c10] text-[#fafafa] font-sans overflow-hidden select-none">
      {/* Responsive warning for small viewports (< 1024px) */}
      <div className="lg:hidden fixed inset-0 z-50 bg-[#0a0c10] p-6 flex flex-col items-center justify-center text-center">
        <ShieldAlert className="w-12 h-12 text-[#c40505] mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Desktop Browser Required</h2>
        <p className="text-xs text-[#a1a1a1] max-w-sm leading-relaxed mb-6">
          The WorkSim incident war room requires at least 1024px screen width to display the multi-panel Monaco editor, terminal, telemetry logs, and AI coworker chat.
        </p>
        <Link href="/dashboard">
          <GlowButton size="sm" variant="secondary">
            Return to Dashboard
          </GlowButton>
        </Link>
      </div>

      {/* 1. TOP STATUS / HEADER (48px) */}
      <header className="h-12 border-b border-white/[0.08] bg-[#0d0f14] px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Logo size="sm" href="/dashboard" />
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-semibold text-white">TechFlow Inc.</span>
            <span className="text-white/30">•</span>
            <span className="text-[#a1a1a1] truncate max-w-[200px] sm:max-w-none">
              {scenario.title}
            </span>
          </div>
        </div>

        {/* Center: Live Timer & Incident Status */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] font-semibold animate-pulse">
            <Flame className="w-3 h-3" />
            <span>P1 CRITICAL</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-white">
            <Clock className="w-3.5 h-3.5 text-[#a1a1a1]" />
            <span className="font-bold">{formatTimer(secondsRemaining)}</span>
          </div>
        </div>

        {/* Right: Submit Button */}
        <div className="flex items-center gap-2">
          <GlowButton
            size="sm"
            variant="primary"
            onClick={() => setSubmittingModalOpen(true)}
            className="font-semibold text-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Submit Hotfix
          </GlowButton>
        </div>
      </header>

      {/* 2. MAIN 3-COLUMN WORKSPACE BODY */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT ICON TOOLBAR (56px) */}
        <aside className="w-14 border-r border-white/[0.08] bg-[#0c0e12] flex flex-col items-center py-3 gap-2 shrink-0 z-20">
          {[
            { id: 'code', label: 'Code Editor', icon: FileCode2 },
            { id: 'logs', label: 'Log Stream', icon: Activity },
            { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
            { id: 'slack', label: 'Slack', icon: MessageSquare },
            { id: 'mission', label: 'Briefing', icon: Info },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTool === tab.id;
            return (
              <button
                key={tab.id}
                title={tab.label}
                onClick={() => {
                  setActiveTool(tab.id as ToolTab);
                  addEvent(`Switched to tool: ${tab.label}`);
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all relative ${
                  isActive
                    ? 'bg-[#c40505]/20 text-[#c40505] border border-[#c40505]/40 shadow-[0_0_12px_rgba(196,5,5,0.25)]'
                    : 'text-[#666666] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#c40505] rounded-r" />
                )}
              </button>
            );
          })}
        </aside>

        {/* CENTER PRIMARY TOOL VIEWER (flex-1) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0e1015] overflow-hidden">
          {/* A. Monaco Code Editor */}
          {activeTool === 'code' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* File Tabs Bar */}
              <div className="h-9 border-b border-white/[0.08] bg-[#111319] flex items-center px-2 gap-1 shrink-0">
                {scenario.files.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file)}
                    className={`h-7 px-3 rounded-t text-xs font-mono flex items-center gap-1.5 transition-colors ${
                      activeFile.name === file.name
                        ? 'bg-[#0e1015] text-white border-t-2 border-t-[#c40505] border-x border-white/[0.08]'
                        : 'text-[#a1a1a1] hover:text-white'
                    }`}
                  >
                    <FileCode2 className="w-3.5 h-3.5 text-[#3b82f6]" />
                    <span>{file.name}</span>
                    {file.name === 'config.ts' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    )}
                  </button>
                ))}
              </div>

              {/* Editor Container */}
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  theme="vs-dark"
                  language={activeFile.language}
                  value={fileContents[activeFile.name]}
                  onChange={(val) => {
                    setFileContents((prev) => ({
                      ...prev,
                      [activeFile.name]: val || '',
                    }));
                  }}
                  options={{
                    fontSize: 13,
                    fontFamily: 'var(--font-mono), monospace',
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>
          )}

          {/* B. Incident Logs Viewer */}
          {activeTool === 'logs' && (
            <div className="flex-1 flex flex-col h-full bg-[#0b0c10] font-mono text-xs overflow-hidden">
              <div className="h-10 border-b border-white/[0.08] bg-[#111319] px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#ef4444]" />
                  <span className="text-white font-semibold">Incident Telemetry Log Stream</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLogFilter('ALL')}
                    className={`px-2.5 py-1 rounded text-[11px] ${
                      logFilter === 'ALL'
                        ? 'bg-white/10 text-white'
                        : 'text-[#666666] hover:text-white'
                    }`}
                  >
                    All Logs ({scenario.initialLogs.length})
                  </button>
                  <button
                    onClick={() => setLogFilter('ERROR')}
                    className={`px-2.5 py-1 rounded text-[11px] ${
                      logFilter === 'ERROR'
                        ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                        : 'text-[#666666] hover:text-white'
                    }`}
                  >
                    Errors Only
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {scenario.initialLogs
                  .filter((log) => logFilter === 'ALL' || log.level === 'ERROR' || log.level === 'FATAL')
                  .map((log) => (
                    <div
                      key={log.id}
                      className={`p-2 rounded border flex items-start gap-3 leading-relaxed ${
                        log.level === 'ERROR' || log.level === 'FATAL'
                          ? 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#fafafa]'
                          : log.level === 'WARN'
                          ? 'bg-yellow-950/20 border-yellow-800/30 text-yellow-300'
                          : 'bg-white/[0.02] border-white/[0.04] text-[#a1a1a1]'
                      }`}
                    >
                      <span className="text-[11px] text-[#666666] shrink-0">
                        {log.timestamp}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                          log.level === 'ERROR' || log.level === 'FATAL'
                            ? 'bg-[#ef4444] text-white'
                            : log.level === 'WARN'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-white/60 font-semibold shrink-0">
                        {log.service}:
                      </span>
                      <span className="flex-1 text-xs">{log.message}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* C. Terminal Shell */}
          {activeTool === 'terminal' && (
            <div className="flex-1 flex flex-col h-full bg-[#0a0b0e] font-mono text-xs overflow-hidden">
              <div className="h-10 border-b border-white/[0.08] bg-[#111319] px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-white">
                  <TerminalIcon className="w-4 h-4 text-[#22c55e]" />
                  <span>pod-payment-service-prod: ~</span>
                </div>
                <span className="text-[11px] text-[#666666]">Node.js v20.12 • Jest 29.7</span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-1.5 leading-relaxed">
                {terminalHistory.map((line, idx) => (
                  <p
                    key={idx}
                    className={
                      line.startsWith('$')
                        ? 'text-white font-bold'
                        : line.includes('passed') || line.includes('✓')
                        ? 'text-[#22c55e]'
                        : line.includes('failed') || line.includes('✗') || line.includes('TIMEOUT')
                        ? 'text-[#ef4444]'
                        : 'text-[#a1a1a1]'
                    }
                  >
                    {line}
                  </p>
                ))}
              </div>

              <form
                onSubmit={handleTerminalSubmit}
                className="p-3 bg-[#0d0f14] border-t border-white/[0.08] flex items-center gap-2 shrink-0"
              >
                <span className="text-[#22c55e] font-bold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder='Try "npm test" or "git diff"...'
                  className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono"
                />
              </form>
            </div>
          )}

          {/* D. Slack War Room View */}
          {activeTool === 'slack' && (
            <div className="flex-1 flex flex-col h-full bg-[#111319] overflow-hidden">
              <div className="h-10 border-b border-white/[0.08] px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 text-white font-medium text-xs">
                  <MessageSquare className="w-4 h-4 text-[#c40505]" />
                  <span># incident-response</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#a1a1a1]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Priya Sharma (EM)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Alex Chen (SWE)
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Marcus Vance (Client)
                  </span>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {/* Unified Channel Activity */}
                {[
                  ...agentThreads.priya,
                  ...agentThreads.alex,
                  ...agentThreads.client,
                ].map((m) => (
                  <div key={m.id} className="flex items-start gap-3 text-xs">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                        m.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : m.sender === 'priya'
                          ? 'bg-[#c40505] text-white'
                          : m.sender === 'alex'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {m.sender === 'user'
                        ? 'YOU'
                        : m.sender === 'priya'
                        ? 'PS'
                        : m.sender === 'alex'
                        ? 'AC'
                        : 'MV'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">
                          {m.sender === 'user'
                            ? 'You'
                            : m.sender === 'priya'
                            ? 'Priya Sharma (EM)'
                            : m.sender === 'alex'
                            ? 'Alex Chen (Senior SWE)'
                            : 'Marcus Vance (VP, BuyFast Client)'}
                        </span>
                        <span className="text-[10px] text-[#666666]">{m.timestamp}</span>
                      </div>
                      <p
                        className={`text-[#d1d5db] leading-relaxed p-2.5 rounded-lg border ${
                          m.sender === 'client'
                            ? 'bg-amber-950/20 border-amber-800/30 text-amber-100'
                            : 'bg-white/[0.02] border-white/[0.04]'
                        }`}
                      >
                        {m.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E. Mission Briefing View */}
          {activeTool === 'mission' && (
            <div className="flex-1 p-6 overflow-y-auto bg-[#0d0f14] max-w-3xl space-y-6 text-sm">
              <div className="border-b border-white/[0.08] pb-4">
                <span className="text-xs font-mono text-[#c40505] uppercase">
                  Scenario Briefing
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{scenario.title}</h3>
                <p className="text-xs text-[#a1a1a1] mt-1">{scenario.company} • SLA: 35 minutes</p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase text-[#a1a1a1] mb-2 font-semibold">
                  Incident Objective
                </h4>
                <p className="text-[#d1d5db] leading-relaxed">{scenario.objective}</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-mono uppercase text-[#22c55e] font-semibold">
                  Action Checklist
                </h4>
                <ul className="space-y-1.5 text-xs text-[#a1a1a1]">
                  <li>1. Review the logs in the Log Stream tool to observe latency spikes.</li>
                  <li>2. Check <code className="text-white font-mono">config.ts</code> in the Code Editor.</li>
                  <li>3. Run <code className="text-white font-mono">npm test</code> in the Terminal to reproduce the failure.</li>
                  <li>4. Update the timeout value with sufficient headroom for Stripe latency.</li>
                  <li>5. Re-run tests and click "Submit Hotfix" once verified!</li>
                </ul>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT PANEL: AI TEAMMATE & CLIENT CHAT (320px) */}
        <aside className="w-80 border-l border-white/[0.08] bg-[#0c0e12] flex flex-col shrink-0 z-20">
          {/* Agent Switcher Header with 3 Agents */}
          <div className="h-12 border-b border-white/[0.08] bg-[#101318] px-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveAgent('priya')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                  activeAgent === 'priya'
                    ? 'bg-[#c40505]/20 text-white border border-[#c40505]/40'
                    : 'text-[#a1a1a1] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>Priya (EM)</span>
              </button>
              <button
                onClick={() => setActiveAgent('alex')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                  activeAgent === 'alex'
                    ? 'bg-blue-600/20 text-white border border-blue-500/40'
                    : 'text-[#a1a1a1] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>Alex (SWE)</span>
              </button>
              <button
                onClick={() => setActiveAgent('client')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                  activeAgent === 'client'
                    ? 'bg-amber-600/25 text-amber-300 border border-amber-500/50'
                    : 'text-amber-500/70 hover:text-amber-400'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Client (VP)</span>
              </button>
            </div>
            <span className="text-[10px] font-mono text-[#666666]">Gemini AI</span>
          </div>

          {/* Active Agent Context Header */}
          <div className="p-2.5 bg-white/[0.02] border-b border-white/[0.04] text-[11px] leading-tight">
            {activeAgent === 'priya' ? (
              <p className="text-[#a1a1a1]">
                <span className="text-white font-semibold">Priya Sharma (EM):</span> Task assigner. Demands status updates & ETAs. Evaluates user progress.
              </p>
            ) : activeAgent === 'alex' ? (
              <p className="text-[#a1a1a1]">
                <span className="text-white font-semibold">Alex Chen (Senior SWE):</span> Coworker. Gives minimal guidance & subtle clues without solving.
              </p>
            ) : (
              <p className="text-amber-200/90 bg-amber-950/20 p-1 rounded border border-amber-800/30">
                <span className="text-amber-400 font-semibold">Marcus Vance (BuyFast Client):</span> Unhappy executive. Only demands updates & states business SLA requirements.
              </p>
            )}
          </div>

          {/* Chat Messages Stream for Active Agent */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {currentMessages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-lg max-w-[90%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'ml-auto bg-blue-600/80 text-white'
                    : m.sender === 'priya'
                    ? 'mr-auto bg-[#181a20] border border-[#c40505]/30 text-white'
                    : m.sender === 'alex'
                    ? 'mr-auto bg-[#181a20] border border-blue-500/30 text-white'
                    : 'mr-auto bg-amber-950/30 border border-amber-600/40 text-amber-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-white/50 mb-1">
                  <span>
                    {m.sender === 'user'
                      ? 'You'
                      : m.sender === 'priya'
                      ? 'Priya'
                      : m.sender === 'alex'
                      ? 'Alex'
                      : 'Marcus (Client)'}
                  </span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            ))}

            {isAiTyping && (
              <div className="text-[11px] text-[#a1a1a1] italic flex items-center gap-1.5 p-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-pulse" />
                <span>
                  {activeAgent === 'priya'
                    ? 'Priya'
                    : activeAgent === 'alex'
                    ? 'Alex'
                    : 'Marcus (Client)'}{' '}
                  is typing...
                </span>
              </div>
            )}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 border-t border-white/[0.08] bg-[#101318] flex items-center gap-1.5 shrink-0"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message ${
                activeAgent === 'priya'
                  ? 'Priya'
                  : activeAgent === 'alex'
                  ? 'Alex'
                  : 'Marcus (Client)'
              }...`}
              className="flex-1 bg-[#090a0d] border border-white/10 rounded-md px-2.5 py-1.5 text-xs text-white placeholder:text-[#666666] focus:outline-none focus:border-[#c40505]"
            />
            <button
              type="submit"
              disabled={isAiTyping || !chatInput.trim()}
              className="w-8 h-8 rounded-md bg-[#c40505] text-white flex items-center justify-center hover:bg-[#a50404] transition-colors disabled:opacity-40 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </aside>
      </div>

      {/* 3. BOTTOM EVENT TIMELINE (36px) */}
      <footer className="h-9 border-t border-white/[0.08] bg-[#0c0e12] px-4 flex items-center gap-4 text-[11px] font-mono shrink-0 overflow-x-auto">
        <span className="text-[#666666] uppercase shrink-0">Live Audit:</span>
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          {events.slice(-4).map((evt, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[#a1a1a1] bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.04]"
            >
              <ChevronRight className="w-3 h-3 text-[#22c55e]" />
              <span>{evt}</span>
            </span>
          ))}
        </div>
      </footer>

      {/* 4. SUBMIT HOTFIX CONFIRMATION MODAL */}
      <AnimatePresence>
        {submittingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12141a] p-6 shadow-2xl"
            >
              {isEvaluating ? (
                <div className="space-y-4 py-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#c40505]/20 border border-[#c40505]/40 flex items-center justify-center mx-auto text-[#c40505]">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Synthesizing Incident Telemetry...
                    </h4>
                    <p className="text-xs text-[#a1a1a1] leading-relaxed">
                      Evaluating code patch, test runs, and multi-agent communications with Priya, Alex, and Marcus.
                    </p>
                  </div>
                  {/* Animated Progress Bar */}
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '10%' }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 3.5, ease: 'easeInOut' }}
                      className="h-full bg-gradient-to-r from-[#c40505] to-[#22c55e]"
                    />
                  </div>
                  <div className="text-[11px] font-mono text-[#a1a1a1] flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                    <span>Calibrating against senior engineering benchmark...</span>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                    Submit Incident Hotfix?
                  </h3>
                  <p className="text-xs text-[#a1a1a1] leading-relaxed mb-6">
                    Your code changes in <code className="text-white font-mono">config.ts</code>, your communication with Priya (Manager), Alex (Coworker), and Marcus (Client), and your diagnostic test velocity will now be evaluated by the WorkSim telemetry engine.
                  </p>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittingModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs text-[#a1a1a1] hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <GlowButton
                      size="sm"
                      variant="primary"
                      onClick={handleFinalSubmit}
                    >
                      Confirm & Generate Radar Scorecard
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </GlowButton>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
