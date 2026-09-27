/**
 * KALKI VAULT — OpenAI GPT-6 Astra Pro Intelligence Service
 * Interacts with OpenRouter using OPENROUTER_API_KEY as the middle man
 * for the autonomous cognitive defense copilot and SOC analysis engine.
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
  model?: string;
}

export const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-6-astra-pro';

const KALKI_SYSTEM_PROMPT = `You are KALKI NEURAL COPILOT, the autonomous cognitive cyber-defense core of KALKI VAULT.
Your architecture is built on NIST FIPS 203 ML-KEM (Kyber-1024), FIPS 204 ML-DSA (Dilithium-5), eBPF kernel telemetry, and zero-trust cryptographically bound hardware passkeys.
You are running under the OpenAI GPT-6 Astra Pro neural intelligence engine.

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

export function getOpenRouterModel(): string {
  return process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
}

export function isFableConfigured(): boolean {
  return Boolean(getOpenRouterApiKey());
}

function extractAffordTokens(errText: string): number | null {
  const match = errText.match(/can only afford (\d+)/i);
  if (match && match[1]) {
    const val = parseInt(match[1], 10);
    return isNaN(val) ? null : val;
  }
  return null;
}

/**
 * Execute a non-streaming chat completion through OpenRouter with GPT-6 Astra Pro
 */
export async function queryFable51(
  userPrompt: string,
  conversationHistory: ChatMessage[] = [],
  modelOverride?: string,
  tokensLimit: number = 150
): Promise<string> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured in the server environment.');
  }

  const model = modelOverride || getOpenRouterModel();
  const messages: ChatMessage[] = [
    { role: 'system', content: KALKI_SYSTEM_PROMPT },
    ...conversationHistory,
    { role: 'user', content: userPrompt }
  ];

  let currentTokens = tokensLimit;
  let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'Kalki Vault Neural Copilot (GPT-6 Astra Pro)'
    },
    body: JSON.stringify({
      model,
      stream: false,
      max_tokens: currentTokens,
      temperature: 0.3,
      messages
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    const afford = extractAffordTokens(errText);
    if (response.status === 402 && afford && afford > 10 && afford < currentTokens) {
      // Auto-adapt to current credit balance
      currentTokens = Math.max(afford - 5, 10);
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Kalki Vault Neural Copilot (GPT-6 Astra Pro)'
        },
        body: JSON.stringify({
          model,
          stream: false,
          max_tokens: currentTokens,
          temperature: 0.3,
          messages
        })
      });
      if (!response.ok) {
        const retryErr = await response.text();
        throw new Error(`OpenRouter HTTP ${response.status}: ${retryErr}`);
      }
    } else {
      throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
    }
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No output received from neural copilot.';
}

/**
 * Stream a chat completion through OpenRouter with GPT-6 Astra Pro using SSE
 */
export async function streamFable51(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
  maxTokens: number = 150,
  modelOverride?: string
): Promise<void> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    onError(new Error('OPENROUTER_API_KEY is not set.'));
    return;
  }

  const model = modelOverride || getOpenRouterModel();
  const fullMessages: ChatMessage[] = [
    { role: 'system', content: KALKI_SYSTEM_PROMPT },
    ...messages
  ];

  let currentTokens = maxTokens;

  try {
    let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Kalki Vault Neural Copilot (GPT-6 Astra Pro)'
      },
      body: JSON.stringify({
        model,
        stream: true,
        max_tokens: currentTokens,
        temperature: 0.3,
        messages: fullMessages
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      const afford = extractAffordTokens(errText);
      if (response.status === 402 && afford && afford > 10 && afford < currentTokens) {
        currentTokens = Math.max(afford - 5, 10);
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'Kalki Vault Neural Copilot (GPT-6 Astra Pro)'
          },
          body: JSON.stringify({
            model,
            stream: true,
            max_tokens: currentTokens,
            temperature: 0.3,
            messages: fullMessages
          })
        });
      }

      if (!response.ok) {
        const finalErr = await response.text();
        onError(new Error(`OpenRouter HTTP ${response.status}: ${finalErr}`));
        return;
      }
    }

    if (!response.body) {
      onError(new Error('No response body returned from OpenRouter.'));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) {
          continue;
        }

        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();
          if (dataStr === '[DONE]') {
            onDone();
            return;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              onError(new Error(parsed.error.message || JSON.stringify(parsed.error)));
              return;
            }
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              onChunk(delta);
            }
          } catch {
            // Partial JSON chunk
          }
        }
      }
    }

    onDone();
  } catch (err: any) {
    onError(err);
  }
}
