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

// ---- Session form submission (mailto) ----
function handleFormSubmit(event, sessionName) {
  event.preventDefault();
  const data = new FormData(event.target);
  const lines = ['Session Sign-Up: ' + sessionName, ''];
  data.forEach(function (value, key) { lines.push(key + ': ' + value); });
  const body    = encodeURIComponent(lines.join('\n'));
  const subject = encodeURIComponent('POI Sign-Up – ' + sessionName);
  window.location.href = 'mailto:poi.alison.zh@gmail.com?cc=poi.maria.fa@gmail.com&subject=' + subject + '&body=' + body;
  return false;
}

// ---- Contact form submission (mailto) ----
function handleContactSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const lines = ['POI Contact Form Submission', ''];
  data.forEach(function (value, key) { lines.push(key + ': ' + value); });
  const body    = encodeURIComponent(lines.join('\n'));
  const reason  = data.get('Reason') || 'General';
  const subject = encodeURIComponent('POI Contact – ' + reason);
  window.location.href = 'mailto:poi.alison.zh@gmail.com?cc=poi.maria.fa@gmail.com&subject=' + subject + '&body=' + body;
  return false;
}
