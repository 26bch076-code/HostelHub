import https from 'node:https';
import http from 'node:http';

// Helper to parse JSON body from incoming stream
export function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({ description: body });
      }
    });
    req.on('error', err => reject(err));
  });
}

// Check what credentials exist in the server environment
export function getAIConfig(env = process.env) {
  const gemmaKey = env.GEMMA_API_KEY || env.GOOGLE_AI_KEY;
  const groqKey = env.GROQ_API_KEY;
  const customEndpoint = env.GEMMA_API_ENDPOINT;

  const isConfigured = Boolean(
    (gemmaKey && gemmaKey.trim() !== '') ||
    (groqKey && groqKey.trim() !== '') ||
    (customEndpoint && customEndpoint.trim() !== '')
  );

  let provider = 'none';
  if (gemmaKey) provider = 'google-ai-studio';
  else if (groqKey) provider = 'groq';
  else if (customEndpoint) provider = 'custom-endpoint';

  return {
    isConfigured,
    provider,
    model: 'gemma-2-9b-it',
    gemmaKey,
    groqKey,
    customEndpoint
  };
}

/**
 * Call Groq Cloud API with gemma2-9b-it
 */
async function callGroqGemma(apiKey, systemPrompt, userText) {
  const payload = JSON.stringify({
    model: 'gemma2-9b-it',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText }
    ],
    temperature: 0.1,
    max_tokens: 500,
    response_format: { type: 'json_object' }
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      res => {
        let data = '';
        res.on('data', chunk => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 400 || parsed.error) {
              return reject(new Error(parsed.error?.message || `Groq API returned status ${res.statusCode}`));
            }
            const content = parsed.choices?.[0]?.message?.content;
            resolve(content);
          } catch (e) {
            reject(new Error(`Failed to parse Groq response: ${e.message}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Call Google AI Studio REST API for Gemma 2
 */
async function callGoogleGemma(apiKey, prompt) {
  const payload = JSON.stringify({
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 600,
      responseMimeType: 'application/json'
    }
  });

  // Try gemma-2-9b-it first, fallback to gemini-1.5-flash if user's API key lacks direct Gemma 2 quota
  const models = ['gemma-2-9b-it', 'gemini-1.5-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      const result = await new Promise((resolve, reject) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const req = https.request(
          url,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload)
            }
          },
          res => {
            let data = '';
            res.on('data', chunk => (data += chunk));
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                if (res.statusCode >= 400 || parsed.error) {
                  return reject(new Error(parsed.error?.message || `Google API status ${res.statusCode}`));
                }
                const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                resolve(content);
              } catch (e) {
                reject(new Error(`Parse error: ${e.message}`));
              }
            });
          }
        );
        req.on('error', reject);
        req.write(payload);
        req.end();
      });

      if (result) return result;
    } catch (err) {
      lastError = err;
      // Try next model if Gemma 2 model endpoint returned 404/unsupported
      continue;
    }
  }

  throw lastError || new Error('Google AI inference failed');
}

/**
 * Categorize complaint using Gemma
 */
export async function categorizeComplaint(complaintText, env = process.env) {
  const config = getAIConfig(env);

  if (!config.isConfigured) {
    return {
      success: false,
      configured: false,
      error: 'NO_API_KEY',
      message: 'Gemma API key is not configured. Add GEMMA_API_KEY or GROQ_API_KEY to your .env file to enable live AI categorization.'
    };
  }

  const systemInstructions = `You are HostelHub AI, an expert hostel maintenance triage system for Indian college hostels.
Analyze the student's complaint description and extract structured metadata.

ALLOWED CATEGORIES:
- Electrical
- Water and Plumbing
- Mess and Food
- Cleanliness
- Maintenance
- Internet and Wi-Fi
- Security
- Other

PRIORITY RULES:
- Urgent: Active physical hazards, electric sparks, exposed wires, gas leaks, flooding, or security breaches (broken room locks).
- High: Essential utility breakdown severely disrupting living conditions (no water supply in washroom, complete room blackout, geyser not working in winter).
- Normal: Routine repairs or minor inconveniences (flickering bulb, squeaking fan bearing, dustbin clearance, slow Wi-Fi).

CONSTRAINTS:
- Do NOT invent any facts or details that the student did not provide.
- Extract location ONLY if explicitly mentioned in the text (e.g., "Room 304", "East wing washroom", "Mess dining hall"). If no location is mentioned, return null.
- Provide a concise summary (max 8 words).
- Provide a brief 1-sentence reasoning for the selected category and priority.

OUTPUT FORMAT:
Return ONLY valid JSON matching this schema:
{
  "category": "Electrical",
  "summary": "Short 3-8 word title",
  "location": "Room 304 or null",
  "priority": "Normal",
  "reasoning": "Reason for priority and category"
}`;

  const promptText = `${systemInstructions}\n\nSTUDENT COMPLAINT TEXT:\n"""\n${complaintText}\n"""\n\nJSON:`;

  try {
    let rawResponse = '';
    if (config.provider === 'groq') {
      rawResponse = await callGroqGemma(config.groqKey, systemInstructions, complaintText);
    } else {
      rawResponse = await callGoogleGemma(config.gemmaKey, promptText);
    }

    // Clean JSON response (strip markdown fences if present)
    let cleaned = rawResponse.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const data = JSON.parse(cleaned);

    return {
      success: true,
      configured: true,
      provider: config.provider,
      model: config.model,
      data: {
        category: data.category || 'Other',
        summary: data.summary || complaintText.slice(0, 40),
        location: data.location || null,
        priority: ['Normal', 'High', 'Urgent'].includes(data.priority) ? data.priority : 'Normal',
        reasoning: data.reasoning || 'Categorized by Gemma AI based on standard hostel maintenance rules.'
      }
    };
  } catch (err) {
    console.error('[HostelHub AI Proxy Error]:', err.message);
    return {
      success: false,
      configured: true,
      error: 'INFERENCE_FAILED',
      message: `Gemma inference error: ${err.message}`
    };
  }
}

/**
 * Express / Connect / Vite server middleware
 */
export function aiProxyMiddleware(env = process.env) {
  return async (req, res, next) => {
    // Only handle /api/ai routes
    if (!req.url.startsWith('/api/ai')) {
      return next ? next() : res.end();
    }

    res.setHeader('Content-Type', 'application/json');

    // GET /api/ai/status
    if (req.method === 'GET' && (req.url === '/api/ai/status' || req.url === '/api/ai/status/')) {
      const config = getAIConfig(env);
      res.writeHead(200);
      return res.end(
        JSON.stringify({
          configured: config.isConfigured,
          provider: config.provider,
          model: config.model,
          message: config.isConfigured
            ? `Gemma AI is connected via ${config.provider} (${config.model}).`
            : 'Gemma AI is not configured. Add GEMMA_API_KEY or GROQ_API_KEY to your .env file.'
        })
      );
    }

    // POST /api/ai/categorize
    if (req.method === 'POST' && req.url.startsWith('/api/ai/categorize')) {
      try {
        const body = await parseRequestBody(req);
        const text = body.description || body.text || '';

        if (!text.trim()) {
          res.writeHead(400);
          return res.end(
            JSON.stringify({
              success: false,
              error: 'EMPTY_DESCRIPTION',
              message: 'Please provide complaint text to categorize.'
            })
          );
        }

        const result = await categorizeComplaint(text, env);
        res.writeHead(result.success ? 200 : (result.error === 'NO_API_KEY' ? 200 : 502));
        return res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500);
        return res.end(
          JSON.stringify({
            success: false,
            error: 'SERVER_ERROR',
            message: err.message
          })
        );
      }
    }

    // Fallback for unknown /api/ai route
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  };
}
