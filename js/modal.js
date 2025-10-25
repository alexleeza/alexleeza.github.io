/**
 * Modal Module
 * Handles modal opening, closing, focus trap, and keyboard interactions
 */

'use strict';

let currentModal = null;
let focusableElements = [];
let firstFocusable = null;
let lastFocusable = null;
let previousFocus = null;

/**
 * Initialize modal functionality
 */
export function initModal() {
  const modal = document.getElementById('stats-modal');
  if (!modal) return;
  
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  // Close button handler
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }
  
  // Overlay click handler
  if (overlay) {
    overlay.addEventListener('click', () => closeModal(modal));
  }
  
  // Keyboard event handler
  modal.addEventListener('keydown', handleModalKeydown);
  
  // Prevent scroll when modal is open
  observeModalState(modal);
}

/**
 * Open modal with focus trap
 * @param {HTMLElement} modal - Modal element to open
 */
export function openModal(modal) {
  if (!modal) return;
  
  // Store currently focused element
  previousFocus = document.activeElement;
  
  // Show modal
  modal.removeAttribute('hidden');
  currentModal = modal;
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Get all focusable elements
  focusableElements = getFocusableElements(modal);
  firstFocusable = focusableElements[0];
  lastFocusable = focusableElements[focusableElements.length - 1];
  
  // Focus first element or close button
  const closeBtn = modal.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.focus();
  } else if (firstFocusable) {
    firstFocusable.focus();
  }
  
  // Announce to screen readers
  modal.setAttribute('aria-hidden', 'false');
}

/**
 * Close modal and restore focus
 * @param {HTMLElement} modal - Modal element to close
 */
export function closeModal(modal) {
  if (!modal) return;
  
  // Hide modal
  modal.setAttribute('hidden', '');
  modal.setAttribute('aria-hidden', 'true');
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Restore focus to previously focused element
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }
  
  currentModal = null;
  focusableElements = [];
  firstFocusable = null;
  lastFocusable = null;
}

/**
 * Handle keyboard interactions in modal
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleModalKeydown(e) {
  if (!currentModal) return;
  
  // ESC key closes modal
  if (e.key === 'Escape' || e.key === 'Esc') {
    e.preventDefault();
    closeModal(currentModal);
    return;
  }
  
  // TAB key for focus trap
  if (e.key === 'Tab') {
    handleTabKey(e);
  }
}

/**
 * Handle tab key for focus trap
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleTabKey(e) {
  if (!focusableElements.length) return;
  
  // Shift + Tab (backward)
  if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    }
  }
  // Tab (forward)
  else {
    if (document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
}

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container element
 * @returns {Array<HTMLElement>} Array of focusable elements
 */
function getFocusableElements(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  
  const elements = container.querySelectorAll(focusableSelectors);
  return Array.from(elements).filter(el => {
    // Filter out hidden elements
    return el.offsetParent !== null;
  });
}

/**
 * Observe modal state changes to manage body scroll
 * @param {HTMLElement} modal - Modal element to observe
 */
function observeModalState(modal) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'hidden') {
        const isHidden = modal.hasAttribute('hidden');
        if (isHidden) {
          document.body.style.overflow = '';
        } else {
          document.body.style.overflow = 'hidden';
        }
      }
    });
  });
  
  observer.observe(modal, {
    attributes: true,
    attributeFilter: ['hidden']
  });
}

/**
 * Create a simple modal programmatically
 * @param {Object} options - Modal configuration
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal content HTML
 * @param {Function} options.onClose - Callback when modal closes
 * @returns {HTMLElement} Created modal element
 */
export function createModal({ title, content, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'dynamic-modal-title');
  modal.setAttribute('hidden', '');
  
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content px-border px-shadow-md">
      <div class="modal-header">
        <h2 id="dynamic-modal-title" class="modal-title">${title}</h2>
        <button class="modal-close px-btn-small" aria-label="Close modal">×</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Set up event listeners
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  const closeHandler = () => {
    closeModal(modal);
    if (onClose) onClose();
    modal.remove();
  };
  
  if (closeBtn) closeBtn.addEventListener('click', closeHandler);
  if (overlay) overlay.addEventListener('click', closeHandler);
  
  modal.addEventListener('keydown', handleModalKeydown);
  
  return modal;
}