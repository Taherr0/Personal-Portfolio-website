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

  // Animate About section when in view
  const aboutSection = document.querySelector('#about');
  const aboutElements = document.querySelectorAll('#about img, #about p');

  aboutElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
  });

  function showAbout() {
    const rect = aboutSection.getBoundingClientRect();
    const trigger = window.innerHeight * 0.8;
    if (rect.top < trigger) {
      aboutElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'all 0.8s ease';
      });
      window.removeEventListener('scroll', showAbout);
    }
  }

  window.addEventListener('scroll', showAbout);
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
