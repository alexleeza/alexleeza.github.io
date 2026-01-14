/**
 * Alex K. Lee Portfolio - Main JavaScript
 * Consolidated script for navigation, forms, themes, and interactions
 * @author Alex K. Lee
 * @version 2.0.0
 */

(function() {
  'use strict';

  // ===== INITIALIZATION =====
  function init() {
    console.log('🎮 Portfolio initializing...');
    
    initNavigation();
    initForm();
    initStatsToggle();
    initThemeToggle();
    initSkillToggle();
    initLazyLoading();
    
    console.log('✅ Portfolio ready!');
  }

  // ===== NAVIGATION =====
  function initNavigation() {
    const navButtons = document.querySelectorAll('.timeline-btn');
    const sections = document.querySelectorAll('.section, .hero');
    
    // Click handlers for nav buttons
    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const sectionId = button.dataset.section;
        const section = document.getElementById(sectionId);
        
        if (section) {
          setActiveButton(navButtons, button);
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Update URL without page jump
          if (history.pushState) {
            history.pushState(null, null, `#${sectionId}`);
          }
        }
      });
    });
    
    // Intersection Observer for active section tracking
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const matchingBtn = document.querySelector(`[data-section="${sectionId}"]`);
          if (matchingBtn) {
            setActiveButton(navButtons, matchingBtn);
          }
        }
      });
    }, observerOptions);
    
    sections.forEach(section => {
      if (section.id) observer.observe(section);
    });
    
    // Handle initial URL hash
    handleInitialHash(navButtons);
  }
  
  function setActiveButton(allButtons, activeButton) {
    allButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-current', 'false');
    });
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-current', 'true');
  }
  
  function handleInitialHash(navButtons) {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const section = document.getElementById(hash);
      const btn = document.querySelector(`[data-section="${hash}"]`);
      if (section && btn) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveButton(navButtons, btn);
        }, 100);
      }
    }
  }

  // ===== STATS TOGGLE =====
  function initStatsToggle() {
    const statsBtn = document.getElementById('stats-btn');
    const statsSection = document.getElementById('stats');
    
    if (!statsBtn || !statsSection) return;
    
    statsBtn.addEventListener('click', () => {
      const isHidden = statsSection.classList.contains('hidden');
      
      if (isHidden) {
        statsSection.classList.remove('hidden');
        statsSection.setAttribute('aria-hidden', 'false');
        statsBtn.setAttribute('aria-expanded', 'true');
        statsBtn.innerHTML = '<span class="btn-icon"></span>Hide Stats';
        
        setTimeout(() => {
          statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        statsSection.classList.add('hidden');
        statsSection.setAttribute('aria-hidden', 'true');
        statsBtn.setAttribute('aria-expanded', 'false');
        statsBtn.innerHTML = '<span class="btn-icon"></span>Stats';
        
        document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ===== THEME TOGGLE =====
  function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Load saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'cream' ? null : 'cream';
      
      document.body.classList.add('theme-transitioning');
      
      if (newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      }
      
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 300);
    });
  }

  // ===== SKILL TOGGLE =====
  function initSkillToggle() {
    const skillBadges = document.querySelectorAll('.skill-badge[data-skill]');
    
    skillBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        const skillId = badge.dataset.skill;
        const subSkills = document.querySelector(`.sub-skills[data-sub-skill="${skillId}"]`);
        
        if (!subSkills) return;
        
        const isExpanded = badge.classList.contains('expanded');
        
        // Close all other expanded skills
        document.querySelectorAll('.skill-badge').forEach(b => {
          b.classList.remove('expanded');
          b.setAttribute('aria-expanded', 'false');
        });
        document.querySelectorAll('.sub-skills').forEach(s => s.classList.remove('show'));
        
        // Toggle current skill
        if (!isExpanded) {
          badge.classList.add('expanded');
          badge.setAttribute('aria-expanded', 'true');
          subSkills.classList.add('show');
        }
      });
    });
  }

  // ===== CONTACT FORM =====
  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
  }
  
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusDiv = form.querySelector('.form-status');
    
    // Clear previous status
    if (statusDiv) {
      statusDiv.textContent = '';
      statusDiv.className = 'form-status';
    }
    
    // Validate all fields
    const inputs = form.querySelectorAll('.form-input');
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) isValid = false;
    });
    
    if (!isValid) {
      showFormStatus(form, 'Please fix the errors above.', 'error');
      return;
    }
    
    // Disable button during submission
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-icon"></span>Sending...';
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        showFormStatus(form, 'Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form error:', error);
      showFormStatus(form, 'Oops! There was a problem. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }
  
  function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let error = '';
    
    if (field.hasAttribute('required') && !value) {
      error = `${capitalize(name)} is required.`;
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
      error = 'Please enter a valid email address.';
    } else if (name === 'message' && value && value.length < 10) {
      error = 'Message must be at least 10 characters.';
    }
    
    if (error) {
      showFieldError(field, error);
      return false;
    }
    
    clearFieldError(field);
    return true;
  }
  
  function showFieldError(field, message) {
    const errorId = field.getAttribute('aria-describedby');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
  }
  
  function clearFieldError(field) {
    const errorId = field.getAttribute('aria-describedby');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = '';
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
  }
  
  function showFormStatus(form, message, type) {
    const statusEl = form.querySelector('.form-status');
    if (!statusEl) return;
    
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
    
    if (type === 'success') {
      setTimeout(() => {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }, 5000);
    }
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ===== LAZY LOADING =====
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      return;
    }
    
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
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===== ERROR HANDLING =====
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
  });

  // ===== INIT ON DOM READY =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
