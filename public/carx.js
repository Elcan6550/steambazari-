/* ============================================================
   ÇARX SİSTEMİ (steambazari.netlify.app versiyası — təkmilləşdirilmiş)
   Not: extracted_vibd_script.js-dəki sadə çarx funksiyalarını əvəz edir.
   Kredit yoxlaması DB üzərindən aparılır (callable backend olmadan).
   ============================================================ */

var carxPrizes = [
    { label: '20% Endirim', color: '#ff1744', dark: '#b71c1c', light: '#ff6b8a', icon: '🔥', extraSpin: false, neon: '#ff1744' },
    { label: '30% Endirim', color: '#ff9100', dark: '#e65100', light: '#ffb74d', icon: '⭐', extraSpin: false, neon: '#ff9100' },
    { label: '25% Endirim', color: '#ffea00', dark: '#f9a825', light: '#fff59d', icon: '💎', extraSpin: false, neon: '#ffea00' },
    { label: 'Heçnə qazanmadınız', color: '#536dfe', dark: '#304ffe', light: '#8c9eff', icon: '💔', extraSpin: false, neon: '#536dfe' },
    { label: '35% Endirim', color: '#d500f9', dark: '#aa00ff', light: '#ea80fc', icon: '🎯', extraSpin: false, neon: '#d500f9' },
    { label: '10 AZN Oyun', color: '#00e676', dark: '#00c853', light: '#69f0ae', icon: '🎮', extraSpin: false, neon: '#00e676' },
    { label: '20% Endirim', color: '#ff1744', dark: '#b71c1c', light: '#ff6b8a', icon: '🔥', extraSpin: false, neon: '#ff1744' },
    { label: 'Yenidən Fırladın', color: '#2979ff', dark: '#2962ff', light: '#82b1ff', icon: '🔄', extraSpin: true, neon: '#2979ff' },
    { label: '25% Endirim', color: '#ffea00', dark: '#f9a825', light: '#fff59d', icon: '💎', extraSpin: false, neon: '#ffea00' }
];
var carxIsSpinning = false;

function carxHexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var b = parseInt(hex.slice(5,7), 16);
    return 'rgba('+r+','+g+','+b+','+alpha+')';
}

function carxPlayTone(freq, duration, type) {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch(e) {}
}

function carxPlayOpenSound() {
    carxPlayTone(440, 0.08, 'triangle');
    setTimeout(function() { carxPlayTone(550, 0.08, 'triangle'); }, 80);
    setTimeout(function() { carxPlayTone(660, 0.1, 'triangle'); }, 160);
}

function carxAc(event) {
    event.preventDefault();
    carxPlayOpenSound();
    var u = localStorage.getItem('sb_current_user');
    if (!u) { myToast('❌ Zəhmət olmasa əvvəlcə daxil olun!', 'r'); return; }
    var username;
    try { username = JSON.parse(u).username; } catch(e) { return; }
    document.getElementById('carxModal').classList.add('active');
    spinCreditsGoster(username);
    carxCiz();
    var ref = getSpinRef();
    if (ref) {
        ref.once("value").then(function(snap) {
            var data = snap.val() || {};
            var el = document.getElementById('spinResult');
            if (el && data.lastPrize) {
                el.textContent = data.lastPrize;
                el.style.opacity = '1';
            }
        });
    }
}

function carxCiz() {
    var canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width, h = canvas.height;
    var cx = w/2, cy = h/2, r = Math.min(cx, cy) - 10;
    var arc = (2 * Math.PI) / carxPrizes.length;

    ctx.clearRect(0, 0, w, h);

    // === 3D XARİCİ HALQA ===
    ctx.shadowColor = 'rgba(255,215,0,0.25)';
    ctx.shadowBlur = 15;
    var ringGrad = ctx.createRadialGradient(cx-5, cy-5, r-5, cx, cy, r+18);
    ringGrad.addColorStop(0, '#8b6914');
    ringGrad.addColorStop(0.3, '#daa520');
    ringGrad.addColorStop(0.6, '#b8860b');
    ringGrad.addColorStop(1, '#8b6914');
    ctx.beginPath();
    ctx.arc(cx, cy, r+14, 0, 2*Math.PI);
    ctx.fillStyle = ringGrad;
    ctx.fill();

    // Halqa üzərində parıltı
    var shineGrad = ctx.createRadialGradient(cx-r*0.3, cy-r*0.3, 0, cx, cy, r+18);
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.1)');
    shineGrad.addColorStop(0.4, 'rgba(255,255,255,0)');
    shineGrad.addColorStop(1, 'rgba(0,0,0,0.08)');
    ctx.beginPath();
    ctx.arc(cx, cy, r+14, 0, 2*Math.PI);
    ctx.fillStyle = shineGrad;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Halqada qızıl düymələr
    var btnCount = 12;
    for (var b = 0; b < btnCount; b++) {
        var ba = (b / btnCount) * 2 * Math.PI - Math.PI/2;
        var bx = cx + Math.cos(ba) * (r+14), by = cy + Math.sin(ba) * (r+14);
        var btnGrad = ctx.createRadialGradient(bx-1, by-1, 0, bx, by, 4);
        btnGrad.addColorStop(0, '#daa520');
        btnGrad.addColorStop(0.5, '#b8860b');
        btnGrad.addColorStop(1, '#8b6914');
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, 2*Math.PI);
        ctx.fillStyle = btnGrad;
        ctx.shadowColor = 'rgba(255,215,0,0.3)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // === SEQMENTLƏR ===
    for (var i = 0; i < carxPrizes.length; i++) {
        var startAngle = i * arc;
        var endAngle = startAngle + arc;
        var p = carxPrizes[i];

        var bevelGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        bevelGrad.addColorStop(0, carxHexToRgba(p.color, 0.3));
        bevelGrad.addColorStop(0.5, carxHexToRgba(p.color, 0.35));
        bevelGrad.addColorStop(1, carxHexToRgba(p.dark, 0.45));
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = bevelGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(startAngle) * r, cy + Math.sin(startAngle) * r);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        var midAngle = startAngle + arc / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(midAngle);
        ctx.textAlign = 'right';
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Segoe UI, sans-serif';
        ctx.fillText(p.icon + ' ' + p.label, r - 22, 5);
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    // === XARİCİ İNCƏ HALQA ===
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2*Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // === UC NÖQTƏLƏRİ ===
    for (var j = 0; j < carxPrizes.length; j++) {
        var a2 = j * arc;
        var dx2 = cx + Math.cos(a2) * r, dy2 = cy + Math.sin(a2) * r;
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(dx2, dy2, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#111';
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    // === MƏRKƏZ ===
    ctx.shadowColor = 'rgba(255,215,0,0.3)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
    var cGrad = ctx.createRadialGradient(cx-8, cy-8, 0, cx, cy, 28);
    cGrad.addColorStop(0, '#3a3a4e');
    cGrad.addColorStop(0.4, '#1a1a2a');
    cGrad.addColorStop(1, '#0a0a12');
    ctx.fillStyle = cGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, 2*Math.PI);
    ctx.strokeStyle = 'rgba(255,215,0,0.35)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(255,215,0,0.2)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, 2*Math.PI);
    ctx.fillStyle = '#daa520';
    ctx.fill();
}

function carxiFirlat() {
    if (carxIsSpinning) return;
    var el = document.getElementById('spinResult');
    var btn = document.getElementById('spinBtn');

    var u = localStorage.getItem('sb_current_user');
    if (!u) { myToast('❌ Zəhmət olmasa daxil olun!', 'r'); return; }
    var username;
    try { username = JSON.parse(u).username; } catch(e) { return; }

    if (isAdmin()) {
        spinCreditsGoster(username);
        try { carxiFirlat2(el, btn); } catch(e) { carxIsSpinning = false; myToast('❌ Xəta: '+e.message,'r'); }
        return;
    }

    var creditsRef = getSpinCreditsRef(username);
    creditsRef.once("value").then(function(snap) {
        var credits = snap.val() || 0;
        if (credits <= 0) {
            myToast('❌ Fırlanma haqqınız yoxdur! Redeem kodu daxil edin.', 'r');
            return;
        }
        return creditsRef.set(credits - 1).then(function() {
            spinCreditsGoster(username);
            try { carxiFirlat2(el, btn); } catch(e) { carxIsSpinning = false; myToast('❌ Xəta: '+e.message,'r'); }
        });
    });
}

function carxGetAudioCtx() {
    if (!window._carxAudioCtx) {
        window._carxAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (window._carxAudioCtx.state === 'suspended') window._carxAudioCtx.resume();
    return window._carxAudioCtx;
}

function carxiFirlat2(el, btn) {
    carxIsSpinning = true;
    if (el) { el.style.opacity = '0'; el.textContent = ''; }
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; btn.style.cursor = 'not-allowed'; }

    var _curUser = null;
    try { _curUser = JSON.parse(localStorage.getItem('sb_current_user')||'null'); } catch(e) {}
    var _curUsername = _curUser ? _curUser.username : '';

    var canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var cx = canvas.width/2, cy = canvas.height/2, r = Math.min(cx, cy) - 10;
    var arc = (2 * Math.PI) / carxPrizes.length;
    var winner;
    do { winner = Math.floor(Math.random() * carxPrizes.length); } while (winner === 5);
    var targetAngle = (3 * Math.PI / 2) - (winner * arc + Math.random() * arc);
    if (targetAngle < 0) targetAngle += 2 * Math.PI;
    var spinAngle = 15 * 2 * Math.PI + targetAngle;
    var duration = 12000, start = null;
    var lastTick = -1;

    function playTick(speed) {
        try {
            var a = carxGetAudioCtx();
            var t = a.currentTime;
            var buf = a.createBuffer(1, a.sampleRate * 0.015, a.sampleRate);
            var d = buf.getChannelData(0);
            for (var i = 0; i < d.length; i++) {
                var phase = i / d.length;
                d[i] = (Math.random() * 2 - 1) * Math.exp(-phase * 6);
                if (phase > 0.1 && phase < 0.4) d[i] += Math.sin(phase * 80) * 0.6 * Math.exp(-(phase-0.1) * 6);
            }
            var src = a.createBufferSource();
            src.buffer = buf;
            var filt = a.createBiquadFilter();
            filt.type = 'highpass';
            filt.frequency.value = 800 + speed * 2000;
            var g = a.createGain();
            src.connect(filt); filt.connect(g); g.connect(a.destination);
            var vol = 0.15 + speed * 0.2;
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.018);
            src.start(t); src.stop(t + 0.018);
        } catch(e) {}
    }

    var _lastDotHit = -1;
    var _dotJerk = 0;
    var _dotJerkDecay = 0;
    var _stickTimer = 0;
    var _stickAngle = 0;
    var _glowSeg = -1;
    var _glowIntensity = 0;
    var _glowColor = '#ffd700';
    var _springPos = 0;
    var _springVel = 0;
    var _springTension = 0.15;
    var _springDamping = 0.7;

    var _winSfx = null;
    function playWinSound(prizeLabel) {
        try {
            if (prizeLabel && prizeLabel.indexOf('10 AZN') >= 0) {
                _winSfx = new Audio(encodeURIComponent('Playing and winning Slot Machine Jackpot - Sound Effect for editing.mp3'));
                _winSfx.volume = 0.6;
                _winSfx.currentTime = 7;
                _winSfx.play().catch(function(e){ console.log('Win sound err:', e); });
            } else if (prizeLabel && prizeLabel.indexOf('Heçnə') >= 0) {
                _winSfx = new Audio(encodeURIComponent('The Price is Right Losing Horn - Sound Effect (HD).mp3'));
                _winSfx.volume = 0.5;
                _winSfx.currentTime = 1;
                _winSfx.play().catch(function(e){ console.log('Loser sound err:', e); });
            } else {
                _winSfx = new Audio(encodeURIComponent('Game Win Sound Effect (#8).mp3'));
                _winSfx.volume = 0.6;
                _winSfx.play().catch(function(e){ console.log('Win sound err:', e); });
            }
        } catch(e) { console.log('Win sound err:', e); }
    }

    function animate(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 4);
        var angle = spinAngle * ease;

        var tickStep = Math.PI / 9;
        var tickCount = Math.floor(angle / tickStep);
        if (tickCount > lastTick) {
            lastTick = tickCount;
            playTick(1 - progress);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // === 3D XARİCİ HALQA ===
        ctx.shadowColor = 'rgba(255,215,0,0.25)';
        ctx.shadowBlur = 15;
        var ringGrad2 = ctx.createRadialGradient(cx-5, cy-5, r-5, cx, cy, r+18);
        ringGrad2.addColorStop(0, '#8b6914');
        ringGrad2.addColorStop(0.3, '#daa520');
        ringGrad2.addColorStop(0.6, '#b8860b');
        ringGrad2.addColorStop(1, '#8b6914');
        ctx.beginPath();
        ctx.arc(cx, cy, r+14, 0, 2*Math.PI);
        ctx.fillStyle = ringGrad2;
        ctx.fill();

        var shineGrad2 = ctx.createRadialGradient(cx-r*0.3, cy-r*0.3, 0, cx, cy, r+18);
        shineGrad2.addColorStop(0, 'rgba(255,255,255,0.1)');
        shineGrad2.addColorStop(0.4, 'rgba(255,255,255,0)');
        shineGrad2.addColorStop(1, 'rgba(0,0,0,0.08)');
        ctx.beginPath();
        ctx.arc(cx, cy, r+14, 0, 2*Math.PI);
        ctx.fillStyle = shineGrad2;
        ctx.fill();
        ctx.shadowBlur = 0;

        var btnCount2 = 12;
        for (var b2 = 0; b2 < btnCount2; b2++) {
            var ba2 = (b2 / btnCount2) * 2 * Math.PI - Math.PI/2;
            var bx2 = cx + Math.cos(ba2) * (r+14), by2 = cy + Math.sin(ba2) * (r+14);
            var btnGrad2 = ctx.createRadialGradient(bx2-1, by2-1, 0, bx2, by2, 4);
            btnGrad2.addColorStop(0, '#daa520');
            btnGrad2.addColorStop(0.5, '#b8860b');
            btnGrad2.addColorStop(1, '#8b6914');
            ctx.beginPath();
            ctx.arc(bx2, by2, 3, 0, 2*Math.PI);
            ctx.fillStyle = btnGrad2;
            ctx.shadowColor = 'rgba(255,215,0,0.3)';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        for (var i = 0; i < carxPrizes.length; i++) {
            var startAngle = i * arc;
            var endAngle = startAngle + arc;
            var p = carxPrizes[i];

            var bevelGrad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
            bevelGrad2.addColorStop(0, carxHexToRgba(p.color, 0.3));
            bevelGrad2.addColorStop(0.5, carxHexToRgba(p.color, 0.35));
            bevelGrad2.addColorStop(1, carxHexToRgba(p.dark, 0.45));
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, r, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = bevelGrad2;
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(startAngle) * r, Math.sin(startAngle) * r);
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1;
            ctx.stroke();

            var midAngle = startAngle + arc / 2;
            ctx.save();
            ctx.rotate(midAngle);
            ctx.textAlign = 'right';
            ctx.shadowColor = 'rgba(0,0,0,0.7)';
            ctx.shadowBlur = 6;
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Segoe UI, sans-serif';
            ctx.fillText(p.icon + ' ' + p.label, r - 22, 5);
            ctx.shadowBlur = 0;
            ctx.restore();
        }

        // === NEON SEQMENT İŞIĞI (OX DƏYDİKÇƏ) ===
        if (_glowSeg >= 0 && _glowIntensity > 0.02) {
            var gs = _glowSeg * arc;
            var ge = gs + arc;
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, r+10, gs, ge);
            ctx.closePath();
            ctx.shadowColor = _glowColor;
            ctx.shadowBlur = 80 * _glowIntensity;
            ctx.fillStyle = carxHexToRgba(_glowColor, 0.25 * _glowIntensity);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, r, gs, ge);
            ctx.closePath();
            ctx.shadowColor = _glowColor;
            ctx.shadowBlur = 50 * _glowIntensity;
            ctx.fillStyle = carxHexToRgba(_glowColor, 0.15 * _glowIntensity);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
            _glowIntensity *= 0.93;
        }

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, 2*Math.PI);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        for (var j = 0; j < carxPrizes.length; j++) {
            var a2j = j * arc;
            var dx2j = Math.cos(a2j) * r, dy2j = Math.sin(a2j) * r;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(dx2j, dy2j, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#111';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.restore();

        ctx.shadowColor = 'rgba(255,215,0,0.3)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
        var cGrad2 = ctx.createRadialGradient(cx-8, cy-8, 0, cx, cy, 28);
        cGrad2.addColorStop(0, '#3a3a4e');
        cGrad2.addColorStop(0.4, '#1a1a2a');
        cGrad2.addColorStop(1, '#0a0a12');
        ctx.fillStyle = cGrad2;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, 2*Math.PI);
        ctx.strokeStyle = 'rgba(255,215,0,0.35)';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(255,215,0,0.2)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, 2*Math.PI);
        ctx.fillStyle = '#daa520';
        ctx.fill();

        var pointerAngle = 3 * Math.PI / 2;
        var speed = 1 - progress;
        for (var d = 0; d < carxPrizes.length; d++) {
            var dotScreenAngle = (d * arc + angle) % (2 * Math.PI);
            var dist = Math.abs(dotScreenAngle - pointerAngle);
            if (dist > Math.PI) dist = 2 * Math.PI - dist;
            if (dist < 0.08 && d !== _lastDotHit) {
                _lastDotHit = d;
                _glowSeg = d;
                _glowIntensity = 2;
                _glowColor = carxPrizes[d].color;
                var dhx = Math.cos(d * arc) * r, dhy = Math.sin(d * arc) * r;
                ctx.save();
                ctx.shadowColor = '#fff';
                ctx.shadowBlur = 30;
                ctx.beginPath();
                ctx.arc(dhx, dhy, 8, 0, 2*Math.PI);
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.restore();
                _dotJerk = 30 + speed * 20;
                _dotJerkDecay = 0.92;
                _stickTimer = 5;
                _stickAngle = (dotScreenAngle - pointerAngle) * (180 / Math.PI) * 0.85;
                _springVel += (6 + speed * 4) * (Math.random() > 0.5 ? 1 : -1);
                var pw = document.getElementById('pointerWrap');
                if (pw) {
                    var bounceAmt = 1 + speed * 1.5;
                    pw.style.transition = 'transform 0.05s ease';
                    pw.style.transform = 'translateX(-50%) translateY(' + bounceAmt + 'px)';
                    clearTimeout(pw._bounceTimer);
                    pw._bounceTimer = setTimeout(function() {
                        pw.style.transition = 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)';
                        pw.style.transform = 'translateX(-50%) translateY(0)';
                    }, 50);
                }
            }
        }
        if (_stickTimer > 0) {
            _stickTimer -= 1;
            _dotJerk *= 0.75;
        } else {
            _dotJerk *= _dotJerkDecay;
        }
        if (_dotJerk < 0.1) _dotJerk = 0;

        var pa = document.getElementById('pointerArrow');
        if (pa) {
            var springForce = -_springTension * _springPos;
            var dampingForce = -_springDamping * _springVel;
            _springVel += (springForce + dampingForce) * 0.15;
            _springPos += _springVel * 0.15;
            _springVel *= 0.98;

            var tipAngle = 0;
            if (_stickTimer > 3) {
                tipAngle = _stickAngle + _springPos;
            } else if (_stickTimer > 0) {
                var releaseJerk = (5 - _stickTimer) / 5;
                var jerk = _dotJerk * (Math.random() > 0.5 ? 1 : -1) * 0.4 * (1 - progress);
                tipAngle = _stickAngle * (1 - releaseJerk) + jerk + _springPos;
            } else {
                if (Math.abs(_springPos) > 0.3) {
                    tipAngle = _springPos;
                } else {
                    var microJerk = Math.sin(angle * 40) * 0.3 * (1 - progress);
                    tipAngle = microJerk;
                }
            }
            pa.style.transition = 'none';
            pa.style.transformOrigin = 'top center';
            pa.style.transform = 'rotate(' + tipAngle + 'deg)';
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            carxIsSpinning = false;
            var prize = carxPrizes[winner];

            // === QALIB SEQMENTİ PARLAT ===
            var wa = winner * arc;
            var we = wa + arc;
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, r+2, wa, we);
            ctx.closePath();
            ctx.shadowColor = prize.neon;
            ctx.shadowBlur = 15;
            ctx.fillStyle = carxHexToRgba(prize.neon, 0.1);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();

            playWinSound(prize.label);
            var prizeText = prize.icon + ' ' + prize.label + ' 🎉';
            if (_curUsername) {
                showWinCelebration(prizeText, _curUsername);
                if (prize.label.indexOf('10 AZN') >= 0) startGameIconRain();
            }
            if (el) {
                el.textContent = prizeText;
                el.style.opacity = '1';
            }
            var pctMatch = prize.label.match(/^(\d+)%/);
            var freeMatch = prize.label.indexOf('10 AZN') >= 0;
            if (pctMatch && _curUsername) {
                var discountPct = parseInt(pctMatch[1], 10);
                saveCoupon(_curUsername, discountPct, function(code) {
                    if (code) myToast('🎫 Kupon: ' + code + ' — ' + discountPct + '% endirim! Səbətdə tətbiq edə bilərsiniz.', 'g');
                });
            } else if (freeMatch && _curUsername) {
                saveCouponFree(_curUsername, function(code) {
                    if (code) myToast('🎫 Pulsuz oyun kuponu qazandınız! Səbətdə istifadə edə bilərsiniz!', 'g');
                });
            }
            if (_curUsername) {
                var _spRef = getSpinRef();
                if (_spRef) _spRef.child('lastPrize').set(prizeText);
            }
            if (btn) { btn.disabled = false; btn.style.opacity = '1'; btn.style.cursor = 'pointer'; }
            _lastDotHit = -1; _dotJerk = 0; _stickTimer = 0; _stickAngle = 0; _springPos = 0; _springVel = 0;
        }
    }
    requestAnimationFrame(animate);
}

/* ===== OYUN İKON YAĞIŞI ===== */
function startGameIconRain() {
    var gameImages = [
        'ggta5.jpg','rdr2.avif','elden.webp','godofwar.jpg','fc26.jpg',
        'call-of-duty-black-ops-6-pc-game-battle-net-cover.jpg','spi.avif','re4.avif',
        'wıitcher.jfif','Cyberpunk-2077-PC-COVER.webp','ghostof.jfif','forza5.jpg',
        'stalker2.avif','hogvarts.jfif','kingdom2.jpg','detroit.jfif'
    ];
    var container = document.createElement('div');
    container.id = 'iconRainContainer';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999998;pointer-events:none;overflow:hidden;';
    document.body.appendChild(container);
    for (var i = 0; i < 40; i++) {
        (function(idx) {
            setTimeout(function() {
                var img = document.createElement('img');
                var src = gameImages[idx % gameImages.length];
                img.src = 'sekiller/' + src;
                var size = 30 + Math.random() * 40;
                img.style.cssText = 'position:absolute;top:-60px;left:' + (Math.random() * 100) + '%;width:' + size + 'px;height:' + (size * 1.33) + 'px;object-fit:cover;border-radius:4px;opacity:0.85;box-shadow:0 2px 8px rgba(255,215,0,0.3);';
                container.appendChild(img);
                var fallDuration = 3 + Math.random() * 3;
                var startTime = performance.now();
                function fallAnim(now) {
                    var elapsed = (now - startTime) / 1000;
                    var progress = Math.min(elapsed / fallDuration, 1);
                    var eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    var yPos = eased * (window.innerHeight + 80) - 60;
                    var rotate = eased * 360;
                    img.style.transform = 'translateY(' + yPos + 'px) rotate(' + rotate + 'deg)';
                    img.style.opacity = 0.85 * (1 - eased * 0.85);
                    if (progress < 1) {
                        requestAnimationFrame(fallAnim);
                    } else {
                        img.remove();
                    }
                }
                requestAnimationFrame(fallAnim);
            }, idx * 80);
        })(i);
    }
    setTimeout(function() { if (container.parentNode) container.remove(); }, 12000);
}

/* ===== QƏLƏBƏ SİDEBAR ===== */
var _winStyleInjected = false;
function showWinCelebration(text, username) {
    var old = document.getElementById('winCelebration');
    if (old) old.remove();

    if (!_winStyleInjected) {
        _winStyleInjected = true;
        var s = document.createElement('style');
        s.textContent =
            '@keyframes winPulse{0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}}' +
            '@keyframes winGlow{0%{box-shadow:0 0 12px #ffd700,0 0 25px #ff6b6b,inset 0 0 20px rgba(255,215,0,0.08)}50%{box-shadow:0 0 25px #ff6b6b,0 0 50px #ffd700,inset 0 0 30px rgba(255,107,107,0.08)}100%{box-shadow:0 0 12px #ffd700,0 0 25px #ff6b6b,inset 0 0 20px rgba(255,215,0,0.08)}}' +
            '@keyframes winFire{0%,100%{opacity:1;transform:translateY(0) scale(1)}50%{opacity:0.6;transform:translateY(-3px) scale(1.05)}}' +
            '#winCelebration{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999999;display:flex;align-items:center;justify-content:center;}' +
            '#winCelebration .wc-box{background:linear-gradient(135deg,rgba(10,14,20,0.98),rgba(30,20,40,0.98));border:2px solid rgba(255,215,0,0.6);border-radius:16px;padding:24px 20px;text-align:center;animation:winPulse 1.5s ease-in-out infinite;position:relative;max-width:90vw;width:380px;}' +
            '#winCelebration .wc-box::before{content:"";position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;border-radius:18px;background:linear-gradient(45deg,#ffd700,#ff6b6b,#ffd700,#ff6b6b);background-size:400% 400%;animation:winGlow 3s ease infinite;z-index:-1;}' +
            '#winCelebration .wc-box::after{content:"";position:absolute;top:0;left:0;right:0;bottom:0;border-radius:16px;background:rgba(10,14,20,0.98);z-index:-1;}' +
            '#winCelebration .wc-fire{position:absolute;font-size:20px;animation:winFire 1.2s ease-in-out infinite;}' +
            '#winCelebration .wc-text{color:#ffd700;font-size:20px;font-weight:900;letter-spacing:1px;text-shadow:0 0 20px rgba(255,215,0,0.5);font-family:Segoe UI,sans-serif;overflow:hidden;white-space:nowrap;border-right:2px solid #ffd700;padding-right:4px;max-width:100%;}' +
            '#winCelebration .wc-user{color:#fff;font-size:14px;font-weight:600;margin-top:10px;opacity:0.8;text-shadow:0 0 10px rgba(255,255,255,0.3);}' +
            '#winCelebration .wc-close{position:absolute;top:-14px;right:-14px;background:#0f0f1a;border:2px solid #00d2ff;color:#00d2ff;font-size:18px;width:30px;height:30px;border-radius:50%;cursor:pointer;line-height:1;display:flex;align-items:center;justify-content:center;z-index:5;box-shadow:0 0 12px rgba(0,210,255,0.4);transition:all 0.3s;}' +
            '#winCelebration .wc-close:hover{box-shadow:0 0 20px rgba(0,210,255,0.6);transform:scale(1.1);}' +
            '@media (max-width:480px){#winCelebration .wc-box{padding:20px 14px;width:85vw;border-radius:12px}' +
            '#winCelebration .wc-text{font-size:16px}' +
            '#winCelebration .wc-user{font-size:13px;margin-top:8px}' +
            '#winCelebration .wc-fire{font-size:16px}' +
            '#winCelebration .wc-close{top:-12px;right:-12px;width:26px;height:26px;font-size:15px}}';
        document.head.appendChild(s);
    }

    var div = document.createElement('div');
    div.id = 'winCelebration';
    div.innerHTML =
        '<div class="wc-box">' +
        '<div class="wc-close" id="wcCloseBtn">&times;</div>' +
        '<div class="wc-fire" style="top:5px;left:10px;">🔥</div>' +
        '<div class="wc-fire" style="top:5px;right:10px;">🔥</div>' +
        '<div class="wc-fire" style="bottom:5px;left:10px;">🔥</div>' +
        '<div class="wc-fire" style="bottom:5px;right:10px;">🔥</div>' +
        '<div class="wc-text" id="wcTextDisplay"></div>' +
        '<div class="wc-user">👤 ' + username + '</div>' +
        '</div>';
    var carxModal = document.getElementById('carxModal');
    var target = carxModal || document.body;
    target.appendChild(div);
    if (carxModal) {
        div.style.position = 'absolute';
        div.style.top = '0';
        div.style.left = '0';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.zIndex = '100';
    }
    var closeBtn = document.getElementById('wcCloseBtn');
    if (closeBtn) {
        closeBtn.onclick = function() {
            div.style.transition = 'opacity 0.4s'; div.style.opacity = '0';
            setTimeout(function() { div.remove(); }, 400);
        };
    }

    var displayEl = document.getElementById('wcTextDisplay');
    if (displayEl) {
        var idx = 0;
        var tw = setInterval(function() {
            if (idx < text.length) {
                displayEl.textContent += text[idx];
                idx++;
            } else {
                clearInterval(tw);
            }
        }, 30);
    }
}

/* ===== Fırlanma haqqı göstəricisi ===== */
function spinCreditsGoster(username) {
    var el = document.getElementById('spinCredits');
    if (!el || !username) return;
    if (isAdmin()) {
        el.textContent = 'Fırlanma haqqı: ♾️ Limitsiz (Admin)';
        var btn = document.getElementById('spinBtn');
        if (btn) { btn.disabled = false; btn.style.opacity = '1'; btn.style.cursor = 'pointer'; }
        return;
    }
    getSpinCreditsRef(username).once("value").then(function(snap) {
        var credits = snap.val() || 0;
        el.textContent = 'Fırlanma haqqı: ' + credits;
        var btn = document.getElementById('spinBtn');
        if (btn) {
            if (credits <= 0) {
                btn.disabled = true; btn.style.opacity = '0.4';
                el.textContent = 'Fırlanma haqqı: 0 — Redeem kodu daxil et!';
            } else {
                btn.disabled = false; btn.style.opacity = '1';
            }
        }
    });
}