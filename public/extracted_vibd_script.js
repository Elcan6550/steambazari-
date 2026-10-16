
        /* ===== Firebase Konfiqurasiya ===== */
        const firebaseConfig = {
            apiKey: "AIzaSyCEIY-MrI-Phc_U2Gs8e-woKxbQcfTv5cs",
            authDomain: "steambazari.firebaseapp.com",
            databaseURL: "https://steambazari-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "steambazari",
            storageBucket: "steambazari.firebasestorage.app",
            messagingSenderId: "232790121889",
            appId: "1:232790121889:web:85559fc202e1ada9a23fe0"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
        const auth = firebase.auth();

        /* ===== Auth State Listener ===== */
        auth.onAuthStateChanged(function(user) {
            if (!user) {
                var u = localStorage.getItem('sb_current_user');
                if (u) {
                    try {
                        var usr = JSON.parse(u);
                        if (usr.username) {
                            auth.signInAnonymously().catch(function(){});
                        }
                    } catch(e) {}
                }
            }
        });

        /* ===== Database İstinadlar ===== */
        function getUsersRef() { return db.ref("users"); }
        function getCartCouponsRef() {
            try {
                var u = JSON.parse(localStorage.getItem('sb_current_user') || 'null');
                if (!u || !u.username) return null;
                return db.ref('users/' + u.username + '/cartCoupons_v2');
            } catch(e) { return null; }
        }
        function getCouponsRef(username) {
            return db.ref("coupons").child(username.replace(/[.#$\/\[\]]/g, "_"));
        }
        function getSpinRef() {
            try {
                var u = JSON.parse(localStorage.getItem('sb_current_user') || 'null');
                if (!u || !u.username) return null;
                return db.ref("spins").child(u.username.replace(/[.#$\/\[\]]/g, "_"));
            } catch(e) { return null; }
        }
        function getSpinCreditsRef(username) {
            return db.ref("spinCredits").child(username.replace(/[.#$/\[\]]/g, "_"));
        }
        function getRedeemRef() { return db.ref("redeemCodes"); }

        /* ===== DB Funksiyaları ===== */
        function saveUserToDB(email, username, password, verified) {
            return getUsersRef().child(username.replace(/[.#$/\[\]]/g, "_")).set({
                email: email, username: username, password: password,
                verified: verified || false, tarix: new Date().toISOString()
            });
        }
        function findUserInDB(username, password, callback) {
            getUsersRef().once("value").then(function(snapshot) {
                var users = snapshot.val() || {};
                var found = null;
                Object.keys(users).forEach(function(key) {
                    var u = users[key];
                    if ((u.username === username || u.email === username) && u.password === password) {
                        found = u;
                    }
                });
                callback(found);
            }).catch(function() { callback(null); });
        }
        function checkUsernameExists(username, callback) {
            getUsersRef().child(username.replace(/[.#$/\[\]]/g, "_")).once("value").then(function(s) {
                callback(s.exists());
            }).catch(function() { callback(false); });
        }
        function checkEmailExists(email, callback) {
            getUsersRef().once("value").then(function(snapshot) {
                var users = snapshot.val() || {};
                var exists = false;
                Object.keys(users).forEach(function(key) {
                    if (users[key].email === email) exists = true;
                });
                callback(exists);
            }).catch(function() { callback(false); });
        }

        /* ===== UI Köməkçi Funksiyalar ===== */
        function myToast(m, t) {
            t = t || 'b';
            var c = document.getElementById('tBox');
            if (!c) return;
            var d = document.createElement('div');
            d.className = 'tB ' + t;
            d.innerHTML = m;
            c.appendChild(d);
            setTimeout(function() {
                d.style.animation = 'tO 0.4s forwards';
                setTimeout(function() { d.remove(); }, 500);
            }, 3000);
        }

        function modalKapat(a) {
            var e = document.getElementById(a);
            if (e) e.classList.remove('active');
        }
        function girisAc() {
            var m = document.getElementById('loginModal');
            if (m) {
                m.classList.add('active');
                var e = document.getElementById('loginError');
                if (e) e.textContent = '';
            }
        }
        function qeydAc() {
            var m = document.getElementById('registerModal');
            if (m) {
                m.classList.add('active');
                var e = document.getElementById('registerError');
                if (e) e.textContent = '';
            }
        }
        function sifreGoster(a, b) {
            var i = document.getElementById(a);
            if (!i) return;
            var c = b.querySelector('i');
            if (i.type === 'password') {
                i.type = 'text';
                if (c) c.className = 'fas fa-eye-slash';
            } else {
                i.type = 'password';
                if (c) c.className = 'fas fa-eye';
            }
        }

        function isAdmin() {
            try {
                var u = JSON.parse(localStorage.getItem('sb_current_user') || 'null');
                return u && u.username === 'elcan';
            } catch(e) { return false; }
        }

        function profilGoster(ad) {
            var m = document.querySelector('.user-menu');
            if (m) {
                var l = m.querySelector('.btn-login'), r = m.querySelector('.btn-register');
                if (l) l.style.display = 'none';
                if (r) r.style.display = 'none';
            }
            var p = document.getElementById('userProfile');
            if (p) {
                document.getElementById('userNameDisplay').textContent = (isAdmin() ? '👑 ' : '') + ad;
                p.style.display = 'flex';
            }
            var adminBtn = document.getElementById('btnAdminCodes');
            if (adminBtn) adminBtn.style.display = isAdmin() ? 'flex' : 'none';
            sebetBadgeGuncelle();
        }

        /* ===== Qeydiyyat / Giriş ===== */
        function qeydEt() {
            var em = document.getElementById('regEmail'),
                un = document.getElementById('regUsername'),
                pw = document.getElementById('regPassword'),
                pw2 = document.getElementById('regPassword2'),
                er = document.getElementById('registerError');
            if (!er) return;
            er.textContent = '';
            er.style.color = '#ff4444';
            if (!em || !un || !pw || !pw2) { er.textContent = 'Xəta: form tapılmadı!'; return; }
            var email = em.value.trim(), username = un.value.trim(), pass = pw.value, pass2 = pw2.value;
            if (!email) { er.textContent = 'Email daxil edin!'; return; }
            if (!username || username.length < 2) { er.textContent = 'İstifadəçi adı ən az 2 simvol!'; return; }
            if (username === 'elcan') { er.textContent = 'Bu istifadəçi adı qadağandır!'; return; }
            if (pass.length < 6) { er.textContent = 'Şifrə ən az 6 simvol!'; return; }
            if (pass !== pass2) { er.textContent = 'Şifrələr eyni deyil!'; return; }

            checkUsernameExists(username, function(exists) {
                if (exists) { er.textContent = 'Bu istifadəçi adı artıq var!'; return; }
                checkEmailExists(email, function(existsEmail) {
                    if (existsEmail) { er.textContent = 'Bu email artıq var!'; return; }
                    auth.createUserWithEmailAndPassword(email, pass).then(function(cred) {
                        cred.user.sendEmailVerification();
                        saveUserToDB(email, username, pass, false).then(function() {
                            localStorage.setItem('sb_current_user', JSON.stringify({username: username}));
                            modalKapat('registerModal');
                            document.getElementById('verifyLoader').classList.add('active');
                            var checkInterval = setInterval(function() {
                                auth.currentUser.reload().then(function() {
                                    if (auth.currentUser.emailVerified) {
                                        clearInterval(checkInterval);
                                        getUsersRef().child(username.replace(/[.#$/\[\]]/g, "_")).update({verified: true});
                                        document.getElementById('verifyLoader').classList.remove('active');
                                        profilGoster(username);
                                        myToast('✅ Email təsdiqləndi! Xoş gəldin, ' + username + '!', 'g');
                                    }
                                });
                            }, 2000);
                        });
                    }).catch(function(err) {
                        if (err.code === 'auth/email-already-in-use') { er.textContent = 'Bu email artıq istifadə olunur!'; return; }
                        er.textContent = 'Xəta: ' + err.message;
                    });
                });
            });
        }

        function girEt() {
            var un = document.getElementById('loginUsername'),
                pw = document.getElementById('loginPassword'),
                er = document.getElementById('loginError');
            if (!er) return;
            er.textContent = '';
            er.style.color = '#ff4444';
            if (!un || !pw) { er.textContent = 'Xəta: form tapılmadı!'; return; }
            var username = un.value.trim(), pass = pw.value;
            if (!username) { er.textContent = 'İstifadəçi adı / email daxil edin!'; return; }
            if (!pass) { er.textContent = 'Şifrə daxil edin!'; return; }

            function showLoginLoader() { document.getElementById('loginLoader').classList.add('active'); }
            function hideLoginLoader() { document.getElementById('loginLoader').classList.remove('active'); }

            if (username === 'elcan' && pass === 'elcan2006') {
                showLoginLoader();
                setTimeout(function() {
                    localStorage.setItem('sb_current_user', JSON.stringify({username: 'elcan', isAdmin: true}));
                    profilGoster('elcan');
                    modalKapat('loginModal');
                    hideLoginLoader();
                    myToast('👑 Xoş gəldin, Vurucum!', 'g');
                }, 800);
                return;
            }

            function emailVerifiedCheck(cb) {
                auth.currentUser.reload().then(function() {
                    if (!auth.currentUser.emailVerified) {
                        auth.signOut().catch(function(){});
                        hideLoginLoader();
                        er.textContent = 'Email təsdiqlənməyib! Zəhmət olmasa emailinizə göndərilən linkə klik edin.';
                        return;
                    }
                    cb();
                }).catch(function() { cb(); });
            }

            showLoginLoader();

            if (username.indexOf('@') >= 0) {
                auth.signInWithEmailAndPassword(username, pass).then(function(cred) {
                    emailVerifiedCheck(function() {
                        localStorage.setItem('sb_current_user', JSON.stringify({username: username}));
                        profilGoster(username);
                        modalKapat('loginModal');
                        hideLoginLoader();
                        myToast('👋 Xoş gəldin, ' + username + '!', 'g');
                    });
                }).catch(function(err) {
                    hideLoginLoader();
                    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                        er.textContent = 'İstifadəçi/şifrə yanlış!'; return;
                    }
                    er.textContent = 'Xəta: ' + err.message;
                });
            } else {
                findUserInDB(username, pass, function(user) {
                    if (!user) { hideLoginLoader(); er.textContent = 'İstifadəçi/şifrə yanlış!'; return; }
                    auth.signInWithEmailAndPassword(user.email, pass).then(function(cred) {
                        emailVerifiedCheck(function() {
                            localStorage.setItem('sb_current_user', JSON.stringify({username: user.username}));
                            profilGoster(user.username);
                            modalKapat('loginModal');
                            hideLoginLoader();
                            myToast('👋 Xoş gəldin, ' + user.username + '!', 'g');
                        });
                    }).catch(function(err) {
                        hideLoginLoader();
                        er.textContent = 'Xəta: ' + err.message;
                    });
                });
            }
        }

        function cixEt() {
            var ad = (document.getElementById('userNameDisplay') || {}).textContent || '';
            localStorage.removeItem('sb_current_user');
            auth.signOut().catch(function(){});
            var p = document.getElementById('userProfile');
            if (p) p.style.display = 'none';
            var m = document.querySelector('.user-menu');
            if (m) {
                var l = m.querySelector('.btn-login'), r = m.querySelector('.btn-register');
                if (l) l.style.display = '';
                if (r) r.style.display = '';
            }
            var badge = document.getElementById('cartBadge');
            if (badge) badge.textContent = '0';
            var mBadge = document.getElementById('mobileCartBadge');
            if (mBadge) mBadge.textContent = '0';
            var dBadge = document.getElementById('cartBadgeDropdown');
            if (dBadge) dBadge.textContent = '0';
            myToast('👋 ' + ad + ', çıxış edildi!', 'b');
        }

        /* ===== SƏBƏT SİSTEMİ - DÜZƏLDİLMİŞ ===== */
        var _cartCurrentItem = null;

        function getCartRef() {
            var u = localStorage.getItem('sb_current_user');
            if (!u) return null;
            try {
                var un = JSON.parse(u).username;
                if (!un) return null;
                return db.ref("carts").child(un.replace(/[.#$\/\[\]]/g, "_"));
            } catch(e) { return null; }
        }

        function sebeteElaveEt() {
            if (!_cartCurrentItem) { myToast('❌ Məhsul məlumatı tapılmadı!', 'r'); return; }
            var ref = getCartRef();
            if (!ref) { myToast('❌ Zəhmət olmasa əvvəlcə daxil olun!', 'r'); return; }
            var item = _cartCurrentItem;
            ref.once("value").then(function(snap) {
                var items = snap.val() || [];
                if (!Array.isArray(items)) items = [];
                var found = items.findIndex(function(i) { return i.title === item.title; });
                if (found >= 0) {
                    items[found].qty = (items[found].qty || 1) + 1;
                } else {
                    item.qty = 1;
                    items.push(item);
                }
                return ref.set(items);
            }).then(function() {
                myToast('✅ "' + item.title + '" səbətə əlavə edildi!', 'g');
                sebetBadgeGuncelle();
            }).catch(function(err) {
                myToast('❌ Xəta: ' + err.message, 'r');
            });
        }

        function sebetBadgeGuncelle() {
            var badge = document.getElementById('cartBadge');
            var mBadge = document.getElementById('mobileCartBadge');
            var dBadge = document.getElementById('cartBadgeDropdown');
            var ref = getCartRef();
            if (!ref) {
                if (badge) badge.textContent = '0';
                if (mBadge) mBadge.textContent = '0';
                if (dBadge) dBadge.textContent = '0';
                return;
            }
            ref.once("value").then(function(snap) {
                var items = snap.val() || [];
                if (!Array.isArray(items)) items = [];
                var count = items.reduce(function(s, i) { return s + (i.qty || 1); }, 0);
                if (badge) badge.textContent = count;
                if (mBadge) mBadge.textContent = count;
                if (dBadge) dBadge.textContent = count;
            }).catch(function() {
                if (badge) badge.textContent = '0';
                if (mBadge) mBadge.textContent = '0';
                if (dBadge) dBadge.textContent = '0';
            });
        }

        function sixAznQiymet(priceText) {
            var p = parseFloat(priceText.replace('AZN','').replace(',','.').trim()) || 0;
            return p >= 5 && p <= 7;
        }

        /* ===== SEBETI TEMIZLE - TAM DÜZƏLDİLMİŞ ===== */
        function sebetiTemizle() {
            console.log('sebetiTemizle çağırıldı');
            
            var ref = getCartRef();
            if (!ref) { 
                myToast('❌ Zəhmət olmasa daxil olun!', 'r'); 
                modalKapat('sebetModal');
                return; 
            }
            
            if (!confirm('Səbəti tamamilə təmizləmək istədiyinizə əminsiniz?')) {
                return;
            }

            // 1. ƏVVƏLCƏ UI-ı SIFIRLA
            uiSifirla();

            // 2. SONRA FIREBASE-DƏN SİL
            var cartR = ref.set([]);
            var couponRef = getCartCouponsRef();
            var couponR = couponRef ? couponRef.set({}) : Promise.resolve();

            Promise.all([cartR, couponR]).then(function() {
                console.log('Firebase uğurla təmizləndi');
                myToast('🗑️ Səbət uğurla təmizləndi!', 'g');
                modalKapat('sebetModal');
            }).catch(function(err) {
                console.error('Firebase xətası:', err);
                myToast('⚠️ Yerli olaraq təmizləndi, lakin server xətası: ' + err.message, 'b');
                modalKapat('sebetModal');
            });
        }

        /* UI Sıfırlama Funksiyası */
        function uiSifirla() {
            console.log('UI sıfırlanır...');
            
            // Global dəyişənləri təmizlə
            window._cartCurrentItem = null;
            window._activeCouponsList = [];
            window._activeCouponsMap = {};
            window._currentCartItems = [];
            window._availableCoupons = [];
            window._freeClaimCache = [];
            
            // Container-i sıfırla
            var container = document.getElementById('sebetItems');
            var footer = document.getElementById('sebetFooter');
            var couponSection = document.getElementById('sebetCoupons');
            var couponList = document.getElementById('couponList');
            var totalEl = document.getElementById('sebetTotal');
            var discountEl = document.getElementById('sebetDiscount');
            
            if (container) container.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.5);padding:30px 0;">Səbət boşdur</p>';
            if (footer) footer.style.display = 'none';
            if (couponSection) couponSection.style.display = 'none';
            if (couponList) couponList.innerHTML = '';
            if (totalEl) totalEl.textContent = '0,00 AZN';
            if (discountEl) {
                discountEl.style.display = 'none';
                var da = discountEl.querySelector('.discount-amount');
                var dp = discountEl.querySelector('.discount-pct');
                if (da) da.textContent = '0 AZN';
                if (dp) dp.textContent = '0% endirim';
            }
            
            // Badge-i sıfırla
            var badge = document.getElementById('cartBadge');
            if (badge) badge.textContent = '0';
            var mBadge = document.getElementById('mobileCartBadge');
            if (mBadge) mBadge.textContent = '0';
            var dBadge = document.getElementById('cartBadgeDropdown');
            if (dBadge) dBadge.textContent = '0';
            
            console.log('UI uğurla sıfırlandı');
        }

        function sebetAc(event) {
            event.preventDefault();
            var ref = getCartRef();
            if (!ref) { myToast('❌ Zəhmət olmasa əvvəlcə daxil olun!', 'r'); return; }

            // Səbət açılanda state-i sıfırla
            window._activeCouponsList = [];
            window._activeCouponsMap = {};

            ref.once("value").then(function(snap) {
                var items = snap.val() || [];
                if (!Array.isArray(items)) items = [];
                window._currentCartItems = items;
                var couponData = {};
                var couponRef = getCartCouponsRef();
                if (couponRef) {
                    return couponRef.once("value").then(function(csnap) {
                        couponData = csnap.val() || {};
                        processCartDisplay(items, couponData);
                    });
                } else {
                    processCartDisplay(items, couponData);
                }
            }).then(function() {
                document.getElementById('sebetModal').classList.add('active');
            }).catch(function(err) {
                myToast('❌ Xəta: ' + err.message, 'r');
            });
        }

        function processCartDisplay(items, couponData) {
            // Kuponları emal et
            Object.keys(couponData).forEach(function(key) {
                var kupon = couponData[key];
                if (kupon && kupon.discount) {
                    var code = kupon.code || key.replace(/_\d+$/, '');
                    window._activeCouponsList.push({key: key, code: code, discount: kupon.discount});
                }
            });
            sebetiGosterRender(items);
        }

        function sebetiGoster(items) {
            if (typeof sebetiGosterRender === 'function') {
                sebetiGosterRender(items);
            }
        }

        function sebetiGosterRender(items) {
            var container = document.getElementById('sebetItems');
            var footer = document.getElementById('sebetFooter');
            var totalEl = document.getElementById('sebetTotal');
            var discountEl = document.getElementById('sebetDiscount');
            var couponSection = document.getElementById('sebetCoupons');
            if (!container) return;

            if (!items || items.length === 0) {
                container.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.5);padding:30px 0;">Səbət boşdur</p>';
                if (footer) footer.style.display = 'none';
                if (couponSection) couponSection.style.display = 'none';
                if (totalEl) totalEl.textContent = '0 AZN';
                if (discountEl) discountEl.style.display = 'none';
                return;
            }

            var h = '';
            var total = 0;
            var normalTotal = 0;
            var sixAznCount = 0;
            items.forEach(function(item) {
                item.qty = item.qty || 1;
                if (sixAznQiymet(item.price)) sixAznCount += item.qty;
            });
            var sixDiscountActive = sixAznCount >= 2;

            items.forEach(function(item, idx) {
                var priceText = item.price || '0 AZN';
                var priceNum = parseFloat(priceText.replace('AZN','').replace(',','.').trim()) || 0;
                var qty = item.qty || 1;
                var isSix = sixAznQiymet(priceText);
                normalTotal += priceNum * qty;
                var itemTotal;
                var discountLabel = '';
                var activeC = window._activeCouponsList || [];
                var totalCouponPct = 0;
                activeC.forEach(function(it) { totalCouponPct += (it.discount || 0); });
                if (totalCouponPct > 100) totalCouponPct = 100;
                if (isSix && sixDiscountActive) {
                    itemTotal = 4 * qty;
                } else if (totalCouponPct > 0) {
                    itemTotal = priceNum * (1 - totalCouponPct / 100) * qty;
                    discountLabel = ' <span style="color:#ffd700;font-size:11px;">(' + totalCouponPct + '% endirim)</span>';
                } else {
                    itemTotal = priceNum * qty;
                }
                total += itemTotal;
                h += '<div style="display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">';
                h += '<img src="' + item.image + '" alt="' + item.title + '" style="width:48px;height:64px;object-fit:cover;border-radius:6px;flex-shrink:0;">';
                h += '<div style="flex:1;min-width:0;">';
                h += '<div style="color:#fff;font-size:14px;font-weight:600;">' + item.title + '</div>';
                h += '<div style="color:#00d2ff;font-size:13px;font-weight:700;">' + itemTotal.toFixed(2).replace('.', ',') + ' AZN' + (qty > 1 ? ' <span style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:400;">x' + qty + '</span>' : '') + discountLabel + '</div>';
                h += '</div>';
                h += '<button onclick="sebetdenSil(' + idx + ')" style="background:transparent;border:1px solid rgba(255,68,68,0.5);color:#ff4444;border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:14px;">&times;</button>';
                h += '</div>';
            });
            container.innerHTML = h;
            if (totalEl) totalEl.textContent = total.toFixed(2).replace('.', ',') + ' AZN';
            var saved = normalTotal - total;
            if (discountEl) {
                if (saved > 0) {
                    discountEl.style.display = 'flex';
                    discountEl.querySelector('.discount-amount').textContent = '- ' + saved.toFixed(2).replace('.', ',') + ' AZN';
                    discountEl.querySelector('.discount-pct').textContent = Math.round(saved / normalTotal * 100) + '% endirim';
                } else {
                    discountEl.style.display = 'none';
                }
            }
            if (footer) footer.style.display = 'block';
        }

        function sebetdenSil(index) {
            var ref = getCartRef();
            if (!ref) return;
            ref.once("value").then(function(snap) {
                var items = snap.val() || [];
                if (!Array.isArray(items)) items = [];
                if (index < 0 || index >= items.length) return;
                var item = items[index];
                if ((item.qty || 1) > 1) {
                    item.qty -= 1;
                } else {
                    items.splice(index, 1);
                }
                return ref.set(items);
            }).then(function() {
                sebetBadgeGuncelle();
                sebetAc({preventDefault: function(){}});
                myToast('🗑️ Məhsul səbətdən silindi', 'b');
            }).catch(function(err) {
                myToast('❌ Xəta: ' + err.message, 'r');
            });
        }

        function sebetdenSifarisVer() {
            var ref = getCartRef();
            if (!ref) return;
            var couponRef = getCartCouponsRef();
            var cartP = ref.once("value");
            var couponP = couponRef ? couponRef.once("value") : Promise.resolve({ val: function() { return {}; } });
            Promise.all([cartP, couponP]).then(function(res) {
                var items = res[0].val() || [];
                if (!Array.isArray(items)) items = [];
                if (items.length === 0) { myToast('❌ Səbət boşdur!', 'r'); return; }
                var cData = res[1].val() || {};
                var activeCouponMap = {};
                var allCouponNames = [];
                Object.keys(cData).forEach(function(c) {
                    if (cData[c] && cData[c].discount) {
                        activeCouponMap[c] = cData[c].discount;
                        allCouponNames.push(cData[c].code || c);
                    }
                });
                var sixAznCount = 0;
                items.forEach(function(item) {
                    item.qty = item.qty || 1;
                    if (sixAznQiymet(item.price)) sixAznCount += item.qty;
                });
                var sixDiscountActive = sixAznCount >= 2;
                var totalCouponPercent = 0;
                Object.keys(activeCouponMap).forEach(function(c) { totalCouponPercent += activeCouponMap[c]; });
                if (totalCouponPercent > 100) totalCouponPercent = 100;
                var msg = 'Salam, SteamBazari saytından sifariş vermək istəyirəm.\n\nSəbətim:\n';
                var total = 0;
                var normalTotal = 0;
                items.forEach(function(item) {
                    var priceText = item.price || '0 AZN';
                    var priceNum = parseFloat(priceText.replace('AZN','').replace(',','.').trim()) || 0;
                    var qty = item.qty || 1;
                    var isSix = sixAznQiymet(priceText);
                    normalTotal += priceNum * qty;
                    var itemTotal;
                    if (isSix && sixDiscountActive) {
                        itemTotal = 4 * qty;
                    } else if (totalCouponPercent > 0) {
                        itemTotal = priceNum * (1 - totalCouponPercent / 100) * qty;
                    } else {
                        itemTotal = priceNum * qty;
                    }
                    total += itemTotal;
                    msg += '* ' + item.title + (qty > 1 ? ' x' + qty : '') + ' - ' + (priceNum * qty).toFixed(2).replace('.', ',') + ' AZN\n';
                });
                if (allCouponNames.length > 0) {
                    msg += '\nTətbiq olunan kuponlar: ' + allCouponNames.join(', ') + ' (' + totalCouponPercent + '% endirim)';
                }
                msg += '\nCəmi: ' + total.toFixed(2).replace('.', ',') + ' AZN';
                var uu = localStorage.getItem('sb_current_user');
                var uname = '';
                try { uname = JSON.parse(uu).username; } catch(e) {}
                if (uname) msg += '\nSifariş verən: ' + uname;
                window.open('https://wa.me/994559308887?text=' + encodeURIComponent(msg), '_blank');
            });
        }

        /* ===== ÇARX SİSTEMİ ===== */
        var carxPrizes = [
            {label: '20% Endirim', color: '#ff6b6b', dark: '#cc3333', icon: '🔥', extraSpin: false},
            {label: '30% Endirim', color: '#ff922b', dark: '#cc6600', icon: '⭐', extraSpin: false},
            {label: '25% Endirim', color: '#ffd700', dark: '#cc9900', icon: '💎', extraSpin: false},
            {label: 'Heçnə', color: '#888888', dark: '#555555', icon: '💔', extraSpin: false},
            {label: '35% Endirim', color: '#e03131', dark: '#a01010', icon: '🎯', extraSpin: false},
            {label: '6 AZN Pulsuz', color: '#0ca678', dark: '#087050', icon: '🎮', extraSpin: false},
            {label: '20% Endirim', color: '#ff6b6b', dark: '#cc3333', icon: '🔥', extraSpin: false},
            {label: 'Yenidən Fırladın', color: '#845ef7', dark: '#5a3ec8', icon: '🔄', extraSpin: true},
            {label: '25% Endirim', color: '#ffd700', dark: '#cc9900', icon: '💎', extraSpin: false}
        ];
        var carxIsSpinning = false;

        function hexToRgba(hex, alpha) {
            var r = parseInt(hex.slice(1,3), 16);
            var g = parseInt(hex.slice(3,5), 16);
            var b = parseInt(hex.slice(5,7), 16);
            return 'rgba('+r+','+g+','+b+','+alpha+')';
        }

        function carxAc(event) {
            event.preventDefault();
            var u = localStorage.getItem('sb_current_user');
            if (!u) { myToast('❌ Zəhmət olmasa əvvəlcə daxil olun!', 'r'); return; }
            var username;
            try { username = JSON.parse(u).username; } catch(e) { return; }
            document.getElementById('carxModal').classList.add('active');
            spinCreditsGoster(username);
            carxCiz();
        }

        function carxCiz() {
            var canvas = document.getElementById('wheelCanvas');
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            var w = canvas.width, h = canvas.height;
            var cx = w/2, cy = h/2, r = Math.min(cx, cy) - 10;
            var arc = (2 * Math.PI) / carxPrizes.length;

            ctx.clearRect(0, 0, w, h);

            for (var i = 0; i < carxPrizes.length; i++) {
                var startAngle = i * arc;
                var endAngle = startAngle + arc;
                var p = carxPrizes[i];

                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, startAngle, endAngle);
                ctx.closePath();
                var segGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
                segGrad.addColorStop(0, hexToRgba(p.color, 0.4));
                segGrad.addColorStop(1, hexToRgba(p.dark, 0.6));
                ctx.fillStyle = segGrad;
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,215,0,0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();

                var midAngle = startAngle + arc / 2;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(midAngle);
                ctx.textAlign = 'right';
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 11px Segoe UI, sans-serif';
                ctx.fillText(p.icon + ' ' + p.label, r - 18, 5);
                ctx.restore();
            }

            ctx.beginPath();
            ctx.arc(cx, cy, 26, 0, 2 * Math.PI);
            ctx.fillStyle = '#1a1a2e';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,215,0,0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, 2*Math.PI);
            ctx.fillStyle = '#ffd700';
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
                carxiFirlat2(el, btn);
                return;
            }

            var creditsRef = getSpinCreditsRef(username);
            creditsRef.once("value").then(function(snap) {
                var credits = snap.val() || 0;
                if (credits <= 0) {
                    myToast('❌ Fırlanma haqqınız yoxdur! Redeem kodu daxil edin.', 'r');
                    return;
                }
                creditsRef.set(credits - 1).then(function() {
                    spinCreditsGoster(username);
                    carxiFirlat2(el, btn);
                });
            });
        }

        function carxiFirlat2(el, btn) {
            carxIsSpinning = true;
            if (el) el.textContent = '';
            if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }

            var _curUser = null;
            try { _curUser = JSON.parse(localStorage.getItem('sb_current_user')||'null'); } catch(e) {}
            var _curUsername = _curUser ? _curUser.username : '';

            var canvas = document.getElementById('wheelCanvas');
            if (!canvas) return;
            var ctx = canvas.getContext('2d');
            var cx = canvas.width/2, cy = canvas.height/2, r = Math.min(cx, cy) - 10;
            var arc = (2 * Math.PI) / carxPrizes.length;
            var winner = Math.floor(Math.random() * carxPrizes.length);
            var targetAngle = (3 * Math.PI / 2) - (winner * arc + Math.random() * arc);
            if (targetAngle < 0) targetAngle += 2 * Math.PI;
            var spinAngle = 5 * 2 * Math.PI + targetAngle;
            var duration = 4000, start = null;

            function animate(timestamp) {
                if (!start) start = timestamp;
                var progress = Math.min((timestamp - start) / duration, 1);
                var ease = 1 - Math.pow(1 - progress, 3);
                var angle = spinAngle * ease;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (var i = 0; i < carxPrizes.length; i++) {
                    var startAngle = i * arc;
                    var endAngle = startAngle + arc;
                    var p = carxPrizes[i];

                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.arc(0, 0, r, startAngle, endAngle);
                    ctx.closePath();
                    var segGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
                    segGrad.addColorStop(0, hexToRgba(p.color, 0.4));
                    segGrad.addColorStop(1, hexToRgba(p.dark, 0.6));
                    ctx.fillStyle = segGrad;
                    ctx.fill();
                    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    var midAngle = startAngle + arc / 2;
                    ctx.save();
                    ctx.rotate(midAngle);
                    ctx.textAlign = 'right';
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 11px Segoe UI, sans-serif';
                    ctx.fillText(p.icon + ' ' + p.label, r - 18, 5);
                    ctx.restore();
                    ctx.restore();
                }

                ctx.beginPath();
                ctx.arc(cx, cy, 26, 0, 2 * Math.PI);
                ctx.fillStyle = '#1a1a2e';
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,215,0,0.5)';
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(cx, cy, 3, 0, 2*Math.PI);
                ctx.fillStyle = '#ffd700';
                ctx.fill();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    carxIsSpinning = false;
                    var prize = carxPrizes[winner];
                    var prizeText = prize.icon + ' ' + prize.label + ' 🎉';
                    if (el) el.innerHTML = prizeText;
                    myToast('🎉 ' + prize.icon + ' ' + prize.label, 'g');
                    var pctMatch = prize.label.match(/^(\d+)%/);
                    if (pctMatch && _curUsername) {
                        var discountPct = parseInt(pctMatch[1], 10);
                        saveCoupon(_curUsername, discountPct, function(code) {
                            if (code) {
                                myToast('🎫 Kupon: ' + code + ' — ' + discountPct + '% endirim! Səbətdə tətbiq edə bilərsiniz.', 'g');
                            }
                        });
                    } else if (prize.label.indexOf('6 AZN') >= 0 && _curUsername) {
                        saveCouponFree(_curUsername, function(code) {
                            if (code) {
                                myToast('🎫 Pulsuz oyun kuponu: ' + code, 'g');
                            }
                        });
                    }
                    if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
                    try { var _u = JSON.parse(localStorage.getItem('sb_current_user')||'null'); if(_u && _u.username) spinCreditsGoster(_u.username); } catch(e){}
                }
            }
            requestAnimationFrame(animate);
        }

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

        function saveCoupon(username, discount, cb) {
            var un = username.toUpperCase().replace(/[.#$\/\[\]]/g, "_");
            function findCode(base, n, done) {
                var c = base + (n > 1 ? '_' + n : '');
                getCouponsRef(username).child(c).once("value").then(function(s) {
                    if (s.exists()) findCode(base, n + 1, done);
                    else done(c);
                });
            }
            findCode(un + discount, 1, function(code) {
                getCouponsRef(username).child(code).set({
                    discount: discount,
                    used: false,
                    createdAt: new Date().toISOString()
                }).then(function() {
                    if (cb) cb(code, discount);
                });
            });
        }

        function saveCouponFree(username, cb) {
            var un = username.toUpperCase().replace(/[.#$\/\[\]]/g, "_");
            function findCode(base, n, done) {
                var c = base + (n > 1 ? '_' + n : '');
                getCouponsRef(username).child(c).once("value").then(function(s) {
                    if (s.exists()) findCode(base, n + 1, done);
                    else done(c);
                });
            }
            findCode(un + '100', 1, function(code) {
                getCouponsRef(username).child(code).set({
                    discount: 100,
                    isFree: true,
                    used: false,
                    createdAt: new Date().toISOString()
                }).then(function() {
                    if (cb) cb(code);
                });
            });
        }

        /* ===== REDEEM CODE ===== */
        function redeemAc(event) {
            event.preventDefault();
            var u = localStorage.getItem('sb_current_user');
            if (!u) { myToast('❌ Zəhmət olmasa əvvəlcə daxil olun!', 'r'); return; }
            document.getElementById('redeemError').textContent = '';
            document.getElementById('redeemSuccess').style.display = 'none';
            document.getElementById('redeemInput').value = '';
            document.getElementById('redeemModal').classList.add('active');
        }

        function adminCodesAc(event) {
            event.preventDefault();
            if (!isAdmin()) { myToast('❌ Yalnız admin!', 'r'); return; }
            document.getElementById('adminCodeError').textContent = '';
            document.getElementById('adminCodeSuccess').style.display = 'none';
            document.getElementById('adminCodeInput').value = '';
            document.getElementById('adminCodesModal').classList.add('active');
            adminCodeListele();
        }

        function adminKodYarat() {
            var codeEl = document.getElementById('adminCodeInput');
            var erEl = document.getElementById('adminCodeError');
            var okEl = document.getElementById('adminCodeSuccess');
            if (!erEl) return;
            erEl.textContent = '';
            okEl.style.display = 'none';
            var code = (codeEl.value || '').trim().toUpperCase();
            var prize = '1 ədəd çarx qazandınız';
            if (!code) { erEl.textContent = 'Kod daxil edin!'; return; }
            if (code.length < 3) { erEl.textContent = 'Kod ən az 3 simvol olmalıdır!'; return; }
            var codeRef = getRedeemRef().child(code);
            codeRef.once("value").then(function(snap) {
                if (snap.exists()) {
                    erEl.textContent = 'Bu kod artıq mövcuddur!';
                    return;
                }
                return codeRef.set({
                    prize: prize,
                    used: false,
                    createdAt: new Date().toISOString(),
                    createdBy: 'elcan'
                });
            }).then(function() {
                if (erEl.textContent) return;
                okEl.textContent = '✅ Kod yaradıldı: ' + code;
                okEl.style.display = 'block';
                codeEl.value = '';
                myToast('✅ Kod yaradıldı: ' + code, 'g');
                adminCodeListele();
            }).catch(function(err) {
                erEl.textContent = 'Xəta: ' + err.message;
            });
        }

        function adminCodeListele() {
            var listEl = document.getElementById('adminCodesList');
            if (!listEl) return;
            listEl.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px 0;font-size:13px;">Yüklənir...</p>';
            getRedeemRef().once("value").then(function(snap) {
                var codes = snap.val() || {};
                var keys = Object.keys(codes);
                if (keys.length === 0) {
                    listEl.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);padding:20px 0;font-size:13px;">Hələ kod yaradılmayıb</p>';
                    return;
                }
                var html = '';
                keys.forEach(function(key) {
                    var c = codes[key];
                    var status = c.used ? '<span style="color:#ff6464;">İstifadə olunub</span>' : '<span style="color:#00ff64;">Aktiv</span>';
                    html += '<div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px 14px;margin-bottom:8px;">';
                    html += '<div><div style="color:#fff;font-weight:700;font-size:14px;letter-spacing:2px;">' + key + '</div><div style="color:rgba(255,255,255,0.6);font-size:12px;">' + c.prize + ' — ' + status + '</div></div>';
                    if (!c.used) {
                        html += '<button onclick="adminKodSil(\'' + key + '\')" style="background:rgba(255,68,68,0.2);border:1px solid rgba(255,68,68,0.4);color:#ff4444;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;">Sil</button>';
                    }
                    html += '</div>';
                });
                listEl.innerHTML = html;
            });
        }

        function adminKodSil(code) {
            if (!confirm('"' + code + '" kodunu silmək istədiyinizə əminsiniz?')) return;
            getRedeemRef().child(code).remove().then(function() {
                myToast('🗑️ Kod silindi: ' + code, 'b');
                adminCodeListele();
            });
        }

        function redeemKoduYoxla() {
            var inputEl = document.getElementById('redeemInput');
            var erEl = document.getElementById('redeemError');
            var okEl = document.getElementById('redeemSuccess');
            if (!erEl) return;
            erEl.textContent = '';
            okEl.style.display = 'none';
            var u = localStorage.getItem('sb_current_user');
            if (!u) { erEl.textContent = 'Zəhmət olmasa daxil olun!'; return; }
            var currentUser;
            try { currentUser = JSON.parse(u).username; } catch(e) { erEl.textContent = 'Xəta!'; return; }
            var code = (inputEl.value || '').trim().toUpperCase();
            if (!code) { erEl.textContent = 'Kod daxil edin!'; return; }
            var codeRef = getRedeemRef().child(code);
            var redeemedPrize = '';
            codeRef.once("value").then(function(snap) {
                if (!snap.exists()) {
                    erEl.textContent = 'Kod yalnışdır!';
                    return;
                }
                var data = snap.val();
                if (data.used) {
                    erEl.textContent = 'Bu kod artıq istifadə olunub!';
                    return;
                }
                redeemedPrize = data.prize;
                return codeRef.update({used: true, usedBy: currentUser, usedAt: new Date().toISOString()});
            }).then(function() {
                if (erEl.textContent) return;
                var creditsRef = getSpinCreditsRef(currentUser);
                return creditsRef.once("value").then(function(snap) {
                    var old = snap.val() || 0;
                    return creditsRef.set(old + 1);
                });
            }).then(function() {
                if (erEl.textContent) return;
                okEl.innerHTML = 'Təbriklər! Mükafatınız: <br><strong style="font-size:20px;color:#ffd700;">' + redeemedPrize + '</strong><br><span style="font-size:13px;color:#ffd700;">+1 fırlanma haqqı əlavə edildi!</span>';
                okEl.style.display = 'block';
                inputEl.value = '';
                myToast('🎉 Kod təsdiqləndi! +1 fırlanma haqqı!', 'g');
            }).catch(function(err) {
                erEl.textContent = 'Xəta: ' + err.message;
            });
        }

        /* ===== View Keçidləri ===== */
        function showPlaystation(event) {
            event.preventDefault();
            document.getElementById('home-view').style.display = 'none';
            document.getElementById('digital-view').style.display = 'none';
            document.getElementById('online-view').style.display = 'none';
            document.getElementById('change-info-view').style.display = 'none';
            document.getElementById('xbox-view').style.display = 'none';
            document.getElementById('playstation-view').style.display = 'block';
            window.scrollTo(0, 0);
        }
        function showOnline(event) {
            event.preventDefault();
            document.getElementById('home-view').style.display = 'none';
            document.getElementById('playstation-view').style.display = 'none';
            document.getElementById('digital-view').style.display = 'none';
            document.getElementById('change-info-view').style.display = 'none';
            document.getElementById('xbox-view').style.display = 'none';
            document.getElementById('online-view').style.display = 'block';
            window.scrollTo(0, 0);
        }
        function showChangeInfo(event) {
            event.preventDefault();
            document.getElementById('home-view').style.display = 'none';
            document.getElementById('playstation-view').style.display = 'none';
            document.getElementById('online-view').style.display = 'none';
            document.getElementById('digital-view').style.display = 'none';
            document.getElementById('xbox-view').style.display = 'none';
            document.getElementById('change-info-view').style.display = 'block';
            window.scrollTo(0, 0);
        }
        function showDigital(event) {
            event.preventDefault();
            document.getElementById('home-view').style.display = 'none';
            document.getElementById('playstation-view').style.display = 'none';
            document.getElementById('online-view').style.display = 'none';
            document.getElementById('change-info-view').style.display = 'none';
            document.getElementById('xbox-view').style.display = 'none';
            document.getElementById('digital-view').style.display = 'block';
            window.scrollTo(0, 0);
        }
        function showXbox(event) {
            event.preventDefault();
            document.getElementById('home-view').style.display = 'none';
            document.getElementById('playstation-view').style.display = 'none';
            document.getElementById('online-view').style.display = 'none';
            document.getElementById('change-info-view').style.display = 'none';
            document.getElementById('digital-view').style.display = 'none';
            document.getElementById('xbox-view').style.display = 'block';
            window.scrollTo(0, 0);
        }
        function showHome(event) {
            event.preventDefault();
            document.getElementById('playstation-view').style.display = 'none';
            document.getElementById('digital-view').style.display = 'none';
            document.getElementById('online-view').style.display = 'none';
            document.getElementById('change-info-view').style.display = 'none';
            document.getElementById('xbox-view').style.display = 'none';
            document.getElementById('home-view').style.display = 'block';
            window.scrollTo(0, 0);
        }

        var _sbFilterTimer = null;
        function filterGames() {
            clearTimeout(_sbFilterTimer);
            _sbFilterTimer = setTimeout(_sbRunFilterGames, 100);
        }

        function _sbRunFilterGames() {
            var input = document.getElementById('gameSearch');
            if (!input) return;
            var filter = input.value.toLowerCase().trim();
            var views = ['home-view', 'playstation-view', 'online-view', 'change-info-view', 'digital-view', 'xbox-view'];
            for (var v = 0; v < views.length; v++) {
                var view = document.getElementById(views[v]);
                if (!view || view.style.display === 'none') continue;
                var cards = view.querySelectorAll('.game-category');
                for (var i = 0; i < cards.length; i++) {
                    var section = cards[i];
                    var gameCards = section.querySelectorAll('.game-card');
                    var sectionHasVisible = false;
                    for (var j = 0; j < gameCards.length; j++) {
                        var card = gameCards[j];
                        var img = card.querySelector('img');
                        var alt = img ? img.getAttribute('alt') || '' : '';
                        if (filter === '' || alt.toLowerCase().indexOf(filter) > -1) {
                            card.style.display = '';
                            sectionHasVisible = true;
                        } else {
                            card.style.display = 'none';
                        }
                    }
                    section.style.display = sectionHasVisible ? '' : 'none';
                }
            }
        }

        /* ===== Modal Klik Yaxşılaşdırma ===== */
        document.addEventListener('DOMContentLoaded', function() {
            try {
                var u = JSON.parse(localStorage.getItem('sb_current_user') || 'null');
                if (u && u.username) profilGoster(u.username);
            } catch(e) {}
            
            document.querySelectorAll('.auth-modal').forEach(function(m) {
                m.addEventListener('click', function(e) {
                    if (e.target === this) this.classList.remove('active');
                });
            });
            document.querySelectorAll('.auth-switch').forEach(function(l) {
                l.addEventListener('click', function(e) {
                    e.preventDefault();
                    var t = this.getAttribute('data-target');
                    if (t === 'loginModal') { modalKapat('registerModal'); girisAc(); }
                    else if (t === 'registerModal') { modalKapat('loginModal'); qeydAc(); }
                });
            });
        });
    