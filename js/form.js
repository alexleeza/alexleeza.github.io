/**
 * Form Module
 * Handles contact form validation and submission
 */

'use strict';

/**
 * Initialize contact form
 */
export function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  // Set up form submission
  form.addEventListener('submit', handleSubmit);
  
  // Set up real-time validation
  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Validate all fields
  const isValid = validateForm(form);
  
  if (!isValid) {
    showFormStatus(form, 'Please fix the errors above.', 'error');
    return;
  }
  
  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="btn-icon"></span> Sending...';
  
  try {
    // Option 1: mailto fallback (default)
    await sendViaMailto(data);
    
    // Option 2: If you have an API endpoint, use this instead:
    // await sendViaAPI(data);
    
    showFormStatus(form, 'Message sent successfully! I\'ll get back to you soon.', 'success');
    form.reset();
    
  } catch (error) {
    console.error('Form submission error:', error);
    showFormStatus(form, 'Failed to send message. Please try again or email me directly.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean} True if form is valid
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('.form-input');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

/**
 * Validate a single field
 * @param {HTMLInputElement} field - Input field to validate
 * @returns {boolean} True if field is valid
 */
function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let errorMessage = '';
  
  // Required field validation
  if (field.hasAttribute('required') && !value) {
    errorMessage = `${capitalize(fieldName)} is required.`;
  }
  
  // Email validation
  else if (field.type === 'email' && value) {
    if (!isValidEmail(value)) {
      errorMessage = 'Please enter a valid email address.';
    }
  }
  
  // Message length validation
  else if (fieldName === 'message' && value) {
    if (value.length < 10) {
      errorMessage = 'Message must be at least 10 characters long.';
    }
  }
  
  // Name validation
  else if (fieldName === 'name' && value) {
    if (value.length < 2) {
      errorMessage = 'Name must be at least 2 characters long.';
    }
  }
  
  // Show or clear error
  if (errorMessage) {
    showFieldError(field, errorMessage);
    return false;
  } else {
    clearFieldError(field);
    return true;
  }
}

/**
 * Show field error message
 * @param {HTMLInputElement} field - Input field
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
  const errorId = field.getAttribute('aria-describedby');
  const errorElement = document.getElementById(errorId);
  
  if (errorElement) {
    errorElement.textContent = message;
  }
  
  field.classList.add('error');
  field.setAttribute('aria-invalid', 'true');
}

/**
 * Clear field error message
 * @param {HTMLInputElement} field - Input field
 */
function clearFieldError(field) {
  const errorId = field.getAttribute('aria-describedby');
  const errorElement = document.getElementById(errorId);
  
  if (errorElement) {
    errorElement.textContent = '';
  }
  
  field.classList.remove('error');
  field.removeAttribute('aria-invalid');
}

/**
 * Show form status message
 * @param {HTMLFormElement} form - Form element
 * @param {string} message - Status message
 * @param {string} type - Status type ('success' or 'error')
 */
function showFormStatus(form, message, type) {
  const statusElement = form.querySelector('.form-status');
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.className = `form-status ${type}`;
  
  // Announce to screen readers
  statusElement.setAttribute('role', 'status');
  statusElement.setAttribute('aria-live', 'polite');
  
  // Clear after 5 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.className = 'form-status';
    }, 5000);
  }
}

/**
 * Send form data via mailto (fallback method)
 * @param {Object} data - Form data
 */
async function sendViaMailto(data) {
  const { name, email, message } = data;
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );
  
  // Replace {{EMAIL}} with your actual email
  const mailtoLink = `mailto:{{EMAIL}}?subject=${subject}&body=${body}`;
  
  // Open mailto link
  window.location.href = mailtoLink;
  
  // Return a resolved promise for consistency
  return new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Send form data via API (to be implemented)
 * @param {Object} data - Form data
 * @returns {Promise} Fetch promise
 */
async function sendViaAPI(data) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}