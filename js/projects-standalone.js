/**
 * Standalone JavaScript for Projects Page (No Modules)
 * Works without a web server
 */

(function() {
  'use strict';

  /**
   * Initialize the projects page
   */
  function init() {
    console.log('🎮 Projects Page initializing...');
    
    // Load and render projects
    loadProjects();
    
    // Set up theme toggle
    setupThemeToggle();
    
    // Set up lazy loading for images
    setupLazyLoading();
    
    console.log('✅ Projects Page ready!');
  }

  /**
   * Load and render projects from JSON
   */
  async function loadProjects() {
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
   */
  function renderProjects(projects) {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    
    grid.innerHTML = projects.map(project => createProjectCard(project)).join('');
  }

  /**
   * Create HTML for a project card
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
   */
  function setupProjectFilters(projects) {
    // Get all unique tags
    const allTags = new Set();
    projects.forEach(project => {
      project.tags.forEach(tag => allTags.add(tag));
    });
    
    // Create filter buttons
    const filterContainer = document.querySelector('.project-filters-container');
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
    const filterBtns = document.querySelectorAll('.filter-btn');
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
   */
  function filterProjects(tag) {
    const cards = document.querySelectorAll('.project-card');
    
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
   */
  function updateActiveFilter(activeBtn) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
  }

  /**
   * Show error message when projects fail to load
   */
  function showProjectsError() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    
    grid.innerHTML = `
      <div class="error-message px-border p-xl">
        <p>Failed to load projects. Please refresh the page to try again.</p>
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();