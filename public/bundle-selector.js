// ==========================================================
// STEAMBAZARI KOMBO PAKET OYUN SEÇİMİ (BUNDLE SELECTOR)
// ==========================================================

var currentBundleMode = 2; // 2 və ya 3 oyun
var currentBundlePrice = '7,99';
var selectedBundleGames = [];

var BUNDLE_GAMES_LIST = [
  {
    "title": "Resident Evil 2 Remake",
    "src": "sekiller/re2.jfif",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Resident Evil 3 Remake",
    "src": "sekiller/re3.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Resident Evil 4 Remake",
    "src": "sekiller/re4.avif",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Resident Evil 7 Biohazard",
    "src": "sekiller/re7.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Resident Evil Village",
    "src": "sekiller/re8.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Reanimal",
    "src": "sekiller/reanimal.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Days Gone",
    "src": "sekiller/daysg.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Silent Hill 2 Remake",
    "src": "sekiller/Silent_Hill_2_remake_cover.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Silent Hill f",
    "src": "sekiller/silentf.jfif",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Dying Light",
    "src": "sekiller/dying1.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Dying Light 2",
    "src": "sekiller/featured.avif",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Outlast",
    "src": "sekiller/outlast1.webp",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Outlast 2",
    "src": "sekiller/oustlas2.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "The Outlast Trials",
    "src": "sekiller/trials.jfif",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Dying Light: The Beast",
    "src": "sekiller/pcd_dyinglightthebeast.webp",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Alan Wake",
    "src": "sekiller/alan1.jfif",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Alan Wake 2",
    "src": "sekiller/Alan_Wake_2_(game).jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "The Last of Us Part I",
    "src": "sekiller/The_Last_of_Us_capa.png",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "The Last of Us Part II",
    "src": "sekiller/TLOU_P2_Box_Art_2.png",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Alien Isolation",
    "src": "sekiller/Alien_Isolation.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Pragmata",
    "src": "sekiller/Pragmata_cover.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Resident Evil Requiem",
    "src": "sekiller/re9.avif",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Crimson Desert",
    "src": "sekiller/crimson-desert-191ki.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "MADiSON",
    "src": "sekiller/madison.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "The Mortuary Assistant",
    "src": "sekiller/the-mortuary-assistant-2026-mPyOBq.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "The Evil Within",
    "src": "sekiller/within.jpg",
    "cat": "Qorxulu oyunlar"
  },
  {
    "title": "Call of Duty:WWII",
    "src": "sekiller/codww.jpg",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Battlefield 1",
    "src": "sekiller/Battlefield_1.jpg",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Battlefield 6",
    "src": "sekiller/battlefield-6-phantom-edition-pc-ea-app-cover.jpg",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Mafia: Definitive Edition",
    "src": "sekiller/mafia1.jpg",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Mafia II",
    "src": "sekiller/mafia2.jfif",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Mafia: The Old Country",
    "src": "sekiller/oldcountry.avif",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Far Cry 5",
    "src": "sekiller/cry5.jfif",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Far Cry 6",
    "src": "sekiller/cry6.jpg",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Metro 2033",
    "src": "sekiller/metro1.jfif",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Metro Last Light",
    "src": "sekiller/metro2.jfif",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Metro Exodus",
    "src": "sekiller/metro3.jfif",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Bodycam",
    "src": "sekiller/bodycam.jpg",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Sekiro",
    "src": "sekiller/Sekiro_art.jpg",
    "cat": "Aksiyon Oyunları"
  },
  {
    "title": "Grand Theft Auto V",
    "src": "sekiller/ggta5.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Red Dead Redemption 2",
    "src": "sekiller/rdr2.avif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Cyberpunk 2077",
    "src": "sekiller/Cyberpunk-2077-PC-COVER.webp",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Grand Theft Auto: The Trilogy",
    "src": "sekiller/Grand_theft_auto_the_trilogy_kapak.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "God of War",
    "src": "sekiller/godofwar.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "God of War Ragnarök",
    "src": "sekiller/God_of_War_Ragnarök_cover.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Elden Ring",
    "src": "sekiller/elden.webp",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "The Witcher 3: Wild Hunt",
    "src": "sekiller/wıitcher.jfif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Horizon Zero Dawn / Forbidden West",
    "src": "sekiller/horizon.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Clair Obscur: Expedition 33",
    "src": "sekiller/expedition-33-v0-cq69az5xp6cg1.webp",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Forza Horizon 6",
    "src": "sekiller/forza6.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Hogwarts Legacy",
    "src": "sekiller/hogvarts.jfif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Ghost of Tsushima",
    "src": "sekiller/ghostof.jfif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Kingdom Come: Deliverance",
    "src": "sekiller/kingdom1.jfif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Kingdom Come: Deliverance II",
    "src": "sekiller/kingdom2.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Marvel's Spider-Man Remastered",
    "src": "sekiller/spi.avif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Marvel's Spider-Man 2",
    "src": "sekiller/spi2.jfif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Watch Dogs",
    "src": "sekiller/watch1.jfif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Watch Dogs 2",
    "src": "sekiller/wd2.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Watch Dogs: Legion",
    "src": "sekiller/watch-dogs-legion.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Forza Horizon 5",
    "src": "sekiller/forza5.jpg",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Stalker 2",
    "src": "sekiller/stalker2.avif",
    "cat": "Açıq Dünya oyunları"
  },
  {
    "title": "Hitman 3",
    "src": "sekiller/hitman3.jfif",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Hitman: Absolution",
    "src": "sekiller/abs.webp",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Indiana Jones and the Great Circle",
    "src": "sekiller/jones.jpg",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Uncharted 4: A Thief's End",
    "src": "sekiller/uc4.jpg",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Tomb Raider",
    "src": "sekiller/tomb.jfif",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Rise of the Tomb Raider",
    "src": "sekiller/rise of.jfif",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Assassin's Creed Unity",
    "src": "sekiller/Assassin’s_Creed_-_Unity.jpg",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Assassin's Creed Origins",
    "src": "sekiller/ACOrigins_STD_Store_Portrait_1200x1600_1200x1600-4a79f9f393f7a3a9e5be3a0ae581f3d5.jfif",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Assassin's Creed Valhalla",
    "src": "sekiller/valhala.png",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Assassin's Creed Shadows",
    "src": "sekiller/shadows.jpeg",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Assassin's Creed Odyssey",
    "src": "sekiller/odysey.jpg",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "Assassin's Creed III",
    "src": "sekiller/ac3_cover.jpg",
    "cat": "Gizlilik,Macəra oyunları"
  },
  {
    "title": "EA Sports FC 23",
    "src": "sekiller/fc23.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "EA Sports FC 24",
    "src": "sekiller/fc24.avif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "EA Sports FC 25",
    "src": "sekiller/fc25.jfif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "EA Sports FC 26",
    "src": "sekiller/fc26.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "WWE26",
    "src": "sekiller/2k.avif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "WWE 2K26",
    "src": "sekiller/2k26.jfif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "A Way Out",
    "src": "sekiller/A-Way-Out.jfif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "It Takes Two",
    "src": "sekiller/ittakes.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Split Fiction",
    "src": "sekiller/split.jfif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Detroit: Become Human",
    "src": "sekiller/detroit.jfif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Death Stranding 2",
    "src": "sekiller/death1.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Death Stranding 1",
    "src": "sekiller/death2.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Mortal Kombat 11",
    "src": "sekiller/mk11.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Mortal Kombat 1",
    "src": "sekiller/mk1.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Mount & Blade",
    "src": "sekiller/mountblade.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Euro Truck Simulator 2",
    "src": "sekiller/ets2.avif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Taxi Life: A City Driving Simulator",
    "src": "sekiller/taxilife1.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "Assetto Corsa",
    "src": "sekiller/assettocorsa.avif",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "PES 2021",
    "src": "sekiller/pes2021.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "FM26",
    "src": "sekiller/fm261.jpg",
    "cat": "Sport,Digər oyunlar"
  },
  {
    "title": "NBA 2K26",
    "src": "sekiller/nba2k26.jpg",
    "cat": "Sport,Digər oyunlar"
  }
];

function openBundleSelector(count, price) {
    try {
        var s = document.getElementById('clickSound');
        if (s) { s.currentTime = 0; s.volume = 0.45; s.play().catch(function(){}); }
    } catch(e) {}

    currentBundleMode = count;
    currentBundlePrice = count === 3 ? '11,99' : '7,99';
    selectedBundleGames = [];

    var modal = document.getElementById('bundleSelectModal');
    if (!modal) return;
    var modalContent = modal.querySelector('.bundle-modal-content');
    
    if (count === 3) {
        if (modalContent) modalContent.classList.add('trio-theme');
        var badge = document.getElementById('bundleModalBadge');
        if (badge) {
            badge.className = 'bundle-modal-badge badge-trio-theme';
            badge.innerHTML = '<i class="fas fa-crown"></i> 3 Oyun Paketi';
        }
        var title = document.getElementById('bundleModalTitle');
        if (title) title.innerText = 'İstədiyiniz 3 Oyunu Seçin';
        var priceEl = document.getElementById('bundleModalPrice');
        if (priceEl) priceEl.innerText = '11,99 AZN';
    } else {
        if (modalContent) modalContent.classList.remove('trio-theme');
        var badge = document.getElementById('bundleModalBadge');
        if (badge) {
            badge.className = 'bundle-modal-badge badge-duo-theme';
            badge.innerHTML = '<i class="fas fa-gamepad"></i> 2 Oyun Paketi';
        }
        var title = document.getElementById('bundleModalTitle');
        if (title) title.innerText = 'İstədiyiniz 2 Oyunu Seçin';
        var priceEl = document.getElementById('bundleModalPrice');
        if (priceEl) priceEl.innerText = '7,99 AZN';
    }

    var searchInput = document.getElementById('bundleSearchInput');
    if (searchInput) searchInput.value = '';

    renderBundleGamesList('');
    updateBundleSelectionUI();

    modal.classList.add('active');
}

function closeBundleModal() {
    var modal = document.getElementById('bundleSelectModal');
    if (modal) modal.classList.remove('active');
}

function filterBundleList() {
    var searchInput = document.getElementById('bundleSearchInput');
    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    renderBundleGamesList(query);
}

function renderBundleGamesList(query) {
    var container = document.getElementById('bundleGamesList');
    if (!container) return;

    var filtered = BUNDLE_GAMES_LIST.filter(function(g) {
        if (!query) return true;
        return g.title.toLowerCase().indexOf(query) > -1 || (g.cat && g.cat.toLowerCase().indexOf(query) > -1);
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:40px 20px;color:rgba(255,255,255,0.4);font-size:14px;"><i class="fas fa-search" style="font-size:24px;display:block;margin-bottom:10px;opacity:0.4;"></i>Axtarışa uyğun oyun tapılmadı</div>';
        return;
    }

    var html = '';
    filtered.forEach(function(game) {
        var isSelected = selectedBundleGames.some(function(sg) { return sg.title === game.title; });
        var escapedTitle = game.title.replace(/'/g, "\\'");
        html += '<div class="bundle-game-row ' + (isSelected ? 'selected' : '') + '" onclick="toggleBundleGame(\'' + escapedTitle + '\')">';
        html += '  <img src="' + game.src + '" alt="' + game.title + '" class="bundle-game-thumb" loading="lazy" onerror="this.style.opacity=0.3">';
        html += '  <div class="bundle-game-info">';
        html += '    <span class="bundle-game-category">' + (game.cat || 'Steam Oyunu') + '</span>';
        html += '    <h4 class="bundle-game-name">' + game.title + '</h4>';
        html += '  </div>';
        html += '  <div class="bundle-game-check"><i class="fas fa-check"></i></div>';
        html += '</div>';
    });

    container.innerHTML = html;
}

function toggleBundleGame(title) {
    try {
        var s = document.getElementById('clickSound');
        if (s) { s.currentTime = 0; s.volume = 0.35; s.play().catch(function(){}); }
    } catch(e) {}

    var existingIdx = selectedBundleGames.findIndex(function(g) { return g.title === title; });
    
    if (existingIdx > -1) {
        selectedBundleGames.splice(existingIdx, 1);
    } else {
        if (selectedBundleGames.length >= currentBundleMode) {
            var msg = currentBundleMode === 2 ? 'Artıq 2 oyun seçmisiniz! Fərqli oyun seçmək üçün əvvəlki seçimlərdən birini çıxarın.' : 'Artıq 3 oyun seçmisiniz! Fərqli oyun seçmək üçün əvvəlki seçimlərdən birini çıxarın.';
            if (typeof gosterToast === 'function') {
                gosterToast(msg, 'warning');
            } else {
                alert(msg);
            }
            return;
        }
        var found = BUNDLE_GAMES_LIST.find(function(g) { return g.title === title; });
        if (found) {
            selectedBundleGames.push(found);
        }
    }

    var searchInput = document.getElementById('bundleSearchInput');
    var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    renderBundleGamesList(query);
    updateBundleSelectionUI();
}

function removeSelectedBundleGame(title) {
    toggleBundleGame(title);
}

function updateBundleSelectionUI() {
    var count = selectedBundleGames.length;
    var target = currentBundleMode;
    var counterEl = document.getElementById('bundleCounterText');
    if (counterEl) {
        counterEl.innerHTML = 'Seçilib: <strong style="color:' + (target === 3 ? '#ffd700' : '#06bfff') + ';">' + count + '</strong> / ' + target;
    }

    var chipsContainer = document.getElementById('selectedGamesChips');
    if (chipsContainer) {
        if (count === 0) {
            chipsContainer.innerHTML = '<span class="bundle-empty-hint">Hələ heç bir oyun seçilməyib</span>';
        } else {
            var chipsHtml = '';
            selectedBundleGames.forEach(function(g) {
                var escaped = g.title.replace(/'/g, "\\'");
                chipsHtml += '<span class="bundle-chip">' + g.title + ' <i class="fas fa-times bundle-chip-remove" onclick="event.stopPropagation();removeSelectedBundleGame(\'' + escaped + '\')"></i></span>';
            });
            chipsContainer.innerHTML = chipsHtml;
        }
    }

    var submitBtn = document.getElementById('bundleSubmitBtn');
    if (submitBtn) {
        if (count === target) {
            submitBtn.disabled = false;
            submitBtn.className = 'bundle-submit-order-btn ' + (target === 3 ? 'active-trio' : 'active-duo');
            submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Sifarişi WhatsApp ilə Tamamla (' + currentBundlePrice + ' AZN)';
        } else {
            submitBtn.disabled = true;
            submitBtn.className = 'bundle-submit-order-btn';
            var remaining = target - count;
            submitBtn.innerHTML = '<i class="fas fa-hand-pointer"></i> Daha ' + remaining + ' oyun seçin (' + count + '/' + target + ')';
        }
    }
}

function submitBundleOrder() {
    if (selectedBundleGames.length !== currentBundleMode) return;
    try {
        var s = document.getElementById('clickSound');
        if (s) { s.currentTime = 0; s.volume = 0.45; s.play().catch(function(){}); }
    } catch(e) {}

    var text = 'Salam, SteamBazari saytından ' + currentBundleMode + ' Oyun Paketi (' + currentBundlePrice + ' AZN) kampaniyası ilə aşağıdakı oyunları sifariş etmək istəyirəm:\n\n';
    selectedBundleGames.forEach(function(g, idx) {
        text += (idx + 1) + '. ' + g.title + '\n';
    });
    text += '\nCəmi: ' + currentBundlePrice + ' AZN';

    var url = 'https://wa.me/994559308887?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
}
