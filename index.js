/* =====================================================
   PRANK WEBSITE — index.js  (ULTIMATE EDITION 💀)
   ===================================================== */

// ── Elements ──────────────────────────────────────────
const yesBtn             = document.getElementById('yesBtn');
const noBtn              = document.getElementById('noBtn');
const celebration        = document.getElementById('celebration');
const confettiBox        = document.getElementById('confetti-container');
const noAttempts         = document.getElementById('noAttempts');
const subtitle           = document.getElementById('subtitle');
const allStuff           = document.getElementById('allStuff');
const mainTitle          = document.getElementById('mainTitle');
const attemptCounter     = document.getElementById('attemptCounter');
const attemptNum         = document.getElementById('attemptNum');
const attemptComment     = document.getElementById('attemptComment');
const fakeLoader         = document.getElementById('fakeLoader');
const loaderFill         = document.getElementById('loaderFill');
const loaderText         = document.getElementById('loaderText');
const interventionModal  = document.getElementById('interventionModal');
const modalClose         = document.getElementById('modalClose');
const restrainingModal   = document.getElementById('restrainingModal');
const restrainingClose   = document.getElementById('restrainingClose');
const screamBubble       = document.getElementById('screamBubble');
const trailContainer     = document.getElementById('trail-container');
const fireworksCanvas    = document.getElementById('fireworksCanvas');
const ctx                = fireworksCanvas.getContext('2d');

// ── State ─────────────────────────────────────────────
let noCount       = 0;
let yesFontSize   = 2;        // rem
let isMobile      = false;
let noBtnRunning  = false;
let loaderTimer   = null;
let loaderPct     = 0;
let discoTimeout  = null;
let fireworksRAF  = null;
let particles     = [];

// ── Mobile detection ──────────────────────────────────
function checkMobile() {
  isMobile = ('ontouchstart' in window) || window.innerWidth <= 768;
}
checkMobile();
window.addEventListener('resize', () => { checkMobile(); resizeCanvas(); });

// ── Taunts & titles ───────────────────────────────────
const taunts = [
  "Nope, that button is NOT for you 😏",
  "Nice try! 😂",
  "You can't catch it! 🏃‍♂️💨",
  "Hehehe… almost! 😈",
  "The button said RUN 😂",
  "Are you SURE you want that one? 👀",
  "It's faster than you! 🚀",
  "It doesn't want to be clicked! 😅",
  "You'll NEVER catch it muahahaha 🦹",
  "Give up and click YES already!! 🥹",
  "Okay this is getting embarrassing for you 💀",
  "THE ANSWER IS YES. JUST DO IT. 💖",
  "Why are you like this 😭",
  "I believe in you… just kidding click YES 😂",
  "The No button has hired a lawyer 📋",
  "No button speed: MAXIMUM 🏎️",
];

const counterComments = [
  "Interesting choice.",
  "You okay?",
  "Getting desperate? 👀",
  "…Really?",
  "Embarrassing. 😬",
  "Oh honey… 😬",
  "This is concerning 🚨",
  "A cry for help? 🆘",
  "Unbelievable. Truly.",
  "The audacity 💅",
];

const titleProgression = [
  "Do you love me? 💕",
  "Do you love me?? 💕💕",
  "Please say yes 🥺",
  "PLEASE say yes 🥺💖",
  "I'm begging you 😭💕",
  "You KNOW the answer!! 😭💖",
  "JUST CLICK YES ALREADY 😭💖💖",
];

const subtitleTexts = [
  "Be honest… 👀",
  "Think carefully… 🤔",
  "The right answer is obvious 😇",
  "You know what to pick 💕",
  "Choose wisely… or else 👀",
  "One of these buttons loves you back 💖",
  "No pressure… okay a little pressure 😅",
];

const loaderMessages = [
  "Processing your terrible decision…",
  "Calculating your mistakes…",
  "Consulting a therapist for you…",
  "Verifying you actually mean No…",
  "Searching for common sense…",
  "Loading: Bad Life Choice™",
];

const trailEmojis = ['😢','💔','🙅','❌','😤','🚫','😬','💀','👎'];

// ── Falling hearts (background) ───────────────────────
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.left             = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
  heart.style.fontSize          = (Math.random() * 1.2 + 0.8) + 'rem';
  const emojis = ['💗','💖','💓','💝','💕','🩷','💞'];
  heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  document.getElementById('hearts-container').appendChild(heart);
  setTimeout(() => heart.remove(), 7000);
}
setInterval(createHeart, 400);

// ── Subtitle cycling ──────────────────────────────────
let subtitleIdx = 0;
setInterval(() => {
  subtitleIdx = (subtitleIdx + 1) % subtitleTexts.length;
  subtitle.style.opacity = '0';
  setTimeout(() => {
    subtitle.textContent  = subtitleTexts[subtitleIdx];
    subtitle.style.opacity = '1';
  }, 300);
}, 4000);

// ── Grow YES button ────────────────────────────────────
function growYes() {
  yesFontSize = Math.min(yesFontSize + 0.3, 4.5);
  yesBtn.style.fontSize = yesFontSize + 'rem';
  yesBtn.style.padding  = `${18 + noCount * 2}px ${24 + noCount * 3}px`;
}

// ── Shrink NO button ───────────────────────────────────
function shrinkNo() {
  const currentSize = Math.max(0.7, 1.4 - noCount * 0.06);
  noBtn.style.fontSize = currentSize + 'rem';
  noBtn.style.opacity  = Math.max(0.5, 1 - noCount * 0.03) + '';
}

// ── Update attempt counter ─────────────────────────────
function updateCounter() {
  attemptCounter.style.display = 'block';
  attemptNum.textContent       = noCount;
  const idx = Math.min(noCount - 1, counterComments.length - 1);
  attemptComment.textContent   = counterComments[idx];
  // Re-trigger animation
  attemptCounter.style.animation = 'none';
  void attemptCounter.offsetWidth;
  attemptCounter.style.animation = '';
}

// ── Update title ───────────────────────────────────────
function updateTitle() {
  const idx = Math.min(noCount, titleProgression.length - 1);
  mainTitle.textContent = titleProgression[idx];
}

// ── Taunt text ─────────────────────────────────────────
function showTaunt() {
  const idx = Math.min(noCount - 1, taunts.length - 1);
  noAttempts.textContent = taunts[idx];
  noAttempts.style.animation = 'none';
  void noAttempts.offsetWidth;
  noAttempts.style.animation = '';
}

// ── Shake screen ───────────────────────────────────────
function shakeScreen() {
  allStuff.classList.remove('shake');
  void allStuff.offsetWidth;
  allStuff.classList.add('shake');
  setTimeout(() => allStuff.classList.remove('shake'), 500);
}

// ── Background tint (gets redder) ─────────────────────
function tintBackground() {
  const intensity = Math.min(noCount * 3, 40);
  document.body.style.backgroundColor = `hsl(340, ${50 + intensity}%, ${97 - intensity * 0.4}%)`;
}

// ── Emoji trail from No button ─────────────────────────
function spawnTrail(x, y) {
  const count = 5;
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.classList.add('trail-emoji');
      el.textContent  = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
      el.style.left   = (x + (Math.random() - 0.5) * 40) + 'px';
      el.style.top    = (y + (Math.random() - 0.5) * 40) + 'px';
      el.style.animationDuration = (Math.random() * 0.5 + 0.8) + 's';
      trailContainer.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }, i * 60);
  }
}

// ── Scream bubble near No ──────────────────────────────
let screamVisible = false;
function showScream(x, y) {
  if (screamVisible) return;
  screamVisible = true;
  screamBubble.style.left = (x - 20) + 'px';
  screamBubble.style.top  = (y - 50) + 'px';
  screamBubble.classList.remove('show');
  void screamBubble.offsetWidth;
  screamBubble.classList.add('show');
  setTimeout(() => {
    screamBubble.classList.remove('show');
    setTimeout(() => { screamVisible = false; }, 200);
  }, 600);
}

// ── Fake loading bar ───────────────────────────────────
function showFakeLoader() {
  loaderText.textContent = loaderMessages[Math.floor(Math.random() * loaderMessages.length)];
  fakeLoader.classList.add('show');
  loaderPct = 0;
  loaderFill.style.width = '0%';
  clearInterval(loaderTimer);
  loaderTimer = setInterval(() => {
    loaderPct += Math.random() * 12;
    if (loaderPct >= 95) {
      loaderPct = 0;
      loaderFill.style.width = '0%';
      loaderText.textContent = loaderMessages[Math.floor(Math.random() * loaderMessages.length)];
    }
    loaderFill.style.width = loaderPct + '%';
  }, 150);
}

function hideFakeLoader() {
  fakeLoader.classList.remove('show');
  clearInterval(loaderTimer);
}

// ── Intervention modal (5 attempts) ───────────────────
function checkInterventions() {
  if (noCount === 5) {
    setTimeout(() => interventionModal.classList.add('show'), 300);
  }
  if (noCount === 10) {
    setTimeout(() => restrainingModal.classList.add('show'), 300);
  }
}

modalClose.addEventListener('click', () => interventionModal.classList.remove('show'));
restrainingClose.addEventListener('click', () => restrainingModal.classList.remove('show'));

// ── All the "No was attempted" effects ────────────────
function onNoAttempted(x, y) {
  noCount++;
  growYes();
  shrinkNo();
  showTaunt();
  updateCounter();
  updateTitle();
  shakeScreen();
  tintBackground();
  spawnTrail(x, y);
  showFakeLoader();
  checkInterventions();
}

// =========================================================
// DESKTOP: No button runs on hover / mousedown
// =========================================================
function getRandomPos(btnW, btnH) {
  const m   = 16;
  const maxX = window.innerWidth  - btnW - m;
  const maxY = window.innerHeight - btnH - m;
  return {
    x: Math.random() * (maxX - m) + m,
    y: Math.random() * (maxY - m) + m,
  };
}

function makeNoRunning() {
  if (noBtnRunning) return;
  noBtnRunning = true;
  const rect = noBtn.getBoundingClientRect();
  noBtn.classList.add('running');
  noBtn.style.left = rect.left + 'px';
  noBtn.style.top  = rect.top  + 'px';
}

function moveNoTo(x, y) {
  noBtn.style.left = x + 'px';
  noBtn.style.top  = y + 'px';
}

document.addEventListener('mousemove', (e) => {
  if (isMobile) return;
  const rect = noBtn.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const dx   = e.clientX - cx;
  const dy   = e.clientY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 140) {
    showScream(cx, cy);
    makeNoRunning();
    const pos = getRandomPos(noBtn.offsetWidth, noBtn.offsetHeight);
    const trail_x = rect.left + rect.width / 2;
    const trail_y = rect.top  + rect.height / 2;
    spawnTrail(trail_x, trail_y);
    moveNoTo(pos.x, pos.y);

    // Show loader when hovering near No
    showFakeLoader();
  } else {
    hideFakeLoader();
  }
});

noBtn.addEventListener('mousedown', (e) => {
  e.preventDefault();
  const rect = noBtn.getBoundingClientRect();
  onNoAttempted(rect.left + rect.width / 2, rect.top + rect.height / 2);
  makeNoRunning();
  const pos = getRandomPos(noBtn.offsetWidth, noBtn.offsetHeight);
  moveNoTo(pos.x, pos.y);
});

noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

// =========================================================
// MOBILE: No button teleports on touch
// =========================================================
function teleportNoBtn() {
  makeNoRunning();
  const btnW = noBtn.offsetWidth  || 100;
  const btnH = noBtn.offsetHeight || 50;

  let x, y, tries = 0;
  do {
    x = Math.random() * (window.innerWidth  - btnW - 20) + 10;
    y = Math.random() * (window.innerHeight - btnH - 20) + 10;
    tries++;
  } while (tries < 15 && Math.abs(x + btnW/2 - window.innerWidth/2) < 80
                       && Math.abs(y + btnH/2 - window.innerHeight/2) < 80);

  noBtn.classList.remove('teleport-flash');
  void noBtn.offsetWidth;
  noBtn.classList.add('teleport-flash');
  noBtn.style.left = x + 'px';
  noBtn.style.top  = y + 'px';
}

noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  onNoAttempted(t.clientX, t.clientY);
  teleportNoBtn();
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (!isMobile) return;
  const touch = e.touches[0];
  const rect  = noBtn.getBoundingClientRect();
  const inX   = touch.clientX >= rect.left - 25 && touch.clientX <= rect.right  + 25;
  const inY   = touch.clientY >= rect.top  - 25 && touch.clientY <= rect.bottom + 25;
  if (inX && inY) {
    teleportNoBtn();
    spawnTrail(touch.clientX, touch.clientY);
  }
}, { passive: true });

// =========================================================
// YES button — CELEBRATION
// =========================================================
function triggerCelebration() {
  celebration.classList.add('show');
  launchConfetti();
  startFireworks();
  triggerDisco();
  for (let i = 0; i < 20; i++) setTimeout(createHeart, i * 70);
}

yesBtn.addEventListener('click', triggerCelebration);
yesBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  triggerCelebration();
}, { passive: false });

// =========================================================
// CONFETTI
// =========================================================
const CONFETTI_COLORS = [
  '#ff3385','#ff6bae','#ff90c8','#ffb3d1',
  '#ff6b6b','#ffd93d','#6bcb77','#4d96ff',
  '#d63384','#c77dff','#ff9f45','#00b4d8',
];

function launchConfetti() {
  for (let i = 0; i < 180; i++) {
    setTimeout(spawnConfetti, Math.random() * 1500);
  }
}

function spawnConfetti() {
  const el   = document.createElement('div');
  el.className = 'confetti-piece';
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const dur   = Math.random() * 2.5 + 2;
  const size  = Math.random() * 8 + 6;
  const useEmoji = Math.random() > 0.72;

  if (useEmoji) {
    const emojis = ['💖','💗','🎉','✨','💕','🩷','💫','🎊','⭐'];
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.cssText = `
      left:${Math.random()*100}vw;
      font-size:${size+4}px;
      animation-duration:${dur}s;
    `;
  } else {
    el.style.cssText = `
      left:${Math.random()*100}vw;
      background:${color};
      width:${size}px;
      height:${size*1.6}px;
      border-radius:${Math.random()>0.5?'50%':'2px'};
      animation-duration:${dur}s;
      transform:rotate(${Math.random()*360}deg);
    `;
  }
  confettiBox.appendChild(el);
  setTimeout(() => el.remove(), (dur + 0.5) * 1000);
}

// =========================================================
// FIREWORKS
// =========================================================
function resizeCanvas() {
  fireworksCanvas.width  = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}
resizeCanvas();

class Particle {
  constructor(x, y, color) {
    this.x     = x;
    this.y     = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx    = Math.cos(angle) * speed;
    this.vy    = Math.sin(angle) * speed;
    this.life  = 1;
    this.decay = Math.random() * 0.02 + 0.012;
    this.size  = Math.random() * 4 + 2;
    this.gravity = 0.12;
  }
  update() {
    this.vy   += this.gravity;
    this.x    += this.vx;
    this.y    += this.vy;
    this.life -= this.decay;
    this.vx   *= 0.98;
  }
  draw(c) {
    c.save();
    c.globalAlpha = Math.max(0, this.life);
    c.fillStyle   = this.color;
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

function launchFirework() {
  const x     = Math.random() * fireworksCanvas.width;
  const y     = Math.random() * fireworksCanvas.height * 0.6;
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  for (let i = 0; i < 70; i++) {
    particles.push(new Particle(x, y, color));
  }
}

let fireworkInterval = null;

function startFireworks() {
  fireworkInterval = setInterval(launchFirework, 500);
  launchFirework(); launchFirework(); launchFirework();

  function loop() {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => { p.update(); p.draw(ctx); });
    fireworksRAF = requestAnimationFrame(loop);
  }
  loop();

  // Stop after 6s
  setTimeout(() => {
    clearInterval(fireworkInterval);
    setTimeout(() => {
      cancelAnimationFrame(fireworksRAF);
      ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    }, 3000);
  }, 6000);
}

// =========================================================
// DISCO MODE (after Yes)
// =========================================================
function triggerDisco() {
  document.body.classList.add('disco');
  clearTimeout(discoTimeout);
  discoTimeout = setTimeout(() => {
    document.body.classList.remove('disco');
    document.body.style.backgroundColor = '';
  }, 4000);
}
