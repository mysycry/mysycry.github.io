// Cloudflare Pages Function — LLM-powered portfolio chatbot.
// Endpoint: POST /api/chat
//
// Why a Function? The Workers AI API key must never run in the browser
// (anyone could read it from DevTools). This Function runs on Cloudflare's
// edge, holds the secret server-side, and only forwards the chat text.
//
// Required environment variables (Pages project -> Settings -> Variables):
//   CF_AI_ACCOUNT_ID  Cloudflare Account ID
//   CF_AI_API_TOKEN   API token with "Workers AI - Read/Edit" permission
//   CF_AI_MODEL       Optional. Model id, defaults to Llama 3.3 70B (fast)
//
// The generic CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN from the Pages
// deployment are used as a fallback, but the deploy token may only have Pages
// permissions, so a dedicated Workers AI token is recommended.

const DEFAULT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const MAX_HISTORY = 8;
const MAX_MESSAGE_LENGTH = 1000;

const SYSTEM_PROMPT = [
  "You are Michael's friendly portfolio assistant, embedded in his personal website.",
  "Answer concisely (under ~120 words) and helpfully. Use the facts below; if you don't",
  "know something, say so and suggest asking Michael directly.",
  "",
  "About Michael Josias D. Tabada:",
  "- Cloud/Platform Engineer and Solutions Architect based in the Philippines.",
  "- Email: navigatormichael@gmail.com. Open to new opportunities.",
  "- Skills: AWS, Azure, GCP, Terraform, Docker, Kubernetes, IaC, GitHub Actions, CI/CD, FinOps.",
  "- Certifications: 10+ including AWS Solutions Architect, GCP Professional Cloud Architect, FinOps Engineer.",
  "- Experience: Platform Engineer at Revcard, Solutions Architect at Ruralnet, Solutions Engineer at Lexmark.",
  "- Education: pursuing a Master's in Financial Engineering at WorldQuant University.",
  "- CV is downloadable via the CV button at the top of the site.",
  "- The site has a Games tab with a PS5-style carousel: Snake (canvas), DOOM (self-hosted WebAssembly), and a Super Mario Bros coming-soon card.",
  "- Pinned repos: mysycry.github.io (this site), claude-code-camp-2026-Q2, aws-bootcamp-cruddur-2023 (AWS Cloud Project Bootcamp), skills-secure-repository-supply-chain.",
].join("\n");

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return json({ ok: true });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const userText = typeof body.message === "string" ? body.message.trim() : "";
  if (!userText) {
    return json({ error: "Empty message" }, 400);
  }
  if (userText.length > MAX_MESSAGE_LENGTH) {
    return json({ error: "Message too long" }, 413);
  }

  const accountId = env.CF_AI_ACCOUNT_ID || env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = env.CF_AI_API_TOKEN || env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    return json(
      { error: "AI is not configured. Add CF_AI_ACCOUNT_ID and CF_AI_API_TOKEN to the Pages project." },
      500
    );
  }

  const model = env.CF_AI_MODEL || DEFAULT_MODEL;

  const history = Array.isArray(body.history)
    ? body.history
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .slice(-MAX_HISTORY)
    : [];

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userText },
  ];

  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${encodeURIComponent(model)}`;

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
    return json({ error: "Could not reach the AI service" }, 502);
  }

  if (!aiResponse.ok) {
    return json({ error: `AI service error (${aiResponse.status})` }, 502);
  }

  let data;
  try {
    data = await aiResponse.json();
  } catch {
    return json({ error: "Unexpected response from AI service" }, 502);
  }

  const reply =
    typeof data?.result?.response === "string" && data.result.response.trim()
      ? data.result.response.trim()
      : "Hmm, I couldn't think of a reply. Try asking something else!";

  return json({ response: reply });
}
