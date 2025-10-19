document.addEventListener('DOMContentLoaded', () => {
  console.log('Enhanced JS Loaded');

  // Smooth scrolling
  const navLinks = document.querySelectorAll('.navbar a');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 50, behavior: 'smooth' });
      }
    });
  });

  // Highlight current nav item
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = window.scrollY;
      const offset = sec.offsetTop - 100;
      const height = sec.offsetHeight;
      if (top >= offset && top < offset + height) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) link.classList.add('active');
    });
  });

  // Reveal sections on scroll
  const revealSections = document.querySelectorAll('.creative-section');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  revealSections.forEach(sec => revealObserver.observe(sec));

  // About: center photo initially, then start typing and push photo left when section is in view
  const aboutSection = document.querySelector('#about');
  const aboutContainer = document.querySelector('#about .about-container');
  const aboutTextEl = document.querySelector('#about .about-text');
  const photoEl = document.querySelector('#taher');

  if (aboutSection && aboutContainer && aboutTextEl && photoEl) {
    const fullText = aboutTextEl.textContent.trim();
    aboutTextEl.textContent = '';
    let typingStarted = false;

    const startTyping = () => {
      if (typingStarted) return;
      typingStarted = true;
      // Switch layout from centered image to normal flow so text can push image left
      aboutContainer.classList.remove('about-initial');

      let index = 0;
      const stepChars = 2; // type multiple chars per tick for speed
      const intervalMs = 10; // fast typing speed
      const timer = setInterval(() => {
        index += stepChars;
        aboutTextEl.textContent = fullText.slice(0, index);
        if (index >= fullText.length) {
          aboutTextEl.textContent = fullText; // ensure final text exact
          clearInterval(timer);
        }
      }, intervalMs);
    };

    // Trigger typing when About enters viewport
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startTyping();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(aboutSection);
  }
});
const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const response = await fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  });
  if (response.ok) {
    alert('Message sent successfully!');
    form.reset();
  } else {
    alert('Oops! Something went wrong.');
  }
});
