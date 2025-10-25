/**
 * Standalone JavaScript (No Modules)
 * Works without a web server
 */

(function() {
  'use strict';

  /**
   * Initialize the application when DOM is ready
   */
  function init() {
    console.log('🎮 Pixel Portfolio initializing...');
    
    // Initialize navigation and section tracking
    initNavigation();
    
    // Initialize contact form
    initForm();
    
    // Set up hero button listeners
    setupHeroButtons();
    
    // Set up theme toggle
    setupThemeToggle();
    
    // Set up lazy loading for images
    setupLazyLoading();
    
    console.log('✅ Pixel Portfolio ready!');
  }

  /**
   * Initialize navigation
   */
  function initNavigation() {
    const navButtons = document.querySelectorAll('.timeline-btn');
    
    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const sectionId = button.dataset.section;
        const section = document.getElementById(sectionId);
        
        if (section) {
          // Remove active class from all buttons
          navButtons.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          button.classList.add('active');
          // Scroll to section
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    
    // Intersection Observer for active section tracking
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          navButtons.forEach(btn => {
            if (btn.dataset.section === sectionId) {
              navButtons.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
  }

  /**
   * Set up hero section button event listeners
   */
  function setupHeroButtons() {
    const statsBtn = document.getElementById('stats-btn');
    console.log('Stats button found:', statsBtn);
    
    if (statsBtn) {
      statsBtn.addEventListener('click', () => {
        console.log('Stats button clicked!');
        const statsSection = document.getElementById('stats');
        console.log('Stats section found:', statsSection);
        
        if (statsSection) {
          // Toggle the hidden class
          const isHidden = statsSection.classList.contains('hidden');
          console.log('Stats section is hidden:', isHidden);
          
          if (isHidden) {
            // Show the stats section
            statsSection.classList.remove('hidden');
            console.log('Showing stats section');
            // Scroll to it smoothly
            setTimeout(() => {
              statsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
            // Update button text
            statsBtn.innerHTML = '<span class="btn-icon"></span>Hide Stats';
          } else {
            // Hide the stats section
            statsSection.classList.add('hidden');
            console.log('Hiding stats section');
            // Update button text
            statsBtn.innerHTML = '<span class="btn-icon"></span>Stats';
            // Scroll back to hero
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          console.error('Stats section not found!');
        }
      });
    } else {
      console.error('Stats button not found!');
    }
  }

  /**
   * Set up theme toggle functionality
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
   * Set up lazy loading for images
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
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }

  /**
   * Initialize contact form
   */
  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous errors
      document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
      });
      
      // Get form data
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      
      let isValid = true;
      
      // Validate name
      if (!name) {
        document.getElementById('name-error').textContent = 'Name is required';
        isValid = false;
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        document.getElementById('email-error').textContent = 'Email is required';
        isValid = false;
      } else if (!emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email';
        isValid = false;
      }
      
      // Validate message
      if (!message) {
        document.getElementById('message-error').textContent = 'Message is required';
        isValid = false;
      }
      
      if (isValid) {
        const statusDiv = form.querySelector('.form-status');
        statusDiv.textContent = 'Message sent successfully! (Demo mode - not actually sent)';
        statusDiv.style.color = '#6B8E6F';
        statusDiv.style.marginTop = '16px';
        form.reset();
        
        setTimeout(() => {
          statusDiv.textContent = '';
        }, 5000);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();