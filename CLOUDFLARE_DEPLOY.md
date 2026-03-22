# Cloudflare Pages - Deployment Guide

## 🚀 Quick Deploy to Cloudflare Pages

### Option 1: Direct GitHub Integration (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Sign in to your account

2. **Connect to GitHub**
   - Navigate to **Workers & Pages** → **Create Application**
   - Select **Pages** tab
   - Click **Connect to Git**

3. **Select Repository**
   - Choose `mysycry/josiasmichael.github.io`
   - Click **Begin Setup**

4. **Configure Build Settings**
   ```
   Project name: josiasmichael-portfolio
   Production branch: main
   Build command: (leave empty)
   Build output directory: .
   ```

5. **Deploy**
   - Click **Save and Deploy**
   - Cloudflare will build and deploy your site

6. **Custom Domain (Optional)**
   - Go to **Custom Domains** in Pages dashboard
   - Add your domain: `josiasmichael.github.io`
   - Follow DNS configuration steps

---

### Option 2: GitHub Actions (Automated)

#### Prerequisites

1. **Get Cloudflare API Token**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Create token with **Edit Cloudflare Pages** permissions
   - Copy the token

2. **Get Account ID**
   - Go to Cloudflare dashboard
   - Find your Account ID in the right sidebar

3. **Add GitHub Secrets**
   ```
   Settings → Secrets and variables → Actions → New repository secret
   
   CLOUDFLARE_API_TOKEN: your_api_token_here
   CLOUDFLARE_ACCOUNT_ID: your_account_id_here
   ```

#### Deployment

The workflow will automatically deploy on every push to `main` branch.

---

## 📊 Cloudflare Pages Features

### Included Free Tier
- ✅ **Unlimited requests** - No bandwidth charges
- ✅ **100k requests/day** - Free tier limit
- ✅ **Global CDN** - 275+ data centers worldwide
- ✅ **Automatic HTTPS** - SSL/TLS included
- ✅ **Instant cache invalidation** - Updates deploy instantly
- ✅ **Preview deployments** - Auto preview for PRs
- ✅ **DDoS protection** - Built-in security

### Performance Benefits
- ⚡ **Edge network** - Content served from nearest data center
- ⚡ **HTTP/3 support** - Fastest protocol available
- ⚡ **Brotli compression** - Smaller file sizes
- ⚡ **Smart caching** - Optimized delivery

---

## 🔧 Configuration Files

### `wrangler.toml`
Cloudflare Pages configuration with:
- Build settings
- Cache headers
- Security headers
- Redirects

### `.github/workflows/cloudflare-pages-deploy.yml`
Automated deployment workflow:
- Triggers on push to `main`
- Deploys via Cloudflare Pages Action
- Creates deployment summary

---

## 🌐 Custom Domain Setup

### Using GitHub Pages Domain

If you want to keep `josiasmichael.github.io`:

1. **Cloudflare DNS Setup**
   ```
   Type: CNAME
   Name: @ (or josiasmichael)
   Target: josiasmichael-portfolio.pages.dev
   Proxy: Enabled (orange cloud)
   ```

2. **Add to Cloudflare Pages**
   - Go to your Pages project
   - **Custom Domains** → **Add Custom Domain**
   - Enter: `josiasmichael.github.io`
   - Click **Add Domain**

3. **Update GitHub Pages** (optional)
   - Go to repository Settings → Pages
   - Remove custom domain if set
   - Or keep both for redundancy

---

## 📈 Monitoring & Analytics

### Cloudflare Analytics
- **Traffic** - Requests, bandwidth, visitors
- **Performance** - Cache ratio, load times
- **Security** - Threats blocked, WAF events
- **Deployment** - Build history, rollback

### Access Analytics
1. Go to Pages project
2. Click **Analytics** tab
3. View real-time metrics

---

## 🔄 CI/CD Workflows

### Current Workflows

| Workflow | Purpose | Status |
|----------|---------|--------|
| `cloudflare-pages-deploy.yml` | Deploy to Cloudflare | ✅ Ready |
| `html-css-validation.yml` | Code validation | ✅ Active |
| `link-checker.yml` | Link validation | ✅ Active |
| `broken-image-checker.yml` | Image validation | ✅ Active |
| `social-media-card.yml` | OG image generation | ✅ Active |

### Deployment Flow

```
Push to main
    ↓
GitHub Actions trigger
    ↓
Run validation workflows
    ↓
Deploy to Cloudflare Pages
    ↓
Global CDN propagation (~5s)
    ↓
Live at josiasmichael-portfolio.pages.dev
```

---

## 🛡️ Security Headers

Automatically applied by `wrangler.toml`:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Cache-Control: public, max-age=3600
```

---

## 💡 Tips & Best Practices

### Performance
1. ✅ Images already optimized with lazy loading
2. ✅ CSS/JS cached for 1 year (immutable)
3. ✅ Preconnect hints for fonts
4. ✅ Minimal bundle size (no frameworks)

### SEO
1. ✅ Meta tags configured
2. ✅ Open Graph tags set
3. ✅ Twitter Cards enabled
4. ✅ Canonical URL set

### Maintenance
1. Monitor analytics weekly
2. Check deployment logs after pushes
3. Use preview deployments for testing
4. Keep GitHub Actions workflows updated

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check wrangler.toml syntax
# Verify directory structure
# Ensure all files committed
git status
git push
```

### Domain Not Working
```
1. Wait 24-48 hours for DNS propagation
2. Check DNS records in Cloudflare
3. Clear browser cache
4. Verify SSL/TLS mode (Full recommended)
```

### Cache Issues
```
1. Go to Pages project
2. Click "Retry deployment"
3. Or push empty commit:
   git commit --allow-empty -m "Clear cache"
   git push
```

---

## 📞 Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Community**: https://community.cloudflare.com/
- **Status**: https://www.cloudflarestatus.com/

---

**Ready to deploy!** 🚀

Just connect your repository to Cloudflare Pages and you're live in seconds!
