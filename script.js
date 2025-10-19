// Smooth section reveal and About typing + photo slide
(function() {
  const ACCENT = getComputedStyle(document.documentElement).getPropertyValue('--accent') || '#00e5ff';

  // Navbar toggle (mobile)
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target instanceof Element && e.target.tagName === 'A') {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active link highlight on scroll
  const links = Array.from(document.querySelectorAll('#primary-nav a'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const setActiveLink = () => {
    let index = sections.findIndex((sec) => sec && sec.getBoundingClientRect().top - 120 > 0);
    if (index === -1) index = sections.length; // bottom of page
    const active = sections[index - 1] || sections[0];
    links.forEach(l => l.classList.toggle('active', active && l.getAttribute('href') === '#' + active.id));
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });
  window.addEventListener('load', setActiveLink);

  // Global reveal observer
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  revealEls.forEach(el => revealObserver.observe(el));

  // About typing + photo slide logic
  const aboutSection = document.getElementById('about');
  const aboutContainer = aboutSection?.querySelector('.container');
  const photo = aboutSection?.querySelector('.about-photo');
  const typingEl = document.getElementById('about-typing');
  const aboutText = (window.ABOUT_TEXT || '').trim();
  let aboutActivated = false;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  // Center the photo horizontally within the about container on initial load
  function centerAboutPhoto() {
    if (!aboutSection || !photo || !aboutContainer || aboutActivated) return;
    const containerRect = aboutContainer.getBoundingClientRect();
    const photoRect = photo.getBoundingClientRect();
    const viewportCenter = window.innerWidth / 2;
    const photoCenter = photoRect.left + photoRect.width / 2;
    let deltaX = viewportCenter - photoCenter;
    // Constrain so photo stays fully inside container
    const minDelta = containerRect.left - photoRect.left; // left edge doesn't cross container left
    const maxDelta = (containerRect.right - photoRect.right); // right edge doesn't cross container right
    deltaX = clamp(deltaX, minDelta, maxDelta);
    photo.style.transform = `translateX(${Math.round(deltaX)}px)`;
  }

  // Word-by-word typing effect
  function typeWords(text, targetEl, opts) {
    const words = text.split(/\s+/);
    const speed = (opts && opts.speedMs) || 180; // ms per word
    let i = 0;
    const timer = setInterval(() => {
      if (i >= words.length) { clearInterval(timer); return; }
      const next = (i === 0) ? words[i] : ' ' + words[i];
      targetEl.textContent += next;
      i += 1;
    }, speed);
  }

  // Trigger both typing and photo slide when About becomes visible
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !aboutActivated) {
        aboutActivated = true;
        // Slide photo into its natural left position
        if (photo) {
          // Force layout to ensure transition applies if transform already set
          photo.getBoundingClientRect();
          photo.style.transform = 'translateX(0px)';
        }
        // Start typing simultaneously
        if (typingEl && aboutText) {
          typeWords(aboutText, typingEl, { speedMs: 160 });
        }
        aboutObserver.disconnect();
      }
    });
  }, { threshold: 0.35 });

  if (aboutSection) {
    // Prepare initial centered state ASAP
    window.addEventListener('DOMContentLoaded', centerAboutPhoto);
    window.addEventListener('load', centerAboutPhoto);
    window.addEventListener('resize', () => { if (!aboutActivated) centerAboutPhoto(); });
    aboutObserver.observe(aboutSection);
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Prevent default form submit (demo only)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thanks! Your message has been received.');
      form.reset();
    });
  }
})();
