/**
 * SteamBazari Guard & 2FA Təsdiq Portalı İnteqrasiya Skripti
 * GTA V və RDR 2 Canlı Təsdiq Kodu Alma Sistemi
 */

(function () {
    const API_BASE = '';
    let currentAuthMode = 'login'; // 'login' | 'register'
    let selectedGame = 'GTA5'; // 'GTA5' | 'RDR2'
    let currentActiveCode = null;
    let timerInterval = null;

    // Helper: Toast bildiriş göstər
    function notify(msg, isSuccess = true) {
        if (typeof bildirisGoster === 'function') {
            bildirisGoster(msg);
            return;
        }
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 25px; right: 25px; z-index: 10000000;
            background: ${isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)'};
            color: #fff; padding: 12px 20px; border-radius: 10px; font-weight: 700;
            font-size: 13px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(10px);
            display: flex; align-items: center; gap: 8px; transition: all 0.3s ease;
        `;
        toast.innerHTML = `<i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }

    // Modal açılışı
    window.guardKoduAc = function (event) {
        if (event) event.preventDefault();
        const modal = document.getElementById('guardCodeModal');
        if (!modal) return;

        checkGuardSession();
        modal.classList.add('active');
    };

    // İstifadəçi sessiyasını yoxla
    function checkGuardSession() {
        const token = localStorage.getItem('sb_guard_token');
        const userStr = localStorage.getItem('sb_guard_user');

        const authSection = document.getElementById('guardAuthSection');
        const mainSection = document.getElementById('guardMainSection');
        const userNameEl = document.getElementById('guardLoggedInName');

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                if (userNameEl) userNameEl.textContent = user.name || 'Müştəri';
                if (authSection) authSection.style.display = 'none';
                if (mainSection) mainSection.style.display = 'block';
                return;
            } catch (e) {
                localStorage.removeItem('sb_guard_token');
                localStorage.removeItem('sb_guard_user');
            }
        }

        if (authSection) authSection.style.display = 'block';
        if (mainSection) mainSection.style.display = 'none';
    }

    // Giriş və Qeydiyyat tab keçidi
    window.switchGuardAuthTab = function (mode) {
        currentAuthMode = mode;
        const tabLogin = document.getElementById('guardTabLogin');
        const tabRegister = document.getElementById('guardTabRegister');
        const submitBtn = document.getElementById('guardSubmitBtn');
        const errEl = document.getElementById('guardAuthError');

        if (errEl) {
            errEl.style.display = 'none';
            errEl.textContent = '';
        }

        if (mode === 'login') {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Daxil Ol';
        } else {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Qeydiyyatdan Keç';
        }
    };

    // Şifrəni göstər/gizlə
    window.toggleGuardPwd = function (el) {
        const input = document.getElementById('guardInputPassword');
        if (!input) return;
        const icon = el.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        } else {
            input.type = 'password';
            if (icon) {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    };

    // Giriş və ya Qeydiyyat göndərilməsi
    window.submitGuardAuth = async function () {
        const nameInput = document.getElementById('guardInputName');
        const passInput = document.getElementById('guardInputPassword');
        const errEl = document.getElementById('guardAuthError');
        const submitBtn = document.getElementById('guardSubmitBtn');

        const name = (nameInput.value || '').trim();
        const password = passInput.value || '';

        if (!name) {
            showError('Zəhmət olmasa Ad və Soyadınızı daxil edin');
            return;
        }

        if (!password || password.length < 3) {
            showError('Şifrə ən az 3 simvoldan ibarət olmalıdır');
            return;
        }

        function showError(msg) {
            if (errEl) {
                errEl.textContent = msg;
                errEl.style.display = 'block';
            }
        }

        if (errEl) errEl.style.display = 'none';
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gözləyin...';

        const endpoint = currentAuthMode === 'login' 
            ? `${API_BASE}/api/auth/login` 
            : `${API_BASE}/api/auth/register`;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                showError(data.error || 'Əməliyyat uğursuz oldu');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                return;
            }

            // Uğurlu giriş / qeydiyyat
            if (data.token) {
                localStorage.setItem('sb_guard_token', data.token);
            }
            if (data.user) {
                localStorage.setItem('sb_guard_user', JSON.stringify(data.user));
            }

            notify(currentAuthMode === 'login' ? 'Uğurla daxil oldunuz!' : 'Qeydiyyat uğurla tamamlandı!', true);
            passInput.value = '';
            checkGuardSession();
        } catch (error) {
            showError('Serverə qoşulmaq mümkün olmadı.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    };

    // Çıxış et
    window.logoutGuard = function () {
        localStorage.removeItem('sb_guard_token');
        localStorage.removeItem('sb_guard_user');
        checkGuardSession();
        notify('Hesabdan çıxış edildi', false);
    };

    // Oyun seçimi
    window.selectGuardGame = function (game) {
        selectedGame = game;
        const cardGTA = document.getElementById('gameCardGTA5');
        const cardRDR = document.getElementById('gameCardRDR2');

        if (cardGTA && cardRDR) {
            if (game === 'GTA5') {
                cardGTA.classList.add('active');
                cardRDR.classList.remove('active');
                cardGTA.querySelector('.guard-card-badge').style.display = 'flex';
                cardRDR.querySelector('.guard-card-badge').style.display = 'none';
            } else {
                cardRDR.classList.add('active');
                cardGTA.classList.remove('active');
                cardRDR.querySelector('.guard-card-badge').style.display = 'flex';
                cardGTA.querySelector('.guard-card-badge').style.display = 'none';
            }
        }
    };

    // Guard Kodu Alma Sorğusu
    window.requestGuardCode = async function () {
        const token = localStorage.getItem('sb_guard_token');
        if (!token) {
            notify('Zəhmət olmasa əvvəlcə daxil olun', false);
            checkGuardSession();
            return;
        }

        const fetchBtn = document.getElementById('btnFetchGuardCode');
        const loadingState = document.getElementById('guardLoadingState');
        const resultBox = document.getElementById('guardResultBox');
        const errorBox = document.getElementById('guardFetchError');

        if (errorBox) errorBox.style.display = 'none';
        if (resultBox) resultBox.style.display = 'none';
        if (loadingState) loadingState.style.display = 'block';

        fetchBtn.disabled = true;
        fetchBtn.style.opacity = '0.7';

        try {
            const res = await fetch(`${API_BASE}/api/guard-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ game: selectedGame }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                if (res.status === 401) {
                    logoutGuard();
                    throw new Error('Sessiyanın vaxtı bitdi. Yenidən daxil olun.');
                }
                throw new Error(data.error || 'Təsdiq kodu tapılmadı. Oyundan kodu yenidən göndərin və 5-10 saniyə sonra yenidən yoxlayın.');
            }

            // Kodu göstər
            currentActiveCode = data.code;
            displayGuardResult(data);
            notify(`Təsdiq kodu uğurla alındı: ${data.code}`, true);

        } catch (error) {
            if (errorBox) {
                errorBox.textContent = error.message || 'Xəta baş verdi';
                errorBox.style.display = 'block';
            }
        } finally {
            if (loadingState) loadingState.style.display = 'none';
            fetchBtn.disabled = false;
            fetchBtn.style.opacity = '1';
        }
    };

    // Nəticəni ekranda göstər və taymeri başlat
    function displayGuardResult(data) {
        const resultBox = document.getElementById('guardResultBox');
        const digitsEl = document.getElementById('guardDigitsDisplay');
        const emailEl = document.getElementById('guardDetailEmail');
        const subjectEl = document.getElementById('guardDetailSubject');
        const timeEl = document.getElementById('guardCodeTime');

        if (!resultBox || !digitsEl) return;

        digitsEl.textContent = data.code || '------';
        if (emailEl) emailEl.textContent = data.targetEmail || '-';
        if (subjectEl) subjectEl.textContent = data.subject || 'Rockstar / Steam Guard Kodu';

        const now = new Date();
        if (timeEl) {
            timeEl.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        }

        resultBox.style.display = 'block';

        // 60 saniyəlik geri sayım
        startCodeTimer(60);
    }

    // Geri sayım taymeri
    function startCodeTimer(seconds) {
        if (timerInterval) clearInterval(timerInterval);

        let remaining = seconds;
        const progressEl = document.getElementById('guardTimerProgress');
        const labelEl = document.getElementById('guardTimerLabel');

        function update() {
            const percent = (remaining / seconds) * 100;
            if (progressEl) progressEl.style.width = `${percent}%`;
            if (labelEl) labelEl.textContent = `Kod aktivdir: ${remaining} san`;

            if (remaining <= 0) {
                clearInterval(timerInterval);
                if (labelEl) labelEl.textContent = 'Kodun vaxtı bitdi. Yenidən "Kodu Al" sıxın.';
                if (progressEl) progressEl.style.width = '0%';
            }
            remaining--;
        }

        update();
        timerInterval = setInterval(update, 1000);
    }

    // Kodu kopyala
    window.copyActiveGuardCode = function () {
        if (!currentActiveCode) return;

        navigator.clipboard.writeText(currentActiveCode).then(() => {
            const btn = document.getElementById('guardCopyBtn');
            if (btn) {
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fas fa-check"></i> <span>Kopyalandı!</span>';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = '<i class="fas fa-copy"></i> <span>Kopyala</span>';
                }, 2000);
            }
            notify('Kod kopyalandı!', true);
        }).catch(() => {
            notify('Kopyalamaq mümkün olmadı', false);
        });
    };

    // Səhifə yükləndikdə yoxla
    document.addEventListener('DOMContentLoaded', function () {
        checkGuardSession();
    });
})();
