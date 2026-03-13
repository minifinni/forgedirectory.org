# ForgeAPI.io

The API Directory for On-Demand Manufacturing — Discover the right manufacturing API, then build on it.

---

## Quick Start

This is a static website. No build step, no dependencies, no server required.

```bash
# Clone or download the files
cd MVP-CODE

# Open in browser (macOS)
open index.html

# Or serve locally with Python
python3 -m http.server 8000
# Then open http://localhost:8000
```

---

## Deployment Options

### Option 1: Vercel (Recommended)

Fastest deployment with automatic CDN.

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your repository or drag-and-drop the `MVP-CODE` folder
4. Click "Deploy"
5. Your site will be live at `forgeapi-xyz.vercel.app`
6. Add your custom domain in Project Settings → Domains

**Free tier includes:**
- 100GB bandwidth/month
- Automatic HTTPS
- Global CDN
- Instant deploys

---

### Option 2: Cloudflare Pages

Excellent performance with generous free tier.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to "Pages" → "Create a project"
3. Connect your GitHub repo or upload the `MVP-CODE` folder
4. Build settings: Leave blank (static site, no build command)
5. Deploy

**Free tier includes:**
- Unlimited requests
- Unlimited bandwidth
- 500 builds/month
- Global CDN

---

### Option 3: GitHub Pages

Simplest if you're already using GitHub.

1. Push the `MVP-CODE` folder to a GitHub repository
2. Go to repository Settings → Pages
3. Source: Deploy from a branch
4. Branch: `main` / `root`
5. Click Save
6. Your site will be at `username.github.io/repo-name`

**To use a custom domain:**
1. Add a file named `CNAME` in the root with your domain
2. Configure DNS with your provider:
   - A record: `185.199.108.153`
   - A record: `185.199.109.153`
   - A record: `185.199.110.153`
   - A record: `185.199.111.153`

---

### Option 4: Netlify Drop

Zero-config drag and drop.

1. Go to [netlify.com](https://netlify.com)
2. Scroll to "Drag and drop your site folder here"
3. Drop the `MVP-CODE` folder
4. Your site is live instantly

---

### Option 5: Surge.sh

Command line deployment for developers.

```bash
# Install surge
npm install -g surge

# Deploy
cd MVP-CODE
surge

# Follow prompts, use forgeapi.surge.sh or your domain
```

---

## File Structure

```
MVP-CODE/
├── index.html          # Homepage / API Directory
├── manufacturer.html   # Individual manufacturer template
├── submit.html         # Submit a manufacturer form
├── style.css           # All styles (dark theme)
├── script.js           # Filtering, search, click tracking
└── README.md           # This file
```

---

## Click Tracking

The site tracks clicks on all "View Docs" and "Get API Key" buttons using localStorage. This data helps identify the most popular APIs to build businesses on top of.

**View analytics in browser console:**
```javascript
// See all click data
forgeapi.getAnalyticsData()

// See top 3 manufacturers
forgeapi.getTopManufacturers()

// Clear all data
forgeapi.clearData()
```

---

## Analytics Integration

Add your Plausible Analytics script to track visitors:

1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain `forgeapi.io`
3. The tracking script is already in the HTML files:
   ```html
   <script defer data-domain="forgeapi.io" src="https://plausible.io/js/script.outbound-links.js"></script>
   ```
4. Update the `data-domain` to match your actual domain

---

## Customization

### Adding a New Manufacturer

1. Open `index.html`
2. Find the manufacturer grid
3. Copy an existing manufacturer card
4. Update:
   - `data-name` attribute (lowercase, no spaces)
   - `data-categories` (comma-separated list)
   - Card content (name, description, badges)

### Updating Colors

Edit `style.css` CSS variables at the top:

```css
:root {
    --accent: #00d4aa;        /* Primary brand color */
    --accent-hover: #00b894;  /* Hover state */
    --popular: #ff6b35;       /* Popular badge color */
    /* ... */
}
```

---

## SEO Checklist

Before launching:

- [ ] Update `index.html` meta description
- [ ] Update `manufacturer.html` meta description
- [ ] Add your domain to Plausible script
- [ ] Submit sitemap to Google Search Console
- [ ] Add social media meta tags (Open Graph)

---

## Domain Setup

Recommended: **forgeapi.io**

Purchase at:
- Namecheap (often cheapest)
- Cloudflare Registrar (wholesale pricing)
- Google Domains

Then point your domain to your hosting provider:
- **Vercel:** Add domain in project settings, follow DNS instructions
- **Cloudflare Pages:** Add custom domain in settings
- **GitHub Pages:** Add CNAME file with your domain

---

## Two-Layer Business Model

**Layer 1: ForgeAPI.io** — This directory
- Tracks which APIs get the most clicks
- Surfaces popular APIs with "🔥 Popular" badges
- Provides market research for developers

**Layer 2: Niche Businesses** — Built on winning APIs
- Track clicks to identify demand
- Build full products on top of popular APIs
- Examples: Hero Forge clone, custom cake toppers, etc.

The click data decides which APIs to build on. No guessing.

---

## License

MIT — Free to use, modify, and deploy.

---

## Support

Questions? Contact hello@forgeapi.io
