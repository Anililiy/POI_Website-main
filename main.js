/* ==========================================================================
   POI – Power of Interest UK | Global Javascript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // === 1. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ===
  const reveals = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window && reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px -20px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    reveals.forEach(el => el.classList.add('visible'));
  }

  // === 2. MOBILE NAVIGATION MENU ===
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // === 3. HEADER SCROLL & READING PROGRESS BAR & BACK TO TOP ===
  const header = document.querySelector('.site-header');

  // Dynamically inject top progress bar
  let progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
  }

  // Dynamically inject back-to-top button
  let backToTop = document.querySelector('.back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '&uarr;';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  const handleScrollEffects = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // 1. Update Header Glassmorphism
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 2. Update Progress Bar
    if (progressBar && docHeight > 0) {
      const scrollPercent = Math.min(Math.max((scrollY / docHeight) * 100, 0), 100);
      progressBar.style.width = scrollPercent + '%';
    }

    // 3. Update Back To Top Visibility
    if (backToTop) {
      if (scrollY > 350) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  // === 4. ACCORDION COMPONENT (FAQ Page) ===
  const accordions = document.querySelectorAll('.accordion-item');
  
  accordions.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    
    if (trigger && content) {
      trigger.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        
        // Close other accordions in the same container
        const parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.accordion-item.active').forEach(openItem => {
            if (openItem !== item) {
              openItem.classList.remove('active');
              openItem.querySelector('.accordion-content').style.maxHeight = null;
            }
          });
        }
        
        // Toggle current
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = null;
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // Open accordion by URL hash (e.g. faq.html#bp-debate)
  function handleAccordionHash() {
    const hash = window.location.hash;
    if (hash) {
      const targetItem = document.querySelector(hash);
      if (targetItem && targetItem.classList.contains('accordion-item')) {
        const content = targetItem.querySelector('.accordion-content');
        if (content) {
          // Close others in same accordion
          const parent = targetItem.parentElement;
          if (parent) {
            parent.querySelectorAll('.accordion-item.active').forEach(openItem => {
              if (openItem !== targetItem) {
                openItem.classList.remove('active');
                openItem.querySelector('.accordion-content').style.maxHeight = null;
              }
            });
          }
          targetItem.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';

          setTimeout(() => {
            targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 200);
        }
      }
    }
  }

  handleAccordionHash();
  window.addEventListener('hashchange', handleAccordionHash);

  // === 5. CLOSED ROLES TOGGLE (Volunteering Page) ===
  const closedToggle = document.getElementById('closed-roles-toggle');
  const closedContainer = document.getElementById('closed-roles-container');
  const closedArrow = document.getElementById('closed-roles-arrow');

  if (closedToggle && closedContainer) {
    closedToggle.addEventListener('click', function () {
      const isExpanded = closedContainer.style.maxHeight && closedContainer.style.maxHeight !== '0px';
      if (isExpanded) {
        closedContainer.style.maxHeight = '0px';
        closedContainer.style.opacity = '0';
        if (closedArrow) closedArrow.style.transform = 'rotate(0deg)';
      } else {
        closedContainer.style.maxHeight = closedContainer.scrollHeight + 150 + 'px';
        closedContainer.style.opacity = '1';
        if (closedArrow) closedArrow.style.transform = 'rotate(180deg)';
      }
    });
  }

  // === 6. ADAPTIVE LIGHT / DARK MODE ENGINE ===
  const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getCurrentTheme() {
    const savedTheme = localStorage.getItem('poi-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return themeMediaQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, save = false) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
    if (save) {
      localStorage.setItem('poi-theme', theme);
    }
    updateToggleIcons(theme);
  }

  function updateToggleIcons(theme) {
    const iconHtml = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    const ariaLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = iconHtml;
      btn.setAttribute('aria-label', ariaLabel);
      btn.setAttribute('title', ariaLabel);
    });

    document.querySelectorAll('.theme-toggle-mobile').forEach(btn => {
      const label = theme === 'dark' ? 'Dark' : 'Light';
      btn.innerHTML = `<span>Theme</span><span>${iconHtml} ${label}</span>`;
    });
  }

  // Initialize theme on load
  const initialTheme = getCurrentTheme();
  applyTheme(initialTheme, false);

  // Listen to OS-level theme changes dynamically
  themeMediaQuery.addEventListener('change', (e) => {
    // Only adapt automatically if the user hasn't explicitly saved a preference
    if (!localStorage.getItem('poi-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

  // Inject Theme Toggle into Desktop Nav
  const navContainer = document.querySelector('.nav');
  if (navContainer && !document.querySelector('.theme-toggle-btn')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.innerHTML = initialTheme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    toggleBtn.setAttribute('aria-label', initialTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.setAttribute('title', initialTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || getCurrentTheme();
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });

    navContainer.appendChild(toggleBtn);
  }

  // Inject Theme Toggle into Mobile Nav
  const mobileNavContainer = document.querySelector('.mobile-nav');
  if (mobileNavContainer && !document.querySelector('.theme-toggle-mobile')) {
    const mobileToggleBtn = document.createElement('button');
    mobileToggleBtn.type = 'button';
    mobileToggleBtn.className = 'theme-toggle-mobile';
    const mobileIcon = initialTheme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    mobileToggleBtn.innerHTML = `<span>Theme</span><span>${mobileIcon} ${initialTheme === 'dark' ? 'Dark' : 'Light'}</span>`;

    mobileToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || getCurrentTheme();
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });

    mobileNavContainer.appendChild(mobileToggleBtn);
  }
});
