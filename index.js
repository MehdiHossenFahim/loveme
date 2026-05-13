// ── Elements ──────────────────────────────────
const yesBtn       = document.getElementById('yesBtn');
const noBtn        = document.getElementById('noBtn');
const celebration  = document.getElementById('celebration');
const confettiBox  = document.getElementById('confetti-container');
const noAttempts   = document.getElementById('noAttempts');
const subtitle     = document.getElementById('subtitle');

// ── State ─────────────────────────────────────
let noCount        = 0;
let yesFontSize    = 2;        
let isMobile       = false;
let noBtnRunning   = false;

// ── Taunts ────────────────────────────────────
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
];

const subtitleTexts = [
  "Be honest… 👀",
  "Think carefully… 🤔",
  "The right answer is obvious 😇",
  "You know what to pick 💕",
  "Choose wisely… or else 👀",
];

// ── Detect mobile/touch ───────────────────────
function checkMobile() {
  isMobile = ('ontouchstart' in window) || window.innerWidth <= 768;
}
checkMobile();
window.addEventListener('resize', checkMobile);

// ── Falling hearts (background) ───────────────
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.style.left             = Math.random() * 100 + 'vw';
  heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
  heart.style.fontSize          = (Math.random() * 1.2 + 0.8) + 'rem';
  heart.style.opacity           = Math.random() * 0.5 + 0.3;
  const emojis = ['💗','💖','💓','💝','💕','🩷','❤️','💞'];
  heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  document.getElementById('hearts-container').appendChild(heart);
  setTimeout(() => heart.remove(), 7000);
}
setInterval(createHeart, 400);

// ── Cycle subtitle text ───────────────────────
let subtitleIdx = 0;
setInterval(() => {
  subtitleIdx = (subtitleIdx + 1) % subtitleTexts.length;
  subtitle.style.opacity = '0';
  setTimeout(() => {
    subtitle.textContent  = subtitleTexts[subtitleIdx];
    subtitle.style.opacity = '1';
  }, 300);
}, 4000);

// ── Grow YES button ────────────────────────────
function growYes() {
  yesFontSize = Math.min(yesFontSize + 0.35, 4.5);
  yesBtn.style.fontSize = yesFontSize + 'rem';
  yesBtn.style.padding  = `${18 + noCount * 3}px ${24 + noCount * 4}px`;
}

// ── Show taunt ────────────────────────────────
function showTaunt() {
  const idx = Math.min(noCount - 1, taunts.length - 1);
  noAttempts.textContent = taunts[idx];
  // Re-trigger animation
  noAttempts.style.animation = 'none';
  void noAttempts.offsetWidth;
  noAttempts.style.animation = '';
}



function getRandomPosition(btnW, btnH) {
  const margin = 16;
  const maxX = window.innerWidth  - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;
  const x = Math.random() * (maxX - margin) + margin;
  const y = Math.random() * (maxY - margin) + margin;
  return { x, y };
}

function moveNoBtnAway(e) {
  if (isMobile) return;

  const rect  = noBtn.getBoundingClientRect();
  const btnCX = rect.left + rect.width  / 2;
  const btnCY = rect.top  + rect.height / 2;
  const dx    = e.clientX - btnCX;
  const dy    = e.clientY - btnCY;
  const dist  = Math.sqrt(dx * dx + dy * dy);


  if (dist > 120) return;

  if (!noBtnRunning) {
    noBtnRunning = true;
    noBtn.classList.add('running');
    noBtn.style.left = rect.left + 'px';
    noBtn.style.top  = rect.top  + 'px';
  }

  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  const pos  = getRandomPosition(btnW, btnH);

  noBtn.style.transition = 'left 0.18s ease, top 0.18s ease';
  noBtn.style.left = pos.x + 'px';
  noBtn.style.top  = pos.y + 'px';
}

document.addEventListener('mousemove', moveNoBtnAway);


noBtn.addEventListener('mousedown', (e) => {
  e.preventDefault();
  noCount++;
  growYes();
  showTaunt();
  dodgeFromEvent(e.clientX, e.clientY);
});

function dodgeFromEvent(cx, cy) {
  if (!noBtnRunning) {
    const rect = noBtn.getBoundingClientRect();
    noBtnRunning = true;
    noBtn.classList.add('running');
    noBtn.style.left = rect.left + 'px';
    noBtn.style.top  = rect.top  + 'px';
  }
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  const pos  = getRandomPosition(btnW, btnH);
  noBtn.style.left = pos.x + 'px';
  noBtn.style.top  = pos.y + 'px';
}


noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  noCount++;
  growYes();
  showTaunt();
  teleportNoBtn();
}, { passive: false });


document.addEventListener('touchmove', (e) => {
  if (!isMobile) return;
  const touch = e.touches[0];
  const rect  = noBtn.getBoundingClientRect();
  const inX   = touch.clientX >= rect.left - 20 && touch.clientX <= rect.right  + 20;
  const inY   = touch.clientY >= rect.top  - 20 && touch.clientY <= rect.bottom + 20;
  if (inX && inY) {
    teleportNoBtn();
  }
}, { passive: true });

function teleportNoBtn() {
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  if (!noBtnRunning) {
    noBtnRunning = true;
    noBtn.classList.add('running');
    const rect = noBtn.getBoundingClientRect();
    noBtn.style.left = rect.left + 'px';
    noBtn.style.top  = rect.top  + 'px';
  }

  // Find a spot far from centre
  let x, y, attempts = 0;
  do {
    x = Math.random() * (window.innerWidth  - btnW - 20) + 10;
    y = Math.random() * (window.innerHeight - btnH - 20) + 10;
    attempts++;
  } while (attempts < 15 && isTooClose(x, y, btnW, btnH));

  // Flash animation
  noBtn.classList.remove('teleport-flash');
  void noBtn.offsetWidth;
  noBtn.classList.add('teleport-flash');

  noBtn.style.left = x + 'px';
  noBtn.style.top  = y + 'px';
}

function isTooClose(x, y, w, h) {
  const cx    = x + w / 2;
  const cy    = y + h / 2;
  const midX  = window.innerWidth  / 2;
  const midY  = window.innerHeight / 2;
  return Math.abs(cx - midX) < 80 && Math.abs(cy - midY) < 80;
}

// =========================================================
// YES button — trigger celebration
// =========================================================
yesBtn.addEventListener('click', triggerCelebration);
yesBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  triggerCelebration();
}, { passive: false });

function triggerCelebration() {
  // Show overlay
  celebration.classList.add('show');
  // Launch confetti
  launchConfetti();
  // Extra hearts burst
  for (let i = 0; i < 18; i++) {
    setTimeout(createHeart, i * 80);
  }
}

// =========================================================
// CONFETTI
// =========================================================
const CONFETTI_COLORS = [
  '#ff3385','#ff6bae','#ff90c8','#ffb3d1',
  '#ff6b6b','#ffd93d','#6bcb77','#4d96ff',
  '#d63384','#c77dff','#ff9f45','#00b4d8',
];

function launchConfetti() {
  const count = 160;
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnConfetti(), Math.random() * 1200);
  }
}

function spawnConfetti() {
  const el    = document.createElement('div');
  el.className = 'confetti-piece';

  const color  = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
  const startX = Math.random() * 100;
  const dur    = Math.random() * 2.5 + 2;
  const size   = Math.random() * 8 + 6;
  const skew   = Math.random() * 30 - 15;

  el.style.cssText = `
    left: ${startX}vw;
    background: ${color};
    width: ${size}px;
    height: ${size * 1.6}px;
    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    animation-duration: ${dur}s;
    transform: rotate(${Math.random() * 360}deg) skew(${skew}deg);
  `;

  // emoji confetti
  if (Math.random() > 0.75) {
    const emojis = ['💖','💗','🎉','✨','💕','🩷','💫'];
    el.textContent  = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.background   = 'transparent';
    el.style.fontSize     = (size + 4) + 'px';
    el.style.width        = 'auto';
    el.style.height       = 'auto';
  }

  confettiBox.appendChild(el);
  setTimeout(() => el.remove(), (dur + 0.5) * 1000);
}

// =========================================================
// Prevent any accidental click
// =========================================================
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  noCount++;
  growYes();
  showTaunt();
});