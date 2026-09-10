export interface ScenarioLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  service: string;
  message: string;
}

export interface ScenarioFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface ScenarioConfig {
  id: string;
  title: string;
  company: string;
  incidentTier: string;
  estimatedMinutes: number;
  objective: string;
  slaMinutes: number;
  initialLogs: ScenarioLog[];
  files: ScenarioFile[];
}

export const PAYMENT_INCIDENT_SCENARIO: ScenarioConfig = {
  id: 'production-incident-payment-api',
  title: 'Production Incident: Payment API Failure',
  company: 'TechFlow Inc.',
  incidentTier: 'SEV-1 Critical',
  estimatedMinutes: 30,
  slaMinutes: 35,
  objective:
    'Investigate the intermittent Payment API failure, identify the root cause in the retry/timeout logic, implement a safe hotfix, and communicate resolution to your engineering manager.',
  
  initialLogs: [
    {
      id: 'log-1',
      timestamp: '02:10:00',
      level: 'INFO',
      service: 'deployment',
      message: 'Deployed payment-service v2.4.1 to cluster prod-us-east-1 (prev: v2.3.8)',
    },
    {
      id: 'log-2',
      timestamp: '02:12:00',
      level: 'INFO',
      service: 'payment-service',
      message: 'Loaded runtime config: PAYMENT_TIMEOUT=2000ms, RETRY_COUNT=3, RETRY_DELAY=1000ms',
    },
    {
      id: 'log-3',
      timestamp: '02:14:58',
      level: 'INFO',
      service: 'stripe-adapter',
      message: 'Stripe API upstream telemetry: average response latency 3200ms (p99: 4800ms)',
    },
    {
      id: 'log-4',
      timestamp: '02:15:03',
      level: 'ERROR',
      service: 'payment-service',
      message: 'Request to /api/payments/charge failed: TimeoutError: operation timed out after 2000ms (txn_8f2a99)',
    },
    {
      id: 'log-5',
      timestamp: '02:15:05',
      level: 'WARN',
      service: 'payment-service',
      message: 'Retry attempt 1/3 for order ord_3d1c... failed: TimeoutError after 2000ms',
    },
    {
      id: 'log-6',
      timestamp: '02:15:07',
      level: 'WARN',
      service: 'payment-service',
      message: 'Retry attempt 2/3 for order ord_3d1c... failed: TimeoutError after 2000ms',
    },
    {
      id: 'log-7',
      timestamp: '02:15:09',
      level: 'FATAL',
      service: 'payment-service',
      message: 'All 3 retries exhausted for txn_8f2a99. Returning HTTP 500 to customer gateway.',
    },
    {
      id: 'log-8',
      timestamp: '02:15:10',
      level: 'ERROR',
      service: 'gateway',
      message: 'Payment charge failed for customer cust_9941. Elevated error rate 43.8% triggers P1 page.',
    },
  ],

  files: [
    {
      name: 'config.ts',
      path: 'src/services/payment/config.ts',
      language: 'typescript',
      content: `// src/services/payment/config.ts
// Updated in deployment v2.4.1 by Platform Team

export const PAYMENT_CONFIG = {
  // CRITICAL CONFIGURATION:
  // Downstream payment gateway timeout in milliseconds.
  // Note: Previous setting was 5000ms. Reduced in v2.4.1 to fail faster.
  timeout: 2000,

  // Maximum number of retry attempts before rejecting transaction
  retryCount: 3,

  // Delay between consecutive retries in milliseconds
  retryDelay: 1000,
};
`,
    },
    {
      name: 'client.ts',
      path: 'src/services/payment/client.ts',
      language: 'typescript',
      content: `// src/services/payment/client.ts
import { PAYMENT_CONFIG } from './config';

export interface ChargeRequest {
  orderId: string;
  amount: number;
  currency: string;
}

export interface ChargeResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function chargePayment(request: ChargeRequest): Promise<ChargeResponse> {
  const { timeout, retryCount, retryDelay } = PAYMENT_CONFIG;

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      // Calls upstream payment processor (e.g. Stripe API) with configured timeout
      const result = await executeGatewayCharge(request, timeout);
      return { success: true, transactionId: result.id };
    } catch (err: any) {
      if (attempt === retryCount) {
        throw new Error(\`Payment failed after \${retryCount} attempts: \${err.message}\`);
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return { success: false, error: 'Retries exhausted' };
}

async function executeGatewayCharge(request: ChargeRequest, timeoutMs: number): Promise<{ id: string }> {
  // Simulates external gateway call with realistic p99 latency
  return new Promise((resolve, reject) => {
    const upstreamLatency = 3200; // Stripe upstream average p99 latency
    if (timeoutMs < upstreamLatency) {
      setTimeout(() => reject(new Error(\`operation timed out after \${timeoutMs}ms\`)), timeoutMs);
    } else {
      setTimeout(() => resolve({ id: \`txn_\${Math.random().toString(36).substring(7)}\` }), 120);
    }
  });
}
`,
    },
  ],
};
