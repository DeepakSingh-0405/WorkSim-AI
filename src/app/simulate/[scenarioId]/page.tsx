'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { saveEvaluationRecord, EvaluationRecord } from '@/lib/scores';
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
  ChevronDown,
  Info,
  Building2,
  UserCheck,
  FolderTree,
  Folder,
  File,
  Maximize2,
  Minimize2,
  X,
  Layers,
  ChevronLeft,
  Search,
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

type ToolTab = 'code' | 'logs' | 'terminal' | 'slack' | 'mission';
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

  // VS Code Resizable Panels State
  const [sidePanelWidth, setSidePanelWidth] = useState(240);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [agentPanelWidth, setAgentPanelWidth] = useState(360);
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(230);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  // Resize Dragging Indicators
  const [isResizingSide, setIsResizingSide] = useState(false);
  const [isResizingAgent, setIsResizingAgent] = useState(false);
  const [isResizingTerminal, setIsResizingTerminal] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

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

  // Terminal State & Command History Navigation
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'TechFlow Production Diagnostic Shell (x86_64-linux-gnu)',
    'Type "help" or "npm test" to run integration tests.',
    '',
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const [commandHistoryList, setCommandHistoryList] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  // Evaluation & Telemetry Events
  const [events, setEvents] = useState<string[]>([
    'Incident war room initiated by candidate',
  ]);
  const [submittingModalOpen, setSubmittingModalOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const addEvent = (desc: string) => {
    setEvents((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${desc}`]);
  };

  // Timer countdown hook
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds to mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  // VS Code Panel Resizing Drag Engine
  useEffect(() => {
    if (!isResizingSide && !isResizingAgent && !isResizingTerminal) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSide) {
        // Activity bar width is 56px (w-14)
        const newWidth = Math.max(160, Math.min(450, e.clientX - 56));
        setSidePanelWidth(newWidth);
      } else if (isResizingAgent) {
        const newWidth = Math.max(260, Math.min(650, window.innerWidth - e.clientX));
        setAgentPanelWidth(newWidth);
      } else if (isResizingTerminal) {
        const container = workspaceRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const newHeight = Math.max(100, Math.min(rect.height - 120, rect.bottom - e.clientY));
          setTerminalHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingSide(false);
      setIsResizingAgent(false);
      setIsResizingTerminal(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isResizingSide, isResizingAgent, isResizingTerminal]);

  // Multi-Agent Chat Message Dispatcher
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

  // Terminal Input KeyDown Handler for Up/Down Arrow Command History
  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistoryList.length === 0) return;
      const nextPointer = historyPointer === -1 ? commandHistoryList.length - 1 : Math.max(0, historyPointer - 1);
      setHistoryPointer(nextPointer);
      setTerminalInput(commandHistoryList[nextPointer] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;
      const nextPointer = historyPointer + 1;
      if (nextPointer >= commandHistoryList.length) {
        setHistoryPointer(-1);
        setTerminalInput('');
      } else {
        setHistoryPointer(nextPointer);
        setTerminalInput(commandHistoryList[nextPointer] || '');
      }
    }
  };

  // Comprehensive Realistic Terminal Command Execution Engine
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = terminalInput.trim();
    if (!rawCmd) return;

    // Save to command history
    setCommandHistoryList((prev) => [...prev, rawCmd]);
    setHistoryPointer(-1);

    setTerminalHistory((prev) => [...prev, `$ ${rawCmd}`]);
    setTerminalInput('');

    const cmd = rawCmd.toLowerCase();
    const configCode = fileContents['config.ts'] || '';
    const match = configCode.match(/timeout\s*:\s*(\d+)/i);
    const parsedTimeout = match ? parseInt(match[1], 10) : 2000;
    const isTimeoutFixed = parsedTimeout >= 3200;

    // 1. Integration Tests
    if (cmd === 'npm test' || cmd === 'test' || cmd === 'npm run test') {
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
    }

    // 2. Git Diff
    else if (cmd === 'git diff') {
      addEvent('Inspected git diff in terminal');
      if (parsedTimeout !== 2000) {
        setTerminalHistory((prev) => [
          ...prev,
          'diff --git a/src/services/payment/config.ts b/src/services/payment/config.ts',
          '--- a/src/services/payment/config.ts',
          '+++ b/src/services/payment/config.ts',
          '@@ -8,3 +8,3 @@',
          '-  timeout: 2000,',
          `+  timeout: ${parsedTimeout},`,
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          'diff --git a/src/services/payment/config.ts b/src/services/payment/config.ts',
          '# No modified changes staged. Timeout is currently default (2000ms).',
        ]);
      }
    }

    // 3. Git Status
    else if (cmd === 'git status') {
      addEvent('Checked git status');
      setTerminalHistory((prev) => [
        ...prev,
        'On branch hotfix/payment-timeout-p1',
        'Your branch is up to date with "origin/hotfix/payment-timeout-p1".',
        '',
        parsedTimeout !== 2000
          ? 'Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\n\tmodified:   src/services/payment/config.ts\n\nno changes added to commit (use "git add" to stage)'
          : 'nothing to commit, working tree clean',
      ]);
    }

    // 4. Git Log
    else if (cmd.startsWith('git log')) {
      addEvent('Checked git log');
      setTerminalHistory((prev) => [
        ...prev,
        'commit a8f9104c8e71b2d4924a919f2c310 (HEAD -> hotfix/payment-timeout-p1)',
        'Author: Alex Chen <alex.chen@techflow.dev>',
        'Date:   Fri Sep 11 02:08:44 2026 -0400',
        '',
        '    deploy(payment-service): release v2.4.1 runtime config bundle',
        '',
        'commit 7b129841f3e09819280ad9188a10b',
        'Author: Priya Sharma <priya.sharma@techflow.dev>',
        'Date:   Fri Sep 11 01:45:12 2026 -0400',
        '',
        '    merge pull request #402 from techflow/feature/stripe-adapter-upgrade',
      ]);
    }

    // 5. Git Branch
    else if (cmd === 'git branch') {
      setTerminalHistory((prev) => [
        ...prev,
        '* hotfix/payment-timeout-p1',
        '  main',
        '  staging',
      ]);
    }

    // 6. cURL Telemetry & Health Endpoints
    else if (cmd.startsWith('curl')) {
      addEvent(`Ran curl query: ${rawCmd}`);
      if (cmd.includes('stripe') || cmd.includes('api.stripe.com')) {
        setTerminalHistory((prev) => [
          ...prev,
          'HTTP/1.1 200 OK',
          'Date: Fri, 11 Sep 2026 02:22:15 GMT',
          'Content-Type: application/json',
          'X-Stripe-Region: us-east-1',
          '',
          '{',
          '  "status": "degraded_performance",',
          '  "service": "api.stripe.com",',
          '  "average_latency_ms": 3200,',
          '  "p99_latency_ms": 4800,',
          '  "incident_id": "INC-STRIPE-89104",',
          '  "message": "Upstream settlement network experiencing packet queuing"',
          '}',
        ]);
      } else if (cmd.includes('health') || cmd.includes('charge') || cmd.includes('localhost')) {
        if (isTimeoutFixed) {
          setTerminalHistory((prev) => [
            ...prev,
            'HTTP/1.1 200 OK',
            'Date: Fri, 11 Sep 2026 02:24:01 GMT',
            'Content-Type: application/json',
            '',
            '{',
            '  "service": "payment-service",',
            '  "status": "HEALTHY",',
            `  "client_timeout_configured": "${parsedTimeout}ms",`,
            '  "circuit_breaker": "CLOSED",',
            '  "success_rate": "99.8%",',
            '  "p99_latency": "3240ms"',
            '}',
          ]);
        } else {
          setTerminalHistory((prev) => [
            ...prev,
            'HTTP/1.1 504 Gateway Timeout',
            'Date: Fri, 11 Sep 2026 02:24:01 GMT',
            'Content-Type: application/json',
            '',
            '{',
            '  "service": "payment-service",',
            '  "status": "CRITICAL_ERROR",',
            '  "error": "GatewayTimeoutError",',
            `  "message": "Upstream response duration 3200ms exceeded configured timeout of ${parsedTimeout}ms",`,
            '  "circuit_breaker": "HALF_OPEN",',
            '  "error_rate": "43.8%"',
            '}',
          ]);
        }
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          `HTTP/1.1 200 OK (GET ${rawCmd.slice(5).trim()})`,
          'Server: TechFlow Gateway',
          'Status: OK',
        ]);
      }
    }

    // 7. Cat / Inspect File
    else if (cmd.startsWith('cat')) {
      const target = cmd.slice(4).trim();
      addEvent(`Viewed file in terminal: ${target}`);
      if (target.includes('config') || target === 'config.ts') {
        const lines = (fileContents['config.ts'] || '').split('\n');
        setTerminalHistory((prev) => [
          ...prev,
          `# ${target || 'src/services/payment/config.ts'}:`,
          ...lines.map((l, i) => `${(i + 1).toString().padStart(3, ' ')} | ${l}`),
        ]);
      } else if (target.includes('client') || target === 'client.ts') {
        const lines = (fileContents['client.ts'] || '').split('\n');
        setTerminalHistory((prev) => [
          ...prev,
          `# ${target || 'src/services/payment/client.ts'}:`,
          ...lines.slice(0, 30).map((l, i) => `${(i + 1).toString().padStart(3, ' ')} | ${l}`),
          '    ... [truncated 45 lines]',
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          `cat: ${target}: No such file. Try "cat config.ts" or "cat client.ts".`,
        ]);
      }
    }

    // 8. Grep
    else if (cmd.startsWith('grep')) {
      setTerminalHistory((prev) => [
        ...prev,
        `src/services/payment/config.ts:8:  timeout: ${parsedTimeout},`,
        'src/services/payment/client.ts:42:  const timeoutSignal = AbortSignal.timeout(PAYMENT_CONFIG.timeout);',
      ]);
    }

    // 9. Ls / File listing
    else if (cmd === 'ls' || cmd === 'ls -la' || cmd === 'dir') {
      setTerminalHistory((prev) => [
        ...prev,
        'drwxr-xr-x 4 techflow techflow  4096 Sep 11 02:10 .',
        'drwxr-xr-x 8 techflow techflow  4096 Sep 11 02:00 ..',
        '-rw-r--r-- 1 techflow techflow   842 Sep 11 02:15 package.json',
        '-rw-r--r-- 1 techflow techflow   412 Sep 11 02:05 tsconfig.json',
        'drwxr-xr-x 2 techflow techflow  4096 Sep 11 02:12 src/services/payment',
        'drwxr-xr-x 2 techflow techflow  4096 Sep 11 02:14 tests',
      ]);
    }

    // 10. PS / Top / System Telemetry
    else if (cmd === 'ps' || cmd === 'ps aux' || cmd === 'top') {
      setTerminalHistory((prev) => [
        ...prev,
        'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
        'techflow  1042 14.2  2.1 948120 184120 ?       Sl   02:10   1:42 node dist/server.js',
        'techflow  1108  0.4  0.3  72104  24190 pts/0    S+   02:16   0:01 /bin/bash diagnostic-shell',
        'techflow  1192  0.1  0.1  41200   9812 ?        S    02:11   0:00 datadog-agent',
      ]);
    }

    // 11. Uptime
    else if (cmd === 'uptime') {
      setTerminalHistory((prev) => [
        ...prev,
        ' 02:24:18 up 14 days,  6:42,  1 user,  load average: 3.48, 2.92, 1.84 [P1 SEV-1 ACTIVE]',
      ]);
    }

    // 12. Ping
    else if (cmd.startsWith('ping')) {
      setTerminalHistory((prev) => [
        ...prev,
        'PING api.stripe.com (54.187.159.182) 56(84) bytes of data.',
        '64 bytes from 54.187.159.182: icmp_seq=1 ttl=52 time=3198 ms',
        '64 bytes from 54.187.159.182: icmp_seq=2 ttl=52 time=3240 ms',
        '64 bytes from 54.187.159.182: icmp_seq=3 ttl=52 time=3204 ms',
        '--- api.stripe.com ping statistics ---',
        '3 packets transmitted, 3 received, 0% packet loss, time 2004ms',
        'rtt min/avg/max/mdev = 3198.2/3214.1/3240.4/18.6 ms',
      ]);
    }

    // 13. Build & Lint
    else if (cmd === 'npm run build' || cmd === 'build') {
      setTerminalHistory((prev) => [
        ...prev,
        '> payment-service@2.4.1 build',
        '> tsc --project tsconfig.json',
        '✓ Compiled successfully without type errors (820ms)',
      ]);
    } else if (cmd === 'npm run lint' || cmd === 'lint') {
      setTerminalHistory((prev) => [
        ...prev,
        '> payment-service@2.4.1 lint',
        '✓ All 12 source files pass ESLint rules (0 errors, 0 warnings)',
      ]);
    }

    // 14. Utilities
    else if (cmd === 'node -v' || cmd === 'node --version') {
      setTerminalHistory((prev) => [...prev, 'v20.12.0']);
    } else if (cmd === 'npm -v' || cmd === 'npm --version') {
      setTerminalHistory((prev) => [...prev, '10.5.0']);
    } else if (cmd === 'whoami') {
      setTerminalHistory((prev) => [...prev, 'oncall-engineer@techflow-prod-node-04']);
    } else if (cmd === 'env' || cmd === 'printenv') {
      setTerminalHistory((prev) => [
        ...prev,
        'NODE_ENV=production',
        'SERVICE_NAME=payment-service',
        'PORT=8080',
        'STRIPE_API_HOST=api.stripe.com',
        `PAYMENT_TIMEOUT=${parsedTimeout}`,
        'SLA_MAX_DOWN_MINUTES=35',
      ]);
    } else if (cmd === 'history') {
      setTerminalHistory((prev) => [
        ...prev,
        ...commandHistoryList.map((c, i) => `  ${i + 1}  ${c}`),
      ]);
    } else if (cmd === 'clear') {
      setTerminalHistory(['TechFlow Production Diagnostic Shell (x86_64-linux-gnu)']);
    } else if (cmd === 'help') {
      setTerminalHistory((prev) => [
        ...prev,
        'Available Diagnostic Commands:',
        '  npm test             - Execute payment integration test suite',
        '  git diff             - Inspect staged & unstaged code differences',
        '  git status           - Show repository branch and modified files',
        '  git log              - View recent deployment commits',
        '  curl <endpoint>      - Test localhost:8080/health or api.stripe.com',
        '  cat <file>           - Display config.ts or client.ts contents',
        '  grep -rn <pat> .     - Search codebase for pattern matches',
        '  ls -la               - List directory files and metadata',
        '  ps aux / top         - View running service process and CPU/memory',
        '  ping api.stripe.com  - Measure upstream network latency',
        '  uptime               - Show server load and uptime',
        '  clear                - Clear terminal output',
      ]);
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        `bash: ${rawCmd}: command not found. Type "help" or "npm test".`,
      ]);
    }
  };

  // Submit Hotfix, Persist Scores, & Route to Evaluation
  const handleFinalSubmit = async () => {
    setIsEvaluating(true);
    addEvent('Submitted hotfix for automated evaluation');

    const allChatHistory = [
      ...agentThreads.priya,
      ...agentThreads.alex,
      ...agentThreads.client,
    ];

    const configCode = fileContents['config.ts'] || '';
    const match = configCode.match(/timeout\s*:\s*(\d+)/i);
    const parsedTimeout = match ? parseInt(match[1], 10) : 2000;
    const isTimeoutFixed = parsedTimeout >= 3200;

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

      // Persist to evaluation history and update dashboard scores
      const durationMins = Math.max(1, Math.round((35 * 60 - secondsRemaining) / 60));
      const record: EvaluationRecord = {
        id: 'session-' + Date.now(),
        scenarioId: 'production-incident-payment-api',
        scenarioTitle: 'Payment API Failure Under Load',
        company: 'TechFlow Inc.',
        resolvedAt: 'Just now',
        duration: `${durationMins} mins`,
        score: data.overallScore ?? (isTimeoutFixed ? 92 : 48),
        status: (data.isResolved ?? isTimeoutFixed) ? 'Resolved' : 'Failed',
        testsPassed: (data.isResolved ?? isTimeoutFixed) ? '3/3 Tests' : '1/3 Tests',
        skillScores: data.skillScores || {
          debugging: isTimeoutFixed ? 92 : 48,
          problemSolving: isTimeoutFixed ? 88 : 42,
          communication: 85,
          technicalReasoning: 90,
          prioritization: 84,
        },
        strengths: data.strengths,
        improvements: data.improvements,
      };

      saveEvaluationRecord(record);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('worksim_latest_evaluation', JSON.stringify(data));
      }

      router.push('/evaluation/demo-session');
    } catch {
      router.push('/evaluation/demo-session');
    }
  };

  const currentMessages = agentThreads[activeAgent] || [];
  const configCode = fileContents['config.ts'] || '';
  const match = configCode.match(/timeout\s*:\s*(\d+)/i);
  const parsedTimeout = match ? parseInt(match[1], 10) : 2000;
  const isTimeoutFixed = parsedTimeout >= 3200;

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
            <Building2 className="w-3.5 h-3.5 text-[#a1a1a1]" />
            <span className="text-white font-semibold">{scenario.company}</span>
            <span className="text-white/30">/</span>
            <span className="text-[#a1a1a1] hidden sm:inline">{scenario.title}</span>
          </div>
        </div>

        {/* Center: Incident Severity & SLA Timer */}
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

        {/* Right: Panel Toggles & Submit Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidePanelOpen((prev) => !prev)}
            title={isSidePanelOpen ? 'Hide Explorer (Side Panel)' : 'Show Explorer'}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              isSidePanelOpen
                ? 'bg-white/[0.08] text-white border-white/20'
                : 'bg-transparent text-[#a1a1a1] border-white/[0.08] hover:text-white'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Explorer</span>
          </button>

          <button
            onClick={() => setIsAgentPanelOpen((prev) => !prev)}
            title={isAgentPanelOpen ? 'Hide Agent Panel' : 'Show Agent Panel'}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              isAgentPanelOpen
                ? 'bg-white/[0.08] text-white border-white/20'
                : 'bg-transparent text-[#a1a1a1] border-white/[0.08] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Agents</span>
          </button>

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

      {/* 2. MAIN RESIZABLE WORKSPACE BODY */}
      <div ref={workspaceRef} className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* LEFT ICON ACTIVITY BAR (56px) */}
        <aside className="w-14 border-r border-white/[0.08] bg-[#0c0e12] flex flex-col items-center py-3 gap-2 shrink-0 z-20">
          {[
            { id: 'code', label: 'Code Editor', icon: FileCode2 },
            { id: 'logs', label: 'Log Stream', icon: Activity },
            { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
            { id: 'slack', label: 'Slack War Room', icon: MessageSquare },
            { id: 'mission', label: 'Incident Briefing', icon: Info },
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

        {/* RESIZABLE SIDE PANEL (Explorer / Incident Checklist) */}
        {isSidePanelOpen && (
          <aside
            style={{ width: `${sidePanelWidth}px` }}
            className="border-r border-white/[0.08] bg-[#0d0f14] flex flex-col shrink-0 overflow-hidden select-none z-10"
          >
            {/* Sidebar Title */}
            <div className="h-9 border-b border-white/[0.08] px-3 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#a1a1a1] bg-[#101217]">
              <span>Explorer</span>
              <button
                onClick={() => setIsSidePanelOpen(false)}
                title="Collapse Sidebar"
                className="hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs font-mono">
              {/* File Tree Section */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#666666] uppercase px-1 mb-1 font-semibold">
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>techflow-payment</span>
                </div>
                <div className="pl-3 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#888888] py-0.5 px-1">
                    <Folder className="w-3.5 h-3.5 text-amber-500/80" />
                    <span>src/services/payment</span>
                  </div>
                  <div className="pl-4 space-y-0.5">
                    {scenario.files.map((file) => {
                      const isSelected = activeFile.name === file.name;
                      const isModified = file.name === 'config.ts' && parsedTimeout !== 2000;
                      return (
                        <button
                          key={file.name}
                          onClick={() => {
                            setActiveFile(file);
                            setActiveTool('code');
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-colors ${
                            isSelected
                              ? 'bg-[#3b82f6]/20 text-white border border-[#3b82f6]/40'
                              : 'text-[#a1a1a1] hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <FileCode2 className="w-3.5 h-3.5 text-[#3b82f6] shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          {isModified && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Modified" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Live Incident Status Checklist */}
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-[11px] text-[#666666] uppercase px-1 mb-2 font-semibold">
                  <Flame className="w-3.5 h-3.5 text-[#ef4444]" />
                  <span>Telemetry Audit</span>
                </div>
                <div className="bg-[#111319] p-2.5 rounded-lg border border-white/[0.06] space-y-2 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a1a1a1]">Stripe Latency:</span>
                    <span className="text-[#ef4444] font-semibold">3200ms p99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a1a1a1]">Config Timeout:</span>
                    <span
                      className={`font-semibold ${
                        isTimeoutFixed ? 'text-[#22c55e]' : 'text-amber-400'
                      }`}
                    >
                      {parsedTimeout}ms {isTimeoutFixed ? '✓ Fixed' : '✗ Too Low'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#a1a1a1]">Test Suite:</span>
                    <span
                      className={`font-semibold ${
                        isTimeoutFixed ? 'text-[#22c55e]' : 'text-[#a1a1a1]'
                      }`}
                    >
                      {isTimeoutFixed ? '3/3 Passing' : 'Failing'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Guidance */}
              <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/30 text-[11px] text-blue-200/90 leading-relaxed">
                <span className="font-semibold text-blue-300 block mb-0.5">Tip:</span>
                Drag the divider lines between panels to resize just like in VS Code.
              </div>
            </div>
          </aside>
        )}

        {/* SIDE PANEL RESIZE DIVIDER */}
        {isSidePanelOpen && (
          <div
            role="separator"
            aria-orientation="vertical"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingSide(true);
            }}
            onDoubleClick={() => setSidePanelWidth(240)}
            title="Drag to resize side panel · Double-click to reset"
            className={`w-1 -ml-0.5 z-30 cursor-col-resize select-none relative group transition-all shrink-0 ${
              isResizingSide
                ? 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                : 'bg-white/[0.08] hover:bg-[#3b82f6]/70'
            }`}
          >
            <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
          </div>
        )}

        {/* CENTER PRIMARY CODING & TOOL PANEL (flex-1) */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0e1015] overflow-hidden relative">
          {/* TOOL VIEW: CODE EDITOR */}
          {activeTool === 'code' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* File Tabs Bar */}
              <div className="h-9 border-b border-white/[0.08] bg-[#111319] flex items-center px-2 gap-1 shrink-0 justify-between">
                <div className="flex items-center gap-1">
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
                      {file.name === 'config.ts' && parsedTimeout !== 2000 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pr-2">
                  <button
                    onClick={() => setIsTerminalOpen((prev) => !prev)}
                    title={isTerminalOpen ? 'Hide Terminal Dock' : 'Show Terminal Dock'}
                    className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition-colors ${
                      isTerminalOpen
                        ? 'text-white bg-white/[0.08]'
                        : 'text-[#a1a1a1] hover:text-white'
                    }`}
                  >
                    <TerminalIcon className="w-3 h-3 text-[#22c55e]" />
                    <span>Terminal</span>
                  </button>
                </div>
              </div>

              {/* Monaco Editor Container */}
              <div className="flex-1 relative overflow-hidden">
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

              {/* VS CODE BOTTOM SPLIT TERMINAL DRAWER */}
              {isTerminalOpen && (
                <>
                  {/* VERTICAL RESIZE DIVIDER */}
                  <div
                    role="separator"
                    aria-orientation="horizontal"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsResizingTerminal(true);
                    }}
                    onDoubleClick={() => setTerminalHeight(230)}
                    title="Drag to resize terminal · Double-click to reset"
                    className={`h-1 -mt-0.5 z-30 cursor-row-resize select-none relative group transition-all shrink-0 ${
                      isResizingTerminal
                        ? 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                        : 'bg-white/[0.08] hover:bg-[#3b82f6]/70'
                    }`}
                  >
                    <div className="absolute inset-x-0 -top-1 -bottom-1 cursor-row-resize" />
                  </div>

                  {/* Terminal Window */}
                  <div
                    style={{ height: `${terminalHeight}px` }}
                    className="bg-[#0b0c10] border-t border-white/[0.08] flex flex-col font-mono text-xs overflow-hidden shrink-0"
                  >
                    {/* Terminal Header */}
                    <div className="h-8 border-b border-white/[0.08] bg-[#111319] px-3 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2 text-white">
                        <TerminalIcon className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span className="font-semibold text-[11px]">TERMINAL · bash</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTerminalHistory(['TechFlow Production Diagnostic Shell'])}
                          className="text-[10px] text-[#a1a1a1] hover:text-white transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setIsTerminalOpen(false)}
                          className="text-[#a1a1a1] hover:text-white"
                          title="Close Terminal Dock"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Output Log Stream */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-1 text-[#d1d5db]">
                      {terminalHistory.map((line, idx) => (
                        <div
                          key={idx}
                          className={
                            line.startsWith('$')
                              ? 'text-white font-semibold flex items-center gap-1.5'
                              : line.includes('✓')
                              ? 'text-[#22c55e]'
                              : line.includes('✗')
                              ? 'text-[#ef4444]'
                              : line.includes('HTTP/1.1 504')
                              ? 'text-[#ef4444]'
                              : line.includes('HTTP/1.1 200')
                              ? 'text-[#22c55e]'
                              : 'text-[#a1a1a1]'
                          }
                        >
                          {line}
                        </div>
                      ))}
                      <div ref={terminalBottomRef} />
                    </div>

                    {/* Command Prompt */}
                    <form
                      onSubmit={handleTerminalSubmit}
                      className="h-8 border-t border-white/[0.08] bg-[#0e1015] px-3 flex items-center gap-2 shrink-0"
                    >
                      <span className="text-[#22c55e] font-bold text-xs">$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        onKeyDown={handleTerminalKeyDown}
                        placeholder='Try "npm test", "curl localhost:8080/health", "git diff", "cat config.ts", "help"...'
                        className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono placeholder:text-[#555555]"
                      />
                    </form>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TOOL VIEW: LOG STREAM */}
          {activeTool === 'logs' && (
            <div className="flex-1 flex flex-col h-full bg-[#0b0c10] font-mono text-xs overflow-hidden">
              <div className="h-10 border-b border-white/[0.08] bg-[#111319] px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#ef4444]" />
                  <span className="text-white font-semibold">Incident Telemetry Log Stream</span>
                </div>
                <span className="text-[11px] text-[#a1a1a1] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-ping" />
                  Live Ingestion
                </span>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {scenario.initialLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-md border text-xs leading-relaxed ${
                      log.level === 'ERROR'
                        ? 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
                        : log.level === 'WARN'
                        ? 'bg-amber-950/20 border-amber-800/30 text-amber-300'
                        : 'bg-white/[0.02] border-white/[0.04] text-[#a1a1a1]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[10px] text-white/50">
                      <span className="font-semibold text-white/80">[{log.timestamp}]</span>
                      <span className="uppercase font-bold text-[#c40505]">{log.level}</span>
                      <span>service={log.service}</span>
                    </div>
                    <p className="font-mono text-white/90">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOOL VIEW: DEDICATED FULL TERMINAL */}
          {activeTool === 'terminal' && (
            <div className="flex-1 flex flex-col h-full bg-[#0b0c10] font-mono text-xs overflow-hidden">
              <div className="h-10 border-b border-white/[0.08] bg-[#111319] px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-[#22c55e]" />
                  <span className="text-white font-semibold">
                    TechFlow Diagnostic Shell (Full View)
                  </span>
                </div>
                <button
                  onClick={() => setTerminalHistory(['TechFlow Production Diagnostic Shell'])}
                  className="text-xs text-[#a1a1a1] hover:text-white"
                >
                  Clear Terminal
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-1.5 text-[#d1d5db]">
                {terminalHistory.map((line, idx) => (
                  <div
                    key={idx}
                    className={
                      line.startsWith('$')
                        ? 'text-white font-semibold flex items-center gap-1.5'
                        : line.includes('✓')
                        ? 'text-[#22c55e]'
                        : line.includes('✗')
                        ? 'text-[#ef4444]'
                        : line.includes('HTTP/1.1 504')
                        ? 'text-[#ef4444]'
                        : line.includes('HTTP/1.1 200')
                        ? 'text-[#22c55e]'
                        : 'text-[#a1a1a1]'
                    }
                  >
                    {line}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>

              <form
                onSubmit={handleTerminalSubmit}
                className="h-10 border-t border-white/[0.08] bg-[#0e1015] px-4 flex items-center gap-2 shrink-0"
              >
                <span className="text-[#22c55e] font-bold text-sm">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={handleTerminalKeyDown}
                  placeholder='Try "npm test", "curl localhost:8080/health", "git diff", "cat config.ts", "top", "help"...'
                  className="flex-1 bg-transparent text-white focus:outline-none text-xs font-mono"
                />
              </form>
            </div>
          )}

          {/* TOOL VIEW: SLACK WAR ROOM */}
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

          {/* TOOL VIEW: MISSION BRIEFING */}
          {activeTool === 'mission' && (
            <div className="flex-1 p-6 overflow-y-auto bg-[#0d0f14] max-w-3xl space-y-6 text-sm">
              <div className="border-b border-white/[0.08] pb-4">
                <span className="text-[11px] font-mono uppercase text-[#c40505] font-semibold">
                  Incident Docket: SEV-1
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{scenario.title}</h3>
                <p className="text-xs text-[#a1a1a1] mt-1">
                  Client: BuyFast E-Commerce · Infrastructure Provider: TechFlow
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-white font-semibold">
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

        {/* AGENT PANEL RESIZE DIVIDER */}
        {isAgentPanelOpen && (
          <div
            role="separator"
            aria-orientation="vertical"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingAgent(true);
            }}
            onDoubleClick={() => setAgentPanelWidth(360)}
            title="Drag to resize agent panel · Double-click to reset"
            className={`w-1 -mr-0.5 z-30 cursor-col-resize select-none relative group transition-all shrink-0 ${
              isResizingAgent
                ? 'bg-[#3b82f6] shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                : 'bg-white/[0.08] hover:bg-[#3b82f6]/70'
            }`}
          >
            <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
          </div>
        )}

        {/* RESIZABLE RIGHT PANEL: AI TEAMMATE & CLIENT CHAT */}
        {isAgentPanelOpen && (
          <aside
            style={{ width: `${agentPanelWidth}px` }}
            className="border-l border-white/[0.08] bg-[#0c0e12] flex flex-col shrink-0 z-20 overflow-hidden"
          >
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

              <button
                onClick={() => setIsAgentPanelOpen(false)}
                title="Collapse Agent Panel"
                className="text-[#666666] hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
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
        )}
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
