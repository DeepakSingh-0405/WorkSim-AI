import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      sessionId,
      files,
      submittedCode,
      chatThreads,
      chatHistory = [],
      events = [],
      durationSeconds = 1200,
    } = body;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // 1. Analyze submitted code & configuration
    const configCode =
      (typeof files === 'object' && files?.['config.ts']) ||
      (typeof submittedCode === 'string' ? submittedCode : '');

    const timeoutMatch = configCode.match(/timeout\s*:\s*(\d+)/i);
    const parsedTimeout = timeoutMatch ? parseInt(timeoutMatch[1], 10) : 2000;

    // Stripe p99 latency is 3200ms. A timeout >= 3200ms fixes the outage.
    // Recommended standard is 5000ms.
    const isTimeoutFixed = parsedTimeout >= 3200;
    const isOptimalTimeout = parsedTimeout >= 4000 && parsedTimeout <= 10000;

    // 2. Analyze testing telemetry
    const ranTests = events.some(
      (e: string) => typeof e === 'string' && e.toLowerCase().includes('test')
    );
    const testsPassed = isTimeoutFixed && ranTests;

    // 3. Analyze candidate communication
    const candidatePriyaMsgs: string[] = [];
    const candidateClientMsgs: string[] = [];
    const candidateAlexMsgs: string[] = [];

    if (chatThreads && typeof chatThreads === 'object') {
      chatThreads.priya?.forEach((m: any) => {
        if (m.sender === 'user' && (m.text || m.content)) {
          candidatePriyaMsgs.push(String(m.text || m.content).trim());
        }
      });
      chatThreads.client?.forEach((m: any) => {
        if (m.sender === 'user' && (m.text || m.content)) {
          candidateClientMsgs.push(String(m.text || m.content).trim());
        }
      });
      chatThreads.alex?.forEach((m: any) => {
        if (m.sender === 'user' && (m.text || m.content)) {
          candidateAlexMsgs.push(String(m.text || m.content).trim());
        }
      });
    } else if (Array.isArray(chatHistory)) {
      chatHistory.forEach((m: any) => {
        if (m && (m.sender === 'user' || m.role === 'user')) {
          const text = String(m.text || m.content || '').trim();
          if (text) candidatePriyaMsgs.push(text);
        }
      });
    }

    const briefedManager = candidatePriyaMsgs.length > 0;
    const briefedClient = candidateClientMsgs.length > 0;
    const totalUserMsgs =
      candidatePriyaMsgs.length + candidateClientMsgs.length + candidateAlexMsgs.length;

    // 4. Calculate realistic base scores
    let baseDebugging: number;
    let baseProblemSolving: number;
    let baseTechReasoning: number;
    let baseCommunication: number;
    let basePrioritization = 85;

    if (isTimeoutFixed) {
      baseDebugging = isOptimalTimeout ? 94 : 85;
      baseProblemSolving = isOptimalTimeout ? 90 : 82;
      baseTechReasoning = ranTests ? 92 : 72; // penalty for hotfixing without testing

      if (briefedManager && briefedClient) {
        baseCommunication = 90;
      } else if (briefedManager) {
        baseCommunication = 78;
      } else if (briefedClient) {
        baseCommunication = 72;
      } else {
        baseCommunication = 55; // silent during P1
      }
    } else {
      // Outage not resolved
      baseDebugging = 48;
      baseProblemSolving = 42;
      baseTechReasoning = 45;
      baseCommunication = briefedManager ? 65 : 45;
      basePrioritization = 70;
    }

    const baseOverall = Math.round(
      baseDebugging * 0.25 +
        baseProblemSolving * 0.25 +
        baseTechReasoning * 0.2 +
        baseCommunication * 0.2 +
        basePrioritization * 0.1
    );

    // 5. Evidence Artifacts
    const evidence = [
      {
        type: 'log' as const,
        title: 'Telemetry Root Cause Correlation',
        timestamp: '02:14:58',
        snippet: 'INFO stripe-adapter: Stripe API average response time: 3200ms (p99: 4800ms)',
        impact: isTimeoutFixed
          ? `Correlated Stripe p99 latency with config.ts timeout threshold.`
          : `Failed to correlate Stripe 3200ms latency with the 2000ms timeout threshold.`,
      },
      {
        type: 'code' as const,
        title: 'Configuration Hotfix in config.ts',
        timestamp: '02:22:15',
        snippet:
          parsedTimeout !== 2000
            ? `PAYMENT_CONFIG.timeout: 2000ms -> ${parsedTimeout}ms`
            : `PAYMENT_CONFIG.timeout: 2000ms (unchanged)`,
        impact: isTimeoutFixed
          ? `Restored downstream gateway headroom to ${parsedTimeout}ms (+${parsedTimeout - 3200}ms buffer over Stripe).`
          : `Configuration remains at ${parsedTimeout}ms, continuing to reject valid customer payments.`,
      },
      {
        type: 'terminal' as const,
        title: 'Integration Test Suite Verification',
        timestamp: '02:24:40',
        snippet: ranTests
          ? testsPassed
            ? `$ npm test -> Tests: 3 passed, 0 failed (${parsedTimeout}ms timeout verified)`
            : `$ npm test -> Tests: 1 passed, 2 failed (TimeoutError)`
          : 'No integration tests executed in terminal before hotfix submission.',
        impact: ranTests
          ? testsPassed
            ? 'Verified fix stability in diagnostic shell before production deployment.'
            : 'Deployed hotfix with failing integration tests.'
          : 'High-risk deployment: Hotfix submitted without test suite verification.',
      },
      {
        type: 'slack' as const,
        title: 'Stakeholder Incident Briefing',
        timestamp: '02:25:02',
        snippet:
          candidatePriyaMsgs.length > 0
            ? `Update to Priya: "${candidatePriyaMsgs[candidatePriyaMsgs.length - 1].slice(0, 75)}..."`
            : candidateClientMsgs.length > 0
              ? `Update to Marcus: "${candidateClientMsgs[0].slice(0, 75)}..."`
              : 'No briefing provided to Engineering Manager or Client in Slack channel.',
        impact:
          briefedManager && briefedClient
            ? 'Maintained proactive stakeholder alignment with both engineering leadership and executive client.'
            : briefedManager
              ? 'Kept manager updated, but left client Marcus Vance without business ETA.'
              : 'Experienced communication blackout during active P1 outage.',
      },
    ];

    // High-fidelity fallback baseline
    let evalResult = {
      isResolved: isTimeoutFixed,
      overallScore: baseOverall,
      skillScores: {
        debugging: baseDebugging,
        problemSolving: baseProblemSolving,
        communication: baseCommunication,
        technicalReasoning: baseTechReasoning,
        prioritization: basePrioritization,
      },
      strengths: isTimeoutFixed
        ? [
            `Identified that 2000ms timeout was below Stripe upstream latency and adjusted threshold to ${parsedTimeout}ms`,
            ranTests
              ? 'Validated hotfix against diagnostic test suite prior to production submission'
              : 'Focused on resolving downstream gateway latency promptly',
            briefedManager
              ? 'Maintained active incident briefing with Priya Sharma in Slack'
              : 'Prioritized hotfix deployment under active SLA timeline constraints',
          ]
        : [
            'Inspected payment configuration files in the service repository',
            'Navigated incident diagnostic environment under SLA pressure',
          ],
      improvements: isTimeoutFixed
        ? [
            !ranTests
              ? 'Run "npm test" in the diagnostic terminal to verify changes before staging hotfix'
              : !briefedClient
                ? 'Provide proactive business ETA to Marcus Vance (VP of E-Commerce) to ease SLA anxiety'
                : 'Consider implementing dynamic jittered retries for upstream gateway resilience',
          ]
        : [
            `Adjust PAYMENT_CONFIG.timeout in config.ts to at least 3200ms (recommended 5000ms) to accommodate Stripe latency`,
            'Run integration tests to verify hotfix before concluding the incident',
          ],
      managerVerdict: isTimeoutFixed
        ? ranTests && briefedManager
          ? 'Exceptional triage execution. Root cause identified, verified via integration tests, and communicated clearly.'
          : 'Effective technical hotfix applied, though communication and test verification could be more thorough.'
        : 'Outage unresolved. The timeout configuration remains below upstream Stripe response times.',
      executiveSummary: isTimeoutFixed
        ? `Candidate restored payment operations by raising timeout to ${parsedTimeout}ms, resolving the P1 outage.`
        : 'Candidate did not resolve the payment timeout issue; customer checkout remains impaired.',
      evidence,
    };

    // 6. AI Evaluation with Gemini 3.6 Flash
    if (apiKey && apiKey !== 'placeholder-gemini-key' && !apiKey.startsWith('placeholder')) {
      try {
        const prompt = `
You are an engineering hiring committee chair evaluating an engineer on a P1 Production Outage.

Factual Incident Telemetry:
- Incident: TechFlow Payment API Failure (Stripe upstream p99 latency = 3200ms).
- Candidate Config: timeout set to ${parsedTimeout}ms (previous: 2000ms).
- Bug Resolved: ${isTimeoutFixed ? `YES - timeout ${parsedTimeout}ms accommodates Stripe latency` : `NO - timeout ${parsedTimeout}ms is below Stripe 3200ms latency`}.
- Ran Integration Tests: ${ranTests ? (testsPassed ? 'YES - all tests passed' : 'YES - tests failed') : 'NO - hotfix submitted without testing'}.
- Briefed Manager (Priya): ${briefedManager ? `YES (${candidatePriyaMsgs.length} messages: "${candidatePriyaMsgs.slice(-2).join(' | ')}")` : 'NO updates sent to manager'}.
- Briefed Client (Marcus Vance): ${briefedClient ? `YES (${candidateClientMsgs.length} messages: "${candidateClientMsgs.slice(-2).join(' | ')}")` : 'NO updates sent to client'}.
- Total User Messages: ${totalUserMsgs}.

Scoring Guidelines:
- If Bug Resolved: overallScore must be between 75 and 96 (penalize if tests not run or communication missing).
- If Bug NOT Resolved: overallScore must be between 35 and 55.
- Strengths and Improvements MUST be truthful and specific to the facts above. (Do NOT say they ran tests if they did not run tests. Do NOT say they updated the client if they did not).

Respond with valid JSON only (no markdown, no backticks):
{
  "isResolved": ${isTimeoutFixed},
  "overallScore": ${baseOverall},
  "skillScores": {
    "debugging": ${baseDebugging},
    "problemSolving": ${baseProblemSolving},
    "communication": ${baseCommunication},
    "technicalReasoning": ${baseTechReasoning},
    "prioritization": ${basePrioritization}
  },
  "strengths": ["string", "string"],
  "improvements": ["string"],
  "managerVerdict": "string under 25 words",
  "executiveSummary": "string under 30 words"
}
`;

        const res = await generateText({
          model: google('gemini-3.6-flash'),
          prompt,
        });

        const cleaned = res.text
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        const parsed = JSON.parse(cleaned);
        if (parsed && typeof parsed.overallScore === 'number') {
          evalResult = {
            ...parsed,
            isResolved: isTimeoutFixed,
            evidence,
          };
        }
      } catch (err) {
        console.warn('AI evaluation parsing fallback utilized:', err);
      }
    }

    // 7. Save evaluation to Supabase if session exists
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && sessionId) {
        await supabase.from('evaluations').insert({
          session_id: sessionId,
          user_id: user.id,
          overall_score: evalResult.overallScore,
          skill_scores: evalResult.skillScores,
          strengths: evalResult.strengths,
          improvements: evalResult.improvements,
        });

        await supabase
          .from('simulation_sessions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
          })
          .eq('id', sessionId);
      }
    } catch {
      // Ignore DB write errors if running in anonymous guest mode
    }

    return Response.json(evalResult);
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Evaluation error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
