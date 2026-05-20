/* ==============================================
   EGAL A — Script principal
   Saisons · Particules · Jeu grenouille
   ============================================== */
'use strict';

/* ──────────────────────────────────────────────
   DONNÉES SAISONNIÈRES
   ────────────────────────────────────────────── */
const SEASONS = {
  spring: {
    emoji:'🌸', name:'Printemps',
    quote:'Les bonnes affaires fleurissent !',
    collectionTitle:'Collection Printemps',
    collectionText:'Nouvelles arrivées printanières disponibles dès maintenant !',
    ribbonItems:['🌸','Collection Printemps — Les bonnes affaires fleurissent !','🌸','Egal A — La Baule','🐸','Des grandes marques, des petits prix','🌸'],
    particles:{ emoji:'🌸', count:18, spin:true,  drift:40,  minDur:6,  maxDur:12 },
    speeches:['Ribbit !','Coucou !','Bonne affaire !','🌸 Magnifique !','C\'est le printemps !'],
  },
  summer: {
    emoji:'☀️', name:'Été',
    quote:'Soleil de La Baule, prix au frais !',
    collectionTitle:'Collection Été',
    collectionText:'Profitez de nos arrivées estivales à prix déstockage !',
    ribbonItems:['☀️','Collection Été — Soleil de La Baule, prix au frais !','☀️','Egal A — La Baule','🐸','Des grandes marques, des petits prix','☀️'],
    particles:{ emoji:'⭐', count:14, spin:false, drift:20,  minDur:4,  maxDur:9  },
    speeches:['Splash !','Ribbit soleil !','Beach vibes 🏖️','On est bien ici !','Cowabunga !'],
  },
  autumn: {
    emoji:'🍂', name:'Automne',
    quote:'Les feuilles tombent, les prix aussi !',
    collectionTitle:'Collection Automne',
    collectionText:'Nouvelles collections automne disponibles chaque semaine !',
    ribbonItems:['🍂','Collection Automne — Les feuilles tombent, les prix aussi !','🍂','Egal A — La Baule','🐸','Des grandes marques, des petits prix','🍁'],
    particles:{ emoji:'🍂', count:22, spin:true,  drift:60,  minDur:5,  maxDur:11 },
    speeches:['Ribbit !','Cosy & stylé !','🍂 Magnifique !','Promo feuillue !','On aime l\'automne !'],
  },
  winter: {
    emoji:'❄️', name:'Hiver',
    quote:'Le froid des températures, pas des prix !',
    collectionTitle:'Collection Hiver',
    collectionText:'Manteaux, pulls et accessoires à prix déstockage !',
    ribbonItems:['❄️','Collection Hiver — Le froid des températures, pas des prix !','❄️','Egal A — La Baule','🐸','Des grandes marques, des petits prix','⛄'],
    particles:{ emoji:'❄️', count:28, spin:false, drift:25,  minDur:5,  maxDur:13 },
    speeches:['Brrr... ribbit !','Chaud dedans !','❄️ Féerique !','On est au chaud ici !','Froid dehors, prix froids !'],
  },
};

/* ──────────────────────────────────────────────
   DÉTECTION SAISON
   ────────────────────────────────────────────── */
function detectSeason() {
  const m = new Date().getMonth(); // 0-based
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'autumn';
  return 'winter';
}

/* ──────────────────────────────────────────────
   APPLICATION DE LA SAISON
   ────────────────────────────────────────────── */
let currentSeason = detectSeason();

function applySeason(season, animate = false) {
  const data = SEASONS[season];
  if (!data) return;

  const doApply = () => {
    currentSeason = season;
    document.documentElement.setAttribute('data-season', season);

    // Navbar badge
    setText('badge-icon',  data.emoji);
    setText('badge-name',  data.name);

    // Bandeau
    const ribbonItems = data.ribbonItems;
    const track = document.getElementById('ribbon-track');
    if (track) {
      // Dupliquer pour boucle infinie
      const allItems = [...ribbonItems, ...ribbonItems, ...ribbonItems];
      track.innerHTML = allItems.map(t => `<span>${t}</span>`).join('');
    }

    // Infos boutique — carte saison
    setText('info-season-icon',  data.emoji);
    setText('info-season-title', data.collectionTitle);
    setText('info-season-text',  data.collectionText);

    // Switcher boutons
    document.querySelectorAll('.ss-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.season === season);
    });

    // Accessoires grenouille
    document.querySelectorAll('.acc-spring,.acc-summer,.acc-autumn,.acc-winter').forEach(el => {
      el.setAttribute('opacity', '0');
    });
    const accEl = document.querySelector(`.acc-${season}`);
    if (accEl) accEl.setAttribute('opacity', '1');

    // Particules
    buildParticles(season);

    // Fond hero
    buildHeroBg();
  };

  const overlay = document.getElementById('season-overlay');
  if (animate && overlay) {
    overlay.classList.add('flash');
    setTimeout(() => { doApply(); overlay.classList.remove('flash'); }, 380);
  } else {
    doApply();
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ──────────────────────────────────────────────
   PARTICULES SAISONNIÈRES
   ────────────────────────────────────────────── */
function buildParticles(season) {
  const layer = document.getElementById('particles-layer');
  if (!layer) return;
  layer.innerHTML = '';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cfg = SEASONS[season]?.particles;
  if (!cfg) return;

  for (let i = 0; i < cfg.count; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    el.textContent = cfg.emoji;

    const dur    = cfg.minDur + Math.random() * (cfg.maxDur - cfg.minDur);
    const delay  = Math.random() * -dur * 1.5; // démarrage aléatoire dans le cycle
    const left   = Math.random() * 100;
    const size   = 0.7 + Math.random() * 1.1;
    const drift  = (Math.random() - 0.5) * 2 * cfg.drift;
    const spin   = cfg.spin ? (Math.random() * 360 - 180) + 'deg' : '0deg';

    Object.assign(el.style, {
      left: `${left}%`,
      fontSize: `${size}rem`,
      animationDuration: `${dur}s`,
      animationDelay: `${delay}s`,
      '--drift': `${drift}px`,
      '--spin': spin,
    });
    layer.appendChild(el);
  }
}

/* ──────────────────────────────────────────────
   FOND HERO (lily pads + bulles)
   ────────────────────────────────────────────── */
function buildHeroBg() {
  const bg = document.getElementById('hero-bg');
  if (!bg) return;
  bg.querySelectorAll('.lily-pad,.bubble-el').forEach(el => el.remove());

  const lily = [
    { x:'8%',  y:'62%', s:95,  dur:9,  del:0,   r0:'-6deg',  r1:'7deg'  },
    { x:'80%', y:'70%', s:130, dur:11, del:1.5, r0:'4deg',   r1:'-6deg' },
    { x:'42%', y:'80%', s:65,  dur:8,  del:.7,  r0:'3deg',   r1:'10deg' },
    { x:'20%', y:'85%', s:100, dur:10, del:2,   r0:'-8deg',  r1:'5deg'  },
    { x:'62%', y:'55%', s:52,  dur:7,  del:1,   r0:'6deg',   r1:'-3deg' },
    { x:'33%', y:'52%', s:42,  dur:13, del:3,   r0:'-2deg',  r1:'8deg'  },
  ];
  lily.forEach(({ x,y,s,dur,del,r0,r1 }) => {
    const el = document.createElement('div');
    el.className = 'lily-pad';
    Object.assign(el.style, {
      left:x, top:y,
      width:`${s}px`, height:`${s}px`,
      '--dur':`${dur}s`, '--del':`${del}s`, '--r0':r0, '--r1':r1,
    });
    bg.appendChild(el);
  });

  const bubs = [
    { x:'10%',  s:10, dur:5,  del:0   },
    { x:'25%',  s:7,  dur:7,  del:1.5 },
    { x:'50%',  s:13, dur:6,  del:.8  },
    { x:'70%',  s:9,  dur:8,  del:2.5 },
    { x:'87%',  s:6,  dur:5,  del:1.2 },
    { x:'40%',  s:11, dur:9,  del:3   },
    { x:'60%',  s:8,  dur:6,  del:.3  },
  ];
  bubs.forEach(({ x,s,dur,del }) => {
    const el = document.createElement('div');
    el.className = 'bubble-el';
    Object.assign(el.style, {
      left:x, bottom:'6%',
      width:`${s}px`, height:`${s}px`,
      '--dur':`${dur}s`, '--del':`${del}s`,
    });
    bg.appendChild(el);
  });
}

/* ──────────────────────────────────────────────
   JEU GRENOUILLE — grenouilles cachées
   ────────────────────────────────────────────── */
let frogsFound = 0;
const TOTAL_FROGS = 5;

function initFrogGame() {
  document.querySelectorAll('.hidden-frog').forEach(frog => {
    frog.addEventListener('click', e => onHiddenFrogClick(e, frog));
  });
  updateFrogCounter();
}

function onHiddenFrogClick(e, frog) {
  e.stopPropagation();
  if (frog.classList.contains('found')) return;

  frog.classList.add('found');
  frogsFound++;
  updateFrogCounter();
  spawnConfettiAt(e.clientX, e.clientY);

  if (frogsFound >= TOTAL_FROGS) {
    setTimeout(showAchievement, 800);
  }
}

function updateFrogCounter() {
  setText('frog-count', frogsFound);
  const counter = document.getElementById('frog-counter');
  if (counter) {
    counter.classList.add('bump');
    setTimeout(() => counter.classList.remove('bump'), 300);
  }
}

function showAchievement() {
  const popup = document.getElementById('achievement-popup');
  if (popup) {
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
  }
}

document.addEventListener('click', e => {
  const btn = e.target.closest('#achievement-close');
  if (btn) {
    const popup = document.getElementById('achievement-popup');
    if (popup) { popup.classList.remove('show'); popup.setAttribute('aria-hidden','true'); }
  }
});

/* ──────────────────────────────────────────────
   CONFETTIS / MINI GRENOUILLES AU CLIC
   ────────────────────────────────────────────── */
function spawnConfettiAt(x, y) {
  const emojis = ['🐸','✨','🎉','💚'];
  const count = 6;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'mini-frog-pop';
    el.textContent = emojis[i % emojis.length];
    const angle = (360 / count) * i + Math.random() * 20 - 10;
    const dist  = 60 + Math.random() * 60;
    const rad   = angle * Math.PI / 180;
    const tx    = Math.cos(rad) * dist;
    const ty    = Math.sin(rad) * dist;
    Object.assign(el.style, {
      left: `${x}px`, top: `${y}px`,
      '--tx': `${tx}px`, '--ty': `${ty}px`,
      '--tr': `${(Math.random()-0.5)*120}deg`,
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }
}

/* ──────────────────────────────────────────────
   GRENOUILLE PRINCIPALE — interactions
   ────────────────────────────────────────────── */
let winkTimer = null;
let speechTimer = null;

function initMainFrog() {
  const frog = document.getElementById('main-frog');
  const hero = document.querySelector('.hero');
  if (!frog) return;

  // Clic : saut + mini grenouilles
  frog.addEventListener('click', e => {
    e.stopPropagation();
    frog.classList.remove('click-jump');
    void frog.offsetWidth; // reflow pour relancer l'animation
    frog.classList.add('click-jump');
    frog.addEventListener('animationend', () => frog.classList.remove('click-jump'), { once: true });

    // Spawn 3 mini grenouilles depuis la position de la grenouille
    const rect = frog.getBoundingClientRect();
    spawnMiniFromFrog(rect.left + rect.width / 2, rect.top + rect.height / 3, 5);
    showSpeech();
  });

  // Clic sur le hero (hors grenouille) → ripple
  if (hero) {
    hero.addEventListener('click', e => {
      if (e.target.closest('.main-frog,.hidden-frog,.hero-btns,.scroll-hint')) return;
      createHeroRipple(e.clientX, e.clientY, hero);
    });
  }

  // Clin d'œil périodique
  scheduleWink(frog);
  // Ribbit périodique
  scheduleSpeech();
}

function spawnMiniFromFrog(cx, cy, count) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'mini-frog-pop';
    el.textContent = '🐸';
    const angle = (360 / count) * i + Math.random() * 30;
    const dist  = 70 + Math.random() * 80;
    const rad   = angle * Math.PI / 180;
    Object.assign(el.style, {
      left: `${cx}px`, top: `${cy}px`,
      '--tx': `${Math.cos(rad)*dist}px`,
      '--ty': `${Math.sin(rad)*dist}px`,
      '--tr': `${(Math.random()-0.5)*180}deg`,
      animationDuration: `${.6+Math.random()*.4}s`,
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }
}

function createHeroRipple(x, y, hero) {
  const rect = hero.getBoundingClientRect();
  const el   = document.createElement('div');
  el.className = 'hero-click-ripple';
  Object.assign(el.style, {
    left: `${x - rect.left}px`,
    top:  `${y - rect.top}px`,
  });
  hero.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

function scheduleWink(frog) {
  clearTimeout(winkTimer);
  winkTimer = setTimeout(() => {
    frog.classList.add('winking');
    setTimeout(() => {
      frog.classList.remove('winking');
      scheduleWink(frog);
    }, 400);
  }, 7000 + Math.random() * 6000);
}

function scheduleSpeech() {
  clearTimeout(speechTimer);
  speechTimer = setTimeout(() => {
    showSpeech();
    scheduleSpeech();
  }, 10000 + Math.random() * 8000);
}

function showSpeech() {
  const bubble = document.getElementById('speech-bubble');
  const textEl = document.getElementById('speech-text');
  if (!bubble || !textEl) return;

  const speeches = SEASONS[currentSeason]?.speeches || ['Ribbit !'];
  const msg = speeches[Math.floor(Math.random() * speeches.length)];
  textEl.textContent = msg;
  bubble.classList.add('visible');
  setTimeout(() => bubble.classList.remove('visible'), 2500);
}

/* ──────────────────────────────────────────────
   NAVBAR SCROLL
   ────────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
}

/* ──────────────────────────────────────────────
   MENU BURGER MOBILE
   ────────────────────────────────────────────── */
function initBurger() {
  const burger = document.getElementById('nav-burger');
  const links  = document.getElementById('nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    })
  );
  document.addEventListener('click', e => {
    if (!links.contains(e.target) && !burger.contains(e.target)) {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded','false');
    }
  });
}

/* ──────────────────────────────────────────────
   SCROLL REVEAL
   ────────────────────────────────────────────── */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold:.1, rootMargin:'0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
}

/* ──────────────────────────────────────────────
   SWITCHER SAISON
   ────────────────────────────────────────────── */
function initSeasonSwitcher() {
  document.querySelectorAll('.ss-btn').forEach(btn => {
    btn.addEventListener('click', () => applySeason(btn.dataset.season, true));
  });
}

/* ──────────────────────────────────────────────
   SMOOTH SCROLL
   ────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth' });
    });
  });
}

/* ──────────────────────────────────────────────
   PARALLAXE HERO LÉGÈRE
   ────────────────────────────────────────────── */
function initParallax() {
  const bg = document.getElementById('hero-bg');
  if (!bg || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        bg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive:true });
}

/* ──────────────────────────────────────────────
   CURSEUR GRENOUILLE (seulement sur hero/desktop)
   ────────────────────────────────────────────── */
function initFrogCursor() {
  if (window.innerWidth < 768) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed; font-size:1.4rem; pointer-events:none; z-index:9998;
    transition:transform .12s ease, opacity .2s ease;
    transform:translate(-50%,-50%) scale(0);
    opacity:0;
  `;
  cursor.textContent = '🐸';
  document.body.appendChild(cursor);

  hero.addEventListener('mousemove', e => {
    cursor.style.left  = `${e.clientX}px`;
    cursor.style.top   = `${e.clientY}px`;
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.opacity = '1';
  });
  hero.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(0)';
    cursor.style.opacity = '0';
  });
}

/* ──────────────────────────────────────────────
   TICKER GRENOUILLE — survol ralentit
   ────────────────────────────────────────────── */
function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

/* ──────────────────────────────────────────────
   EASTER EGG — logo click
   ────────────────────────────────────────────── */
let logoClickCount = 0;
function initLogoEasterEgg() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickCount >= 5) {
      logoClickCount = 0;
      showSpeech();
      spawnConfettiAt(window.innerWidth/2, 80);
    }
  });
}

/* ──────────────────────────────────────────────
   ANNÉE FOOTER
   ────────────────────────────────────────────── */
function setYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ──────────────────────────────────────────────
   INIT GLOBALE
   ────────────────────────────────────────────── */
function init() {
  applySeason(detectSeason(), false);
  initNavbar();
  initBurger();
  initScrollReveal();
  initSeasonSwitcher();
  initMainFrog();
  initFrogGame();
  initSmoothScroll();
  initParallax();
  initFrogCursor();
  initTicker();
  initLogoEasterEgg();
  setYear();

  // Première bulle après 3s
  setTimeout(showSpeech, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
