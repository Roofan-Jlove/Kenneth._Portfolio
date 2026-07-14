// ===== Ambient orchard light: drifts toward the cursor / touch point =====
(() => {
  const light = document.getElementById('ambientLight');
  if (!light) return;

  let destX = window.innerWidth / 2;
  let destY = window.innerHeight / 2;
  let liveX = destX;
  let liveY = destY;
  let restTimer = null;

  function moveLightTo(x, y) {
    destX = x;
    destY = y;
    light.classList.add('active');
    clearTimeout(restTimer);
    restTimer = setTimeout(() => light.classList.remove('active'), 1900);
  }

  // Pointer input on desktop
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse') moveLightTo(e.clientX, e.clientY);
  });
  window.addEventListener('mouseleave', () => light.classList.remove('active'));

  // Touch input: the light follows a finger drag/scroll
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length) moveLightTo(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length) moveLightTo(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('touchend', () => {
    restTimer = setTimeout(() => light.classList.remove('active'), 700);
  }, { passive: true });

  // Ease the glow's position toward the destination each frame
  function drift() {
    liveX += (destX - liveX) * 0.32;
    liveY += (destY - liveY) * 0.32;
    light.style.setProperty('--lx', `${liveX}px`);
    light.style.setProperty('--ly', `${liveY}px`);
    requestAnimationFrame(drift);
  }
  drift();
})();

// ===== Mobile Nav Toggle =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
}
window.addEventListener('scroll', setActiveLink);

// ===== Navbar shadow on scroll =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.35)' : 'none';
});

// ===== Back to top button =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Skill bar animation on scroll into view =====
const skillFills = document.querySelectorAll('.bar-fill');
const revealEls = document.querySelectorAll('.section-inner, .about-grid, .skills-grid, .projects-grid, .contact-grid');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.classList.contains('skills-grid')) {
        skillFills.forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ===== Contact form (client-side demo handling) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.style.color = '#ff6b6b';
    return;
  }

  // NOTE: This demo just confirms locally. To actually receive messages,
  // connect this form to a backend or a service like Formspree/EmailJS.
  formStatus.textContent = `Thanks, ${name}! Your message has been noted.`;
  formStatus.style.color = '#22c1c3';
  contactForm.reset();
});

// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();
