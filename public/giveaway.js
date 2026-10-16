// ============================================================
// STEAMBAZARI.AZ - GIVEAWAY SİSTEMİ
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCEIY-MrI-Phc_U2Gs8e-woKxbQcfTv5cs",
    authDomain: "steambazari.firebaseapp.com",
    databaseURL: "https://steambazari-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "steambazari",
    storageBucket: "steambazari.firebasestorage.app",
    messagingSenderId: "232790121889",
    appId: "1:232790121889:web:85559fc202e1ada9a23fe0",
    measurementId: "G-SJXMQ9DR7W"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// ============================================================
// DƏYİŞƏNLƏR
// ============================================================

const DRAW_DATE = new Date('2026-07-14T00:00:00+04:00');
const ADMIN_EMAILS = ['elcan@steambazari.az', 'admin@steambazari.az'];
const GIVEAWAY_REF = database.ref('giveaway');
const PARTICIPANTS_REF = database.ref('giveaway/participants');
const SETTINGS_REF = database.ref('giveaway/settings');
const WINNER_REF = database.ref('giveaway/winner');

let participants = [];
let currentUser = null;
let hasJoined = false;
let isSpinning = false;
let isDrawActive = false;

const joinBtn = document.getElementById('joinBtn');
const spinBtn = document.getElementById('spinBtn');
const resetBtn = document.getElementById('resetBtn');
const slotTrack = document.getElementById('slotTrack');
const participantCount = document.getElementById('participantCount');
const winnerSection = document.getElementById('winnerSection');
const winnerName = document.getElementById('winnerName');

// ============================================================
// AUTH
// ============================================================

auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        checkUserParticipation();
    }
    updateButtonStates();
});

// ============================================================
// REAL-TIME PARTICIPANT LIST
// ============================================================

PARTICIPANTS_REF.on('value', snapshot => {
    const data = snapshot.val();
    participants = [];

    if (data) {
        const keys = Object.keys(data);
        for (const key of keys) {
            participants.push({
                id: key,
                username: data[key].username || 'Naməlum',
                entryDate: data[key].entryDate || Date.now()
            });
        }
        participants.sort((a, b) => a.entryDate - b.entryDate);
    }

    participantCount.textContent = participants.length;
    renderSlot();
    updateButtonStates();
});

SETTINGS_REF.child('isActive').on('value', snapshot => {
    isDrawActive = snapshot.val() === true;
    updateButtonStates();
});

WINNER_REF.on('value', snapshot => {
    const data = snapshot.val();
    if (data && data.username) {
        showWinner(data.username);
    }
});

// ============================================================
// JOIN GIVEAWAY
// ============================================================

joinBtn.addEventListener('click', joinGiveaway);

async function joinGiveaway() {
    if (!currentUser) {
        showToast('Zəhmət olmasa əvvəlcə daxil olun!', 'error');
        return;
    }

    if (hasJoined) return;

    const username = currentUser.displayName ||
        currentUser.email?.split('@')[0] ||
        currentUser.uid?.slice(0, 8) ||
        'İstifadəçi';

    try {
        await PARTICIPANTS_REF.child(currentUser.uid).set({
            username: username,
            email: currentUser.email || '',
            entryDate: Date.now()
        });

        hasJoined = true;
        joinBtn.classList.add('joined');
        joinBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>Qoşuldunuz!</span>';
        showToast('Uğurla qoşuldunuz! Uğurlar! 🎉', 'success');
    } catch (err) {
        showToast('Xəta baş verdi: ' + err.message, 'error');
    }
}

function checkUserParticipation() {
    if (!currentUser) return;

    PARTICIPANTS_REF.child(currentUser.uid).once('value', snapshot => {
        if (snapshot.exists()) {
            hasJoined = true;
            joinBtn.classList.add('joined');
            joinBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>Qoşuldunuz!</span>';
        } else {
            hasJoined = false;
            joinBtn.classList.remove('joined');
            joinBtn.innerHTML = '<i class="fas fa-user-plus"></i><span>Giveaway-də İştirak Et</span>';
        }
    });
}

// ============================================================
// SLOT RENDER
// ============================================================

function renderSlot() {
    if (!slotTrack) return;

    if (participants.length === 0) {
        slotTrack.innerHTML = `<div class="giva-slot-placeholder">İştirakçılar gözlənilir...</div>`;
        return;
    }

    let html = '';
    const doubled = [...participants, ...participants, ...participants];

    for (const p of doubled) {
        html += `
            <div class="giva-slot-item" data-id="${p.id}">
                <span class="giva-item-icon"><i class="fas fa-user"></i></span>
                ${escapeHtml(p.username)}
            </div>
        `;
    }

    slotTrack.innerHTML = html;
    centerSlot();
}

function centerSlot() {
    if (participants.length === 0) return;

    const items = slotTrack.querySelectorAll('.giva-slot-item');
    if (items.length === 0) return;

    const itemWidth = items[0].offsetWidth || 120;
    const centerIndex = Math.floor(items.length / 2);
    const containerWidth = slotTrack.parentElement?.offsetWidth || 800;
    const offset = (containerWidth / 2) - (centerIndex * itemWidth + itemWidth / 2);

    slotTrack.style.transform = `translateX(${offset}px)`;
}

// ============================================================
// COUNTDOWN
// ============================================================

function updateCountdown() {
    const now = new Date();
    const diff = DRAW_DATE - now;

    if (diff <= 0) {
        document.getElementById('cd-days').textContent = '00';
        document.getElementById('cd-hours').textContent = '00';
        document.getElementById('cd-minutes').textContent = '00';
        document.getElementById('cd-seconds').textContent = '00';
        updateButtonStates();
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ============================================================
// BUTTON STATES
// ============================================================

function updateButtonStates() {
    const now = new Date();
    const isAfterDraw = now >= DRAW_DATE;
    const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

    if (!isAfterDraw) {
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<i class="fas fa-lock"></i><span>Fırlat</span>';
    } else if (!isAdmin) {
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<i class="fas fa-shield-alt"></i><span>Yalnız Admin</span>';
    } else if (isSpinning || !isDrawActive) {
        spinBtn.disabled = true;
    } else {
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<i class="fas fa-play"></i><span>Fırlat</span>';
    }
}

// ============================================================
// SPIN ANİMASYONU (FORZA HORIZON STYLE)
// ============================================================

spinBtn.addEventListener('click', startSpin);

function startSpin() {
    if (isSpinning || participants.length < 2) {
        if (participants.length < 2) {
            showToast('Ən az 2 iştirakçı olmalıdır!', 'error');
        }
        return;
    }

    const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);
    if (!isAdmin) {
        showToast('Fırlatma üçün admin girişi tələb olunur!', 'error');
        return;
    }

    isSpinning = true;
    spinBtn.classList.add('spinning');
    spinBtn.disabled = true;

    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];
    const slotItems = slotTrack.querySelectorAll('.giva-slot-item');
    const containerWidth = slotTrack.parentElement?.offsetWidth || 800;

    if (slotItems.length === 0) {
        isSpinning = false;
        spinBtn.classList.remove('spinning');
        return;
    }

    const baseItemWidth = slotItems[0]?.offsetWidth || 120;
    const centerSlotIdx = Math.floor(slotItems.length / 2);
    const targetItemIdx = participants.length + winnerIndex;

    const targetX = (containerWidth / 2) - (targetItemIdx * baseItemWidth + baseItemWidth / 2);

    animateForzaSpin(targetX, () => {
        announceWinner(winner);
    });
}

function animateForzaSpin(targetX, onComplete) {
    const startX = slotTrack.offsetLeft || 0;
    const startTime = performance.now();
    const duration = 4000 + Math.random() * 2000;

    const amplitude = 400 + Math.random() * 300;
    const friction = 0.97;

    let currentX = targetX - amplitude * 2;
    let velocity = 30;
    let phase = 0;
    let lastTime = performance.now();

    slotTrack.style.transition = 'none';

    function step(timestamp) {
        const delta = Math.min((timestamp - lastTime) / 16.67, 3);
        lastTime = timestamp;

        velocity *= friction;
        phase += velocity * delta * 0.05;
        currentX += Math.sin(phase) * velocity * delta * 2;

        const centerTarget = targetX + Math.sin(phase * 0.5) * Math.max(velocity * 3, 0);
        slotTrack.style.transform = `translateX(${centerTarget}px)`;

        if (velocity > 0.3) {
            requestAnimationFrame(step);
        } else {
            slotTrack.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
            slotTrack.style.transform = `translateX(${targetX}px)`;
            setTimeout(onComplete, 600);
        }
    }

    requestAnimationFrame(step);
}

// ============================================================
// ANNOUNCE WINNER
// ============================================================

async function announceWinner(winner) {
    isSpinning = false;
    spinBtn.classList.remove('spinning');

    const winnerData = {
        userId: winner.id,
        username: winner.username,
        drawDate: Date.now()
    };

    try {
        await WINNER_REF.set(winnerData);
        await SETTINGS_REF.update({ isActive: false });
        showWinner(winner.username);
    } catch (err) {
        showToast('Xəta: ' + err.message, 'error');
    }

    resetBtn.style.display = 'flex';
}

function showWinner(username) {
    winnerName.textContent = username;
    winnerSection.style.display = 'flex';
    createConfetti();
}

// ============================================================
// CONFETTİ
// ============================================================

function createConfetti() {
    const container = document.querySelector('.giva-winner-confetti');
    if (!container) return;

    container.innerHTML = '';
    const colors = ['#ffd700', '#ff6b35', '#ff4444', '#44ff44', '#4444ff', '#ff44ff', '#44ffff'];

    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'giva-confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 4) + 'px';
        piece.style.height = (Math.random() * 8 + 4) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.animationDelay = (Math.random() * 2) + 's';
        container.appendChild(piece);
    }
}

// ============================================================
// RESET
// ============================================================

resetBtn.addEventListener('click', async () => {
    try {
        await PARTICIPANTS_REF.remove();
        await WINNER_REF.remove();
        await SETTINGS_REF.update({ isActive: true });

        winnerSection.style.display = 'none';
        resetBtn.style.display = 'none';

        hasJoined = false;
        joinBtn.classList.remove('joined');
        joinBtn.innerHTML = '<i class="fas fa-user-plus"></i><span>Giveaway-də İştirak Et</span>';

        slotTrack.style.transition = 'none';
        slotTrack.style.transform = 'translateX(0)';

        showToast('Giveaway sıfırlandı!', 'success');
    } catch (err) {
        showToast('Xəta: ' + err.message, 'error');
    }
});

// ============================================================
// TOAST
// ============================================================

function showToast(message, type) {
    const existing = document.querySelector('.giva-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'giva-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        padding: 16px 32px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        color: #fff;
        background: ${type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(34,197,94,0.95)'};
        box-shadow: 0 8px 40px rgba(0,0,0,0.3);
        z-index: 2000;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ============================================================
// UTILITY
// ============================================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================
// WINDOW RESIZE
// ============================================================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!isSpinning) {
            centerSlot();
        }
    }, 200);
});
