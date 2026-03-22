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
- **Repos Tab** - GitHub repositories with stats
- **Snake Game** - Playable game with score tracking
- **Chatbot** - Interactive virtual assistant
- **Share Button** - Native share API + clipboard fallback
- **Copy Email** - One-click email copying with toast

---

## 📊 Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom properties, animations, responsive design
- **JavaScript (Vanilla)** - ES6+ features, no frameworks
- **Font Awesome** - Icons
- **Google Fonts** - Inter & Fira Code

---

## 📁 Project Structure

```
mysycry.github.io/
├── index.html              # Main HTML (social media layout)
├── styles.css              # Social media theme styling
├── script.js               # All JavaScript functionality
├── manifest.json           # PWA manifest (if needed)
├── og-image.svg            # Auto-generated social media card
├── README.md               # Documentation
├── CLOUDFLARE_DEPLOY.md    # Cloudflare deployment guide
├── wrangler.toml           # Cloudflare Pages config
├── _routes.json            # Cloudflare routing config
├── prof-pic.jpg            # Profile picture
├── Tabada, Michael Josias D. CV.pdf
├── .github/
│   └── workflows/
│       ├── cloudflare-pages-deploy.yml  # Cloudflare deployment
│       ├── broken-image-checker.yml
│       ├── link-checker.yml
│       ├── html-css-validation.yml
│       └── social-media-card.yml
└── images/
    ├── credly.svg
    ├── portfolio-preview.png
    └── prof-pic.jpg
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
   
   CLOUDFLARE_API_TOKEN: your_api_token
   CLOUDFLARE_ACCOUNT_ID: your_account_id
   ```

2. Push to main - Auto-deploys via workflow

**Custom Domain:**
- Add in Cloudflare Pages dashboard
- DNS: CNAME to `portfolio.josiasmichael.workers.dev`

📖 **Full guide:** See [`CLOUDFLARE_DEPLOY.md`](CLOUDFLARE_DEPLOY.md)

### GitHub Pages

1. Push to GitHub
2. Settings → Pages → Select `main` branch
3. Live at `https://mysycry.github.io/`

---

## 🎨 Customization

### Update Profile Info

Edit `index.html`:
- **Name/Bio** - Lines 85-95
- **Meta/Stats** - Lines 97-115
- **Social Links** - Lines 123-135

### Update Experience (Posts)

Edit `index.html` Posts tab (lines 145-280):
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

Edit `index.html` Badges tab (lines 365-480):
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

Edit `index.html` Repos tab (lines 490-570)

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

## 🤖 Chatbot Commands

The chatbot responds to:
- `hello`, `hi` - Greeting
- `contact`, `email` - Contact info
- `job`, `work`, `hire` - Opportunities
- `skill`, `technology` - Skills list
- `certif`, `badge` - Certifications
- `experience` - Work history
- `education` - Education info
- `github`, `repo` - Projects
- `game`, `snake` - Game info

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
| 🔍 **Broken Image Checker** | Scans for broken images | Push + Weekly |
| 🔗 **Link Checker** | Validates all links | Push + Weekly |
| 🧹 **HTML/CSS Validation** | Linting + W3C validation | Push/PR |
| 🎴 **Social Media Card** | Auto-generates OG image | On content update |

---

## 📈 Changelog

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
- ✅ Deployment guide (`CLOUDFLARE_DEPLOY.md`)
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

**Live in seconds!** See [`CLOUDFLARE_DEPLOY.md`](CLOUDFLARE_DEPLOY.md) for full guide.

---

## 📝 License

Open source. Feel free to fork and customize!

---

## 🤝 Contact

- **Email:** navigatormichael@gmail.com
- **LinkedIn:** [linkedin.com/in/josiasmichael](https://linkedin.com/in/josiasmichael)
- **GitHub:** [github.com/mysycry](https://github.com/mysycry)
- **Credly:** [credly.com/users/jmichael](https://www.credly.com/users/jmichael/badges)

---

**Made with ❤️ and ☕ by Michael Josias D. Tabada**

*Last Updated: March 2026 | Version 6.2 | Deployed on Cloudflare Pages*
