/* ============================================================
   STEAMBAZARI.AZ - BƏRPA EDİLMİŞ ƏSAS FUNKSİYALAR
   ------------------------------------------------------------
   Bu fayl index.html-ə əlavə edilmişdir. Orijinal böyük inline
   skript itdiyi üçün aşağıdakı funksiyalar mövcud HTML elementləri
   və Firebase verilənlər strukturu əsasında yenidən qurulub:
     - Səhifə/görünüş keçidləri (qa-view daxil olmaqla)
     - Oyun kartı -> məlumat pəncərəsi -> səbətə atma
     - Ziyarətçi izləmə (trackVisitor) və klik sayğacı
     - Profil açılan menyusu (profil dropdown)
     - Şifrə sıfırlama
     - FAQ və Sual-Cavab (istifadəçi + admin)
     - Müştəri rəyləri (istifadəçi + admin)
     - Admin: ziyarətçilər, istifadəçilər
     - Mini oyunlar (mg) - Sliding Puzzle və Guess the Quote
   ============================================================ */

/* ------------------------------------------------------------------
   KÖMƏKÇİLƏR
------------------------------------------------------------------ */
function sbId(id) { return document.getElementById(id); }
function sbEsc(t) {
    return String(t == null ? '' : t)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function sbNow() { return new Date().toISOString(); }
function sbFmt(iso) {
    try {
        var d = new Date(iso);
        if (isNaN(d.getTime())) return iso || '';
        var s = d.toLocaleString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        return s;
    } catch (e) { return iso || ''; }
}
function sbUser() {
    try { return JSON.parse(localStorage.getItem('sb_current_user') || 'null'); }
    catch (e) { return null; }
}
function sbUserName() {
    var u = sbUser();
    return u && u.username ? u.username : '';
}
function sbSafeKey(name) {
    return String(name || '').replace(/[.#$\/\[\]]/g, '_');
}
function sbRequireLogin() {
    var u = sbUser();
    if (u && u.username) return true;
    myToast('❌ Zəhmət olmasa əvvəlcə daxil olun!', 'r');
    girisAc();
    return false;
}

/* Ekranda olmayan bəzi elementləri (loader, toast qabı) yaradır + stillər */
function sbEnsureUI() {
    try {
        if (!sbId('sb-restore-style')) {
            var st = document.createElement('style');
            st.id = 'sb-restore-style';
            st.textContent =
                '#tBox{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);z-index:99999999;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;width:auto;max-width:92vw}' +
                '#tBox .tB{padding:12px 22px;border-radius:12px;font-size:14px;font-weight:700;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,0.45);animation:tOIn .25s ease forwards;max-width:92vw;text-align:center}' +
                '#tBox .tB.g{background:linear-gradient(135deg,#16a34a,#0d8a3e);border:1px solid rgba(255,255,255,0.25)}' +
                '#tBox .tB.r{background:linear-gradient(135deg,#dc2626,#b91c1c);border:1px solid rgba(255,255,255,0.25)}' +
                '#tBox .tB.b{background:linear-gradient(135deg,#0e7490,#155e75);border:1px solid rgba(255,255,255,0.25)}' +
                '@keyframes tOIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}' +
                '@keyframes tO{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-10px)}}' +
                '.sb-loader{position:fixed;inset:0;z-index:99999999;background:rgba(5,8,14,0.72);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;flex-direction:column;gap:14px}' +
                '.sb-loader.active{display:flex}' +
                '.sb-loader .sb-spinner{width:52px;height:52px;border-radius:50%;border:4px solid rgba(0,210,255,0.2);border-top-color:#00d2ff;animation:sbSpin .8s linear infinite}' +
                '.sb-loader .sb-txt{color:#fff;font-size:14px;font-weight:600;letter-spacing:0.5px}' +
                '@keyframes sbSpin{to{transform:rotate(360deg)}}' +
                '.sb-expand{display:none;padding-top:10px;color:rgba(255,255,255,0.8);font-size:13px;line-height:1.6;border-top:1px dashed rgba(255,255,255,0.1);margin-top:10px}' +
                '.sb-expand.open{display:block}' +
                '.sb-list-item{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 14px}' +
                '.sb-row-btn{border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px;font-weight:600;border:1px solid;background:transparent;transition:all .2s}' +
                '.sb-mini{width:100%;max-width:400px;margin:6px auto;display:flex;flex-direction:column;gap:8px;align-items:center}';
            (document.head || document.documentElement).appendChild(st);
        }
        if (!sbId('tBox')) {
            var t = document.createElement('div');
            t.id = 'tBox';
            document.body.appendChild(t);
        }
        if (!sbId('loginLoader')) {
            var l1 = document.createElement('div');
            l1.id = 'loginLoader';
            l1.className = 'sb-loader';
            l1.innerHTML = '<div class="sb-spinner"></div><div class="sb-txt">Daxil olunur...</div>';
            document.body.appendChild(l1);
        }
        if (!sbId('verifyLoader')) {
            var l2 = document.createElement('div');
            l2.id = 'verifyLoader';
            l2.className = 'sb-loader';
            l2.innerHTML = '<div class="sb-spinner"></div><div class="sb-txt">Email təsdiqi gözlənilir...</div>';
            document.body.appendChild(l2);
        }
    } catch (e) { console.warn('sbEnsureUI:', e); }
}

/* ------------------------------------------------------------------
   SƏHİFƏ / GÖRÜNÜŞ KEÇİDLƏRİ (qa-view-u da gizlədən versiya)
------------------------------------------------------------------ */
var SB_VIEWS = ['home-view', 'playstation-view', 'online-view', 'change-info-view', 'digital-view', 'qa-view'];

function sbShowOnly(targetId) {
    for (var i = 0; i < SB_VIEWS.length; i++) {
        var el = sbId(SB_VIEWS[i]);
        if (el) el.style.display = (SB_VIEWS[i] === targetId) ? 'block' : 'none';
    }
    window.scrollTo(0, 0);
}

function showHome(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    sbShowOnly('home-view');
}
function showPlaystation(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    sbShowOnly('playstation-view');
}
function showOnline(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    sbShowOnly('online-view');
}
function showChangeInfo(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    sbShowOnly('change-info-view');
}
function showDigital(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    sbShowOnly('digital-view');
}
function faqAc(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    sbShowOnly('qa-view');
    sbYukleFAQ();
    sbYukleQA();
}

/* ------------------------------------------------------------------
   PROFİL AÇILAN MENYUSU
------------------------------------------------------------------ */
function toggleProfileMenu(event) {
    if (event) { event.stopPropagation(); event.preventDefault(); }
    var dd = sbId('profileDropdown');
    if (!dd) return;
    var open = dd.classList.contains('open');
    dd.classList.toggle('open', !open);
    if (!open) {
        var admin = isAdmin();
        var dv = sbId('adminDivider'), sec = sbId('adminSection');
        if (dv) dv.style.display = admin ? 'block' : 'none';
        if (sec) sec.style.display = admin ? 'block' : 'none';
    }
    var arrow = sbId('profileTrigger').querySelector('.profile-arrow');
    if (arrow) arrow.style.transform = dd.classList.contains('open') ? 'rotate(180deg)' : '';
}
function closeProfileMenu() {
    var dd = sbId('profileDropdown');
    if (dd) dd.classList.remove('open');
    var arrow = sbId('profileTrigger') && sbId('profileTrigger').querySelector('.profile-arrow');
    if (arrow) arrow.style.transform = '';
}
function sbSyncAdminMenu() {
    var admin = isAdmin();
    var dv = sbId('adminDivider'), sec = sbId('adminSection');
    if (dv) dv.style.display = admin ? 'block' : 'none';
    if (sec) sec.style.display = admin ? 'block' : 'none';
}
document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t.id !== 'profileDropdown' && t.id !== 'profileTrigger' && t.id !== 'userProfile') t = t.parentNode;
    if (!t) closeProfileMenu();
});

/* ------------------------------------------------------------------
   ŞİFRƏ SIFIRLAMA
------------------------------------------------------------------ */
function sifreSifirlaAc() {
    var m = sbId('sifreSifirlaModal');
    if (!m) return;
    m.classList.add('active');
    var em = sbId('sifreSifirlaEmail');
    if (em) em.value = '';
    var er = sbId('sifreSifirlaError');
    if (er) { er.textContent = ''; er.style.color = '#ff4444'; }
}
function sifreSifirla() {
    var em = sbId('sifreSifirlaEmail');
    var er = sbId('sifreSifirlaError');
    if (!er) return;
    er.style.color = '#ff4444';
    if (!em) { er.textContent = 'Xəta: forma tapılmadı!'; return; }
    var email = (em.value || '').trim();
    if (!email) { er.textContent = 'Email ünvanı daxil edin!'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { er.textContent = 'Düzgün email ünvanı daxil edin!'; return; }
    er.textContent = 'Göndərilir...';
    er.style.color = '#00d2ff';
    if (typeof auth === 'undefined' || !auth.sendPasswordResetEmail) {
        er.style.color = '#ff4444';
        er.textContent = 'Xəta: Firebase hazır deyil!';
        return;
    }
    auth.sendPasswordResetEmail(email).then(function () {
        er.style.color = '#00ff64';
        er.textContent = '✅ Şifrə sıfırlama linki emailinizə göndərildi!';
    }).catch(function (err) {
        er.style.color = '#ff4444';
        if (err && err.code === 'auth/user-not-found') {
            er.textContent = 'Bu email ilə hesab tapılmadı!';
        } else if (err && err.message) {
            er.textContent = 'Xəta: ' + err.message;
        } else {
            er.textContent = 'Xəta baş verdi!';
        }
    });
}

/* ------------------------------------------------------------------
   OYUN KARTI -> MƏLUMAT PƏNCƏRƏSİ -> SƏBƏT
------------------------------------------------------------------ */
function sbGameFind(alt, src) {
    if (typeof steamGameInfo === 'undefined' || !steamGameInfo) return null;
    var al = String(alt || '').trim().toLowerCase();
    var sr = String(src || '').toLowerCase();
    var stem = '';
    try { stem = sr.split('/').pop().replace(/\.[a-z0-9]+$/i, '').toLowerCase(); } catch (e) { }
    for (var i = 0; i < steamGameInfo.length; i++) {
        var g = steamGameInfo[i];
        var title = String(g.title || '').toLowerCase();
        var key = String(g.key || '').toLowerCase();
        if (al && (al === title || title.indexOf(al) > -1 || al.indexOf(title) > -1)) return g;
        if (stem && (stem === key || stem.indexOf(key) > -1 || key.indexOf(stem) > -1)) return g;
    }
    return null;
}

function sbCardPrice(card) {
    var price = '';
    var el = card.querySelector('.game-price-tag');
    if (el) { price = el.textContent.trim(); }
    if (!price) {
        var psEl = card.querySelector('.ps-price-tag span');
        if (psEl) {
            var pm = String(psEl.textContent || '').match(/\d{1,3}[.,]\d{2}/);
            if (pm) price = pm[0] + ' AZN';
        }
    }
    if (!price) {
        var t = String(card.textContent || '');
        var m = t.match(/💰\D{0,10}(\d{1,3}[.,]\d{2})\s*AZN/);
        if (!m) m = t.match(/(\d{1,3}[.,]\d{2})\s*AZN/);
        if (m) price = m[1] + ' AZN';
    }
    return price;
}

function sbRestorePrices() {
    try {
        document.querySelectorAll('.game-card').forEach(function (card) {
            if (card.querySelector('.game-price-tag')) return;
            if (card.querySelector('.ps-price-tag')) return;
            var p = sbCardPrice(card);
            if (!p) return;
            var span = document.createElement('span');
            span.className = 'game-price-tag';
            span.textContent = p;
            card.appendChild(span);
        });
    } catch (e) { }
}

var _sbInfoOverlay = null;
function gosterOyunInfo(card) {
    if (!card) return;
    var img = card.querySelector('img');
    var title = img ? (img.getAttribute('alt') || '').trim() : '';
    var image = img ? (img.getAttribute('src') || '') : '';
    var cardVideoEl = card.querySelector('video');
    var cardVideo = cardVideoEl ? (cardVideoEl.getAttribute('src') || '') : '';
    var titleEl = card.querySelector('.digital-hover-layer h4');
    if (titleEl && titleEl.textContent.trim()) title = titleEl.textContent.trim();
    var price = sbCardPrice(card);
    if (!title) return;

    var data = sbGameFind(title, image);
    var genre = data ? (data.genre || '') : '';
    var meta = data ? (data.metacritic || '') : '';
    var desc = data ? (data.description || '') : '';
    if (!desc) {
        var hov = card.querySelector('.digital-hover-layer');
        if (hov && hov.querySelector('p')) {
            desc = (hov.querySelector('p').textContent || '').trim();
        }
    }

    if (!_sbInfoOverlay) {
        _sbInfoOverlay = document.createElement('div');
        _sbInfoOverlay.className = 'game-info-modal';
        _sbInfoOverlay.addEventListener('click', function (e) {
            if (e.target === _sbInfoOverlay) { sbStopMusic(); _sbInfoOverlay.classList.remove('active'); }
        });
        document.body.appendChild(_sbInfoOverlay);
    }
    var chips = '';
    if (genre) chips += '<div class="game-info-chip"><span>Janr</span><strong>' + sbEsc(genre) + '</strong></div>';
    if (meta) chips += '<div class="game-info-chip"><span>Metacritic</span><strong>' + sbEsc(meta) + '</strong></div>';
    chips += '<div class="game-info-chip"><span>Qiymət</span><strong>' + sbEsc(price || '—') + '</strong></div>';

    var actionBtns =
        '<div class="game-info-actions">' +
        '<button type="button" class="game-info-cart-btn" onclick="sebeteAtFromInfo()">' +
        '<span class="btn-icon-wrap"><i class="fas fa-cart-plus"></i></span>' +
        '<span class="btn-title-text">Səbətə əlavə et</span>' +
        '</button>' +
        '<button type="button" class="game-info-buy-btn" onclick="birbasaSifarisFromInfo()">' +
        '<span class="btn-icon-wrap"><i class="fas fa-bolt"></i></span>' +
        '<span class="btn-label-group">' +
        '<span class="btn-title-text">Sifariş et</span>' +
        (price ? '<span class="btn-price-badge">' + sbEsc(price) + '</span>' : '') +
        '</span>' +
        '<i class="fas fa-arrow-right btn-arrow"></i>' +
        '</button>' +
        '</div>';

    _sbInfoOverlay.innerHTML =
        '<div class="game-info-panel">' +
        '<button class="game-info-close" onclick="sbStopMusic();this.closest(\'.game-info-modal\').classList.remove(\'active\')">&times;</button>' +
        '<div class="game-info-content">' +
        (cardVideo ? '<video class="game-info-image game-info-video" src="' + sbEsc(cardVideo) + '" autoplay muted loop playsinline></video>' : (image ? '<img class="game-info-image" src="' + sbEsc(image) + '" alt="' + sbEsc(title) + '">' : '')) +
        '<div class="game-info-body">' +
        '<h3>' + sbEsc(title) + '</h3>' +
        (chips ? '<div class="game-info-meta">' + chips + '</div>' : '') +
        (desc ? '<p class="game-info-description">' + sbEsc(desc) + '</p>' : '') +
        actionBtns +
        '</div></div></div>';
    _sbInfoOverlay.dataset.title = title;
    _sbInfoOverlay.dataset.price = price;
    _sbInfoOverlay.dataset.image = image;
    _sbInfoOverlay.classList.add('active');
}

function sebeteAtFromInfo() {
    if (!_sbInfoOverlay) return;
    if (!sbRequireLogin()) return;
    window._cartCurrentItem = {
        title: _sbInfoOverlay.dataset.title,
        price: _sbInfoOverlay.dataset.price,
        image: _sbInfoOverlay.dataset.image
    };
    sebeteElaveEt();
}

function birbasaSifarisFromInfo() {
    if (!_sbInfoOverlay) return;
    var title = _sbInfoOverlay.dataset.title || 'Oyun';
    var price = _sbInfoOverlay.dataset.price || '';
    var uu = localStorage.getItem('sb_current_user');
    var uname = '';
    try { uname = JSON.parse(uu).username; } catch(e) {}
    var msg = 'Salam, SteamBazari.az saytından sifariş etmək istəyirəm:\n\n' +
              '🎮 Oyun: ' + title + '\n' +
              '💰 Qiymət: ' + price;
    if (uname) {
        msg += '\n👤 İstifadəçi: ' + uname;
    }
    window.open('https://wa.me/994559308887?text=' + encodeURIComponent(msg), '_blank');
}

function sifarisEtFromInfo() {
    sebeteAtFromInfo();
}

var _sbCurrentHoverCard = null;
var _sbHoverSoundTimer = null;

function setupSteamGameInfo() {
    // 1. KLİK: Modalı açır və həm klik səsini, həm də oyunun saundtrekini oxudur
    document.addEventListener('click', function (e) {
        var t = e.target;
        while (t && t !== document && !(t.classList && t.classList.contains('game-card'))) t = t.parentNode;
        if (t && t !== document && t.classList && t.classList.contains('game-card')) {
            sbPlayCardSound(t, true);
            gosterOyunInfo(t);
        }
    });

    // 2. HOVER (MOUSEOVER): Kartın üzərinə gələndə mahnını dərhal oxutmağa başlayır
    document.addEventListener('mouseover', function (e) {
        var t = e.target;
        while (t && t !== document && !(t.classList && t.classList.contains('game-card'))) t = t.parentNode;
        if (t && t !== document && t.classList && t.classList.contains('game-card')) {
            if (t === _sbCurrentHoverCard) return;
            _sbCurrentHoverCard = t;
            clearTimeout(_sbHoverSoundTimer);
            _sbHoverSoundTimer = setTimeout(function () {
                var modal = document.querySelector('.game-info-modal.active');
                if (!modal) {
                    sbPlayCardSound(t, false);
                }
            }, 60);
        }
    });

    // 3. LEAVE (MOUSEOUT): Kartın üzərindən kursor çıxanda mahnını dayandırır (əgər modal açıq deyilsə)
    document.addEventListener('mouseout', function (e) {
        var t = e.target;
        while (t && t !== document && !(t.classList && t.classList.contains('game-card'))) t = t.parentNode;
        if (t && t !== document && t.classList && t.classList.contains('game-card')) {
            var rel = e.relatedTarget;
            while (rel && rel !== document && rel !== t) rel = rel.parentNode;
            if (rel === t) return; // Hələ də kartın içindədir
            if (_sbCurrentHoverCard === t) {
                _sbCurrentHoverCard = null;
            }
            clearTimeout(_sbHoverSoundTimer);
            var modal = document.querySelector('.game-info-modal.active');
            if (!modal) {
                sbStopMusic();
            }
        }
    });

    // 4. BROWSER AUTOPLAY UNLOCK: İstifadəçi səhifəyə toxunan kimi audio blokunu aradan qaldırır
    var unlockAudio = function () {
        var track = document.getElementById('game-soundtrack');
        if (track) {
            track.volume = 0.5;
        }
        ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(function (evt) {
            document.removeEventListener(evt, unlockAudio);
        });
    };
    ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(function (evt) {
        document.addEventListener(evt, unlockAudio, { passive: true, once: true });
    });
}

function sbPlayCardSound(card, playClick) {
    try {
        var img = card.querySelector('img');
        if (!img) return;
        var src = img.getAttribute('src') || '';
        var file = src.split('/').pop().split('?')[0];
        var base;
        try { base = decodeURIComponent(file).replace(/\.[^.]+$/, ''); } catch (e) { base = file.replace(/\.[^.]+$/, ''); }
        if (!base) return;

        if (playClick !== false) {
            var clickEl = document.getElementById('clickSound');
            if (clickEl) {
                clickEl.currentTime = 0;
                clickEl.volume = 0.35;
                clickEl.play().catch(function () { });
            }
        }

        var track = document.getElementById('game-soundtrack');
        if (!track) {
            track = document.createElement('audio');
            track.id = 'game-soundtrack';
            track.preload = 'auto';
            track.style.display = 'none';
            document.body.appendChild(track);
        }

        var mapped = sbSoundtrackMap[base];
        if (mapped === null) return;
        var mp3;
        if (mapped instanceof Array) {
            mp3 = mapped[Math.floor(Math.random() * mapped.length)];
        } else {
            mp3 = mapped ? mapped : (base + '_soundtrack.mp3');
        }
        var decodedSrc = decodeURIComponent(track.getAttribute('src') || '');
        if (decodedSrc !== mp3) {
            track.src = mp3;
        }
        track.volume = 0.5;
        var st = (sbSoundtrackStart[base] !== undefined ? sbSoundtrackStart[base] : sbSoundtrackStart[mp3]) || 0;
        sbStartTrack(track, st);
    } catch (e) { }
}

function sbStartTrack(track, startSec) {
    try {
        track.volume = 0.5;
        if (startSec > 0 && track.readyState >= 1) {
            track.currentTime = startSec;
        }
    } catch (e) { }

    var p = track.play();
    if (p && typeof p.catch === 'function') {
        p.catch(function () { });
    }

    if (startSec > 0) {
        var onMeta = function () {
            track.removeEventListener('loadedmetadata', onMeta);
            try { track.currentTime = startSec; } catch (e) { }
        };
        track.addEventListener('loadedmetadata', onMeta);
    }
}

function sbStopMusic() {
    try {
        var t = document.getElementById('game-soundtrack');
        if (t) {
            t.pause();
            t.currentTime = 0;
        }
    } catch (e) { }
}

var sbSoundtrackStart = {
    /* Saniyələrlə: şəkil adı və ya mp3 adı -> başlanğıc saniyə */
    "ggta5_soundtrack.mp3": 29,
    "rdr2_soundtrack.mp3": 33,
    "last_of_us_soundtrack.mp3": 18,
    "tlou_p2_soundtrack.mp3": 17,
    "assassin_soundtrack.mp3": 34,
    "unity_soundtrack.mp3": 33,
    "uc4_soundtrack.mp3": 10,
    "jones_soundtrack.mp3": 6,
    "acorigins_soundtrack.mp3": 3,
    "nba2k26_soundtrack.mp3": 7.6,
    "taxilife_soundtrack.mp3": 15,
    "mk11_soundtrack.mp3": 4,
    "mk1_soundtrack.mp3": 4,
    "cod_soundtrack.mp3": 5,
    "cod3_soundtrack.mp3": 5,
    "black-ops-6_soundtrack.mp3": 3,
    "bo2_soundtrack.mp3": 5,
    "call-of-duty-modern-3840x2160-13480_soundtrack.mp3": 5,
    "trilogy_sanandreas.mp3": 3,
    "Assassin’s_Creed_-_Unity": 34,
    "acblackflag": 10
};

var sbSoundtrackMap = {
    "Pragmata_cover": "pragmata_soundtrack.mp3",
    "crimson-desert-191ki": "crimson_soundtrack.mp3",
    "Silent_Hill_2_remake_cover": "silent_hill_2_soundtrack.mp3",
    "Alan_Wake_2_(game)": "alan_wake_2_soundtrack.mp3",
    "The_Last_of_Us_capa": "last_of_us_soundtrack.mp3",
    "TLOU_P2_Box_Art_2": "tlou_p2_soundtrack.mp3",
    "Alien_Isolation": "alien_isolation_soundtrack.mp3",
    "layers-of-fear-cloth-covering-painting-mwksd3fmz3x7tv9w": "layers-of-fear_soundtrack.mp3",
    "Call-of-Duty-Modern-Warfare-II_Reveal_X1_Wire_Hero_1920x1080-b5aea4e5ca6046ac478e": "cod_soundtrack.mp3",
    "call-of-duty-modern-warfare-pc-cover": "cod_soundtrack.mp3",
    "call-of-duty-black-ops-6-pc-game-battle-net-cover": "black-ops-6_soundtrack.mp3",
    "call-of-duty-black-ops-pc-game-steam-europe-cover": "black-ops_soundtrack.mp3",
    "COD-BO2": "bo2_soundtrack.mp3",
    "call-of-duty-black-ops-3-ps4-wallpapers-07": "black-ops-3_soundtrack.mp3",
    "Battlefield_1": "bf1_soundtrack.mp3",
    "battlefield-6-phantom-edition-pc-ea-app-cover": "battlefield-6_soundtrack.mp3",
    "Sekiro_art": "sekiro_soundtrack.mp3",
    "Cyberpunk-2077-PC-COVER": "cyberpunk_soundtrack.mp3",
    "God_of_War_Ragnarök_cover": "ragnarök_soundtrack.mp3",
    "expedition-33-v0-cq69az5xp6cg1": "expedition_soundtrack.mp3",
    "rise of": "rise_of_soundtrack.mp3",
    "Assassin’s_Creed_-_Unity": "assassin_soundtrack.mp3",
    "ACOrigins_STD_Store_Portrait_1200x1600_1200x1600-4a79f9f393f7a3a9e5be3a0ae581f3d5": "acorigins_soundtrack.mp3",
    "ac3_cover": "ac3_soundtrack.mp3",
    "A-Way-Out": "a-way-out_soundtrack.mp3",
    "taxilife1": "taxilife_soundtrack.mp3",
    "fm261": "fm26_soundtrack.mp3",
    "forza6 (2)": "forza6_soundtrack.mp3",
    "Dead-by-Daylight-jpg": "dead-by-daylight_soundtrack.mp3",
    "Dead-Island-2": "dead-island-2_soundtrack.mp3",
    "Back_4_Blood_cover_art": "back_4_blood_soundtrack.mp3",
    "escape_the_backrooms (1)": "escape_the_backrooms_soundtrack.mp3",
    "subnautica_2_early_access_roadmap_all_planned_content_explained_hero_d5ecfe5d7b": "subnautica_2_soundtrack.mp3",
    "rematch-ny9l9": "rematch_soundtrack.mp3",
    "SnowRunner_cover": "snowrunner_soundtrack.mp3",
    "watch-dogs-legion": "legion_soundtrack.mp3",
    "Resident_Evil_Village": "re8_soundtrack.mp3",
    "acblackflag": "assassin_soundtrack.mp3",
    "the-mortuary-assistant-2026-mPyOBq": "mortuary_soundtrack.mp3",
    "mirage": "assassin_soundtrack.mp3",
    "Mafia Trilogy": "mafia1_soundtrack.mp3",
    "ufc5": "undisputed_soundtrack.mp3",
    "vanguard1": "codww_soundtrack.mp3",
    "Grand_theft_auto_the_trilogy_kapak": ["trilogy_gta3.mp3", "trilogy_vicecity.mp3", "trilogy_sanandreas.mp3"],
    "minecraft": null,
    "rust": null,
    "2k": null,
    "steam": null,
    "ubisoft": null,
    "epic-games-free-announcement": null,
    "canva": null,
    "duo": null,
    "spotify": null,
    "windows": null,
    "kasper": null,
    "geforce": null,
    "gamepass ": null,
    "xbox-game-pass-ultimate_gby8": null,
    "netflix": null,
    "250": null,
    "500": null,
    "750": null,
    "1000": null,
    "1500 (2)": null,
    "2000": null
};

/* ------------------------------------------------------------------
   ZİYARƏTÇİ İZLƏMƏ + KLİK SAYĞACI
------------------------------------------------------------------ */
function trackVisitor() {
    try {
        var k = 'sb_visitor_sent_' + new Date().toDateString();
        if (localStorage.getItem(k)) return;
        if (typeof db === 'undefined' || !db.ref) return;
        db.ref('visitors').push({
            timestamp: sbNow(),
            page: location.pathname || '/',
            ua: (navigator.userAgent || '').slice(0, 180)
        }).then(function () {
            try { localStorage.setItem(k, '1'); } catch (e) { }
        }).catch(function () { });
    } catch (e) { }
}

var _sbClickLastWrite = 0;
function initClickCounter() {
    document.addEventListener('click', function () {
        try {
            if (typeof db === 'undefined' || !db.ref) return;
            var now = Date.now();
            if (now - _sbClickLastWrite < 1000) return;
            _sbClickLastWrite = now;
            db.ref('clickCounter').once('value').then(function (s) {
                var c = (typeof s.val() === 'number' ? s.val() : 0) + 1;
                return db.ref('clickCounter').set(c);
            }).catch(function () { });
        } catch (e) { }
    });
}

/* ------------------------------------------------------------------
   FAQ (Verilən suallar) - yükləmə + admin
------------------------------------------------------------------ */
function sbYukleFAQ() {
    var list = sbId('faqList');
    if (!list) return;
    list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);font-size:13px;padding:20px 0;">Suallar yüklənir...</p>';
    if (typeof db === 'undefined' || !db.ref) { list.innerHTML = ''; return; }
    db.ref('faq').once('value').then(function (snap) {
        var items = snap.val() || {};
        var arr = [];
        Object.keys(items).forEach(function (k) {
            var it = items[k] || {};
            arr.push({ key: k, q: it.question || '', a: it.answer || '', icon: it.icon || '❓', order: it.order || 0 });
        });
        arr.sort(function (x, y) { return (x.order || 0) - (y.order || 0); });
        if (arr.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);font-size:13px;padding:20px 0;">Hələ sual əlavə edilməyib.</p>';
            return;
        }
        var h = '';
        arr.forEach(function (it, i) {
            h += '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0;overflow:hidden;">' +
                '<div onclick="var p=this.nextElementSibling;var o=p.classList.contains(\'open\');document.querySelectorAll(\'.sb-expand\').forEach(function(e){e.classList.remove(\'open\')});if(!o)p.classList.add(\'open\')" style="display:flex;align-items:center;gap:10px;padding:13px 14px;cursor:pointer;">' +
                '<span style="font-size:17px;">' + sbEsc(it.icon) + '</span>' +
                '<span style="color:#fff;font-size:14px;font-weight:600;flex:1;">' + sbEsc(it.q) + '</span>' +
                '<span style="color:#00d2ff;font-size:13px;">+</span></div>' +
                '<div class="sb-expand" style="padding:0 14px 13px;">' + sbEsc(it.a) + '</div>' +
                '</div>';
        });
        list.innerHTML = h;
    }).catch(function () {
        list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);font-size:13px;padding:20px 0;">Suallar yüklənə bilmədi.</p>';
    });
}

function adminFAQAc(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (!isAdmin()) { myToast('❌ Yalnız admin!', 'r'); return; }
    var m = sbId('adminFAQModal');
    if (m) m.classList.add('active');
    adminFAQYenile();
}
function adminFAQFormAc() {
    var m = sbId('adminFAQEditModal');
    if (!m) return;
    sbId('adminFAQEditTitle').textContent = 'Yeni Sual';
    sbId('adminFAQEditKey').value = '';
    sbId('faqEditQuestion').value = '';
    sbId('faqEditAnswer').value = '';
    sbId('faqEditIcon').value = '';
    sbId('faqEditOrder').value = '0';
    sbId('faqEditError').textContent = '';
    m.classList.add('active');
}
function adminFAQDuzelt(key) {
    if (typeof db === 'undefined') return;
    db.ref('faq/' + key).once('value').then(function (snap) {
        var d = snap.val() || {};
        sbId('adminFAQEditTitle').textContent = 'Suala Düzəliş Et';
        sbId('adminFAQEditKey').value = key;
        sbId('faqEditQuestion').value = d.question || '';
        sbId('faqEditAnswer').value = d.answer || '';
        sbId('faqEditIcon').value = d.icon || '';
        sbId('faqEditOrder').value = d.order || 0;
        sbId('faqEditError').textContent = '';
        sbId('adminFAQEditModal').classList.add('active');
    }).catch(function () { myToast('❌ Yüklənə bilmədi', 'r'); });
}
function adminFAQYaddaEt() {
    var er = sbId('faqEditError');
    if (!er) return;
    er.textContent = '';
    var q = (sbId('faqEditQuestion').value || '').trim();
    var a = (sbId('faqEditAnswer').value || '').trim();
    var key = sbId('adminFAQEditKey').value;
    if (!q) { er.textContent = 'Sual daxil edin!'; return; }
    if (!a) { er.textContent = 'Cavab daxil edin!'; return; }
    var obj = {
        question: q,
        answer: a,
        icon: (sbId('faqEditIcon').value || '').trim() || '❓',
        order: parseInt(sbId('faqEditOrder').value, 10) || 0,
        updatedAt: sbNow()
    };
    var p;
    if (key) p = db.ref('faq/' + key).update(obj);
    else p = db.ref('faq').push(obj);
    p.then(function () {
        modalKapat('adminFAQEditModal');
        myToast('✅ FAQ yadda saxlanıldı!', 'g');
        adminFAQYenile();
        sbYukleFAQ();
    }).catch(function (err) { er.textContent = 'Xəta: ' + err.message; });
}
function adminFAQSil(key) {
    if (!confirm('Bu sualı silmək istədiyinizə əminsiniz?')) return;
    db.ref('faq/' + key).remove().then(function () {
        myToast('🗑️ Sual silindi', 'b');
        adminFAQYenile();
        sbYukleFAQ();
    }).catch(function () { myToast('❌ Silinə bilmədi', 'r'); });
}
function adminFAQYenile() {
    var list = sbId('adminFAQList');
    if (!list) return;
    list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-size:13px;">Yüklənir...</p>';
    if (typeof db === 'undefined') { list.innerHTML = ''; return; }
    db.ref('faq').once('value').then(function (snap) {
        var items = snap.val() || {};
        var keys = Object.keys(items);
        if (!keys.length) {
            list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-size:13px;">Hələ sual yoxdur</p>';
            return;
        }
        var arr = [];
        keys.forEach(function (k) {
            var it = items[k] || {};
            arr.push({ key: k, q: it.question || '', a: it.answer || '', icon: it.icon || '', order: it.order || 0 });
        });
        arr.sort(function (x, y) { return (x.order || 0) - (y.order || 0); });
        var h = '';
        arr.forEach(function (it) {
            h += '<div class="sb-list-item" style="margin-bottom:8px;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">' +
                '<div style="flex:1;min-width:0;"><div style="color:#fff;font-size:13px;font-weight:600;">' + sbEsc(it.icon) + ' ' + sbEsc(it.q) + '</div>' +
                '<div style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:3px;">' + sbEsc(it.a) + '</div></div>' +
                '<div style="display:flex;gap:6px;flex-shrink:0;">' +
                '<button class="sb-row-btn" style="border-color:rgba(0,210,255,0.5);color:#00d2ff;" onclick="adminFAQDuzelt(\'' + it.key + '\')"><i class="fas fa-edit"></i> Düzəlt</button>' +
                '<button class="sb-row-btn" style="border-color:rgba(255,80,80,0.5);color:#ff5050;" onclick="adminFAQSil(\'' + it.key + '\')"><i class="fas fa-trash"></i></button>' +
                '</div></div></div>';
        });
        list.innerHTML = h;
    }).catch(function () {
        list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-size:13px;">Yüklənə bilmədi</p>';
    });
}

/* ------------------------------------------------------------------
   SUAL-CAVAB (qa) - istifadəçi + admin
------------------------------------------------------------------ */
function sbYukleQA() {
    var list = sbId('qaList');
    if (!list) return;
    list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);font-size:13px;padding:20px 0;">Suallar yüklənir...</p>';
    if (typeof db === 'undefined') { list.innerHTML = ''; return; }
    db.ref('qa').once('value').then(function (snap) {
        var items = snap.val() || {};
        var arr = [];
        Object.keys(items).forEach(function (k) {
            var it = items[k] || {};
            arr.push({ key: k, name: it.name || '', question: it.question || it.text || '', answer: it.answer || '', createdAt: it.createdAt || it.timestamp || '' });
        });
        arr.sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
        if (!arr.length) {
            list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);font-size:13px;padding:20px 0;">Hələ sual verilməyib. İlk sualı siz verin!</p>';
            return;
        }
        var h = '';
        arr.slice(0, 30).forEach(function (it) {
            h += '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px 14px;">' +
                '<div style="display:flex;justify-content:space-between;gap:10px;align-items:baseline;">' +
                '<span style="color:#00d2ff;font-size:12px;font-weight:700;"><i class="fas fa-user"></i> ' + sbEsc(it.name) + '</span>' +
                '<span style="color:rgba(255,255,255,0.35);font-size:11px;">' + sbEsc(sbFmt(it.createdAt)) + '</span></div>' +
                '<div style="color:#fff;font-size:13px;margin-top:6px;">' + sbEsc(it.question) + '</div>' +
                (it.answer ? '<div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:8px;border-left:2px solid rgba(0,210,255,0.5);padding-left:10px;">' +
                    '<span style="color:#ffd700;font-size:11px;font-weight:700;">👑 SteamBazari cavabı:</span><br>' + sbEsc(it.answer) + '</div>' : '') +
                '</div>';
        });
        list.innerHTML = h;
    }).catch(function () {
        list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.3);font-size:13px;padding:20px 0;">Suallar yüklənə bilmədi.</p>';
    });
}

function userSualVer() {
    if (!sbRequireLogin()) return;
    var m = sbId('userQAModal');
    if (!m) return;
    var name = sbUserName();
    if (name) sbId('qaUserName').value = name;
    sbId('qaQuestionText').value = '';
    var er = sbId('qaError'); if (er) { er.textContent = ''; }
    var ok = sbId('qaSuccess'); if (ok) { ok.style.display = 'none'; }
    m.classList.add('active');
}
function qaGonder() {
    var name = sbUserName();
    var question = (sbId('qaQuestionText').value || '').trim();
    var er = sbId('qaError'), ok = sbId('qaSuccess');
    if (!er) return;
    er.textContent = '';
    if (!name) { er.textContent = 'Zəhmət olmasa daxil olun!'; return; }
    if (!question) { er.textContent = 'Sualınızı yazın!'; return; }
    db.ref('qa').push({
        name: name,
        question: question,
        answer: '',
        createdAt: sbNow(),
        answeredAt: ''
    }).then(function () {
        sbId('qaQuestionText').value = '';
        ok.textContent = '✅ Sualınız göndərildi! Cavab yaxında əlavə olunacaq.';
        ok.style.display = 'block';
        setTimeout(function () { modalKapat('userQAModal'); ok.style.display = 'none'; }, 2200);
        sbYukleQA();
    }).catch(function (err) { er.textContent = 'Xəta: ' + err.message; });
}

function adminQAAc(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (!isAdmin()) { myToast('❌ Yalnız admin!', 'r'); return; }
    var m = sbId('adminQAModal');
    if (m) m.classList.add('active');
    adminQAYenile();
}
function adminQAYenile() {
    var list = sbId('adminQAList');
    if (!list) return;
    list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-size:13px;">Yüklənir...</p>';
    if (typeof db === 'undefined') { list.innerHTML = ''; return; }
    db.ref('qa').once('value').then(function (snap) {
        var items = snap.val() || {};
        var keys = Object.keys(items);
        if (!keys.length) { list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;font-size:13px;">Hələ sual yoxdur</p>'; return; }
        var arr = [];
        keys.forEach(function (k) {
            var it = items[k] || {};
            arr.push({ key: k, name: it.name || '', question: it.question || '', answer: it.answer || '', createdAt: it.createdAt || '' });
        });
        arr.sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); });
        var h = '';
        arr.forEach(function (it) {
            var answered = it.answer ? '<span style="color:#00ff64;">Cavablandı</span>' : '<span style="color:#ffd700;">Gözləyir</span>';
            h += '<div class="sb-list-item" style="margin-bottom:8px;">' +
                '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">' +
                '<div style="flex:1;min-width:0;"><span style="color:#00d2ff;font-size:12px;font-weight:700;">' + sbEsc(it.name) + '</span> &nbsp;' + answered +
                '<div style="color:#fff;font-size:13px;margin-top:4px;">' + sbEsc(it.question) + '</div>' +
                (it.answer ? '<div style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:4px;">Cavab: ' + sbEsc(it.answer) + '</div>' : '') +
                '</div>' +
                '<div style="display:flex;gap:6px;flex-shrink:0;">' +
                '<button class="sb-row-btn" style="border-color:rgba(0,210,255,0.5);color:#00d2ff;" onclick="adminQADuzelt(\'' + it.key + '\')"><i class="fas fa-edit"></i></button>' +
                '<button class="sb-row-btn" style="border-color:rgba(255,80,80,0.5);color:#ff5050;" onclick="adminQASil(\'' + it.key + '\')"><i class="fas fa-trash"></i></button>' +
                '</div></div></div>';
        });
        list.innerHTML = h;
    }).catch(function () { list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px;">Yüklənə bilmədi</p>'; });
}
function adminQADuzelt(key) {
    if (typeof db === 'undefined') return;
    db.ref('qa/' + key).once('value').then(function (snap) {
        var d = snap.val() || {};
        sbId('adminQAEditTitle').textContent = 'Suala Düzəliş Et';
        sbId('adminQAEditKey').value = key;
        sbId('qaEditName').value = d.name || '';
        sbId('qaEditText').value = d.question || '';
        sbId('qaEditAnswer').value = d.answer || '';
        var dt = d.createdAt || d.answeredAt || '';
        var dd = sbId('qaEditDate'), tm = sbId('qaEditTime');
        if (dd) dd.value = dt ? dt.slice(0, 10) : '';
        if (tm) tm.value = dt ? dt.slice(11, 16) : '';
        sbId('qaEditError').textContent = '';
        sbId('adminQAEditModal').classList.add('active');
    }).catch(function () { myToast('❌ Yüklənə bilmədi', 'r'); });
}
function qaAdminYaddaEt() {
    var er = sbId('qaEditError');
    if (!er) return;
    er.textContent = '';
    var key = sbId('adminQAEditKey').value;
    var name = (sbId('qaEditName').value || '').trim();
    var q = (sbId('qaEditText').value || '').trim();
    var a = (sbId('qaEditAnswer').value || '').trim();
    var date = sbId('qaEditDate').value || '';
    var time = sbId('qaEditTime').value || '';
    if (!q) { er.textContent = 'Sual daxil edin!'; return; }
    if (!name) { er.textContent = 'Ad daxil edin!'; return; }
    var ts = date + (time ? 'T' + time : '') + (time ? ':00' : '');
    var obj = { name: name, question: q, answer: a };
    if (ts) { obj.createdAt = new Date(ts).toISOString(); }
    if (a) { obj.answeredAt = sbNow(); obj.answeredBy = 'elcan'; }
    var p = key ? db.ref('qa/' + key).update(obj) : db.ref('qa').push(obj);
    p.then(function () {
        modalKapat('adminQAEditModal');
        myToast('✅ Yadda saxlanıldı!', 'g');
        adminQAYenile();
        sbYukleQA();
    }).catch(function (err) { er.textContent = 'Xəta: ' + err.message; });
}
function adminQASil(key) {
    if (!confirm('Bu sualı silmək istədiyinizə əminsiniz?')) return;
    db.ref('qa/' + key).remove().then(function () {
        myToast('🗑️ Sual silindi', 'b');
        adminQAYenile();
        sbYukleQA();
    }).catch(function () { myToast('❌ Silinə bilmədi', 'r'); });
}

/* ------------------------------------------------------------------
   MÜŞTƏRİ RƏYLƏRİ (testimonials)
------------------------------------------------------------------ */
function sbYukleTestimonials() {
    var grid = sbId('testimonialsGrid');
    if (!grid) return;
    grid.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.35);padding:24px;">Rəylər yüklənir...</p>';
    if (typeof db === 'undefined') { grid.innerHTML = ''; return; }
    db.ref('testimonials').once('value').then(function (snap) {
        var items = snap.val() || {};
        var arr = [];
        Object.keys(items).forEach(function (k) {
            var it = items[k] || {};
            arr.push({ key: k, name: it.name || '', text: it.text || '', stars: parseInt(it.stars, 10) || 5, product: it.product || '', reply: it.reply || '', date: it.date || it.createdAt || '' });
        });
        arr.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
        if (!arr.length) {
            grid.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.35);padding:24px;">Hələ rəy yoxdur. İlk rəyi siz yazın!</p>';
            return;
        }
        var h = '';
        arr.forEach(function (it) {
            var stars = '';
            for (var s = 0; s < 5; s++) stars += (s < it.stars ? '★' : '☆');
            h += '<div class="testimonial-card" style="display:flex;flex-direction:column;gap:6px;">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">' +
                '<span style="color:#fff;font-weight:700;font-size:14px;"><i class="fas fa-user-circle"></i> ' + sbEsc(it.name) + '</span>' +
                '<span style="color:#ffd700;font-size:14px;letter-spacing:2px;">' + stars + '</span></div>' +
                (it.product ? '<div style="color:#00d2ff;font-size:12px;"><i class="fas fa-shopping-bag"></i> ' + sbEsc(it.product) + '</div>' : '') +
                '<p style="color:rgba(255,255,255,0.85);font-size:13px;line-height:1.6;margin:0;">' + sbEsc(it.text) + '</p>' +
                (it.reply ? '<div style="border-left:2px solid rgba(0,210,255,0.5);padding-left:10px;font-size:12px;color:rgba(255,255,255,0.65);">' +
                    '<span style="color:#ffd700;font-weight:700;">👑 SteamBazari:</span> ' + sbEsc(it.reply) + '</div>' : '') +
                (it.date ? '<span style="color:rgba(255,255,255,0.3);font-size:11px;">' + sbEsc(sbFmt(it.date)) + '</span>' : '') +
                '</div>';
        });
        grid.innerHTML = h;
    }).catch(function () {
        grid.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.35);padding:24px;">Rəylər yüklənə bilmədi.</p>';
    });
}

function sbFillProductSelect(sel) {
    if (!sel) return;
    if (sel.options.length > 1) return;
    var titles = [];
    if (typeof steamGameInfo !== 'undefined' && steamGameInfo) {
        steamGameInfo.forEach(function (g) {
            if (g && g.title && titles.indexOf(g.title) < 0) titles.push(g.title);
        });
    }
    titles.sort();
    titles.forEach(function (t) {
        var o = document.createElement('option');
        o.value = t;
        o.textContent = t;
        sel.appendChild(o);
    });
}

function userTestimonialAc() {
    if (!sbRequireLogin()) return;
    var m = sbId('userTestimonialModal');
    if (!m) return;
    var name = sbUserName();
    if (name) sbId('userTestNameInput').value = name;
    sbId('userTestTextInput').value = '';
    sbId('userTestStarsInput').value = '5';
    sbId('userEditingTestimonialKey').value = '';
    sbFillProductSelect(sbId('userTestProductInput'));
    var dField = sbId('userTestDateField'), rField = sbId('userTestReplyField');
    if (dField) dField.style.display = 'none';
    if (rField) rField.style.display = 'none';
    sbId('userTestimonialFormTitle').textContent = 'Rəy Yaz';
    var cb = sbId('userTestimonialCancelBtn'); if (cb) cb.style.display = 'none';
    var er = sbId('userTestimonialError'); if (er) er.textContent = '';
    var ok = sbId('userTestimonialSuccess'); if (ok) ok.style.display = 'none';
    m.classList.add('active');
}
function userTestimonialGonder() {
    var name = sbUserName();
    var text = (sbId('userTestTextInput').value || '').trim();
    var stars = sbId('userTestStarsInput').value || '5';
    var product = sbId('userTestProductInput').value || '';
    var er = sbId('userTestimonialError'), ok = sbId('userTestimonialSuccess');
    if (!er) return;
    er.textContent = '';
    if (!name) { er.textContent = 'Zəhmət olmasa daxil olun!'; return; }
    if (!text) { er.textContent = 'Rəyinizi yazın!'; return; }
    var key = sbId('userEditingTestimonialKey').value || '';
    var obj = { name: name, text: text, stars: parseInt(stars, 10) || 5, product: product, date: sbNow() };
    var p;
    if (key) {
        p = db.ref('testimonials/' + key).update(obj);
    } else {
        p = db.ref('testimonials').push(obj);
    }
    p.then(function () {
        sbId('userTestTextInput').value = '';
        ok.textContent = '✅ Rəyiniz üçün təşəkkürlər!';
        ok.style.display = 'block';
        setTimeout(function () { modalKapat('userTestimonialModal'); ok.style.display = 'none'; }, 2200);
        sbYukleTestimonials();
    }).catch(function (err) { er.textContent = 'Xəta: ' + err.message; });
}
function userTestimonialLegvEt() {
    var keyEl = sbId('userEditingTestimonialKey');
    if (keyEl) keyEl.value = '';
    var cb = sbId('userTestimonialCancelBtn');
    if (cb) cb.style.display = 'none';
    var ok = sbId('userTestimonialSuccess');
    if (ok) ok.style.display = 'none';
    var er = sbId('userTestimonialError');
    if (er) er.textContent = '';
}

function adminTestimonialsAc(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (!isAdmin()) { myToast('❌ Yalnız admin!', 'r'); return; }
    var m = sbId('adminTestimonialsModal');
    if (m) m.classList.add('active');
    adminTestimonialLegvEt();
    adminTestimonialYenile();
}
function adminTestimonialLegvEt() {
    sbId('editingTestimonialKey').value = '';
    sbId('adminTestimonialFormTitle').textContent = 'Yeni Rəy Əlavə Et';
    sbId('testimonialNameInput').value = '';
    sbId('testimonialTextInput').value = '';
    sbId('testimonialStarsInput').value = '5';
    sbId('testimonialProductInput').value = '';
    sbId('testimonialReplyInput').value = '';
    sbId('testimonialCategoryInput').value = '';
    sbId('testimonialDateInput').value = '';
    sbId('testimonialTimeInput').value = '';
    sbId('adminTestimonialError').textContent = '';
    sbId('adminTestimonialSuccess').style.display = 'none';
    var btn = sbId('adminTestimonialSubmitBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-plus"></i> Rəy Əlavə Et';
    var cb = sbId('adminTestimonialCancelBtn');
    if (cb) cb.style.display = 'none';
}
function adminTestimonialYaddaHelper() {
    var er = sbId('adminTestimonialError');
    er.textContent = '';
    var name = (sbId('testimonialNameInput').value || '').trim();
    var text = (sbId('testimonialTextInput').value || '').trim();
    var stars = sbId('testimonialStarsInput').value || '5';
    var product = sbId('testimonialProductInput').value || '';
    var reply = sbId('testimonialReplyInput').value || '';
    var category = sbId('testimonialCategoryInput').value || '';
    var date = sbId('testimonialDateInput').value || '';
    var time = sbId('testimonialTimeInput').value || '';
    var key = sbId('editingTestimonialKey').value || '';
    if (!name) { er.textContent = 'Müştəri adı daxil edin!'; return; }
    if (!text) { er.textContent = 'Rəy mətni daxil edin!'; return; }
    var ts = date ? (date + (time ? 'T' + time : 'T00:00')) : sbNow();
    var obj = { name: name, text: text, stars: parseInt(stars, 10) || 5, product: product, reply: reply, category: category, date: ts };
    var p = key ? db.ref('testimonials/' + key).update(obj) : db.ref('testimonials').push(obj);
    p.then(function () {
        sbId('adminTestimonialSuccess').textContent = '✅ Yadda saxlanıldı!';
        sbId('adminTestimonialSuccess').style.display = 'block';
        adminTestimonialLegvEt();
        adminTestimonialYenile();
        sbYukleTestimonials();
    }).catch(function (err) { er.textContent = 'Xəta: ' + err.message; });
}
function adminTestimonialElaveEt() {
    if (!isAdmin()) { myToast('❌ Yalnız admin!', 'r'); return; }
    adminTestimonialYaddaHelper();
}
function adminTestDuzelt(key) {
    if (typeof db === 'undefined') return;
    db.ref('testimonials/' + key).once('value').then(function (snap) {
        var d = snap.val() || {};
        sbId('editingTestimonialKey').value = key;
        sbId('adminTestimonialFormTitle').textContent = 'Rəyə Düzəliş Et';
        sbId('testimonialNameInput').value = d.name || '';
        sbId('testimonialTextInput').value = d.text || '';
        sbId('testimonialStarsInput').value = d.stars || 5;
        sbId('testimonialProductInput').value = d.product || '';
        sbId('testimonialReplyInput').value = d.reply || '';
        sbId('testimonialCategoryInput').value = d.category || '';
        var dt = d.date || d.createdAt || '';
        sbId('testimonialDateInput').value = dt ? dt.slice(0, 10) : '';
        sbId('testimonialTimeInput').value = dt ? dt.slice(11, 16) : '';
        sbId('adminTestimonialError').textContent = '';
        sbId('adminTestimonialSuccess').style.display = 'none';
        var btn = sbId('adminTestimonialSubmitBtn');
        if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Yadda Saxla';
        var cb = sbId('adminTestimonialCancelBtn');
        if (cb) cb.style.display = 'block';
    }).catch(function () { myToast('❌ Yüklənə bilmədi', 'r'); });
}
function adminTestSil(key) {
    if (!confirm('Bu rəyi silmək istədiyinizə əminsiniz?')) return;
    db.ref('testimonials/' + key).remove().then(function () {
        myToast('🗑️ Rəy silindi', 'b');
        adminTestimonialYenile();
        sbYukleTestimonials();
    }).catch(function () { myToast('❌ Silinə bilmədi', 'r'); });
}
function adminTestimonialYenile() {
    var list = sbId('adminTestimonialsList');
    if (!list) return;
    list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px 0;font-size:13px;">Rəylər yüklənir...</p>';
    if (typeof db === 'undefined') { list.innerHTML = ''; return; }
    db.ref('testimonials').once('value').then(function (snap) {
        var items = snap.val() || {};
        var keys = Object.keys(items);
        if (!keys.length) { list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px 0;font-size:13px;">Hələ rəy yoxdur</p>'; return; }
        var arr = [];
        keys.forEach(function (k) {
            var it = items[k] || {};
            arr.push({ key: k, name: it.name || '', text: it.text || '', stars: it.stars || 5, product: it.product || '', reply: it.reply || '', date: it.date || it.createdAt || '' });
        });
        arr.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
        var h = '';
        arr.forEach(function (it) {
            var stars = '';
            for (var s = 0; s < 5; s++) stars += (s < it.stars ? '★' : '☆');
            h += '<div class="sb-list-item" style="margin-bottom:8px;">' +
                '<div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">' +
                '<div style="flex:1;min-width:0;"><span style="color:#ffd700;font-weight:700;font-size:13px;">' + sbEsc(it.name) + '</span> <span style="color:rgba(255,255,255,0.45);font-size:12px;">' + stars + '</span>' +
                (it.product ? '<div style="color:#00d2ff;font-size:11px;">' + sbEsc(it.product) + '</div>' : '') +
                '<div style="color:rgba(255,255,255,0.8);font-size:12px;margin-top:4px;">' + sbEsc(it.text) + '</div>' +
                (it.reply ? '<div style="color:rgba(255,255,255,0.55);font-size:12px;margin-top:4px;">Cavab: ' + sbEsc(it.reply) + '</div>' : '') +
                '</div>' +
                '<div style="display:flex;gap:6px;flex-shrink:0;">' +
                '<button class="sb-row-btn" style="border-color:rgba(255,215,0,0.5);color:#ffd700;" onclick="adminTestDuzelt(\'' + it.key + '\')"><i class="fas fa-edit"></i></button>' +
                '<button class="sb-row-btn" style="border-color:rgba(255,80,80,0.5);color:#ff5050;" onclick="adminTestSil(\'' + it.key + '\')"><i class="fas fa-trash"></i></button>' +
                '</div></div></div>';
        });
        list.innerHTML = h;
    }).catch(function () { list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px 0;">Yüklənə bilmədi</p>'; });
}

/* ------------------------------------------------------------------
   ADMIN: ZİYARƏTÇİLƏR
------------------------------------------------------------------ */
function adminVisitorsAc(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (!isAdmin()) { myToast('❌ Yalnız admin!', 'r'); return; }
    var m = sbId('adminVisitorsModal');
    if (m) m.classList.add('active');
    adminVisitorsYenile();
}
function adminVisitorsYenile() {
    var list = sbId('adminVisitorsList');
    var countEl = sbId('visitorCount');
    if (!list) return;
    list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:30px 0;font-size:13px;">Ziyarətçilər yüklənir...</p>';
    if (typeof db === 'undefined') { list.innerHTML = ''; return; }
    db.ref('visitors').once('value').then(function (snap) {
        var items = snap.val() || {};
        var arr = [];
        Object.keys(items).forEach(function (k) {
            var it = items[k] || {};
            arr.push({ key: k, timestamp: it.timestamp || '', ua: it.ua || '', page: it.page || '' });
        });
        arr.sort(function (a, b) { return String(b.timestamp).localeCompare(String(a.timestamp)); });
        if (countEl) countEl.textContent = 'Cəmi: ' + arr.length + ' ziyarət';
        if (!arr.length) { list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:30px 0;font-size:13px;">Hələ ziyarət yoxdur</p>'; return; }
        var h = '';
        arr.slice(0, 100).forEach(function (it) {
            h += '<div class="sb-list-item" style="margin-bottom:6px;">' +
                '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">' +
                '<span style="color:#64c8ff;font-weight:700;font-size:12px;"><i class="fas fa-eye"></i> ' + sbEsc(sbFmt(it.timestamp)) + '</span>' +
                '<span style="color:rgba(255,255,255,0.4);font-size:11px;">' + sbEsc(it.page || '/') + '</span></div>' +
                '<div style="color:rgba(255,255,255,0.4);font-size:10px;margin-top:3px;word-break:break-all;">' + sbEsc(it.ua || '') + '</div>' +
                '</div>';
        });
        list.innerHTML = h;
    }).catch(function (err) {
        list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:30px 0;font-size:13px;">Yüklənə bilmədi: ' + sbEsc(err.message || '') + '</p>';
    });
}
function adminVisitorsTemizle() {
    if (!confirm('Bütün ziyarətçi qeydlərini silmək istədiyinizə əminsiniz?')) return;
    db.ref('visitors').remove().then(function () {
        myToast('🗑️ Ziyarətçilər təmizləndi', 'g');
        adminVisitorsYenile();
    }).catch(function (err) {
        myToast('⚠️ Silinə bilmədi: ' + (err.message || 'icazə yoxdur'), 'r');
    });
}

/* ------------------------------------------------------------------
   ADMIN: İSTİFADƏÇİLƏR
------------------------------------------------------------------ */
function adminUsersAc(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (!isAdmin()) { myToast('❌ Yalnız admin!', 'r'); return; }
    var m = sbId('adminUsersModal');
    if (m) m.classList.add('active');
    adminUsersYenile();
}
function adminUsersYenile() {
    var list = sbId('adminUsersList');
    var countEl = sbId('userCount');
    if (!list) return;
    list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:30px 0;font-size:13px;">İstifadəçilər yüklənir...</p>';
    if (typeof db === 'undefined') { list.innerHTML = ''; return; }
    db.ref('users').once('value').then(function (snap) {
        var items = snap.val() || {};
        var keys = Object.keys(items);
        if (countEl) countEl.textContent = 'Cəmi: ' + keys.length + ' istifadəçi';
        if (!keys.length) { list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:30px 0;font-size:13px;">İstifadəçi yoxdur</p>'; return; }
        var h = '';
        keys.forEach(function (k) {
            var u = items[k] || {};
            var name = u.username || u.email || k;
            var verified = u.verified ? '<span style="color:#00ff64;">✓</span>' : '<span style="color:#ff6464;">✗</span>';
            h += '<div class="sb-list-item" style="margin-bottom:6px;cursor:pointer;" onclick="adminUserDetailGoster(\'' + k + '\')">' +
                '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;">' +
                '<div style="flex:1;min-width:0;"><span style="color:#fff;font-weight:700;font-size:13px;"><i class="fas fa-user"></i> ' + sbEsc(name) + '</span> ' + verified +
                '<div style="color:rgba(255,255,255,0.45);font-size:11px;margin-top:2px;">' + sbEsc(u.email || '') + '</div></div>' +
                '<span style="color:rgba(255,255,255,0.35);font-size:11px;flex-shrink:0;">' + sbEsc(sbFmt(u.tarix || u.createdAt || '')) + '</span>' +
                '</div></div>';
        });
        list.innerHTML = h;
    }).catch(function (err) {
        list.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:30px 0;font-size:13px;">Yüklənə bilmədi: ' + sbEsc(err.message || 'icazə yoxdur') + '</p>';
    });
}
function adminUserDetailGoster(key) {
    var body = sbId('adminUserDetailBody');
    var title = sbId('adminUserDetailTitle');
    if (!body) return;
    title.textContent = 'İstifadəçi: ' + key;
    body.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:30px 0;">Yüklənir...</p>';
    sbId('adminUserDetailModal').classList.add('active');
    var uid = sbSafeKey(key);
    var q1 = db.ref('users/' + uid).once('value');
    var q2 = db.ref('carts/' + uid).once('value');
    var q3 = db.ref('coupons/' + uid).once('value');
    var q4 = db.ref('spinCredits/' + uid).once('value');
    Promise.all([q1, q2, q3, q4]).then(function (res) {
        var u = res[0].val() || {};
        var cart = res[1].val() || [];
        var coupons = res[2].val() || {};
        var credits = res[3].val() || 0;
        var cartCount = 0;
        var cartHtml = '';
        if (Array.isArray(cart)) {
            cartCount = cart.length;
            cart.forEach(function (c) {
                if (c && c.title) cartHtml += '<div style="font-size:12px;color:rgba(255,255,255,0.7);">• ' + sbEsc(c.title) + ' — ' + sbEsc(c.price || '') + '</div>';
            });
        } else { cartCount = 0; }
        var couponCount = Object.keys(coupons || {}).length;
        var h = '<div style="background:rgba(255,255,255,0.05);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:8px;">';
        h += '<div style="color:#00d2ff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Profil</div>';
        h += '<div><span style="color:rgba(255,255,255,0.5);font-size:12px;">İstifadəçi adı:</span> <span style="color:#fff;font-weight:700;font-size:14px;">' + sbEsc(u.username || key) + '</span></div>';
        h += '<div><span style="color:rgba(255,255,255,0.5);font-size:12px;">Email:</span> <span style="color:#fff;font-size:13px;">' + sbEsc(u.email || '—') + '</span></div>';
        h += '<div><span style="color:rgba(255,255,255,0.5);font-size:12px;">Qeydiyyat:</span> <span style="color:#fff;font-size:13px;">' + sbEsc(sbFmt(u.tarix || u.createdAt || '')) + '</span></div>';
        h += '<div><span style="color:rgba(255,255,255,0.5);font-size:12px;">Email təsdiqi:</span> <span style="color:#fff;font-size:13px;">' + (u.verified ? '✅ Bəli' : '❌ Xeyr') + '</span></div>';
        h += '<div style="color:#00d2ff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:8px;">Statistika</div>';
        h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">';
        h += '<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:10px;text-align:center;"><div style="color:#ffd700;font-size:20px;font-weight:800;">' + cartCount + '</div><div style="color:rgba(255,255,255,0.5);font-size:11px;">Səbətdə</div></div>';
        h += '<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:10px;text-align:center;"><div style="color:#ffd700;font-size:20px;font-weight:800;">' + couponCount + '</div><div style="color:rgba(255,255,255,0.5);font-size:11px;">Kupon</div></div>';
        h += '<div style="background:rgba(255,255,255,0.04);border-radius:8px;padding:10px;text-align:center;"><div style="color:#ffd700;font-size:20px;font-weight:800;">' + credits + '</div><div style="color:rgba(255,255,255,0.5);font-size:11px;">Fırlanma</div></div>';
        h += '</div>';
        if (cartHtml) {
            h += '<div style="color:#00d2ff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:8px;">Səbət məzmunu</div>' + cartHtml;
        }
        h += '</div>';
        body.innerHTML = h;
    }).catch(function (err) {
        body.innerHTML = '<p style="color:rgba(255,255,255,0.5);padding:20px;">Yüklənə bilmədi: ' + sbEsc(err.message || 'icazə yoxdur') + '</p>';
    });
}

/* ------------------------------------------------------------------
   İLKİN YÜKLƏMƏ
------------------------------------------------------------------ */
function sbInit() {
    sbEnsureUI();
    sbRestorePrices();
    sbSyncAdminMenu();
    sbYukleTestimonials();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sbInit);
} else {
    sbInit();
}
