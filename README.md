# Portfolio - Michael Josias D. Tabada

A modern, interactive portfolio website showcasing my professional experience, certifications, and projects as a Platform Engineer & Cloud Solutions Architect.



![Portfolio Preview](/images/portfolio-preview.png)

## 🌟 Features

### Design & UX
- **Modern UI** - Clean, professional design with smooth animations
- **Dark/Light Mode** - Toggle between themes with persistent preference
- **Fully Responsive** - Optimized for all screen sizes (desktop, tablet, mobile)
- **Instagram Story Ring** - Animated profile picture with hover enlargement effect

### Interactive Elements
- **Tab Navigation** - Summary, Work Experience, Credly, GitHub, Snake Game
- **Card Carousels** - Swipeable cards for experience, projects, and skills
- **Mini Snake Game** - Playable game with score tracking and speed progression
- **Floating Chatbot** - Ready for AI integration

### Visual Effects

#### Dark Mode 🌌
- **Twinkling Stars** - 30+ animated stars per card with varying sizes
- **Meteors** - Glowing meteors with purple trails spawning periodically
- **Mouse Glow** - Purple/pink gradient follows cursor on cards

#### Light Mode ☀️
- **Floating Orbs** - Large, soft gradient circles in brand colors
- **Rising Particles** - Golden particles float upward
- **Mouse Glow** - Warm golden gradient follows cursor

### Content Sections
- **Summary** - About me, education, technical skills carousel
- **Work Experience** - Career history with swipeable cards
- **Projects & Training** - Bootcamp projects and certifications
- **Credly Badges** - 10 verified digital badges with verification links
- **GitHub** - 6 featured repositories with stats
- **Snake Game** - Interactive game with wall-passing mechanic

## 🚀 Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Custom styling with CSS variables, animations, gradients
- **JavaScript (Vanilla)** - No frameworks, pure JS for all interactions
- **Font Awesome** - Icon library
- **Google Fonts** - Inter & Fira Code typography

## 📁 Project Structure

```
josiasmichael.github.io/
├── index.html              # Main HTML file
├── styles.css              # All styling and animations
├── script.js               # All JavaScript functionality
├── README.md               # Project documentation
├── prof-pic.jpg            # Profile picture
├── Tabada, Michael Josias D. CV.pdf  # CV/Resume
└── images/
    └── credly.svg          # Credly icon
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

## 📊 Performance

- **No external frameworks** - Pure HTML/CSS/JS for fast loading
- **Optimized animations** - GPU-accelerated CSS transforms
- **Lazy-loaded effects** - Only active in dark/light mode
- **Responsive images** - Profile pic scales appropriately

## 🌐 Browser Support

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

**Made with ❤️ and lots of ☕ by Michael Josias D. Tabada**

*Last Updated: March 2026*
