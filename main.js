// =====================================================
// POI Website — main.js
// =====================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Header shadow on scroll ----
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  // ---- Auto-open accordion from URL hash ----
  // When navigating to volunteering.html#director, open the accordion
  // and scroll it into view (offsetting for the sticky header).
  if (window.location.hash) {
    const targetId = window.location.hash.slice(1); // strip the '#'
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const toggleBtn = targetEl.querySelector('.role-toggle');
      if (toggleBtn) {
        // Open the accordion
        toggleRole(toggleBtn);
      }
      // Wait a tick so the accordion has expanded, then scroll with offset
      setTimeout(function () {
        const headerHeight = header ? header.offsetHeight : 0;
        const announceBar = document.querySelector('.announce-bar');
        const announceHeight = announceBar ? announceBar.offsetHeight : 0;
        const top = targetEl.getBoundingClientRect().top + window.scrollY
                    - headerHeight - announceHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }, 50);
    }
  }

  // ---- Hamburger menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Policy modals ----
  const modalTriggers = [
    { id: 'footer-company-policy-btn', modal: 'company-policy-modal' },
    { id: 'footer-data-policy-btn',    modal: 'data-policy-modal' },
  ];
  modalTriggers.forEach(function (cfg) {
    const btn = document.getElementById(cfg.id);
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(cfg.modal);
      });
    }
  });

  document.querySelectorAll('.policy-close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const modal = btn.closest('.policy-modal-overlay');
      if (modal) closeModal(modal);
    });
  });
  document.querySelectorAll('.policy-modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.policy-modal-overlay.open').forEach(closeModal);
    }
  });
});

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}
function closeModal(modal) {
  if (typeof modal === 'string') modal = document.getElementById(modal);
  if (modal) modal.classList.remove('open');
}

// ---- Role accordion ----
function toggleRole(btn) {
  const content = btn.nextElementSibling;
  const isOpen = content.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', String(isOpen));
}

// ---- FAQ accordion ----
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', String(isOpen));
}

// ---- Form submission (Formspree AJAX) ----
  const forms = document.querySelectorAll('form[action^="https://formspree.io"]');
  forms.forEach(function(form) {
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      const statusBtn = form.querySelector('button[type="submit"]');
      const originalText = statusBtn.innerText;
      statusBtn.innerText = 'Sending...';
      
      const data = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          form.reset(); // Clear fields
          statusBtn.innerText = 'Sent Successfully!';
          setTimeout(function() { statusBtn.innerText = originalText; }, 4000);
        } else {
          statusBtn.innerText = 'Error sending';
          setTimeout(function() { statusBtn.innerText = originalText; }, 4000);
        }
      } catch (error) {
        statusBtn.innerText = 'Error sending';
        setTimeout(function() { statusBtn.innerText = originalText; }, 4000);
      }
    });
  });
