/* ==============================================
   EGAL A — Script principal
   Système de saisons, animations, interactivité
   ============================================== */

'use strict';

/* ── Données saisonnières ── */
const SEASONS = {
  spring: {
    emoji: '🌸',
    name: 'Printemps',
    quote: 'Les bonnes affaires fleurissent !',
    collectionTitle: 'Collection Printemps',
    collectionText: 'Nouvelles arrivées printanières disponibles en boutique !',
  },
  summer: {
    emoji: '☀️',
    name: 'Été',
    quote: 'Soleil de La Baule, prix au frais !',
    collectionTitle: 'Collection Été',
    collectionText: 'Profitez de nos arrivées estivales à prix déstockage !',
  },
  autumn: {
    emoji: '🍂',
    name: 'Automne',
    quote: 'Les feuilles tombent, les prix aussi !',
    collectionTitle: 'Collection Automne',
    collectionText: 'Les nouvelles collections automne arrivent chaque semaine !',
  },
  winter: {
    emoji: '❄️',
    name: 'Hiver',
    quote: 'Le froid des températures, pas des prix !',
    collectionTitle: 'Collection Hiver',
    collectionText: 'Manteaux, pulls et accessoires de grandes marques à prix déstockage !',
  },
};

/* ── Détection automatique de la saison ── */
function detectSeason() {
  const month = new Date().getMonth(); // 0 = janvier
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

/* ── Appliquer la saison ── */
let currentSeason = detectSeason();

function applySeason(season, animate = false) {
  if (season === currentSeason && !animate) return;

  const overlay = document.getElementById('season-overlay');
  const data = SEASONS[season];
  if (!data) return;

  const doApply = () => {
    currentSeason = season;
    document.documentElement.setAttribute('data-season', season);

    // Navbar badge
    const icon = document.getElementById('season-icon');
    const name = document.getElementById('season-name');
    if (icon) icon.textContent = data.emoji;
    if (name) name.textContent = data.name;

    // Bandeau saisonnier
    const ribIcon = document.getElementById('ribbon-icon');
    const ribIcon2 = document.getElementById('ribbon-icon2');
    const ribText = document.getElementById('ribbon-text');
    if (ribIcon) ribIcon.textContent = data.emoji;
    if (ribIcon2) ribIcon2.textContent = data.emoji;
    if (ribText) ribText.textContent = `Collection ${data.name} — ${data.quote}`;

    // Carte boutique
    const bIcon = document.getElementById('boutique-season-icon');
    const bTitle = document.getElementById('boutique-season-title');
    const bText = document.getElementById('boutique-season-text');
    if (bIcon) bIcon.textContent = data.emoji;
    if (bTitle) bTitle.textContent = data.collectionTitle;
    if (bText) bText.textContent = data.collectionText;

    // Switcher boutons
    document.querySelectorAll('.ss-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.season === season);
    });

    // Regénérer les éléments du fond héros
    buildHeroBg();
  };

  if (animate && overlay) {
    overlay.classList.add('flash');
    setTimeout(() => {
      doApply();
      overlay.classList.remove('flash');
    }, 350);
  } else {
    doApply();
  }
}

/* ── Génération du fond héros (lily pads + bulles) ── */
function buildHeroBg() {
  const bg = document.getElementById('hero-bg');
  if (!bg) return;

  // Nettoyer les anciens éléments générés
  bg.querySelectorAll('.lily-pad, .bubble').forEach(el => el.remove());

  const lilyData = [
    { x: '8%',  y: '65%', size: 90,  duration: 9,  delay: 0,   rotS: '-5deg',  rotE: '8deg'  },
    { x: '82%', y: '72%', size: 130, duration: 11, delay: 1.5, rotS: '4deg',   rotE: '-6deg' },
    { x: '45%', y: '82%', size: 70,  duration: 8,  delay: 0.7, rotS: '2deg',   rotE: '10deg' },
    { x: '18%', y: '88%', size: 100, duration: 10, delay: 2,   rotS: '-8deg',  rotE: '4deg'  },
    { x: '65%', y: '58%', size: 55,  duration: 7,  delay: 1,   rotS: '6deg',   rotE: '-4deg' },
    { x: '35%', y: '55%', size: 40,  duration: 12, delay: 3,   rotS: '-3deg',  rotE: '7deg'  },
  ];

  lilyData.forEach(({ x, y, size, duration, delay, rotS, rotE }) => {
    const pad = document.createElement('div');
    pad.className = 'lily-pad';
    Object.assign(pad.style, {
      left: x,
      top: y,
      width: `${size}px`,
      height: `${size}px`,
      '--duration': `${duration}s`,
      '--delay': `${delay}s`,
      '--rot-start': rotS,
      '--rot-end': rotE,
    });
    bg.appendChild(pad);
  });

  const bubbleData = [
    { x: '12%',  size: 10, duration: 5,  delay: 0   },
    { x: '28%',  size: 7,  duration: 7,  delay: 1.5 },
    { x: '52%',  size: 13, duration: 6,  delay: 0.8 },
    { x: '73%',  size: 9,  duration: 8,  delay: 2.5 },
    { x: '88%',  size: 6,  duration: 5,  delay: 1.2 },
    { x: '40%',  size: 11, duration: 9,  delay: 3   },
    { x: '62%',  size: 8,  duration: 6,  delay: 0.3 },
  ];

  bubbleData.forEach(({ x, size, duration, delay }) => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    Object.assign(bubble.style, {
      left: x,
      bottom: '5%',
      width: `${size}px`,
      height: `${size}px`,
      '--duration': `${duration}s`,
      '--delay': `${delay}s`,
    });
    bg.appendChild(bubble);
  });
}

/* ── Navbar scroll ── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Menu burger mobile ── */
function initBurger() {
  const burger = document.getElementById('nav-burger');
  const links = document.getElementById('nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  // Fermer au clic sur un lien
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Fermer en cliquant hors du menu
  document.addEventListener('click', e => {
    if (!links.contains(e.target) && !burger.contains(e.target)) {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ── Scroll reveal (IntersectionObserver) ── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

/* ── Switcher de saison ── */
function initSeasonSwitcher() {
  document.querySelectorAll('.ss-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applySeason(btn.dataset.season, true);
    });
  });
}

/* ── Interaction grenouille (rebond au clic) ── */
function initFrogInteraction() {
  const frog = document.getElementById('hero-frog');
  if (!frog) return;

  frog.addEventListener('click', () => {
    frog.style.animationPlayState = 'paused';
    frog.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
    frog.style.transform = 'translateY(-50px) scale(1.08) rotate(5deg)';
    setTimeout(() => {
      frog.style.transform = '';
      setTimeout(() => {
        frog.style.transition = '';
        frog.style.animationPlayState = '';
      }, 400);
    }, 350);
  });
}

/* ── Année dans le footer ── */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ── Smooth scroll pour les ancres ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // hauteur navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Parallaxe légère sur le hero ── */
function initParallax() {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        heroBg.style.transform = `translateY(${y * 0.3}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ── Init globale ── */
function init() {
  applySeason(detectSeason(), false);
  buildHeroBg();
  initNavbar();
  initBurger();
  initScrollReveal();
  initSeasonSwitcher();
  initFrogInteraction();
  initSmoothScroll();
  initParallax();
  setYear();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
