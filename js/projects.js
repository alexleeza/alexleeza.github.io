/**
 * Alex K. Lee Portfolio - Projects Page JavaScript
 * Handles project loading, filtering, and display
 * @author Alex K. Lee
 * @version 2.0.0
 */

(function() {
  'use strict';

  let projectsData = [];

  // ===== INITIALIZATION =====
  function init() {
    console.log('📁 Projects page initializing...');
    
    loadProjects();
    initThemeToggle();
    
    console.log('✅ Projects page ready!');
  }

  // ===== PROJECT LOADING =====
  async function loadProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    try {
      const response = await fetch('./data/projects.json');
      if (!response.ok) throw new Error('Failed to load projects');
      
      projectsData = await response.json();
      renderProjects(projectsData);
      setupFilters(projectsData);
      
    } catch (error) {
      console.error('Error loading projects:', error);
      showError(grid);
    }
  }

  // ===== PROJECT RENDERING =====
  function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    
    if (projects.length === 0) {
      grid.innerHTML = '<div class="loading-message px-border"><p>No projects found.</p></div>';
      return;
    }
    
    grid.innerHTML = projects.map(project => createProjectCard(project)).join('');
    
    // Setup lazy loading for project images
    setupImageLazyLoading();
  }

  function createProjectCard(project) {
    const tags = project.tags.map(tag => 
      `<span class="project-tag">${escapeHtml(tag)}</span>`
    ).join('');
    
    const links = project.links && project.links.length > 0 
      ? project.links.map(link =>
          `<a href="${escapeHtml(link.url)}" class="px-btn px-btn-small" target="_blank" rel="noopener noreferrer">
            <span class="btn-icon"></span>
            ${escapeHtml(link.label)}
          </a>`
        ).join('')
      : '<span class="text-muted text-sm">Private Repository</span>';
    
    const featuredBadge = project.featured 
      ? '<span class="featured-badge">Featured</span>' 
      : '';
    
    const comingSoonBadge = project.status === 'coming-soon'
      ? '<span class="coming-soon-badge">Coming Soon</span>'
      : '';
    
    // YouTube video embed or image thumbnail
    let mediaHtml = '';
    if (project.video) {
      // Extract YouTube video ID from various URL formats
      const videoId = extractYouTubeId(project.video);
      if (videoId) {
        mediaHtml = `
          <div class="project-video-container">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}" 
              title="${escapeHtml(project.title)} demo video"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              loading="lazy">
            </iframe>
          </div>`;
      }
    } else if (project.image) {
      mediaHtml = `
        <img src="${escapeHtml(project.image)}" 
             alt="${escapeHtml(project.title)} screenshot" 
             class="project-thumbnail" 
             loading="lazy" 
             decoding="async"
             onerror="this.parentElement.classList.add('no-image')">`;
    }
    
    // Video button if video exists
    const videoBtn = project.video 
      ? `<a href="${escapeHtml(project.video)}" class="px-btn px-btn-small video-btn" target="_blank" rel="noopener noreferrer">
           <span class="btn-icon video-icon"></span>
           Watch Demo
         </a>`
      : '';
    
    return `
      <article class="project-card px-border px-shadow-sm ${project.status === 'coming-soon' ? 'coming-soon' : ''}" 
               data-tags="${project.tags.join(',').toLowerCase()}"
               style="position: relative;">
        ${featuredBadge}
        ${comingSoonBadge}
        ${mediaHtml}
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        <div class="project-tags">${tags}</div>
        <p class="project-description">${escapeHtml(project.description)}</p>
        <div class="project-links">
          ${videoBtn}
          ${links}
        </div>
      </article>
    `;
  }

  // Extract YouTube video ID from various URL formats
  function extractYouTubeId(url) {
    if (!url) return null;
    
    // Match various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }

  // ===== FILTERING =====
  function setupFilters(projects) {
    const filterContainer = document.querySelector('.project-filters');
    if (!filterContainer) return;
    
    // Collect unique tags
    const allTags = new Set();
    projects.forEach(project => {
      project.tags.forEach(tag => allTags.add(tag));
    });
    
    // Create filter buttons for each tag
    const sortedTags = Array.from(allTags).sort();
    sortedTags.forEach(tag => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = tag;
      btn.dataset.filter = tag.toLowerCase();
      btn.setAttribute('aria-pressed', 'false');
      filterContainer.appendChild(btn);
    });
    
    // Add event listeners
    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterProjects(filter);
        updateActiveFilter(filterBtns, btn);
      });
    });
  }

  function filterProjects(filter) {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
      const cardTags = card.dataset.tags.split(',');
      
      if (filter === 'all' || cardTags.includes(filter)) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.3s ease-out';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function updateActiveFilter(allBtns, activeBtn) {
    allBtns.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-pressed', 'true');
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

  // ===== IMAGE LAZY LOADING =====
  function setupImageLazyLoading() {
    if (!('IntersectionObserver' in window)) return;
    
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
      rootMargin: '100px 0px',
      threshold: 0.01
    });
    
    document.querySelectorAll('.project-thumbnail[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===== UTILITIES =====
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showError(container) {
    container.innerHTML = `
      <div class="error-message px-border">
        <p>Failed to load projects. Please refresh the page to try again.</p>
      </div>
    `;
  }

  // ===== INIT ON DOM READY =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
