# 🤖 Chatbot — Deployment Guide & Troubleshooting

This document explains how the LLM chatbot works, why it behaves differently on
the two live URLs, and the exact hurdles + solutions we implemented to get it
working on both.

---

## 🔗 The Two Live Links

| Link | Host | Chatbot |
|------|------|---------|
| `https://mysycry.github.io` | **GitHub Pages** (static) | ✅ LLM-powered (via Cloudflare **Worker**) |
| `https://josiasmichael.pages.dev` | **Cloudflare Pages** (static + Functions) | ✅ LLM-powered (native Pages Function) |

Both serve the **same** static build (identical `index.html` / `script.js` / CSS).
The difference is only *where* the `/api/chat` request is handled.

---

## 🧠 How the Chatbot Works

```
User types a message
   ↓
Browser → POST /api/chat   (no API key here — the key stays server-side)
   ↓
Cloudflare Workers AI (LLM)
   ↓
Reply → back to the chat bubble
```

The browser never sees the Workers AI token. A server-side component holds the
secret and forwards the request. That server-side component is the catch:
**GitHub Pages can't run it.**

---

## ⚔️ The Core Problem

`index.html` calls `/api/chat` relative to the current origin:

```js
fetch('/api/chat', { method: 'POST', ... });
```

- On **Cloudflare Pages**, `/api/chat` is handled by a *Pages Function*
  (`functions/api/chat.js`). Works out of the box.
- On **GitHub Pages**, there is **no server-side runtime**. `/api/chat` does not
  exist, so the request returns `405 Method Not Allowed` and the chatbot fell
  back to plain keyword replies.

> GitHub Pages is a purely static host — it cannot execute
> `functions/api/chat.js`. That file only runs on Cloudflare's edge.

---

## 🛠️ The Solution: A Standalone Cloudflare Worker

We moved the chat logic into a **standalone Cloudflare Worker** that lives at a
fixed public URL, independent of either site:

- **Source:** `workers/chat.js` (module Worker format)
- **Endpoint:** `https://portfolio.josiasmichael.workers.dev/api/chat`
- **Env vars:** `CF_AI_ACCOUNT_ID`, `CF_AI_API_TOKEN` (+ optional `CF_AI_MODEL`)

`script.js` now tries the endpoints **in order** and falls back gracefully:

```js
const CHAT_API_URLS = [
  '/api/chat',                                      // 1. Cloudflare Pages Function
  'https://portfolio.josiasmichael.workers.dev/api/chat', // 2. Worker (GitHub Pages)
];
```

1. Try the same-origin `/api/chat` (works on Cloudflare Pages).
2. If that fails / returns nothing, try the Worker (works on GitHub Pages).
3. If both fail, fall back to the built-in keyword replies.

The Worker is deployed automatically by
`.github/workflows/cloudflare-worker-deploy.yml`.

---

## 🚧 The Hurdles We Faced (and the fixes)

### 1. ❌ Deploy kept failing — "Input required and not supplied: apiToken"

The GitHub Actions workflow referenced secrets (`CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID`) that didn't exist in the repo.

**Fix:** Add the secrets in **Repo → Settings → Secrets and variables →
Actions**. We standardized on `CF_AI_API_TOKEN` / `CF_AI_ACCOUNT_ID` for
uniformity across GitHub and Cloudflare (same names everywhere).

### 2. ❌ Cloudflare API returned `403 / 10000 Authentication error`

The token was present but Cloudflare rejected it. Two separate causes:

- **Stale token value.** Editing/rolling a Cloudflare API token **regenerates
  its value**. The old value in the GitHub secret was dead.
  **Fix:** after editing permissions, copy the *new* token value and update the
  GitHub secret.

- **Missing permissions.** The token must carry **three** permission groups:

  | Permission | Used for |
  |------------|----------|
  | Cloudflare Pages → Edit | Pages deploy |
  | Workers AI → Edit | Chatbot AI calls |
  | Workers Scripts → Edit | Worker deploy (easy to miss!) |

### 3. ❌ Worker deploy failed at "Uploading secrets..."

`cloudflare/wrangler-action@v3` tried to `wrangler secret put` **before** the
worker existed, so the secret upload failed.

**Fix:** Deploy the worker first, then set the secret in a separate step
(`.github/workflows/cloudflare-worker-deploy.yml`):

```yaml
- name: Deploy Worker
  uses: cloudflare/wrangler-action@v3
  with:
    ...
    command: deploy chat.js --name portfolio --compatibility-date 2025-09-27 --var CF_AI_ACCOUNT_ID:...

- name: Set Worker AI secret
  run: |
    echo "${{ secrets.CF_AI_API_TOKEN }}" | npx wrangler secret put CF_AI_API_TOKEN --name portfolio
```

### 4. ❌ Worker URL mismatch

The deploy workflow originally named the worker `portfolio-chat`, but the
hardcoded URL in `script.js` was `portfolio`. CI would have deployed to the
wrong URL.

**Fix:** Aligned the workflow to `--name portfolio` so the deployed worker
matches `https://portfolio.josiasmichael.workers.dev/api/chat`.

### 5. ❌ Link Checker failed — lychee install & root-relative links

- Manual `curl | tar` install broke because the lychee release archive changed
  format (`lychee: Not found in archive`).
  **Fix:** switched to the official `lycheeverse/lychee-action@v2`.
- Root-relative links like `/images/...` couldn't be resolved.
  **Fix:** added `--root-dir .` to the lychee args.

### 6. ❌ Canonical URL pointed to a dead domain

The meta tags pointed to `https://josiasmichael.github.io`, which does not
exist (404) — the actual GitHub Pages domain is `https://mysycry.github.io`.

**Fix:** updated `canonical`, `og:url`, `og:image`, `twitter:image` in
`index.html` to `https://mysycry.github.io`.

---

## 🧪 How to Verify

```powershell
# GitHub Pages site (static)
curl https://mysycry.github.io/

# Cloudflare Pages site (static + Function)
curl https://josiasmichael.pages.dev/

# Chatbot via Worker (used by GitHub Pages)
curl -X POST https://portfolio.josiasmichael.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What certifications does Michael have?","history":[]}'

# Chatbot via Pages Function (used by Cloudflare Pages)
curl -X POST https://josiasmichael.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What certifications does Michael have?","history":[]}'
```

Expected: HTTP 200 with a JSON `{ "response": "..." }` from all chat endpoints.

---

## 📂 Relevant Files

| File | Purpose |
|------|---------|
| `functions/api/chat.js` | Pages Function (Cloudflare Pages native) |
| `workers/chat.js` | Standalone Worker (GitHub Pages fallback) |
| `script.js` | Endpoint fallback logic (`CHAT_API_URLS`) |
| `.github/workflows/cloudflare-pages-deploy.yml` | Pages deploy |
| `.github/workflows/cloudflare-worker-deploy.yml` | Worker deploy |
| `wrangler.toml` / `wrangler.jsonc` | Cloudflare config |
