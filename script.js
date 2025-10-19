// Utility: smooth-scroll for nav links and close mobile menu
(function(){
  const siteNav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const header = document.querySelector('.site-header');

  function closeMenu(){
    siteNav?.setAttribute('data-open', 'false');
    toggle?.setAttribute('aria-expanded', 'false');
  }

  toggle?.addEventListener('click', () => {
    const current = siteNav?.getAttribute('data-open') === 'true';
    siteNav?.setAttribute('data-open', String(!current));
    toggle?.setAttribute('aria-expanded', String(!current));
  });

  navMenu?.addEventListener('click', (e) => {
    const target = e.target;
    if(target instanceof HTMLAnchorElement && target.getAttribute('href')?.startsWith('#')){
      e.preventDefault();
      const id = target.getAttribute('href')?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if(el){
        const top = el.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight ?? 0) - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      closeMenu();
    }
  });
})();

// Reveal sections on scroll
(function(){
  const revealables = Array.from(document.querySelectorAll('.reveal'));
  if(revealables.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    for(const entry of entries){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.18, rootMargin: '0px 0px -10% 0px' });

  revealables.forEach(el => io.observe(el));
})();

// About section: synchronized typing animation (word-by-word) and photo slide
(function(){
  const aboutSection = document.getElementById('about');
  if(!aboutSection) return;

  const typingTarget = aboutSection.querySelector('.typing-target');
  const fullText = typingTarget?.getAttribute('data-full-text')?.trim() ?? '';
  let typingStarted = false;

  function typeWords(element, text, intervalMs){
    const words = text.split(/\s+/);
    // clear and set up a text node and a persistent caret
    element.textContent = '';
    const textNode = document.createTextNode('');
    element.appendChild(textNode);
    const existingCaret = element.querySelector('.caret');
    const caret = existingCaret instanceof HTMLElement ? existingCaret : (() => {
      const c = document.createElement('span');
      c.className = 'caret';
      element.appendChild(c);
      return c;
    })();

    let index = 0;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReduced ? 0 : intervalMs;

    function next(){
      if(index < words.length){
        const addition = (index === 0 ? '' : ' ') + words[index];
        textNode.nodeValue = (textNode.nodeValue ?? '') + addition;
        index += 1;
        if(duration === 0){
          next();
        } else {
          setTimeout(next, duration);
        }
      } else {
        // done typing, caret remains
      }
    }
    next();
  }

  const io = new IntersectionObserver((entries) => {
    for(const entry of entries){
      if(entry.isIntersecting && !typingStarted){
        typingStarted = true;
        aboutSection.classList.add('active'); // triggers photo margin transition to left
        if(typingTarget && fullText.length){
          typeWords(typingTarget, fullText, 140);
        }
        io.disconnect();
      }
    }
  }, { threshold: 0.35 });

  io.observe(aboutSection);
})();

// Footer year
(function(){
  const year = document.getElementById('year');
  if(year) year.textContent = String(new Date().getFullYear());
})();
