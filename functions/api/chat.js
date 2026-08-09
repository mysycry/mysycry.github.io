// Cloudflare Pages Function — LLM-powered portfolio chatbot.
// Endpoint: POST /api/chat
//
// Thin entry point; all logic lives in the shared core at
// workers/chat-core.js (also used by the standalone Worker).
//
// Required environment variables (Pages project -> Settings -> Variables):
//   CF_AI_ACCOUNT_ID  Cloudflare Account ID
//   CF_AI_API_TOKEN   API token with "Workers AI - Read/Edit" permission
//   CF_AI_MODEL       Optional. Model id, defaults to Llama 3.3 70B (fast)

import { handleChatRequest } from "../../workers/chat-core.js";

export async function onRequest(context) {
  const { request, env } = context;
  return handleChatRequest(request, env);
}
