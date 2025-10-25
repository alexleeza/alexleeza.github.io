/**
 * Navigation Module
 * Handles sidebar timeline navigation and active section tracking
 */

'use strict';

import { debounce } from './utils.js';

let activeSection = null;
let observer = null;

/**
 * Initialize navigation functionality
 * Sets up smooth scrolling and active section tracking
 */
export function initNavigation() {
  setupSmoothScroll();
  setupActiveTracking();
  setupMobileNav();
}

/**
 * Set up smooth scrolling for timeline navigation buttons
 */
function setupSmoothScroll() {
  const timelineBtns = document.querySelectorAll('.timeline-btn');
  
  timelineBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const sectionId = btn.dataset.section;
      const targetSection = document.getElementById(sectionId);
      
      if (targetSection) {
        // Smooth scroll to section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active state immediately for better UX
        updateActiveButton(btn);
        
        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, `#${sectionId}`);
        }
      }
    });
  });
}

/**
 * Set up Intersection Observer for active section tracking
 */
function setupActiveTracking() {
  const sections = document.querySelectorAll('.section, .hero');
  const options = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        updateActiveSectionByID(sectionId);
      }
    });
  }, options);
  
  // Observe all sections
  sections.forEach(section => {
    if (section.id) {
      observer.observe(section);
    }
  });
  
  // Handle initial state based on URL hash
  handleInitialHash();
}

/**
 * Update active button state by section ID
 * @param {string} sectionId - ID of the active section
 */
function updateActiveSectionByID(sectionId) {
  if (activeSection === sectionId) return;
  
  activeSection = sectionId;
  
  const timelineBtns = document.querySelectorAll('.timeline-btn');
  timelineBtns.forEach(btn => {
    if (btn.dataset.section === sectionId) {
      btn.classList.add('active');
      btn.setAttribute('aria-current', 'true');
    } else {
      btn.classList.remove('active');
      btn.removeAttribute('aria-current');
    }
  });
}

/**
 * Update active button directly
 * @param {HTMLElement} activeBtn - Button element to mark as active
 */
function updateActiveButton(activeBtn) {
  const timelineBtns = document.querySelectorAll('.timeline-btn');
  timelineBtns.forEach(btn => {
    btn.classList.remove('active');
    btn.removeAttribute('aria-current');
  });
  
  activeBtn.classList.add('active');
  activeBtn.setAttribute('aria-current', 'true');
  activeSection = activeBtn.dataset.section;
}

/**
 * Handle initial URL hash on page load
 */
function handleInitialHash() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const section = document.getElementById(hash);
    const btn = document.querySelector(`[data-section="${hash}"]`);
    
    if (section && btn) {
      // Wait for layout to settle
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActiveButton(btn);
      }, 100);
    }
  } else {
    // Default to first section (hero or about)
    const firstBtn = document.querySelector('.timeline-btn');
    if (firstBtn) {
      updateActiveButton(firstBtn);
    }
  }
}

/**
 * Set up mobile navigation adjustments
 * Ensures nav is accessible on mobile with bottom positioning
 */
function setupMobileNav() {
  const nav = document.querySelector('.sidebar-nav');
  if (!nav) return;
  
  // Handle window resize
  const handleResize = debounce(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      nav.setAttribute('aria-label', 'Bottom navigation');
    } else {
      nav.setAttribute('aria-label', 'Section navigation');
    }
  }, 250);
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Call once on init
}

/**
 * Cleanup observers (useful if navigation is destroyed)
 */
export function cleanupNavigation() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

/**
 * Programmatically navigate to a section
 * @param {string} sectionId - ID of section to navigate to
 */
export function navigateToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const btn = document.querySelector(`[data-section="${sectionId}"]`);
  
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    if (btn) {
      updateActiveButton(btn);
    }
    
    // Update URL
    if (history.pushState) {
      history.pushState(null, null, `#${sectionId}`);
    }
  }
}