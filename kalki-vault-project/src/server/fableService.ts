/**
 * KALKI VAULT — Anthropic Claude Fable 5.1 Intelligence Service
 * Interacts with OpenRouter using OPENROUTER_API_KEY for the
 * autonomous cognitive defense copilot and SOC analysis engine.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface FableChatOptions {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

const KALKI_SYSTEM_PROMPT = `You are KALKI NEURAL COPILOT, the autonomous cognitive cyber-defense core of KALKI VAULT.
Your architecture is built on NIST FIPS 203 ML-KEM (Kyber-1024), FIPS 204 ML-DSA (Dilithium-5), eBPF kernel telemetry, and zero-trust cryptographically bound hardware passkeys.
You are running under the Anthropic Claude Fable 5.1 neural intelligence engine.

Personality & Protocol:
- Respond as an advanced, precise, authoritative sovereign cyber-intelligence officer.
- Specialize in deep technical explanations of:
  * Adversary-in-the-Middle (AitM) phishing proxy mitigation via FIDO2 origin binding.
  * Post-Quantum Cryptography (PQC) lattice algorithms (Module-LWE, Ring-LWE, Kyber, Dilithium).
  * In-memory ransomware heuristic neutralization via mass file entropy monitoring (>7.9 bits/byte) and eBPF socket termination in <42ms.
  * Hardened WebAuthn passkeys, hardware security modules (HSM), and ephemeral capability tokens.
  * Automated DEFCON threat posture escalation and air-gap network quarantines.
- Format responses cleanly with concise markdown, terminal-like headers, bullet points, and code/configuration blocks where relevant. Keep answers punchy, dense with real cryptographic and cybersecurity acumen, and directly applicable.`;

export function getOpenRouterApiKey(): string | undefined {
  return process.env.OPENROUTER_API_KEY;
}

export function isFableConfigured(): boolean {
  return Boolean(getOpenRouterApiKey());
}

/**
 * Execute a non-streaming chat completion with Claude Fable 5.1
 */
export async function queryFable51(userPrompt: string, conversationHistory: ChatMessage[] = []): Promise<string> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in the server environment.');
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: KALKI_SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userPrompt }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'Kalki Vault Neural Copilot (Fable 5.1)'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-fable-5.1',
      stream: false,
      max_tokens: 600,
      temperature: 0.3,
      messages
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No output received from Claude Fable 5.1.';
}

/**
 * Stream a chat completion with Claude Fable 5.1 using Server-Sent Events (SSE)
 */
export async function streamFable51(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
  maxTokens: number = 350
): Promise<void> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    onError(new Error('OPENROUTER_API_KEY is not set.'));
    return;
  }

  const fullMessages: ChatMessage[] = [
    { role: 'system', content: KALKI_SYSTEM_PROMPT },
    ...messages
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Kalki Vault Neural Copilot (Fable 5.1)'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-fable-5.1',
        stream: true,
        max_tokens: maxTokens,
        temperature: 0.3,
        messages: fullMessages
      })
    });

    if (!response.ok) {
      const err = await response.text();
      onError(new Error(`OpenRouter HTTP ${response.status}: ${err}`));
      return;
    }

    if (!response.body) {
      onError(new Error('No response body returned from OpenRouter.'));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              onChunk(delta);
            }
          } catch {
            // ignore partial JSON parse
          }
        }
      }
    }
    onDone();
  } catch (err: any) {
    onError(err);
  }
}
