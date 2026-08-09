// Shared LLM chatbot core, used by BOTH the Cloudflare Pages Function
// (functions/api/chat.js) and the standalone Worker (workers/chat.js).
// Keep all shared logic here so the two entry points can never drift.
//
// Endpoint: POST /api/chat  (JSON: { message, history? })
//
// Security:
// - CORS is restricted to the two known origins (GitHub Pages + Cloudflare
//   Pages). Unknown origins get no ACAO header, so browsers can't call this
//   from a random website.
// - A per-IP rate limit (20 req/min) guards against quota-burning abuse. The
//   counters live in Cloudflare's Cache API so they survive across worker
//   isolates, with an in-memory fallback if the Cache API is unavailable.
// - The Workers AI token stays server-side and is never exposed to the browser.
//
// Required environment variables:
//   CF_AI_ACCOUNT_ID  Cloudflare Account ID
//   CF_AI_API_TOKEN   API token with "Workers AI - Read/Edit" permission
//   CF_AI_MODEL       Optional. Model id, defaults to Llama 3.3 70B (fast)

export const DEFAULT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
export const MAX_HISTORY = 8;
export const MAX_MESSAGE_LENGTH = 1000;

const ALLOWED_ORIGINS = [
  "https://mysycry.github.io",
  "https://josiasmichael.pages.dev",
];

// Rate limiting: max requests per IP per rolling window.
//
// Uses Cloudflare's Cache API for the counters so the count survives across
// worker isolates (an in-memory Map dies the moment a request lands on a
// different edge isolate, which is nearly every request). Cache entries use
// short max-age TTLs and are shared across Cloudflare's edge. If the Cache
// API is unavailable for any reason, we fall back to a best-effort in-memory
// counter per isolate.
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 20;
const hitCounters = new Map();
const CACHE_BASE = "https://rate-limit.portfolio.internal/";

async function isRateLimited(ip) {
  const now = Date.now();
  const key = `${CACHE_BASE}${ip}`;
  let bucket;

  try {
    const cached = await caches.default.match(key);
    if (cached) {
      bucket = await cached.json();
    }
  } catch {
    // cache unavailable — fall back to in-memory below
  }

  if (bucket && now - bucket.start < RATE_WINDOW_MS) {
    bucket.count += 1;
  } else {
    bucket = { start: now, count: 1 };
  }

  const limited = bucket.count > RATE_MAX;

  if (!limited) {
    try {
      const ttlS = Math.max(1, Math.ceil((bucket.start + RATE_WINDOW_MS - now) / 1000));
      await caches.default.put(
        key,
        new Response(JSON.stringify(bucket), {
          headers: { "Cache-Control": `s-maxage=${ttlS}` },
        })
      );
    } catch {
      // Cache is unavailable; fall back to in-memory for this request.
      const mem = hitCounters.get(ip);
      if (mem && now - mem.start < RATE_WINDOW_MS) {
        mem.count += 1;
        return mem.count > RATE_MAX;
      }
      hitCounters.set(ip, bucket);
    }
  }

  return limited;
}

const SYSTEM_PROMPT = [
  "You are Michael's friendly portfolio assistant, embedded in his personal website.",
  "Answer concisely (under ~120 words) and helpfully. Use the facts below; if you don't",
  "know something, say so and suggest asking Michael directly.",
  "",
  "About Michael Josias D. Tabada:",
  "- Cloud/Platform Engineer and Solutions Architect based in the Philippines.",
  "- Email: josiasmichael@gmail.com. Open to new opportunities.",
  "- Skills: AWS, Azure, GCP, Terraform, Docker, Kubernetes, IaC, GitHub Actions, CI/CD, FinOps.",
  "- Certifications: 10+ including AWS Solutions Architect, GCP Professional Cloud Architect, FinOps Engineer.",
  "- Experience: Platform Engineer at Revcard, Solutions Architect at Ruralnet, Solutions Engineer at Lexmark.",
  "- Education: pursuing a Master's in Financial Engineering at WorldQuant University.",
  "- CV is downloadable via the CV button at the top of the site.",
  "- The site has a Games tab with a PS5-style carousel: Snake (canvas), DOOM (self-hosted WebAssembly), and a Super Mario Bros coming-soon card.",
  "- Pinned repos: mysycry.github.io (this site), claude-code-camp-2026-Q2, aws-bootcamp-cruddur-2023 (AWS Cloud Project Bootcamp), skills-secure-repository-supply-chain.",
].join("\n");

function json(data, status = 200, origin) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Vary"] = "Origin";
  }

  return new Response(JSON.stringify(data), { status, headers });
}

export async function handleChatRequest(request, env) {
  const origin = request.headers.get("Origin") || "";

  if (request.method === "OPTIONS") {
    return json({ ok: true }, 200, origin);
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, origin);
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (await isRateLimited(ip)) {
    return json({ error: "Too many requests, please try again in a minute" }, 429, origin);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, origin);
  }

  const userText = typeof body.message === "string" ? body.message.trim() : "";
  if (!userText) {
    return json({ error: "Empty message" }, 400, origin);
  }
  if (userText.length > MAX_MESSAGE_LENGTH) {
    return json({ error: "Message too long" }, 413, origin);
  }

  // History is treated as untrusted input: only user/assistant roles, string
  // content, length-capped, and truncated to the most recent MAX_HISTORY.
  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.length <= MAX_MESSAGE_LENGTH
        )
        .slice(-MAX_HISTORY)
    : [];

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userText },
  ];

  const accountId = env.CF_AI_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CF_AI_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return json(
      { error: "AI is not configured. Add CF_AI_ACCOUNT_ID and CF_AI_API_TOKEN." },
      500,
      origin
    );
  }

  const model = env.CF_AI_MODEL || DEFAULT_MODEL;

  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`;

  let aiResponse;
  try {
    aiResponse = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });
  } catch {
    return json({ error: "Could not reach the AI service" }, 502, origin);
  }

  if (!aiResponse.ok) {
    return json({ error: `AI service error (${aiResponse.status})` }, 502, origin);
  }

  let data;
  try {
    data = await aiResponse.json();
  } catch {
    return json({ error: "Unexpected response from AI service" }, 502, origin);
  }

  const reply =
    typeof data?.result?.response === "string" && data.result.response.trim()
      ? data.result.response.trim()
      : "Hmm, I couldn't think of a reply. Try asking something else!";

  return json({ response: reply }, 200, origin);
}
