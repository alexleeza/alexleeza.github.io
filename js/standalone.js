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
    
    // Set up expandable skills
    setupSkillToggle();
    
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
   * Set up expandable skills functionality
   */
  function setupSkillToggle() {
    const skillBadges = document.querySelectorAll('.skill-badge[data-skill]');
    
    skillBadges.forEach(badge => {
      badge.addEventListener('click', () => {
        const skillId = badge.dataset.skill;
        const subSkills = document.querySelector(`.sub-skills[data-sub-skill="${skillId}"]`);
        
        if (subSkills) {
          // Toggle the expanded state
          const isExpanded = badge.classList.contains('expanded');
          
          // Close all other expanded skills
          document.querySelectorAll('.skill-badge').forEach(b => b.classList.remove('expanded'));
          document.querySelectorAll('.sub-skills').forEach(s => s.classList.remove('show'));
          
          // Toggle this skill
          if (!isExpanded) {
            badge.classList.add('expanded');
            subSkills.classList.add('show');
          }
        }
      });
    });
  }

  /**
   * Initialize contact form
   */
  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous errors and status
      document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
      });
      
      const statusDiv = form.querySelector('.form-status');
      statusDiv.textContent = '';
      
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
        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-icon"></span>Sending...';
        
        try {
          // Submit to Formspree
          const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            statusDiv.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            statusDiv.style.color = '#6B8E6F';
            statusDiv.style.marginTop = '16px';
            form.reset();
          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          statusDiv.textContent = 'Oops! There was a problem sending your message. Please try again.';
          statusDiv.style.color = '#d9534f';
          statusDiv.style.marginTop = '16px';
        } finally {
          // Re-enable submit button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          
          // Clear status after 5 seconds
          setTimeout(() => {
            statusDiv.textContent = '';
          }, 5000);
        }
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