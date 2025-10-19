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

  // Animate About section when in view: center img, then fast type paragraph, pushing image left
  const aboutSection = document.querySelector('#about');
  const aboutContainer = document.querySelector('#about .about-container');
  const aboutImg = document.querySelector('#taher');
  const aboutPara = document.querySelector('#about p');

  // Prepare initial states
  if (aboutContainer && aboutImg && aboutPara) {
    // Center the photo initially
    aboutContainer.classList.add('about-anim');

    // Capture full text and clear for typing
    const fullText = aboutPara.textContent.trim();
    aboutPara.dataset.fullText = fullText;
    aboutPara.textContent = '';
    // Hide paragraph so photo is perfectly centered at start
    aboutPara.style.display = 'none';
    aboutPara.classList.add('typing-caret');

    // Reveal image and paragraph smoothly when section enters view
    aboutImg.style.opacity = '0';
    aboutPara.style.opacity = '0';
    aboutImg.style.transform = 'scale(0.98)';
    aboutPara.style.transform = 'translateY(6px)';
    const reveal = () => {
      aboutImg.style.transition = 'all 500ms ease';
      aboutPara.style.transition = 'all 500ms ease';
      aboutImg.style.opacity = '1';
      aboutPara.style.opacity = '1';
      aboutImg.style.transform = 'scale(1)';
      aboutPara.style.transform = 'translateY(0)';
    };

    // Intersection Observer to trigger typing once in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal();
          // Begin typing once visible
          startTyping();
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });
    observer.observe(aboutSection);

    function startTyping() {
      const text = aboutPara.dataset.fullText || '';
      let index = 0;
      const step = () => {
        // Fast typing speed, one letter per tick
        index = Math.min(index + 1, text.length);
        if (index === 1) {
          // Show paragraph on first character so photo stays centered until typing starts
          aboutPara.style.display = 'block';
        }
        aboutPara.textContent = text.slice(0, index);

        // As text grows, allow it to take space which pushes image left
        if (index > 0) {
          aboutContainer.style.justifyContent = 'space-between';
        }

        if (index < text.length) {
          // Tight interval for fast typing
          setTimeout(step, 8);
        } else {
          // Done typing: remove caret and animation class
          aboutPara.classList.remove('typing-caret');
          aboutContainer.classList.remove('about-anim');
        }
      };
      step();
    }
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
