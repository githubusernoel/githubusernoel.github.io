document.getElementById('year').textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.16,
  rootMargin: '0px 0px -60px 0px'
});

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(item);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute('id');
    const currentLink = document.querySelector(`.site-nav a[href="#${id}"]`);

    if (!currentLink) {
      return;
    }

    if (entry.isIntersecting) {
      navLinks.forEach((link) => link.classList.remove('is-active'));
      currentLink.classList.add('is-active');
    }
  });
}, {
  threshold: 0.45
});

sections.forEach((section) => sectionObserver.observe(section));
