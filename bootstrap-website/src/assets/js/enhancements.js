/**
 * Cinematic Counter-Cartographies
 * Enhanced Interactive Features
 */

// Prevent double initialization
if (!window._cc_initialized) {
  window._cc_initialized = true;

  // Safe global error reporting
  window.addEventListener('error', function (e) {
    console.error('Runtime error:', e.error || e.message);
    try { showToast('A runtime error occurred', 'error'); } catch (err) {}
  });

  // ==========================================
  // 1. Initialization & DOM Ready
  // ==========================================
  document.addEventListener('DOMContentLoaded', function() {
    try {
      initializeEnhancements();
      initializeAnimations();
      initializeAccessibility();
      updateCopyrightYear();
    } catch (err) {
      console.error('Initialization error:', err);
      try { showToast('Initialization failed (check console)', 'error'); } catch (e) {}
    }
  });
}

// ==========================================
// 2. Core Enhancement Functions
// ==========================================

/**
 * Initialize all page enhancements
 */
function initializeEnhancements() {
  // Add smooth scrolling to anchor links
  addSmoothScrolling();
  
  // Add loading states to buttons
  enhanceButtons();
  
  // Add card hover effects
  enhanceCards();
  
  // Add search/filter functionality (if exists)
  initializeFilters();
  
  // Add keyboard navigation
  enhanceKeyboardNav();
  
  // Add progress indicator for long pages
  addProgressIndicator();

  // Lazy-load images if any
  try { lazyLoadImages(); } catch (e) {}
}

/**
 * Smooth scrolling for anchor links
 */
function addSmoothScrolling() {
  try {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            // Update URL without jumping
            history.pushState(null, null, href);
          }
        }
      });
    });
  } catch (err) {
    console.warn('addSmoothScrolling error', err);
  }
}

/**
 * Enhance buttons with loading states and feedback
 */
function enhanceButtons() {
  try {
    document.querySelectorAll('.btn').forEach(btn => {
      // Add ripple effect on click
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          left: ${x}px;
          top: ${y}px;
          pointer-events: none;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = this.style.position || 'relative';
        this.style.overflow = this.style.overflow || 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  } catch (err) {
    console.warn('enhanceButtons error', err);
  }
  
  // Add CSS for ripple animation if not already present
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }
}

/**
 * Enhance cards with dynamic content loading indicators
 */
function enhanceCards() {
  try {
    document.querySelectorAll('.card').forEach(card => {
      // Add staggered fade-in on scroll
      observeElement(card, () => {
        card.classList.add('fade-in');
      });
      
      // Add click tracking for analytics (placeholder)
      card.addEventListener('click', function(e) {
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
          const cardTitle = this.querySelector('h2, h3, h5, h6');
          if (cardTitle) {
            console.log('Card clicked:', cardTitle.textContent);
          }
        }
      });
    });
  } catch (err) {
    console.warn('enhanceCards error', err);
  }
}

/**
 * Initialize filter functionality
 */
function initializeFilters() {
  try {
    const filterInputs = document.querySelectorAll('[data-filter]');
    
    filterInputs.forEach(input => {
      input.addEventListener('input', debounce(function() {
        const filterType = this.dataset.filter;
        const filterValue = this.value.toLowerCase();
        
        filterContent(filterType, filterValue);
      }, 300));
    });
  } catch (err) {
    // No filters on page — that's fine
  }
}

/**
 * Filter content based on type and value
 */
function filterContent(type, value) {
  try {
    const items = document.querySelectorAll('[data-filterable]');
    
    items.forEach(item => {
      const itemValue = (item.dataset && item.dataset[type]) ? item.dataset[type].toLowerCase() : '';
      
      if (itemValue.includes(value) || value === '') {
        item.style.display = '';
        item.classList.add('fade-in');
      } else {
        item.style.display = 'none';
      }
    });
  } catch (err) {
    console.warn('filterContent error', err);
  }
}

// ==========================================
// 3. Animation & Visual Effects
// ==========================================

/**
 * Initialize scroll-based animations
 */
function initializeAnimations() {
  try {
    const animatedElements = document.querySelectorAll('.card, .list-group-item, section');
    
    animatedElements.forEach((el, index) => {
      observeElement(el, () => {
        setTimeout(() => {
          // set initial state then animate in
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          });
        }, index * 50);
      });
    });
  } catch (err) {
    console.warn('initializeAnimations error', err);
  }
}

/**
 * Intersection Observer helper with fallback
 */
function observeElement(element, callback, options = {}) {
  // If element is not present, bail
  if (!element) return;
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { ...defaultOptions, ...options });
    
    observer.observe(element);
  } else {
    // Fallback: call callback immediately
    setTimeout(() => callback(element), 50);
  }
}

/**
 * Add reading progress indicator
 */
function addProgressIndicator() {
  try {
    // Avoid duplicate
    if (document.getElementById('reading-progress')) return;

    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #d32f2f, #00732f);
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', throttle(() => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    }, 50));
  } catch (err) {
    console.warn('addProgressIndicator error', err);
  }
}

// ==========================================
// 4. Accessibility Enhancements
// ==========================================

/**
 * Enhance keyboard navigation
 */
function enhanceKeyboardNav() {
  document.addEventListener('keydown', function(e) {
    // Alt + H = Home
    if (e.altKey && (e.key === 'h' || e.key === 'H')) {
      e.preventDefault();
      window.location.href = '../../index.html';
    }
    
    // Alt + M = Map
    if (e.altKey && (e.key === 'm' || e.key === 'M')) {
      e.preventDefault();
      window.location.href = '../map.html';
    }
    
    // Alt + T = Theater
    if (e.altKey && (e.key === 't' || e.key === 'T')) {
      e.preventDefault();
      window.location.href = '../theater.html';
    }
    
    // Escape = Close modals/dropdowns
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
      });
    }
  });
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
  // Add skip to main content link
  addSkipLink();
  
  // Ensure all images have alt text
  checkImageAltText();
  
  // Add ARIA labels where needed
  enhanceARIA();
  
  // Add focus visible styles for keyboard navigation
  addFocusStyles();
}

/**
 * Add skip to main content link
 */
function addSkipLink() {
  try {
    if (!document.querySelector('#skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.id = 'skip-link';
      skipLink.href = '#main';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #d32f2f;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 0 0 4px 0;
      `;
      
      skipLink.addEventListener('focus', function() {
        this.style.top = '0';
      });
      
      skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
      
      // Add ID to main if it doesn't exist
      const main = document.querySelector('main');
      if (main && !main.id) {
        main.id = 'main';
      }
    }
  } catch (err) {
    console.warn('addSkipLink error', err);
  }
}

/**
 * Check and warn about missing alt text
 */
function checkImageAltText() {
  try {
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt) {
        console.warn('Image missing alt text:', img.src);
        img.alt = 'Decorative image'; // Fallback
      }
    });
  } catch (err) {}
}

/**
 * Enhance ARIA labels
 */
function enhanceARIA() {
  try {
    // Add role to navigation
    document.querySelectorAll('nav').forEach(nav => {
      if (!nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
    });
    
    // Add aria-label to buttons without text
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
        btn.setAttribute('aria-label', 'Button');
      }
    });
  } catch (err) {}
}

/**
 * Add focus visible styles
 */
function addFocusStyles() {
  try {
    document.body.classList.add('keyboard-nav');
    
    // Detect mouse usage to toggle keyboard nav class
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });
  } catch (err) {}
}

// ==========================================
// 5. Utility Functions
// ==========================================

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Update copyright year
 */
function updateCopyrightYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
  try {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'error' ? '#d32f2f' : '#00732f'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInUp 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutDown 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  } catch (err) {
    console.warn('showToast failed', err);
  }
}

/**
 * Copy text to clipboard with feedback
 */
function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  if (!navigator.clipboard) {
    showToast('Clipboard not supported', 'error');
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMessage, 'success');
  }).catch(() => {
    showToast('Failed to copy', 'error');
  });
}

/**
 * Lazy load images
 */
function lazyLoadImages() {
  try {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } catch (err) {
    console.warn('lazyLoadImages error', err);
  }
}

// ==========================================
// 6. Data Loading & Management
// ==========================================

/**
 * Load JSON data from file
 */
async function loadJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading JSON:', error);
    try { showToast('Error loading data', 'error'); } catch (e) {}
    return null;
  }
}

/**
 * Save data to local storage
 */
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load data from local storage
 */
function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

// ==========================================
// 7. Export for use in other scripts
// ==========================================

window.CounterCartographies = {
  loadJSON,
  showToast,
  copyToClipboard,
  observeElement,
  debounce,
  throttle,
  saveToLocalStorage,
  loadFromLocalStorage
};

// Add toast animation styles if not present
if (!document.querySelector('#toast-styles')) {
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    @keyframes slideInUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }
    
    .keyboard-nav *:focus {
      outline: 2px solid #d32f2f;
      outline-offset: 2px;
    }

    .fade-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}