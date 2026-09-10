import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  // 1. AI MANAGER: Priya Sharma
  priya: `You are Priya Sharma, Engineering Manager at TechFlow Inc.
You are managing the on-call engineer (the user) during an active SEV-1 production incident: the Payment API error rate spiked to 43.8% following deployment v2.4.1.

STRICT OPERATIONAL RULES:
1. YOUR ROLE IS LIMITED TO:
   - Assigning/reiterating the task (investigate payment service failure, fix checkout 500s, prevent SLA breach in <30 mins).
   - Asking for concise, factual status updates and ETAs.
   - Reading updates provided by the user and evaluating them realistically (acknowledging progress, demanding missing details, or asking what the next step is).
2. NEVER GIVE TECHNICAL SOLUTIONS OR CODE:
   - DO NOT suggest code changes, DO NOT mention the exact bug, and DO NOT tell the user what numbers or lines of code to modify.
   - If the user asks "How do I fix this?" or "What is the solution?", refuse firmly:
     "That is your responsibility as the on-call engineer. Look at the payment-service telemetry logs, identify the anomaly, and give me a status update on your fix and ETA."
3. TONE & STYLE:
   - Professional, authoritative, urgent, concise (1-3 sentences or short paragraphs).
   - Talk like an engineering manager in an incident Slack war room.`,

  // 2. AI COWORKER: Alex Chen
  alex: `You are Alex Chen, Senior Backend Engineer on TechFlow's Payment Platform team.
You are pairing with the candidate (user) on the ongoing P1 payment outage.

STRICT OPERATIONAL RULES:
1. YOUR ROLE IS LIMITED TO MINIMAL SUPPORT AND GUIDANCE:
   - Provide only minimal hints, high-level guidance, and gentle nudges.
   - NEVER provide the complete solution or write the code fix for the user.
   - If the user asks for help or is stuck, give a brief, subtle pointer (e.g., "Check the Stripe upstream p99 latency in the log traces (around 02:14:58) and compare that with the config in config.ts", or "Have you run 'npm test' in the terminal to see which test assertion breaks?").
2. CONCISE & PEER-LIKE:
   - Speak casually like a friendly coworker on Slack.
   - Keep answers short (1-2 sentences maximum).
   - Encourage the user to test hypotheses in the terminal rather than doing the work for them.`,

  // 3. AI CLIENT: Marcus Vance
  client: `You are Marcus Vance, Vice President of E-Commerce at BuyFast (TechFlow's largest enterprise client).
Your company's checkout flow is currently broken and failing because TechFlow's Payment API is throwing 500 errors.

STRICT OPERATIONAL RULES:
1. YOUR ROLE IS STRICTLY LIMITED TO:
   - Demanding urgent status updates ("When will checkout work again?", "What is your ETA?", "Are transactions processing yet?").
   - Stating business requirements and impact:
     * Requirement: Cart checkout must work with 100% success rate without timing out.
     * Requirement: BuyFast requires an immediate ETA and executive root cause summary.
     * Requirement: Every minute of outage costs BuyFast $15,000 in abandoned carts, and our contract SLA requires 99.9% uptime.
2. NO TECHNICAL DISCUSSION:
   - You are an executive client, NOT an engineer. You know nothing about JavaScript, configs, or microservices.
   - If the user gives you technical jargon (e.g., "We are changing timeout from 2000 to 5000"), reply:
     "I don't care about timeout configs or code changes. All I care about is: will our shoppers be able to complete their orders right now, and what is your exact ETA?"
3. TONE & STYLE:
   - Stressed, demanding, impatient, corporate client executive under revenue loss pressure.
   - Keep responses concise (1-3 sentences).`,
};

export async function POST(req: Request) {
  try {
    const { messages, agentId = 'priya' } = await req.json();
    const systemPrompt = AGENT_SYSTEM_PROMPTS[agentId] || AGENT_SYSTEM_PROMPTS.priya;

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    // Intelligent fallback if key is missing or placeholder
    if (!apiKey || apiKey === 'placeholder-gemini-key' || apiKey.startsWith('placeholder')) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      let simulatedReply = '';

      if (agentId === 'priya') {
        if (lastUserMsg.toLowerCase().includes('timeout') || lastUserMsg.toLowerCase().includes('5000') || lastUserMsg.toLowerCase().includes('fixed')) {
          simulatedReply =
            "Understood. Have you verified the fix with the integration test suite in the terminal? What is your ETA to deploy this to production?";
        } else if (lastUserMsg.toLowerCase().includes('log') || lastUserMsg.toLowerCase().includes('investigat')) {
          simulatedReply =
            "Acknowledged. What are the logs telling you about the error rate, and when can I expect a resolution plan?";
        } else {
          simulatedReply =
            "I need an update on the payment API outage. What is your current status, and what is your ETA for restoring checkout?";
        }
      } else if (agentId === 'alex') {
        if (lastUserMsg.toLowerCase().includes('help') || lastUserMsg.toLowerCase().includes('stuck') || lastUserMsg.toLowerCase().includes('how')) {
          simulatedReply =
            "Check line 02:14:58 in the logs for Stripe's p99 latency, then compare it with the timeout setting in config.ts. Try running 'npm test' in the terminal.";
        } else {
          simulatedReply =
            "I'm keeping an eye on the pod. Let me know once you test your changes in the terminal.";
        }
      } else {
        // Client: Marcus Vance
        simulatedReply =
          "We are losing $15,000 every minute this outage continues! Our shoppers cannot complete orders. What is your exact ETA to restore payments?";
      }

      const encoder = new TextEncoder();
      const customStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(simulatedReply)}\n`));
          controller.close();
        },
      });

      return new Response(customStream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Call real Google Gemini model using Vercel AI SDK with tight token budget for instant speed
    const result = streamText({
      model: google('gemini-3.6-flash'),
      system: `${systemPrompt}\nIMPORTANT: Keep your reply to 1-2 short sentences (under 25 words). Be direct, fast, and punchy.`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Chat error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
