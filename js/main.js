/**
 * Main JavaScript Entry Point
 * Initializes all modules and sets up event listeners
 */

'use strict';

import { initNavigation } from './nav.js';
import { initModal } from './modal.js';
import { initForm } from './form.js';
import { initChart } from './charts.js';
import { loadProjects, filterProjects } from './utils.js';

/**
 * Initialize the application when DOM is ready
 */
function init() {
  console.log('🎮 Pixel Portfolio initializing...');
  
  // Initialize navigation and section tracking
  initNavigation();
  
  // Initialize stats modal
  initModal();
  
  // Initialize contact form
  initForm();
  
  // Initialize pixel chart
  initChart();
  
  // Load and render projects
  loadProjects();
  
  // Set up hero button listeners
  setupHeroButtons();
  
  // Set up theme toggle
  setupThemeToggle();
  
  // Set up lazy loading for images
  setupLazyLoading();
  
  console.log('✅ Pixel Portfolio ready!');
}

/**
 * Set up hero section button event listeners
 */
function setupHeroButtons() {
  const statsBtn = document.getElementById('stats-btn');
  const projectsBtn = document.getElementById('projects-btn');
  
  if (statsBtn) {
    statsBtn.addEventListener('click', () => {
      // Option 1: Open modal (uncomment to use modal instead of scroll)
      // const modal = document.getElementById('stats-modal');
      // if (modal) {
      //   modal.removeAttribute('hidden');
      //   modal.querySelector('.modal-close')?.focus();
      // }
      
      // Option 2: Scroll to stats section (default)
      const statsSection = document.getElementById('stats');
      if (statsSection) {
        statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  
  if (projectsBtn) {
    projectsBtn.addEventListener('click', () => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
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

/**
 * Handle errors globally
 */
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential use in other modules
export { init };