# 🚀 Quick Deployment Checklist

## Pre-Deployment (Do These First!)

### 1. Content Updates
- [ ] Replace `{{YOUR_NAME}}` in index.html (appears multiple times)
- [ ] Replace `{{TAGLINE}}` in index.html
- [ ] Replace `{{EMAIL}}` in index.html and js/form.js
- [ ] Replace `{{USERNAME}}` in index.html (social links)
- [ ] Update Open Graph/Twitter card info in index.html `<head>`

### 2. Projects
- [ ] Edit `/data/projects.json` with your actual projects
- [ ] Add project images to `/assets/img/projects/`
- [ ] Use the image generator at `/assets/img/generator.html` for placeholders

### 3. Experience Sections
- [ ] Update Work Experience cards in index.html
- [ ] Update Research Experience cards in index.html
- [ ] Add or remove experience cards as needed

### 4. Assets
- [ ] Add your resume PDF to `/assets/` (name it `resume.pdf`)
- [ ] Create favicons (16x16 and 32x32) and add to `/assets/img/`
- [ ] Create preview image (1200x630) at `/assets/img/preview.png`
- [ ] Download pixel font and add to `/assets/fonts/`

### 5. SEO Files
- [ ] Update `robots.txt` with your GitHub username and repo name
- [ ] Update `sitemap.xml` with your GitHub username and repo name
- [ ] Update or delete `CNAME` (only needed for custom domain)

### 6. Stats Section
- [ ] Update stat values in index.html (Years Coding, Projects, etc.)
- [ ] Customize chart data in js/charts.js if desired

## GitHub Pages Deployment

### Step 1: Create Repository
```bash
# Initialize git in the project folder
cd pixel-portfolio
git init
git add .
git commit -m "Initial commit: Pixel art portfolio"
```

### Step 2: Push to GitHub
```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository on GitHub.com
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Source**, select branch: `main`
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Step 4: Access Your Site
Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## Optional: Custom Domain

### Add Custom Domain
1. Add your domain to `CNAME` file (just the domain, no https://)
2. In GitHub repo Settings → Pages → Custom domain, enter your domain
3. Configure DNS with your domain provider:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`
4. Enable "Enforce HTTPS" in GitHub Pages settings

## Testing Checklist

### Before Going Live
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile device (or Chrome DevTools mobile view)
- [ ] Navigate using keyboard only (Tab, Enter, Escape)
- [ ] Run Lighthouse audit (target: 95+ scores)
- [ ] Check all links work correctly
- [ ] Verify images load properly
- [ ] Test contact form validation
- [ ] Check social links point to correct profiles

### Lighthouse Testing
1. Open site in Chrome
2. Press F12 (DevTools)
3. Go to "Lighthouse" tab
4. Click "Analyze page load"
5. Check all categories score 95+

### Accessibility Testing
- [ ] Use screen reader (NVDA on Windows, VoiceOver on Mac)
- [ ] Navigate with keyboard only
- [ ] Check color contrast in DevTools
- [ ] Verify all images have alt text
- [ ] Test with browser zoom at 200%

## Common Issues & Solutions

### Images Not Loading
- Check file paths are relative (./assets/...)
- Verify images exist in correct folders
- Check file names match exactly (case-sensitive)

### Projects Not Showing
- Validate JSON at https://jsonlint.com/
- Check browser console for errors
- Verify projects.json path is correct

### Fonts Not Loading
- Download from Google Fonts
- Convert to WOFF2 format
- Place in /assets/fonts/
- Update font path in variables.css

### Site Not Deploying
- Check GitHub Actions tab for errors
- Ensure gh-pages branch exists
- Verify Settings → Pages is configured
- Wait 2-3 minutes after pushing changes

## Performance Tips

### Optimize Images
```bash
# Use ImageOptim, TinyPNG, or:
# For PNG
pngquant image.png --quality 65-80

# For JPG
jpegoptim --max=85 image.jpg
```

### Compress Files (Optional)
For even better performance, minify CSS/JS:
- Use https://www.minifier.org/
- Or install tools: `npm install -g csso uglify-js`

## Updates & Maintenance

### Adding New Projects
1. Edit `/data/projects.json`
2. Add project image to `/assets/img/projects/`
3. Commit and push changes
4. GitHub Pages auto-deploys in ~2 minutes

### Updating Resume
1. Replace `/assets/resume.pdf`
2. Commit and push
3. Clear browser cache to see changes

### Theme Changes
Edit `/css/variables.css` to change:
- Colors (sage, charcoal, cream)
- Spacing scale
- Font sizes
- Shadow styles

## Next Steps

1. ✅ Complete this checklist
2. 🚀 Deploy to GitHub Pages
3. 📱 Share your portfolio link
4. 🎨 Customize further as needed
5. 📊 Monitor with Google Analytics (optional)

---

**Need Help?**
- Check README.md for detailed docs
- Review code comments
- Test locally before deploying
- Use browser DevTools console for debugging

**Your portfolio URL:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

Good luck! 🎮✨