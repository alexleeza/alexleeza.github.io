/**
 * Utility Functions
 * Helper functions used throughout the application
 */

'use strict';

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return func(...args);
  };
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Query selector helper with optional scope
 * @param {string} selector - CSS selector
 * @param {HTMLElement} scope - Scope element (default: document)
 * @returns {HTMLElement|null} Selected element
 */
export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/**
 * Query selector all helper with optional scope
 * @param {string} selector - CSS selector
 * @param {HTMLElement} scope - Scope element (default: document)
 * @returns {Array<HTMLElement>} Array of selected elements
 */
export function qsa(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

/**
 * Load and render projects from JSON
 */
export async function loadProjects() {
  try {
    const response = await fetch('./data/projects.json');
    if (!response.ok) {
      throw new Error('Failed to load projects');
    }
    
    const projects = await response.json();
    renderProjects(projects);
    setupProjectFilters(projects);
    
  } catch (error) {
    console.error('Error loading projects:', error);
    showProjectsError();
  }
}

/**
 * Render projects to the grid
 * @param {Array<Object>} projects - Array of project objects
 */
function renderProjects(projects) {
  const grid = qs('.projects-grid');
  if (!grid) return;
  
  grid.innerHTML = projects.map(project => createProjectCard(project)).join('');
}

/**
 * Create HTML for a project card
 * @param {Object} project - Project object
 * @returns {string} HTML string
 */
function createProjectCard(project) {
  const tags = project.tags.map(tag => 
    `<span class="project-tag">${escapeHtml(tag)}</span>`
  ).join('');
  
  const links = project.links.map(link =>
    `<a href="${escapeHtml(link.url)}" class="px-btn px-btn-small" target="_blank" rel="noopener noreferrer">
      <span class="btn-icon"></span>
      ${escapeHtml(link.label)}
    </a>`
  ).join('');
  
  return `
    <article class="project-card px-border px-shadow-sm" data-tags="${project.tags.join(',')}">
      ${project.image ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="project-thumbnail" loading="lazy" decoding="async">` : ''}
      <h3 class="project-title">${escapeHtml(project.title)}</h3>
      <div class="project-tags">${tags}</div>
      <p class="project-description">${escapeHtml(project.description)}</p>
      <div class="project-links">${links}</div>
    </article>
  `;
}

/**
 * Set up project filter functionality
 * @param {Array<Object>} projects - Array of project objects
 */
function setupProjectFilters(projects) {
  // Get all unique tags
  const allTags = new Set();
  projects.forEach(project => {
    project.tags.forEach(tag => allTags.add(tag));
  });
  
  // Create filter buttons
  const filterContainer = qs('.project-filters');
  if (!filterContainer) return;
  
  // Add tag filter buttons
  allTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = tag;
    btn.dataset.filter = tag;
    filterContainer.appendChild(btn);
  });
  
  // Add event listeners
  const filterBtns = qsa('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterProjects(filter);
      updateActiveFilter(btn);
    });
  });
}

/**
 * Filter projects by tag
 * @param {string} tag - Tag to filter by ('all' shows all projects)
 */
export function filterProjects(tag) {
  const cards = qsa('.project-card');
  
  cards.forEach(card => {
    if (tag === 'all') {
      card.style.display = '';
    } else {
      const cardTags = card.dataset.tags.split(',');
      if (cardTags.includes(tag)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

/**
 * Update active filter button state
 * @param {HTMLElement} activeBtn - Button to mark as active
 */
function updateActiveFilter(activeBtn) {
  qsa('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  activeBtn.classList.add('active');
}

/**
 * Show error message when projects fail to load
 */
function showProjectsError() {
  const grid = qs('.projects-grid');
  if (!grid) return;
  
  grid.innerHTML = `
    <div class="error-message px-border p-xl">
      <p>Failed to load projects. Please refresh the page to try again.</p>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get CSS variable value
 * @param {string} varName - CSS variable name (without --)
 * @returns {string} Variable value
 */
export function getCSSVar(varName) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${varName}`).trim();
}

/**
 * Set CSS variable value
 * @param {string} varName - CSS variable name (without --)
 * @param {string} value - Value to set
 */
export function setCSSVar(varName, value) {
  document.documentElement.style.setProperty(`--${varName}`, value);
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {Object} options - Scroll options
 */
export function scrollTo(target, options = {}) {
  const element = typeof target === 'string' ? qs(target) : target;
  if (!element) return;
  
  element.scrollIntoView({
    behavior: options.smooth !== false ? 'smooth' : 'auto',
    block: options.block || 'start',
    inline: options.inline || 'nearest'
  });
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

/**
 * Wait for specified milliseconds
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get breakpoint value
 * @returns {string} Current breakpoint ('mobile', 'tablet', 'desktop')
 */
export function getBreakpoint() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Trap focus within an element (for accessibility)
 * @param {HTMLElement} element - Element to trap focus within
 * @param {Function} onEscape - Callback when escape key is pressed
 */
export function trapFocus(element, onEscape) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && onEscape) {
      onEscape();
    }
    
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}