# Portfolio - Michael Josias D. Tabada

A modern **social media-style portfolio** website showcasing professional experience, certifications, and projects as a Platform Engineer & Cloud Solutions Architect.

![Portfolio Preview](/images/portfolio-preview.png)

---

## 🌟 Features

### 📱 Social Media Profile Design
- **Modern Layout** - Instagram/Twitter/LinkedIn-inspired profile design
- **Cover Photo** - Animated gradient header
- **Profile Avatar** - Circular with online status indicator
- **Verified Badge** - Professional verification indicator
- **Action Buttons** - Contact, Download CV, Share profile
- **Stats Bar** - Certifications, Projects, Years of Experience

### 🎨 Design & UX
- **Dark/Light Mode** - Auto-detects system preference + manual toggle
- **Fully Responsive** - Optimized for all screen sizes
- **Smooth Animations** - Fade transitions, hover effects, spin animations
- **Sticky Navigation** - Tab navigation stays visible while scrolling

### ♿ Accessibility (WCAG 2.1)
- **Skip to Content Link** - Keyboard users can bypass navigation
- **ARIA Labels** - Complete ARIA attributes for screen readers
- **Keyboard Navigation** - Full keyboard support
- **Focus Indicators** - Clear focus states
- **Reduced Motion** - Respects user's motion preferences

### 🚀 Performance
- **Lazy Loading** - Images load efficiently
- **Preconnect Hints** - Faster font loading
- **Optimized Animations** - GPU-accelerated CSS
- **No Framework Bloat** - Pure HTML/CSS/JS

### 🔍 SEO
- **Meta Tags** - Complete title, description, keywords
- **Open Graph** - Social media preview cards
- **Twitter Cards** - Twitter-specific meta tags
- **Canonical URL** - Prevents duplicate content

### ✨ Interactive Elements
- **Posts Feed** - Experience displayed as social media posts
- **About Tab** - Education and skills grid
- **Badges Tab** - 10+ certifications with spin animation
- **Repos Tab** - Mirrors the 4 pinned GitHub repos with live stats
- **Game Room** - Snake + DOOM (self-hosted WASM) + Mario (coming soon)
- **Chatbot** - LLM-powered interactive assistant (Cloudflare Workers AI)
- **Share Button** - Native share API + clipboard fallback
- **Copy Email** - One-click email copying with toast

---

## 📊 Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom properties, animations, responsive design
- **JavaScript (Vanilla)** - ES6+ features, no frameworks
- **Font Awesome** - Icons
- **Google Fonts** - Inter & Fira Code
- **Cloudflare Pages** - Hosting, CDN, Pages Functions
- **Cloudflare Workers AI** - Serverless LLM for the chatbot

---

## 📁 Project Structure

```
mysycry.github.io/
├── index.html              # Main HTML (social media layout)
├── styles.css              # Social media theme styling
├── script.js               # All JavaScript functionality
├── README.md               # Documentation
├── _headers                # Security + caching headers (Cloudflare Pages)
├── _routes.json            # Cloudflare routing config (Functions only)
├── 404.html                # Custom 404 page
├── robots.txt              # Crawler rules + sitemap pointer
├── sitemap.xml             # SEO sitemap
├── docs/
│   ├── GH-README.md        # GitHub Actions study guide
│   ├── CLOUDFLARE_DEPLOY.md# Cloudflare deployment guide
│   ├── CHATBOT-README.md   # Chatbot guide (how it works + troubleshooting)
│   └── Tabada, Michael Josias D. CV.pdf   # Downloadable CV
├── .github/
│   ├── dependabot.yml                 # Weekly dependency updates
│   └── workflows/
│       ├── cloudflare-pages-deploy.yml  # Auto-deploy to Pages
│       ├── cloudflare-worker-deploy.yml # Auto-deploy chat Worker
│       ├── link-checker.yml             # Link + image + social metadata checks
│       ├── html-css-validation.yml      # Linting + validation
│       └── site-health-check.yml        # Uptime ping for live endpoints
├── doom/                   # Self-hosted DOOM (WASM)
│   ├── doom.html
│   ├── index.js
│   ├── index.wasm
│   └── index.data
├── functions/
│   └── api/
│       └── chat.js         # LLM chatbot entry (Cloudflare Pages Function)
├── workers/
│   ├── chat-core.js        # Shared LLM chatbot logic (CORS + rate limit)
│   ├── chat.js             # LLM chatbot entry (standalone Worker)
│   └── wrangler.toml       # Worker config
└── images/
    ├── doom-icon.jpg
    ├── mario-question-mark.webp
    ├── portfolio-preview.png
    ├── prof-pic.jpg
    ├── snake-icon.webp
    └── supermario-icon.webp
```

---

## 🛠️ Setup

### Local Development

```bash
git clone https://github.com/mysycry/mysycry.github.io.git
cd mysycry.github.io

# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

Visit `http://localhost:8000`

### Cloudflare Pages (Recommended)

**Option 1: Direct GitHub Integration**

1. Go to https://dash.cloudflare.com → Workers & Pages → Create Application
2. Select **Pages** → **Connect to Git**
3. Choose repository: `mysycry/mysycry.github.io`
4. Build settings:
   ```
   Project name: portfolio
   Production branch: main
   Build command: (leave empty)
   Build output directory: .
   ```
5. Click **Save and Deploy** - Live in seconds!

**Option 2: GitHub Actions**

1. Add repository secrets:
   ```
   Settings → Secrets and variables → Actions
    
   CF_AI_ACCOUNT_ID: your_cloudflare_account_id
   CF_AI_API_TOKEN: your_api_token_here
   ```

2. Push to main - Auto-deploys via workflow

**Custom Domain:**
- Add in Cloudflare Pages dashboard
- DNS: CNAME to `portfolio.josiasmichael.workers.dev`

📖 **Full guide:** See [`docs/CLOUDFLARE_DEPLOY.md`](docs/CLOUDFLARE_DEPLOY.md)

### 🤖 Chatbot

The LLM chatbot works on **both** live sites (GitHub Pages and Cloudflare
Pages) via a Cloudflare Worker fallback. It uses Workers AI with the key held
server-side.

📖 **Full guide:** See [`docs/CHATBOT-README.md`](docs/CHATBOT-README.md)

### GitHub Pages

1. Push to GitHub
2. Settings → Pages → Select `main` branch
3. Live at `https://mysycry.github.io/`

---

## 🎨 Customization

### Update Profile Info

Edit `index.html`:
- **Name/Bio/Meta** - Lines 62-93 (profile header)
- **Stats/Actions** - Lines 95-123 (profile-stats + profile-actions)

### Update Experience (Posts)

Edit `index.html` Posts tab (lines 155-480):
```html
<article class="post">
    <div class="post-content">
        <h3 class="post-title">Your Position</h3>
        <p class="post-company">Company Name</p>
        <!-- ... -->
    </div>
</article>
```

### Update Badges

Edit `index.html` Badges tab (lines 573-739):
```html
<div class="badge-card" data-badge="your-badge-id">
    <div class="badge-image-container">
        <div class="badge-icon aws">
            <i class="fab fa-aws"></i>
        </div>
    </div>
    <h4>Badge Name</h4>
    <p>Issuer</p>
</div>
```

### Update Repositories

Edit `index.html` Repos tab (lines 740-836) — currently mirrors the 4 repos pinned
on [github.com/mysycry](https://github.com/mysycry).

### Change Colors

Edit `styles.css` CSS variables (lines 11-30):
```css
:root {
    --primary: #6366f1;      /* Main brand color */
    --secondary: #ec4899;    /* Accent color */
    --cover-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## 🎮 Snake Game

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move | Arrow Keys / WASD | Swipe |
| Start | Space / Enter | Tap Start |

**Features:**
- Starts slow, speeds up
- Pass through walls
- High score saved locally

---

## 🤖 AI Chatbot

The chatbot is powered by **Cloudflare Workers AI** (a serverless LLM). A single
shared module (`workers/chat-core.js`) holds all the logic and is used by **both**
entry points, so they can never drift apart:
- **`functions/api/chat.js`** — native Pages Function (Cloudflare Pages).
- **`workers/chat.js`** — standalone Worker fallback so the chatbot also works on
  the static GitHub Pages deployment.

The API key stays server-side.

- **Live (deployed):** answers any question with an LLM, aware of Michael's
  background, skills, certifications, and projects.
- **Offline fallback:** if the AI endpoint is unreachable (e.g. running locally
  with `python -m http.server`), it falls back to keyword matching (greetings,
  contact, jobs, skills, certifications, experience, education, repos, games,
  plus "who are you" / "are you AI" style identity questions).

To enable the AI, set `CF_AI_ACCOUNT_ID` and `CF_AI_API_TOKEN` in the Cloudflare
Pages project settings (see `docs/CLOUDFLARE_DEPLOY.md`).

### 🔒 Chatbot security
- **Restricted CORS** — the API only answers requests from
  `mysycry.github.io` and `josiasmichael.pages.dev`, so random websites can't
  burn your Workers AI quota from a visitor's browser. `Vary: Origin` is always
  set so a shared cache can't cross-serve the CORS variants.
- **Rate limiting** — per-IP limiter (20 req/min) protects against
  quota-burning abuse; counters persist via Cloudflare's Cache API
- **Prompt safety** — message length capped at 1000 chars; chat history is
  treated as untrusted input (role/content validated, truncated to 8 turns).
  Raw request bodies are also capped (~64 KB) and rejected with `413` before
  any LLM call.
- **No secrets in the browser** — the Workers AI token never ships to the client.

---

## 📱 Responsive Breakpoints

| Device | Width | Features |
|--------|-------|----------|
| Desktop | > 768px | Full layout, 5-column badges |
| Tablet | 480-768px | Adjusted spacing, 3-column badges |
| Mobile | < 480px | Single column, stacked layout |

---

## 🔄 CI/CD Workflows

| Workflow | Description | Schedule |
|----------|-------------|----------|
| 🚀 **Cloudflare Pages Deploy** | Auto-deploys the site to Pages | Push to main/dev |
| 🤖 **Chat Worker Deploy** | Deploys the standalone chatbot Worker | Push to main/dev (workers/**) |
| 🔗 **Link Checker** | Validates links, images & social metadata | Push/PR + Weekly |
| 🧹 **HTML/CSS Validation** | Linting (HTMLHint/Stylelint) + W3C checks | Push/PR |
| 🩺 **Site Health Check** | Pings all live endpoints for uptime | Every 3 days |
| 🤖 **Dependabot** | Weekly GitHub Actions updates | Weekly |

---

## 🔐 Security & Best Practices

### Headers & caching
- **`_headers`** file applies security headers on Cloudflare Pages:
  `X-Frame-Options: SAMEORIGIN`, a Content-Security-Policy (with
  `frame-ancestors 'self'` so cross-site framing is blocked but the same-origin
  DOOM iframe keeps working), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, `Strict-Transport-Security`, and `Permissions-Policy`
  (no camera/mic/geolocation).
- Long-lived immutable caching for `styles.css` / `script.js` (cache-busted
  with `?v=` query strings).
- GitHub Pages serves its own `Strict-Transport-Security` automatically.

### Supply chain
- **SRI** (`integrity` attribute) on the Font Awesome CDN stylesheet — the
  browser refuses it if the CDN serves tampered content.
- **Dependabot** opens weekly PRs for GitHub Actions updates.
- All workflows use **version-pinned actions** (`@v7`, etc.), not floating
  tags, and least-privilege `permissions:`.

### Deploy security
- Cloudflare credentials live only in **GitHub Secrets**, never in the repo.
- Secrets are passed to commands via **environment variables**, not echoed
  into shell command lines.
- The Cloudflare **API token needs 3 permissions**: Cloudflare Pages → Edit,
  Workers AI → Edit, Workers Scripts → Edit. (Editing/rolling a token
  regenerates its value — update the GitHub secret after any change.)

### SEO & crawling
- **`robots.txt`** allows crawling and points to the sitemap.
- **`sitemap.xml`** lists the canonical URL.
- **`404.html`** gives visitors a friendly fallback (GitHub Pages & Cloudflare).

---

## 📈 Changelog

### Version 7.2 - Security Hardening
- ✅ Content-Security-Policy on Cloudflare Pages (`frame-ancestors 'self'`,
  `object-src 'none'`, plus a relaxed override for `/doom/*` so the Emscripten
  build keeps working)
- ✅ `Strict-Transport-Security` header added
- ✅ Chat API: always send `Vary: Origin` (prevents CDN cross-serving the
  CORS variant), `Cache-Control: no-store`, and a ~64 KB request-body cap
  that returns `413` before any LLM call
- ✅ Added missing `concurrency` guard to the chat Worker deploy workflow
- ✅ Fixed doc drift: `CLOUDFLARE_DEPLOY.md` referenced a `legacy` production
  branch and claimed the AI token differed from the Pages deploy token (it's
  the same token with 3 permission groups)

### Version 7.1 - Security & Consistency Audit
- ✅ Shared chatbot core (`workers/chat-core.js`) — no more duplicated logic
- ✅ CORS restricted to the two live origins + per-IP rate limiting
- ✅ `_headers` file with security headers; removed dead root `wrangler.toml`
- ✅ `_routes.json` scoped to `/api/chat` only
- ✅ Unified workflow branch triggers (`main` + `dev`)
- ✅ Fixed doc drift: unified `CF_AI_API_TOKEN`/`CF_AI_ACCOUNT_ID` secrets
- ✅ Added SRI to CDN stylesheet
- ✅ Secrets passed via env vars in CI (no shell echo)
- ✅ Added `404.html`, `robots.txt`, `sitemap.xml`
- ✅ Tab keyboard navigation (arrow keys / Home / End) + `aria-controls`
- ✅ Removed unused assets; URL-encoded the CV link

### Version 7.0 - LLM Chatbot & Site Overhaul
- ✅ LLM-powered chatbot via Cloudflare Workers AI (Pages Function, serverless)
- ✅ Repos tab mirrors the 4 pinned GitHub repos with real stats (36 repos / 112 stars)
- ✅ Game Room: self-hosted DOOM (WASM) + Mario coming-soon "?" block
- ✅ Responsive fixes: 2x2 stats grid on phones, game carousel, floating button overlap
- ✅ GitHub Actions workflow fixes + study guide (`docs/GH-README.md`)
- ✅ Chat input no longer swallows WASD keys while typing

### Version 6.2 - AWS MCP AI Assistant Project
- ✅ Added AI Assistant with MCP Integration project
- ✅ AWS Bedrock AgentCore Runtime deployment
- ✅ Model Context Protocol implementation
- ✅ Multiple MCP servers (calculator, calendar, weather)
- ✅ Full-stack: Python, FastAPI, React
- ✅ Updated projects count to 36+

### Version 6.1 - Cloudflare Pages Deployment
- ✅ Added `wrangler.toml` configuration
- ✅ GitHub Actions workflow for auto-deploy
- ✅ Security and cache headers
- ✅ Deployment guide (`docs/CLOUDFLARE_DEPLOY.md`)
- ✅ `_routes.json` for routing
- ✅ Updated README with deployment instructions

### Version 6.0 - Social Media Redesign ⭐
- ✅ ARIA attributes throughout
- ✅ Skip-to-content link
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Reduced motion support
- ✅ Print stylesheet
- ✅ Copy email with toast

### Version 4.0 - Carousel Improvements
- ✅ Smooth infinite scrolling
- ✅ Touch swipe support
- ✅ Keyboard arrow navigation

### Version 3.0 - Visual Effects
- ✅ Dark mode with stars/meteors
- ✅ Light mode with particles
- ✅ Mouse-tracking glow

### Version 2.0 - Core Features
- ✅ Tab navigation
- ✅ Snake game
- ✅ Chatbot

### Version 1.0 - Initial Release
- ✅ Basic portfolio structure

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 🚀 Deploy to Cloudflare Pages

**Quick Deploy:**
1. Go to https://dash.cloudflare.com → Workers & Pages
2. Create Application → Pages → Connect to Git
3. Select this repository → Click **Save and Deploy**

**Live in seconds!** See [`docs/CLOUDFLARE_DEPLOY.md`](docs/CLOUDFLARE_DEPLOY.md) for full guide.

---

## 📝 License

Open source. Feel free to fork and customize!

---

## 🤝 Contact

- **Email:** josiasmichael@gmail.com
- **LinkedIn:** [linkedin.com/in/josiasmichael](https://linkedin.com/in/josiasmichael)
- **GitHub:** [github.com/mysycry](https://github.com/mysycry)
- **Credly:** [credly.com/users/jmichael](https://www.credly.com/users/jmichael/badges/credly)

---

**Made with ❤️ and ☕ by Michael Josias D. Tabada**

*Last Updated: August 2026 | Version 7.2 | Deployed on Cloudflare Pages/Github Pages*
