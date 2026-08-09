// Cloudflare Worker — LLM-powered portfolio chatbot.
// Endpoint: POST /api/chat (any path is fine)
//
// Thin entry point; all logic lives in the shared core at chat-core.js
// (also used by the Cloudflare Pages Function).
//
// Required environment variables (Worker -> Settings -> Variables):
//   CF_AI_ACCOUNT_ID  Cloudflare Account ID
//   CF_AI_API_TOKEN   API token with "Workers AI - Read/Edit" permission
//   CF_AI_MODEL       Optional. Model id, defaults to Llama 3.3 70B (fast)

import { handleChatRequest } from "./chat-core.js";

export default {
  async fetch(request, env) {
    return handleChatRequest(request, env);
  },
};
