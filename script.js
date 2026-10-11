function initPortal() {
  const page = document.querySelector('.page');
  const lobby = document.querySelector('.portal-lobby');
  const artwork = document.querySelector('.hero-art');
  const portal = artwork?.querySelector('.portal-trigger');
  const canvas = artwork?.querySelector('canvas');
  const motion = artwork?.querySelector('.motion-toggle');
  const catalog = document.querySelector('.project-disclosure');
  const entry = catalog?.querySelector('summary');
  const toolbar = catalog?.querySelector('.project-toolbar');
  const back = catalog?.querySelector('.return-portal');
  const title = catalog?.querySelector('.project-title');
  const effects = document.querySelector('.portal-effects');
  const effect = effects?.getContext('2d');
  if (!page || !lobby || !artwork || !portal || !canvas || !motion || !catalog || !entry || !toolbar || !back || !title || !effect) return;
  const paint = typeof createPortalPainter === 'function' && createPortalPainter(canvas);
  if (!paint) return;
  const label = motion.querySelector('.motion-label');
  const glyph = motion.querySelector('.motion-glyph');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll('.destination'), entry];
  let paused = false, inView = false, hovered = false, focused = false;
  let pointerTarget = null, focusTarget = null, pullTarget = null;
  let frame = 0, previous = 0, accumulated = 0, time = 0, charge = 0;
  let transition = null, flight = null, outgoing = false, view = 'lobby';
  let effectsDirty = false;
  let center = { x: 0, y: 0 }, origin = { x: 0, y: 0 };
  let returnFocus = portal;
  const pixelSize = 4;
  const interval = 1000 / 30;

  function geometry() {
    const width = Math.ceil(window.innerWidth / pixelSize), height = Math.ceil(window.innerHeight / pixelSize);
    if (effects.width !== width) effects.width = width;
    if (effects.height !== height) effects.height = height;
    effect.imageSmoothingEnabled = false;
    if (view === 'lobby') {
      const rect = portal.getBoundingClientRect();
      center = { x: (rect.left + rect.width * .5) / pixelSize, y: (rect.top + rect.height * .53) / pixelSize };
    } else {
      center = { x: effects.width / 2, y: Math.min(effects.height * .4, 95) };
    }
    if (pullTarget) {
      const rect = pullTarget.getBoundingClientRect();
      origin = { x: (rect.left + rect.width / 2) / pixelSize, y: (rect.top + rect.height / 2) / pixelSize };
      const dx = center.x - origin.x, dy = center.y - origin.y;
      const distance = Math.hypot(dx, dy) || 1;
      pullTarget.style.setProperty('--pull-x', Math.round(dx / distance * 20) + 'px');
      pullTarget.style.setProperty('--pull-y', Math.round(dy / distance * 20) + 'px');
      pullTarget.style.setProperty('--pull-angle', (dx > 3 ? -2 : dx < -3 ? 2 : 0) + 'deg');
    }
  }
  function charged() { return hovered || focused || Boolean(pullTarget); }
  function syncCharge() {
    const next = pointerTarget || focusTarget;
    if (pullTarget !== next) {
      pullTarget?.classList.remove('is-pulled');
      pullTarget = next;
      if (pullTarget && !preference.matches && !paused) pullTarget.classList.add('is-pulled');
      geometry();
    }
    artwork.dataset.charged = String(charged());
    if (paused || preference.matches) paint(time, charged() ? 1 : 0);
    update();
  }
  function canAnimate() {
    return !outgoing && !document.hidden && (Boolean(transition) || (!paused && !preference.matches && inView && view === 'lobby'));
  }
  function update() {
    if (transition && (preference.matches || paused)) finishTransition();
    const running = canAnimate();
    artwork.dataset.motion = running ? 'running' : 'paused';
    page.dataset.animation = paused || preference.matches ? 'paused' : 'running';
    motion.disabled = preference.matches;
    label.textContent = preference.matches ? 'Motion off' : paused ? 'Play' : 'Pause';
    glyph.textContent = paused || preference.matches ? '▷' : 'Ⅱ';
    motion.setAttribute('aria-label', preference.matches ? 'Animation off: reduced motion preference' : paused ? 'Play portal animation' : 'Pause portal animation');
    if (running && !frame) { previous = 0; frame = requestAnimationFrame(draw); }
    if (!running && frame) { cancelAnimationFrame(frame); frame = 0; previous = 0; }
    if (!running && !transition && !outgoing) effect.clearRect(0, 0, effects.width, effects.height);
  }
  function particles() {
    if (!pullTarget || paused || preference.matches) return;
    // Pixel flecks peel from the tile's leading edge and spiral into the aperture.
    for (let i = 0; i < 22; i++) {
      const progress = (time * .48 + i / 22) % 1;
      const curve = progress * progress;
      const spread = Math.sin(progress * Math.PI) * (i % 2 ? 7 : -7);
      const x = origin.x + (center.x - origin.x) * curve + spread;
      const y = origin.y + (center.y - origin.y) * curve;
      effect.globalAlpha = Math.sin(progress * Math.PI) * .8;
      effect.fillStyle = i % 3 ? '#81aa82' : '#2a5a42';
      effect.fillRect(Math.round(x), Math.round(y), i % 4 === 0 ? 2 : 1, 1);
    }
    effect.globalAlpha = 1;
  }
  function pixelWipe(progress) {
    const tile = 7;
    const maxDistance = Math.max(...[[0,0],[effects.width,0],[0,effects.height],[effects.width,effects.height]].map(([x,y]) => Math.hypot(x - transition.center.x, y - transition.center.y)));
    for (let y = 0; y < effects.height; y += tile) {
      for (let x = 0; x < effects.width; x += tile) {
        const distance = Math.hypot(x + tile / 2 - transition.center.x, y + tile / 2 - transition.center.y) / maxDistance;
        const noise = ((x * 17 + y * 31) % 23) / 23;
        const entering = transition.next !== 'lobby';
        const coverAt = entering ? .68 + distance * .10 + noise * .035 : .18 + distance * .29 + noise * .055;
        const revealAt = entering ? .85 + distance * .10 + noise * .045 : .58 + distance * .25 + noise * .11;
        if (progress < coverAt || progress > revealAt) continue;
        effect.fillStyle = ['#223b2d','#2a5a42','#396c4d','#547862'][Math.floor(noise * 4)];
        effect.fillRect(x, y, tile + 1, tile + 1);
      }
    }
  }
  function createFlight(source) {
    const face = source?.querySelector('.button-face');
    if (!face || paused || preference.matches) return;
    const rect = face.getBoundingClientRect();
    const ghost = face.cloneNode(true);
    ghost.className = 'button-face portal-flight';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.font = getComputedStyle(face).font;
    document.body.append(ghost);
    source.classList.add('is-departing');
    flight = { source, ghost, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, trail: [] };
  }
  function swallow(progress) {
    if (!flight) return;
    const amount = Math.min(1, progress / .68);
    const cx = transition.center.x * pixelSize, cy = transition.center.y * pixelSize;
    const side = flight.x < cx ? -1 : 1;
    let x, y, scale, rotation;
    if (amount < .45) {
      const pull = Math.pow(amount / .45, 1.35);
      x = flight.x + (cx + side * 26 - flight.x) * pull;
      y = flight.y + (cy + 38 - flight.y) * pull;
      scale = 1 - pull * .48;
      rotation = side * pull * -.25;
    } else {
      const depth = (amount - .45) / .55;
      const angle = Math.atan2(38 / 48, side * 26 / 36) + side * depth * Math.PI * 3.5;
      const radius = Math.pow(1 - depth, 1.15);
      x = cx + Math.cos(angle) * 36 * radius;
      y = cy + Math.sin(angle) * 48 * radius + depth * 16;
      scale = .52 * Math.pow(1 - depth, 1.6);
      rotation = angle - Math.PI / 2;
    }
    flight.ghost.style.transform = 'translate(' + Math.round(x - flight.x) + 'px,' + Math.round(y - flight.y) + 'px) rotate(' + rotation + 'rad) scale(' + Math.max(.001, scale) + ')';
    flight.ghost.style.opacity = amount > .93 ? String((1 - amount) / .07) : '1';
    flight.trail.push({ x: x / pixelSize, y: y / pixelSize });
    if (flight.trail.length > 16) flight.trail.shift();
    flight.trail.forEach((point, index) => {
      effect.globalAlpha = index / flight.trail.length * (1 - amount) * .8;
      effect.fillStyle = index % 3 ? '#81aa82' : '#2a5a42';
      effect.fillRect(Math.round(point.x + index % 3 - 1), Math.round(point.y), 1, index % 4 === 0 ? 2 : 1);
    });
    effect.globalAlpha = 1;
  }
  function resetJourney() {
    flight?.source.classList.remove('is-departing');
    flight?.ghost.remove();
    flight = null;
    outgoing = false;
    page.classList.remove('is-transitioning', 'is-opening');
    page.removeAttribute('aria-busy');
    page.inert = lobby.inert = catalog.inert = false;
    effect.clearRect(0, 0, effects.width, effects.height);
  }
  function setView(next, writeHistory) {
    view = next;
    const projects = view === 'projects';
    page.dataset.view = view;
    lobby.hidden = projects;
    catalog.open = projects;
    entry.hidden = projects;
    toolbar.hidden = !projects;
    portal.setAttribute('aria-expanded', String(projects));
    if (writeHistory) {
      history.pushState({ portalView: view }, '', projects ? '#projects' : location.pathname + location.search);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    geometry();
  }
  function finishTransition() {
    if (!transition) return;
    if (transition.href) {
      const href = transition.href;
      transition = null;
      outgoing = true;
      window.location.assign(href);
      return;
    }
    if (!transition.committed) setView(transition.next, transition.writeHistory);
    transition = null;
    resetJourney();
    paint(time, 0);
    (view === 'projects' ? title : returnFocus).focus({ preventScroll: true });
  }
  function travel(next, writeHistory = true, source = entry, href = null) {
    if (transition || outgoing || next === view) return;
    if (next === 'projects') returnFocus = document.activeElement === entry ? entry : portal;
    if (next !== 'lobby') createFlight(source);
    pointerTarget = null;
    focusTarget = null;
    pullTarget?.classList.remove('is-pulled');
    pullTarget = null;
    hovered = focused = false;
    artwork.dataset.charged = 'false';
    geometry();
    transition = { next, href, writeHistory, elapsed: 0, committed: false, center: { ...center } };
    page.classList.add('is-transitioning');
    page.classList.toggle('is-opening', next !== 'lobby');
    page.setAttribute('aria-busy', 'true');
    page.inert = true;
    lobby.inert = true;
    catalog.inert = true;
    update();
  }
  function draw(timestamp) {
    frame = 0;
    if (!canAnimate()) return;
    const delta = previous ? Math.max(0, timestamp - previous) : 0;
    previous = timestamp;
    accumulated += Math.min(delta, 100);
    // Navigation follows elapsed time even when a device drops animation frames.
    // Visibility changes reset `previous`, so hidden-tab time stays paused.
    if (transition) transition.elapsed += delta;
    if (accumulated >= interval) {
      const elapsed = accumulated;
      accumulated %= interval;
      time += (elapsed - accumulated) / 1000;
      // Avoid repainting the viewport-sized overlay while only the sprite moves.
      if (effectsDirty || transition || pullTarget) {
        effect.clearRect(0, 0, effects.width, effects.height);
      }
      effectsDirty = Boolean(transition || pullTarget);
      if (transition) {
        const entering = transition.next !== 'lobby';
        const progress = Math.min(1, transition.elapsed / (entering ? 1650 : 1150));
        paint(time, 1, 0, Math.min(1, progress / .25));
        swallow(progress);
        pixelWipe(progress);
        if (progress >= (entering ? .83 : .55) && !transition.committed) {
          if (transition.href) finishTransition();
          else {
            setView(transition.next, transition.writeHistory);
            transition.committed = true;
          }
        }
        if (transition && progress >= 1) finishTransition();
      } else {
        charge += ((charged() ? 1 : 0) - charge) * .14;
        paint(time, charge);
        particles();
      }
    }
    if (canAnimate() && !frame) frame = requestAnimationFrame(draw);
    else if (!canAnimate()) update();
  }

  portal.addEventListener('pointerenter', () => { hovered = true; syncCharge(); });
  portal.addEventListener('pointerleave', () => { hovered = false; syncCharge(); });
  portal.addEventListener('focus', () => { focused = true; syncCharge(); });
  portal.addEventListener('blur', () => { focused = false; syncCharge(); });
  portal.addEventListener('click', () => travel('projects'));
  entry.addEventListener('click', event => { event.preventDefault(); travel('projects'); });
  back.addEventListener('click', () => travel('lobby'));
  for (const target of targets) {
    target.addEventListener('pointerenter', () => { pointerTarget = target; syncCharge(); });
    target.addEventListener('pointerleave', () => { if (pointerTarget === target) pointerTarget = null; syncCharge(); });
    target.addEventListener('focus', () => { focusTarget = target; syncCharge(); });
    target.addEventListener('blur', () => { if (focusTarget === target) focusTarget = null; syncCharge(); });
    if (target.matches('a.destination')) {
      target.addEventListener('click', event => {
        // Keep new-tab, modified clicks, downloads, and no-script links native.
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || target.target === '_blank' || target.hasAttribute('download')) return;
        event.preventDefault();
        travel('external', false, target, target.href);
      });
    }
  }
  motion.addEventListener('click', () => {
    paused = !paused;
    if (paused) pullTarget?.classList.remove('is-pulled');
    else pullTarget?.classList.add('is-pulled');
    update();
  });
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', update);
  window.addEventListener('resize', geometry, { passive: true });
  window.addEventListener('scroll', () => { if (!transition) geometry(); }, { passive: true });
  window.addEventListener('popstate', () => travel(location.hash === '#projects' ? 'projects' : 'lobby', false));
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    transition = null;
    resetJourney();
    geometry();
    update();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([item]) => { inView = item.isIntersecting; update(); }, { threshold: .05 });
    observer.observe(artwork);
  } else { inView = true; }
  geometry();
  paint(0);
  canvas.hidden = false;
  artwork.querySelector('.portal-fallback').hidden = true;
  motion.hidden = false;
  effects.hidden = false;
  portal.removeAttribute('disabled');
  if (location.hash === '#projects') setView('projects', false);
  update();
}
initPortal();
