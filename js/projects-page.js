/**
 * Projects Page JavaScript
 * Initializes projects loading and filtering
 */

'use strict';

import { loadProjects, filterProjects } from './utils.js';

/**
 * Initialize the projects page
 */
function init() {
  console.log('Projects Page initializing...');
  
  // Load and render projects
  loadProjects();
  
  // Set up theme toggle
  setupThemeToggle();
  
  // Set up lazy loading for images
  setupLazyLoading();
  
  console.log('Projects Page ready!');
}

/**
 * Set up theme toggle functionality
 * Persists theme preference to localStorage
 */
function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'cream' ? 'charcoal' : 'cream';
    
    // Add transition class
    document.body.classList.add('theme-transitioning');
    
    // Change theme
    if (newTheme === 'charcoal') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
    
    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 300);
  });
}

/**
 * Set up lazy loading for images using Intersection Observer
 */
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential use in other modules
export { init };