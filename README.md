# Portfolio - Michael Josias D. Tabada

A modern, accessible, and performant portfolio website showcasing professional experience, certifications, and projects as a Platform Engineer & Cloud Solutions Architect.

![Portfolio Preview](/images/portfolio-preview.png)

## 🌟 Features

### 🎨 Design & UX
- **Modern UI** - Clean, professional design with smooth animations
- **Dark/Light Mode** - Toggle between themes with persistent preference
- **Fully Responsive** - Optimized for all screen sizes (desktop, tablet, mobile)
- **Instagram Story Ring** - Animated profile picture with hover enlargement effect
- **Print-Friendly** - Optimized print stylesheet for professional hard copies

### ♿ Accessibility (WCAG 2.1)
- **Skip to Content Link** - Keyboard users can bypass navigation
- **ARIA Labels** - Complete ARIA attributes for screen readers
- **Keyboard Navigation** - Full keyboard support for carousels and tabs
- **Focus Indicators** - Clear focus states for all interactive elements
- **Reduced Motion** - Respects user's motion preferences
- **Semantic HTML** - Proper heading hierarchy and landmark regions

### 🚀 Performance
- **Lazy Loading** - Images below the fold load on demand
- **Preconnect Hints** - Faster font loading with DNS preconnect
- **Optimized Animations** - GPU-accelerated CSS transforms
- **No Framework Bloat** - Pure HTML/CSS/JS for minimal bundle size

### 🔍 SEO
- **Meta Tags** - Complete title, description, and keywords
- **Open Graph** - Social media preview cards
- **Twitter Cards** - Twitter-specific meta tags
- **Canonical URL** - Prevents duplicate content issues
- **Robots Meta** - Search engine indexing directives

### ✨ Interactive Elements
- **Tab Navigation** - Summary, Work Experience, Credly, GitHub, Snake Game
- **Infinite Carousels** - Smooth swipeable cards with looping
- **Mini Snake Game** - Playable game with score tracking and speed progression
- **Floating Chatbot** - Ready for AI integration
- **Copy Email** - One-click email copying with toast notification
- **Scroll to Top** - Smooth scroll button appears on scroll

### 🎭 Visual Effects

#### Dark Mode 🌌
- **Twinkling Stars** - 30+ animated stars per card with varying sizes
- **Meteors** - Glowing meteors with purple trails spawning periodically
- **Mouse Glow** - Purple/pink gradient follows cursor on cards

#### Light Mode ☀️
- **Floating Orbs** - Large, soft gradient circles in brand colors
- **Rising Particles** - Golden particles float upward
- **Mouse Glow** - Warm golden gradient follows cursor

### 📊 Content Sections
- **Summary** - About me, education, technical skills carousel
- **Work Experience** - Career history with swipeable cards
- **Projects & Training** - Bootcamp projects and certifications
- **Credly Badges** - 10+ verified digital badges with verification links
- **GitHub** - 6 featured repositories with stats
- **Snake Game** - Interactive game with wall-passing mechanic

## 🚀 Technologies Used

- **HTML5** - Semantic structure with ARIA attributes
- **CSS3** - Custom properties, animations, gradients, print styles
- **JavaScript (Vanilla)** - No frameworks, pure ES6+ JavaScript
- **Font Awesome** - Icon library
- **Google Fonts** - Inter & Fira Code typography

## 📊 Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | < 1.5s | ✅ |
| Largest Contentful Paint | < 2.5s | ✅ |
| Cumulative Layout Shift | < 0.1 | ✅ |
| Time to Interactive | < 3.5s | ✅ |
| Accessibility Score | 100 | ✅ |
| SEO Score | 100 | ✅ |
| Best Practices | 100 | ✅ |

## 🔄 CI/CD & Automation

This portfolio uses **GitHub Actions** for automated quality checks and maintenance:

| Workflow | Description | Schedule |
|----------|-------------|----------|
| 🔍 **Broken Image Checker** | Scans for missing/broken image references | On push + Weekly |
| 🔗 **Link Checker** | Validates all internal & external links | On push + Weekly |
| 🧹 **HTML/CSS Validation** | Runs HTMLHint, Stylelint, and W3C validators | On push/PR |
| 🎴 **Social Media Card** | Auto-generates Open Graph images | On content update |

### Workflow Details

#### Broken Image Checker
- Checks all local image file references
- Verifies image paths exist
- Runs on every push to `main` and weekly via cron

#### Link Checker
- Uses `lychee` to validate all links
- Checks external URLs (LinkedIn, GitHub, Credly badges)
- Verifies internal anchor links
- Weekly scheduled runs to catch link rot

#### HTML/CSS Validation
- **HTMLHint** - Static analysis for HTML
- **Stylelint** - CSS linting with custom config
- **W3C Validators** - Official HTML & CSS validation
- Runs on every push and pull request

#### Social Media Card Generator
- Auto-generates SVG Open Graph images
- Extracts name and title from `index.html`
- Commits `og-image.svg` to repository
- Use in meta tags for social sharing preview

```yaml
# Add to <head> in index.html:
<meta property="og:image" content="og-image.svg">
<meta name="twitter:image" content="og-image.svg">
```

### Manual Trigger

You can manually run workflows from the **Actions** tab:
1. Go to `Actions` in your repository
2. Select the workflow you want to run
3. Click `Run workflow`

## 📁 Project Structure

```
josiasmichael.github.io/
├── index.html              # Main HTML file
├── styles.css              # All styling and animations
├── script.js               # All JavaScript functionality
├── og-image.svg            # Auto-generated social media card
├── README.md               # Project documentation
├── prof-pic.jpg            # Profile picture
├── Tabada, Michael Josias D. CV.pdf  # CV/Resume
├── .github/
│   └── workflows/
│       ├── broken-image-checker.yml   # Broken image detection
│       ├── link-checker.yml           # Link validation
│       ├── html-css-validation.yml    # HTML/CSS linting
│       └── social-media-card.yml      # OG image generator
└── images/
    ├── credly.svg          # Credly icon
    ├── portfolio-preview.png
    └── prof-pic.jpg
```

## 🛠️ Setup & Usage

### Local Development

1. **Clone or download** this repository
   ```bash
   git clone https://github.com/mysycry/josiasmichael.github.io.git
   cd josiasmichael.github.io
   ```

2. **Open in browser**
   - Simply open `index.html` in any modern browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js
     npx serve
     ```

3. **Access the site**
   - Navigate to `http://localhost:8000`

### GitHub Pages Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/mysycry/josiasmichael.github.io.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select `main` branch as source
   - Your site will be live at `https://mysycry.github.io/josiasmichael.github.io/`

## 🎨 Customization Guide

### Update Personal Information

Edit `index.html`:
- **Name & Title** - Lines 33-34
- **Contact Info** - Lines 35-43
- **Social Links** - Lines 44-55
- **About Me** - Line 89
- **Education** - Lines 95-99

### Update Work Experience

Edit `index.html` (Experience tab):
- **Job entries** - Lines 167-250
- **Projects & Training** - Lines 252-300

### Update Credly Badges

1. **Get badge URLs**:
   - Go to `https://www.credly.com/users/jmichael/badges`
   - Right-click each badge → Copy Image Address

2. **Edit `script.js`** (lines 801-814):
   ```javascript
   const badgeImageUrls = {
       'professional-cloud-architect': 'PASTE_URL_HERE',
       'finops-certified-engineer': 'PASTE_URL_HERE',
       // ... add all badge URLs
   };
   ```

### Update GitHub Repositories

Edit `index.html` (GitHub tab):
- **Profile link** - Line 431
- **Repository cards** - Lines 445-560

### Change Profile Picture

1. Replace `prof-pic.jpg` with your image
2. Or update the `src` in `index.html` (line 25)

### Change Favicon

1. Replace the URL in `index.html` (line 6):
   ```html
   <link rel="icon" type="image/png" href="your-favicon.png">
   ```

2. Or download your favicon and reference it locally

### Customize Colors

Edit `styles.css` CSS variables (lines 1-33):
```css
:root {
    --primary: #6366f1;      /* Main brand color */
    --secondary: #ec4899;    /* Accent color */
    --bg-primary: #ffffff;   /* Light mode background */
    /* ... more variables */
}
```

### Adjust Effects Intensity

**Dark Mode Stars & Meteors** - `styles.css`:
- Stars: Lines 373-407 (adjust `opacity` and `radial-gradient` sizes)
- Meteors: Lines 547-573 (adjust `box-shadow` and `width/height`)

**Light Mode Particles** - `styles.css`:
- Orbs: Lines 447-461 (adjust `opacity` values)
- Particles: Lines 468-494 (adjust `radial-gradient` sizes)
- Rising particles: Lines 595-617 (adjust `box-shadow`)

**Spawn Rates** - `script.js`:
- Dark mode meteors: Line 114 (`setInterval`)
- Light mode particles: Line 117 (`setInterval`)
- Initial batches: Lines 120-128

## 🎮 Snake Game Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move Up | ↑ / W | Swipe Up |
| Move Down | ↓ / S | Swipe Down |
| Move Left | ← / A | Swipe Left |
| Move Right | → / D | Swipe Right |
| Start Game | Space / Enter | Tap Start Button |

**Features:**
- Starts slow, speeds up as you eat
- Pass through walls (wrap-around)
- High score saved locally
- Speed multiplier display

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab** - Navigate between interactive elements
- **Enter/Space** - Activate buttons
- **Arrow Keys** - Navigate carousels and tabs
- **Escape** - Close chatbot

### Screen Reader Support
- All interactive elements have descriptive labels
- Tab changes are announced
- Carousel navigation is announced
- Skip link allows bypassing navigation

### Motion Sensitivity
- Respects `prefers-reduced-motion` system setting
- Animations are disabled when reduced motion is enabled

## 📊 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This project is open source and available for personal use. Feel free to fork and customize for your own portfolio!

## 🤝 Contact

- **Email:** navigatormichael@gmail.com
- **LinkedIn:** [linkedin.com/in/josiasmichael](https://linkedin.com/in/josiasmichael)
- **GitHub:** [github.com/mysycry](https://github.com/mysycry)
- **Credly:** [credly.com/users/jmichael](https://www.credly.com/users/jmichael/badges)

---

## 📈 Changelog

### Version 5.0 - Major Accessibility & Performance Update
- ✅ Added comprehensive meta tags (SEO, Open Graph, Twitter Cards)
- ✅ Implemented skip-to-content link for keyboard users
- ✅ Added ARIA attributes to all interactive elements
- ✅ Implemented lazy loading for images
- ✅ Added preconnect hints for faster font loading
- ✅ Added `prefers-reduced-motion` support
- ✅ Added scroll-to-top button
- ✅ Added copy email functionality with toast notifications
- ✅ Added keyboard navigation for carousels
- ✅ Added print stylesheet
- ✅ Fixed carousel infinite looping and swipe smoothness
- ✅ Updated all GitHub Actions to Node.js 24
- ✅ Added badge spin animation on hover/touch

### Version 4.0 - Carousel Improvements
- Infinite looping for all carousels
- Smooth swipe gestures on mobile
- Keyboard arrow key navigation
- Improved touch response

### Version 3.0 - Visual Effects
- Dark mode with stars and meteors
- Light mode with floating particles
- Mouse-tracking glow effects

### Version 2.0 - Core Features
- Tab navigation
- Snake game
- Chatbot integration

### Version 1.0 - Initial Release
- Basic portfolio structure
- Responsive design
- Dark/light theme toggle

---

**Made with ❤️ and lots of ☕ by Michael Josias D. Tabada**

*Last Updated: March 2026 | CI/CD powered by GitHub Actions | Accessibility: WCAG 2.1 AA*
