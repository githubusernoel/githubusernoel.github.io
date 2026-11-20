/* ===================== Utilities ===================== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ===================== Preloader ===================== */
window.addEventListener('load', () => {
  setTimeout(() => $('#preloader')?.classList.add('hidden'), 900);
});

/* ===================== Year ===================== */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===================== Scroll progress + header ===================== */
const scrollProgress = $('#scrollProgress');
const header = $('#siteHeader');
const backToTop = $('#backToTop');
function onScroll() {
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  if (scrollProgress) scrollProgress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
  if (header) header.classList.toggle('is-scrolled', scrolled > 12);
  if (backToTop) backToTop.classList.toggle('show', scrolled > 400);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===================== Custom cursor ===================== */
const cursor = $('#cursor');
const follower = $('#cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;
if (cursor && follower && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function animCursor() {
    cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%,-50%)`;
    requestAnimationFrame(animCursor);
  }
  animCursor();
  $$('a, button, .chip, .card, .skill-tab, .filter-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
  });
}

/* ===================== Nav toggle (mobile) ===================== */
const navToggle = $('#navToggle');
const siteNav = $('#siteNav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-link').forEach((l) => l.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.classList.remove('open');
  }));
}

/* ===================== Active nav on scroll ===================== */
const navLinks = $$('.nav-link');
const sections = $$('main section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
  });
}, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });
sections.forEach((s) => sectionObserver.observe(s));

/* ===================== Reveal on scroll ===================== */
const revealItems = $$('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
revealItems.forEach((item, i) => {
  item.style.transitionDelay = `${Math.min(i % 5, 4) * 70}ms`;
  revealObserver.observe(item);
});
// on-load items
window.addEventListener('load', () => {
  $$('.is-visible-on-load').forEach((item, i) => {
    item.style.transitionDelay = `${i * 120}ms`;
    item.classList.add('is-visible');
  });
});

/* ===================== Counters ===================== */
function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.nextElementSibling; // not used
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });
$$('.stat-num').forEach((el) => counterObserver.observe(el));

/* ===================== Skill tabs ===================== */
const skillTabs = $$('.skill-tab');
const skillPanels = $$('.skill-panel');
skillTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.tab;
    skillTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
    skillPanels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === key));
  });
});

/* ===================== Project filters ===================== */
const filterBtns = $$('.filter-btn');
const projectCards = $$('.project-card');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
    projectCards.forEach((card) => {
      const show = f === 'all' || card.dataset.cat === f;
      card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      if (show) {
        card.style.display = '';
        requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.96)';
        setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 350);
      }
    });
  });
});

/* ===================== 3D tilt + glow tracking ===================== */
$$('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -10;
    const ry = ((x / r.width) - 0.5) * 10;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    card.style.setProperty('--mx', (x / r.width * 100) + '%');
    card.style.setProperty('--my', (y / r.height * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===================== Magnetic buttons ===================== */
$$('[data-magnetic]').forEach((btn) => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ===================== Back to top ===================== */
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===================== Contact form ===================== */
const form = $('#contactForm');
const formStatus = $('#formStatus');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (formStatus) {
      formStatus.textContent = '✓ Message ready — wire this to your backend or mailto.';
      formStatus.style.color = 'var(--accent-3)';
    }
    form.reset();
    setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 4000);
  });
}

/* ===================== Terminal typing animation ===================== */
const terminalBody = $('#terminalBody');
const typedCmd = $('#typedCmd');

const scriptLines = [
  { cmd: 'whoami', out: 'noel — System Administrator' },
  { cmd: 'uptime', out: 'up 1825 days, load average: 0.42, 0.38, 0.35' },
  { cmd: 'systemctl status nginx', out: '● nginx.service - A high performance web server\n   Active: active (running) since Mon 2024-01-15' },
  { cmd: 'df -h /', out: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        80G   34G   43G  44% /' },
  { cmd: 'cat /etc/os-release | head -2', out: 'NAME="Ubuntu"\nVERSION="22.04.4 LTS (Jammy Jellyfish)"' },
  { cmd: 'echo "All systems operational"', out: 'All systems operational', cls: 'ok' },
];

let termIndex = 0;
function typeCommand(text, cb) {
  let i = 0;
  if (typedCmd) typedCmd.textContent = '';
  const t = setInterval(() => {
    if (i < text.length) {
      if (typedCmd) typedCmd.textContent += text[i++];
    } else {
      clearInterval(t);
      if (cb) cb();
    }
  }, 45);
}
function runTerminal() {
  if (!terminalBody) return;
  const line = scriptLines[termIndex % scriptLines.length];
  // clear previous typed cmd line? keep history
  // create command line
  const cmdLine = document.createElement('div');
  cmdLine.className = 'term-line';
  const prompt = document.createElement('span');
  prompt.className = 'prompt';
  prompt.textContent = 'noel@portfolio:~$';
  const cmd = document.createElement('span');
  cmd.className = 'cmd';
  cmdLine.appendChild(prompt);
  cmdLine.appendChild(document.createTextNode(' '));
  cmdLine.appendChild(cmd);
  terminalBody.appendChild(cmdLine);

  // type
  let i = 0;
  const t = setInterval(() => {
    if (i < line.cmd.length) {
      cmd.textContent += line.cmd[i++];
    } else {
      clearInterval(t);
      // output
      const out = document.createElement('div');
      out.className = 'term-out' + (line.cls === 'ok' ? '' : '');
      if (line.cls === 'err') out.classList.add('err');
      out.textContent = line.out;
      terminalBody.appendChild(out);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      termIndex++;
      setTimeout(runTerminal, 1400);
    }
  }, 45);
}
// Start terminal when in view
const termEl = $('#terminal');
if (termEl) {
  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (terminalBody) terminalBody.innerHTML = '';
        runTerminal();
        termObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  termObserver.observe(termEl);
}
// remove initial placeholder line already in HTML? It contains caret; we'll leave first cmd slot
// Hide the static typedCmd caret container after first run by clearing? Keep as is.

/* ===================== Mini terminal uptime ticker ===================== */
const miniTerm = $('#miniTerminal');
if (miniTerm) {
  let upDays = 1825;
  setInterval(() => {
    upDays += 0; // keep stable
  }, 60000);
}

/* ===================== Typed name (subtle) ===================== */
const typedName = $('#typedName');
if (typedName) {
  const roles = ['Noel', 'Noel.', 'Noel'];
  // keep static name; no-op for stability
}

/* ===================== Parallax orbs on mouse ===================== */
if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    $$('.orb').forEach((o, i) => {
      o.style.transform = `translate(${x * (i + 1) * 0.4}px, ${y * (i + 1) * 0.4}px)`;
    });
  });
}