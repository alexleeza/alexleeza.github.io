// config
const CONFIG = {
  name: "Alex Kyoungmoon Lee",
  tagline: "Industrial Engineer · Operations Research · Production Systems · Data Science/ML",
  description: "Industrial Engineer — Operations Research, Production Systems, Data Science/ML.",
  siteUrl: "https://alexleeza.github.io",

  // buttons
  tier1: [
    { label: "Personal Site", url: "https://alexklee.com" },
    { label: "Recruiter Portal", url: "https://recruiters.alexklee.com" }
  ],

  // projects — featured: true for top grid, "#" for placeholder urls
  tier2: [
    // featured
    { name: "Kyouza", url: "https://kyouza.com", subtitle: "Indie software studio", featured: true },
    { name: "Certain Gold", url: "https://certaingold.com", subtitle: "2D extraction platformer", featured: true },
    { name: "Boiler Optimizer", url: "#", subtitle: "MIP-based academic planning with LLM advising", featured: true },
    { name: "Portfolio Jeans", url: "#", subtitle: "Procedural portfolio generator", featured: true },
    // other — professional
    { name: "MarkovSim", url: "#", subtitle: "Interactive Markov chain simulation" },
    { name: "StatWorkbench", url: "#", subtitle: "CSV analysis & regression comparison" },
    { name: "Boiler Optimizer Scraper", url: "#", subtitle: "Automated Purdue catalog scraper" },
    { name: "Bottle It Up IMS", url: "#", subtitle: "Full-stack bottling facility management" },
    { name: "MLR Crime Rate", url: "#", subtitle: "Socioeconomic regression analysis" },
    // other — kyouza
    { name: "Certain Gold Foundry", url: "#", subtitle: "Procedural game asset generation" },
    { name: "Chexcel", url: "#", subtitle: "PWA budgeting app" },
    { name: "kaishenfit", url: "#", subtitle: "Fitness coaching platform" },
    { name: "ai for Kyouza", url: "#", subtitle: "Dual-personality AI chatbot" },
    { name: "AKL OS", url: "#", subtitle: "Fake OS desktop interface" },
    { name: "HumAndI", url: "#", subtitle: "Human vs AI benchmark games" },
    { name: "ZeroArise", url: "#", subtitle: "ML life-mimicking program" },
    { name: "Doc Tor", url: "#", subtitle: "Client-side PDF utility" },
    { name: "Echo Egg", url: "#", subtitle: "Procedural personality quiz" },
    { name: "Enza", url: "#", subtitle: "Cryptographic multi-source RNG" },
    { name: "Re-Cord", url: "#", subtitle: "Browser-based screen recorder" },
    { name: "GenUI", url: "#", subtitle: "Procedural design system generator" },
    { name: "Orchestrator", url: "#", subtitle: "Multi-provider AI orchestration CLI" },
    { name: "zagzig", url: "#", subtitle: "Pixel-drafted CSS framework" }
  ],

  // socials — remove or set "" to hide
  social: {
    github: "https://github.com/alexleeza",
    linkedin: "#",
    email: "mailto:alex@alexklee.com"
  }
};


// render
function render() {
  document.title = CONFIG.name;
  document.querySelector('.name').textContent = CONFIG.name;
  document.querySelector('.tagline').textContent = CONFIG.tagline;

  const setMeta = (attr, val, content) => {
    const el = document.querySelector(`meta[${attr}="${val}"]`);
    if (el) el.setAttribute('content', content);
  };
  setMeta('name', 'description', `${CONFIG.name} — ${CONFIG.description}`);
  setMeta('property', 'og:title', CONFIG.name);
  setMeta('property', 'og:description', CONFIG.description);
  setMeta('property', 'og:url', CONFIG.siteUrl);
  setMeta('name', 'twitter:title', CONFIG.name);
  setMeta('name', 'twitter:description', CONFIG.description);

  const left = document.getElementById('action-left');
  const right = document.getElementById('action-right');
  left.href = CONFIG.tier1[0].url;
  left.textContent = CONFIG.tier1[0].label;
  right.href = CONFIG.tier1[1].url;
  right.textContent = CONFIG.tier1[1].label;

  const drawer = document.getElementById('drawer');
  const featured = CONFIG.tier2.filter(p => p.featured);
  const regular = CONFIG.tier2.filter(p => !p.featured);

  const featLabel = document.createElement('span');
  featLabel.className = 'section-label';
  featLabel.id = 'featured-label';
  featLabel.textContent = 'Featured Projects';
  drawer.appendChild(featLabel);

  const featGrid = document.createElement('div');
  featGrid.className = 'featured-grid';
  featGrid.id = 'featured-grid';
  featured.forEach(p => {
    const placeholder = !p.url || p.url === '#';
    const el = document.createElement(placeholder ? 'div' : 'a');
    el.className = 'cell cell-featured';
    if (!placeholder) {
      el.href = p.url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
    el.setAttribute('aria-label', `${p.name} — ${p.subtitle}`);
    el.innerHTML =
      `<span class="cell-name">${p.name}</span>` +
      `<span class="cell-sub">${p.subtitle}</span>`;
    featGrid.appendChild(el);
  });
  drawer.appendChild(featGrid);

  const regLabel = document.createElement('span');
  regLabel.className = 'section-label';
  regLabel.id = 'regular-label';
  regLabel.textContent = 'Other Projects';
  drawer.appendChild(regLabel);

  const regGrid = document.createElement('div');
  regGrid.className = 'regular-grid';
  regGrid.id = 'regular-grid';
  regular.forEach(p => {
    const placeholder = !p.url || p.url === '#';
    const el = document.createElement(placeholder ? 'div' : 'a');
    el.className = 'cell';
    if (!placeholder) {
      el.href = p.url;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
    el.setAttribute('aria-label', `${p.name} — ${p.subtitle}`);
    el.innerHTML =
      `<span class="cell-name">${p.name}</span>` +
      `<span class="cell-sub">${p.subtitle}</span>`;
    regGrid.appendChild(el);
  });
  drawer.appendChild(regGrid);

  const foot = document.getElementById('foot');
  [
    { label: 'GitHub', url: CONFIG.social.github },
    { label: 'LinkedIn', url: CONFIG.social.linkedin },
    { label: 'Email', url: CONFIG.social.email }
  ].forEach(s => {
    if (!s.url) return;
    const isPlaceholder = s.url === '#';
    const a = document.createElement(isPlaceholder ? 'span' : 'a');
    if (!isPlaceholder) {
      a.href = s.url;
      if (!s.url.startsWith('mailto:')) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    }
    a.textContent = s.label;
    foot.appendChild(a);
  });
}


// lines
const NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

function rect(id) {
  return document.getElementById(id).getBoundingClientRect();
}

function drawLines() {
  const svg = document.getElementById('lines');
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);

  const frag = document.createDocumentFragment();
  const hdr = rect('header-box');
  const btnL = rect('action-left');
  const btnR = rect('action-right');
  const tog = rect('toggle');
  const isMobile = innerWidth < 561;

  const DOT_JUNCTION = 3;
  const DOT_ENDPOINT = 2;
  const DOT_ACCENT = 1.5;

  const line = (x1, y1, x2, y2) => frag.appendChild(svgEl('line', { x1, y1, x2, y2 }));
  const dot = (cx, cy, r) => frag.appendChild(svgEl('circle', { cx, cy, r }));

  const cx = hdr.left + hdr.width / 2;

  // header to fork
  const forkY = hdr.bottom + (btnL.top - hdr.bottom) / 2;
  line(cx, hdr.bottom, cx, forkY);
  dot(cx, hdr.bottom, DOT_ENDPOINT);
  dot(cx, forkY, DOT_JUNCTION);

  const togTop = tog.top - 4;

  if (isMobile) {
    line(cx, forkY, cx, btnL.top);
    dot(cx, btnL.top, DOT_ENDPOINT);

    line(cx, btnL.bottom, cx, btnR.top);
    dot(cx, btnL.bottom, DOT_ENDPOINT);
    dot(cx, btnR.top, DOT_ENDPOINT);

    line(cx, btnR.bottom, cx, togTop);
    dot(cx, btnR.bottom, DOT_ENDPOINT);
    dot(cx, togTop, DOT_ENDPOINT);
  } else {
    const btnLcx = btnL.left + btnL.width / 2;
    const btnRcx = btnR.left + btnR.width / 2;

    line(btnLcx, forkY, btnRcx, forkY);

    line(btnLcx, forkY, btnLcx, btnL.top);
    dot(btnLcx, forkY, DOT_JUNCTION);
    dot(btnLcx, btnL.top, DOT_ENDPOINT);

    line(btnRcx, forkY, btnRcx, btnR.top);
    dot(btnRcx, forkY, DOT_JUNCTION);
    dot(btnRcx, btnR.top, DOT_ENDPOINT);

    const mergeY = btnL.bottom + (togTop - btnL.bottom) / 2;

    line(btnLcx, btnL.bottom, btnLcx, mergeY);
    dot(btnLcx, btnL.bottom, DOT_ENDPOINT);
    dot(btnLcx, mergeY, DOT_JUNCTION);

    line(btnRcx, btnR.bottom, btnRcx, mergeY);
    dot(btnRcx, btnR.bottom, DOT_ENDPOINT);
    dot(btnRcx, mergeY, DOT_JUNCTION);

    line(btnLcx, mergeY, btnRcx, mergeY);
    dot(cx, mergeY, DOT_JUNCTION);

    line(cx, mergeY, cx, togTop);
    dot(cx, togTop, DOT_ENDPOINT);
  }

  // rails
  const footLinks = document.getElementById('foot').children;

  if (footLinks.length > 0) {
    const fRects = Array.from(footLinks).map(el => el.getBoundingClientRect());
    const hdrCy = hdr.top + hdr.height / 2;
    const footCy = fRects[0].top + fRects[0].height / 2;
    const railGap = 16;

    const firstR = fRects[0];
    const lastR = fRects[fRects.length - 1];

    const leftRailX = Math.max(4, hdr.left - railGap);
    const rightRailX = Math.min(innerWidth - 4, hdr.right + railGap);

    // left
    line(hdr.left, hdrCy, leftRailX, hdrCy);
    dot(hdr.left, hdrCy, DOT_ACCENT);

    line(leftRailX, hdrCy, leftRailX, footCy);
    dot(leftRailX, hdrCy, DOT_ACCENT);
    dot(leftRailX, footCy, DOT_ACCENT);

    line(leftRailX, footCy, firstR.left, footCy);
    dot(firstR.left, footCy, DOT_ENDPOINT);

    // right
    line(hdr.right, hdrCy, rightRailX, hdrCy);
    dot(hdr.right, hdrCy, DOT_ACCENT);

    line(rightRailX, hdrCy, rightRailX, footCy);
    dot(rightRailX, hdrCy, DOT_ACCENT);
    dot(rightRailX, footCy, DOT_ACCENT);

    line(rightRailX, footCy, lastR.right, footCy);
    dot(lastR.right, footCy, DOT_ENDPOINT);

    // bus
    for (let i = 0; i < fRects.length - 1; i++) {
      const gapMidX = (fRects[i].right + fRects[i + 1].left) / 2;
      line(fRects[i].right, footCy, fRects[i + 1].left, footCy);
      dot(gapMidX, footCy, DOT_ACCENT);
    }
  }

  svg.appendChild(frag);
  drawSpurs();
}


// spurs
let spurEls = [];

function drawSpurs() {
  const svg = document.getElementById('lines');
  spurEls.forEach(e => e.remove());
  spurEls = [];

  const drawer = document.getElementById('drawer');
  if (!drawer.classList.contains('open')) return;

  const DOT_ENDPOINT = 2;
  const DOT_JUNCTION = 3;

  function addLine(x1, y1, x2, y2) {
    const el = svgEl('line', { x1, y1, x2, y2 });
    svg.appendChild(el);
    spurEls.push(el);
  }
  function addDot(cx, cy, r) {
    const el = svgEl('circle', { cx, cy, r });
    svg.appendChild(el);
    spurEls.push(el);
  }

  const tog = rect('toggle');
  const featGrid = document.getElementById('featured-grid');
  const regGrid = document.getElementById('regular-grid');
  if (!featGrid || !regGrid) return;

  const fgR = featGrid.getBoundingClientRect();
  const rgR = regGrid.getBoundingClientRect();
  const cx = tog.left + tog.width / 2;

  addLine(cx, tog.bottom + 4, cx, fgR.top);
  addDot(cx, tog.bottom + 4, DOT_ENDPOINT);
  addDot(cx, fgR.top, DOT_ENDPOINT);

  const midY = fgR.bottom + (rgR.top - fgR.bottom) / 2;
  addLine(cx, fgR.bottom, cx, midY);
  addDot(cx, fgR.bottom, DOT_ENDPOINT);
  addDot(cx, midY, DOT_JUNCTION);
  addLine(cx, midY, cx, rgR.top);
  addDot(cx, rgR.top, DOT_ENDPOINT);
}


// toggle
function initToggle() {
  const btn = document.getElementById('toggle');
  const drawer = document.getElementById('drawer');

  let rafId = null;
  function trackLayout() {
    drawLines();
    rafId = requestAnimationFrame(trackLayout);
  }

  function stopTracking() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  drawer.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'max-height') stopTracking();
  });

  btn.addEventListener('click', () => {
    const willOpen = !drawer.classList.contains('open');
    drawer.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', willOpen);
    stopTracking();
    trackLayout();
  });
}


// init
let layoutTimer;
function scheduleRedraw() {
  clearTimeout(layoutTimer);
  layoutTimer = setTimeout(drawLines, 100);
}

window.addEventListener('resize', scheduleRedraw);
window.addEventListener('scroll', scheduleRedraw, { passive: true });

document.addEventListener('DOMContentLoaded', () => {
  render();
  initToggle();
  document.fonts.ready.then(drawLines);
});
