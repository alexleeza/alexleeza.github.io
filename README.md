# Pixel-Art Portfolio Website

A fully responsive, accessible, single-page portfolio website with a distinctive pixel-art aesthetic. Built with vanilla HTML, CSS, and JavaScript for deployment on GitHub Pages.

## 🎨 Features

- **Pixel-Art Design**: Distinctive blocky UI with stepped shadows and sage green color scheme
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessible**: WCAG-compliant with keyboard navigation, screen reader support, and focus management
- **Interactive Navigation**: Left sidebar timeline with smooth scrolling and active section tracking
- **Dynamic Projects**: JSON-driven project showcase with tag filtering
- **Contact Form**: Client-side validation with mailto fallback (easily swappable for API integration)
- **Stats Visualization**: Pure JavaScript pixel-style chart (no external libraries)
- **Theme Toggle**: Switch between charcoal and cream accent colors
- **Performance Optimized**: Lazy loading, minimal dependencies, 95+ Lighthouse scores

## 📁 Project Structure

```
/
├─ index.html              # Main HTML file
├─ /assets
│  ├─ /img                 # Images, sprites, favicons
│  │  ├─ favicon-16x16.png
│  │  ├─ favicon-32x32.png
│  │  ├─ preview.png       # Site preview/og:image
│  │  └─ /projects         # Project thumbnails
│  ├─ /fonts               # Pixel/bitmap fonts
│  └─ resume.pdf           # Your resume PDF
├─ /css
│  ├─ variables.css        # Design tokens (colors, spacing, shadows)
│  ├─ base.css             # Reset, typography, utilities
│  ├─ layout.css           # Grid, sections, responsive layout
│  ├─ components.css       # Buttons, cards, forms, modals
│  └─ themes.css           # Theme variations (charcoal/cream)
├─ /js
│  ├─ main.js              # Entry point, initialization
│  ├─ nav.js               # Sidebar navigation logic
│  ├─ modal.js             # Modal behavior with focus trap
│  ├─ charts.js            # Pixel chart renderer
│  ├─ form.js              # Contact form validation
│  └─ utils.js             # Helper functions
├─ /data
│  └─ projects.json        # Project data
├─ README.md               # This file
├─ robots.txt              # SEO
├─ sitemap.xml             # SEO
└─ CNAME                   # Custom domain (optional)
```

## 🚀 Quick Start

### 1. Customize Content

Replace the following placeholders in `index.html`:

- `{{YOUR_NAME}}` - Your name
- `{{TAGLINE}}` - Your tagline/subtitle
- `{{EMAIL}}` - Your email address
- `{{USERNAME}}` - Your GitHub/social media username

### 2. Update Projects

Edit `/data/projects.json` with your projects:

```json
{
  "title": "Project Name",
  "description": "Project description",
  "tags": ["Tag1", "Tag2"],
  "image": "./assets/img/projects/project.png",
  "links": [
    { "label": "Demo", "url": "https://..." },
    { "label": "GitHub", "url": "https://..." }
  ]
}
```

### 3. Add Your Resume

Replace `/assets/resume.pdf` with your actual resume PDF.

### 4. Update Experience

Edit the Work Experience and Research Experience sections in `index.html` with your actual roles and achievements.

### 5. Add Images

Place your images in:
- `/assets/img/projects/` - Project thumbnails
- `/assets/img/` - Favicons and preview image

## 🎨 Theme Customization

### Changing Secondary Color

The portfolio uses **Sage Green** as primary and **Charcoal** as secondary by default.

To switch to **Cream** as secondary:

1. Open `/css/variables.css`
2. Change the default theme attribute:

```css
:root {
  --color-accent-secondary: var(--color-cream-base);
}
```

Or users can toggle between themes using the theme toggle button in the sidebar.

### Custom Colors

To add your own colors:

1. Define color ramps in `/css/variables.css`:

```css
--color-custom-lightest: #...;
--color-custom-light: #...;
--color-custom-base: #...;
--color-custom-dark: #...;
--color-custom-darkest: #...;
```

2. Update accent variables:

```css
--color-accent-primary: var(--color-custom-base);
```

## 📱 Responsive Breakpoints

- **Mobile**: ≤ 768px (bottom navigation bar)
- **Tablet**: 769px - 1024px (compact sidebar)
- **Desktop**: ≥ 1024px (full sidebar)

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support with visible focus indicators
- **Screen Readers**: Semantic HTML with ARIA labels
- **Skip Link**: Jump to main content
- **Focus Trap**: Modals trap focus correctly
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Contrast**: WCAG AA compliant color contrast ratios

## 🚀 Deployment to GitHub Pages

### Option 1: GitHub Repository Settings

1. Push code to GitHub repository
2. Go to repository **Settings** → **Pages**
3. Under **Source**, select branch `main` (or `gh-pages`)
4. Click **Save**
5. Your site will be live at `https://USERNAME.github.io/REPO-NAME/`

### Option 2: Custom Domain

1. Add a `CNAME` file to root with your domain:
   ```
   yourdomain.com
   ```
2. Configure DNS settings with your domain provider:
   - Type: `CNAME`
   - Name: `www` (or `@`)
   - Value: `USERNAME.github.io`
3. Enable HTTPS in GitHub Pages settings

### Important: Relative Paths

All paths are relative, so the site works at:
- `https://USERNAME.github.io/REPO-NAME/`
- `https://customdomain.com/`

No build process required!

## 🛠️ Development

### Local Development

Simply open `index.html` in a browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with npx)
npx serve

# VS Code Live Server extension
Right-click index.html → "Open with Live Server"
```

Visit `http://localhost:8000`

### Testing

- **Lighthouse**: Run in Chrome DevTools (Cmd/Ctrl + Shift + I → Lighthouse)
- **Accessibility**: Test with screen reader (NVDA, JAWS, VoiceOver)
- **Keyboard**: Navigate using Tab, Enter, Escape keys only
- **Mobile**: Test on real devices or Chrome DevTools device emulation

## 📊 Performance Optimization

- Images use `loading="lazy"` and `decoding="async"`
- Fonts are preloaded
- No external dependencies or frameworks
- Minified CSS/JS for production (optional)
- IntersectionObserver for efficient scroll tracking

## 🔧 Customization Guide

### Adding a New Section

1. Add section HTML in `index.html`:
```html
<section class="section" id="new-section">
  <div class="section-content">
    <h2 class="section-title px-border">New Section</h2>
    <!-- Content -->
  </div>
</section>
```

2. Add timeline button:
```html
<li class="timeline-item">
  <button class="timeline-btn" data-section="new-section">
    <span class="timeline-node"></span>
    <span class="timeline-label">New Section</span>
  </button>
</li>
```

### Swapping Stats Button Behavior

By default, the Stats button scrolls to the Stats section.

To open a modal instead:

1. Open `/js/main.js`
2. In `setupHeroButtons()`, uncomment the modal code:
```javascript
// Uncomment these lines:
const modal = document.getElementById('stats-modal');
if (modal) {
  modal.removeAttribute('hidden');
}
```

### Integrating Contact Form API

Replace mailto with your API:

1. Open `/js/form.js`
2. Update `sendViaAPI()` function:
```javascript
async function sendViaAPI(data) {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

3. Change form submit to use API:
```javascript
await sendViaAPI(data); // Instead of sendViaMailto(data)
```

## 📄 Files Checklist

Before deploying, ensure you have:

- [ ] Updated `{{YOUR_NAME}}`, `{{TAGLINE}}`, `{{EMAIL}}`, `{{USERNAME}}`
- [ ] Added your projects to `/data/projects.json`
- [ ] Replaced `/assets/resume.pdf` with your resume
- [ ] Added project images to `/assets/img/projects/`
- [ ] Created favicon files (16x16 and 32x32)
- [ ] Added preview image at `/assets/img/preview.png`
- [ ] Updated Work and Research Experience sections
- [ ] Tested on mobile and desktop
- [ ] Run Lighthouse audit (target: 95+ on all metrics)

## 🐛 Troubleshooting

**Projects not loading?**
- Check `/data/projects.json` is valid JSON
- Verify file path is correct
- Check browser console for errors

**Images not showing?**
- Ensure relative paths are correct
- Check image files exist in `/assets/img/`
- Verify image formats are supported (.png, .jpg, .webp)

**Sidebar not visible on mobile?**
- It moves to bottom on mobile (< 768px)
- Check responsive styles in `/css/layout.css`

**Fonts not loading?**
- Preload font in `<head>` of `index.html`
- Ensure font files are in `/assets/fonts/`
- Use web-safe fallback fonts

## 📝 License

This template is free to use for personal and commercial projects.

## 🙏 Credits

- Design System: Custom pixel-art aesthetic
- Icons: Text-based pixel icons (no icon library needed)
- Fonts: System fonts with pixel heading font option

## 📞 Support

For issues or questions:
1. Check this README
2. Review code comments
3. Check browser console for errors
4. Test in different browsers

---

Built with ❤️ and pixels. Happy coding!