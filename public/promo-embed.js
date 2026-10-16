/**
 * STEAMBAZARI — PROMO MODAL & LIVE DATA SYNC BRIDGE
 * Mövcud SteamBazari saytını cinematic reklam təqdimatı ilə əlaqələndirir.
 */

(function(window) {
    'use strict';

    var PromoEmbedBridge = {
        modalEl: null,
        iframeEl: null,
        isOpen: false,

        init: function() {
            this.createModalDOM();
            this.bindEvents();
            console.log('[PromoEmbedBridge] Reklam təqdimatı modulu hazırdır.');
        },

        createModalDOM: function() {
            if (document.getElementById('promoModalOverlay')) return;

            var modal = document.createElement('div');
            modal.id = 'promoModalOverlay';
            modal.className = 'promo-modal-overlay';
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('aria-label', 'SteamBazari Reklam Təqdimatı');

            modal.innerHTML = `
                <div class="promo-modal-container">
                    <button class="promo-modal-close-btn" id="promoModalCloseBtn" title="Təqdimatı bağla (ESC)">
                        <i class="fas fa-times"></i>
                    </button>
                    <iframe id="promoIframe" class="promo-modal-iframe" allow="autoplay; fullscreen" loading="lazy"></iframe>
                </div>
            `;

            document.body.appendChild(modal);
            this.modalEl = modal;
            this.iframeEl = modal.querySelector('#promoIframe');
        },

        open: function() {
            if (!this.modalEl) this.createModalDOM();

            // Iframe mənbəyini müəyyən et
            var promoUrl = '../SteamBazari-Promo/index.html';
            if (this.iframeEl && (!this.iframeEl.src || this.iframeEl.src === 'about:blank' || !this.iframeEl.src.includes('SteamBazari-Promo'))) {
                this.iframeEl.src = promoUrl;
            }

            this.modalEl.classList.add('open');
            this.isOpen = true;
            document.body.style.overflow = 'hidden';

            // Saytdakı cari oyun kartlarını iframe-ə ötür
            var self = this;
            setTimeout(function() {
                self.syncLiveGamesToPromo();
            }, 800);
        },

        close: function() {
            if (!this.modalEl) return;
            this.modalEl.classList.remove('open');
            this.isOpen = false;
            document.body.style.overflow = '';

            // Səsi dayandırmaq üçün iframe-ə mesaj və ya reset
            if (this.iframeEl && this.iframeEl.contentWindow) {
                try {
                    this.iframeEl.contentWindow.postMessage({ type: 'sbPromoStopAudio' }, '*');
                } catch(e) {}
            }
        },

        syncLiveGamesToPromo: function() {
            if (!this.iframeEl || !this.iframeEl.contentWindow) return;
            var cards = document.querySelectorAll('.game-category .game-card');
            if (!cards || cards.length === 0) return;

            var gamesList = [];
            cards.forEach(function(card, idx) {
                if (idx >= 6) return;
                var img = card.querySelector('img');
                var priceTag = card.querySelector('.game-price-tag');
                var title = img ? (img.getAttribute('alt') || '') : '';
                var priceStr = priceTag ? priceTag.textContent.trim() : '';
                var priceVal = parseFloat(priceStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 29.99;
                var imgSrc = img ? img.getAttribute('src') : '';

                if (title) {
                    gamesList.push({
                        id: 'live_card_' + idx,
                        title: title,
                        price: priceVal,
                        oldPrice: Number((priceVal * 1.6).toFixed(2)),
                        currency: 'AZN',
                        productType: 'Steam Key',
                        note: 'Şəxsi hesabınıza aktivləşdirilir',
                        image: imgSrc || 'assets/ggta5.jpg'
                    });
                }
            });

            if (gamesList.length > 0) {
                try {
                    this.iframeEl.contentWindow.postMessage({
                        type: 'sbPromoUpdateLiveGames',
                        games: gamesList
                    }, '*');
                } catch(e) {}
            }
        },

        bindEvents: function() {
            var self = this;

            // Bağlama düyməsi
            var closeBtn = document.getElementById('promoModalCloseBtn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    self.close();
                });
            }

            // Arxa fona kliklədikdə bağlama
            if (this.modalEl) {
                this.modalEl.addEventListener('click', function(e) {
                    if (e.target === self.modalEl) {
                        self.close();
                    }
                });
            }

            // ESC düyməsi ilə bağlama
            window.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && self.isOpen) {
                    self.close();
                }
            });
        }
    };

    window.openPromoModal = function(e) {
        if (e) e.preventDefault();
        PromoEmbedBridge.open();
    };

    window.closePromoModal = function(e) {
        if (e) e.preventDefault();
        PromoEmbedBridge.close();
    };

    window.PromoEmbedBridge = PromoEmbedBridge;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            PromoEmbedBridge.init();
        });
    } else {
        PromoEmbedBridge.init();
    }

})(typeof window !== 'undefined' ? window : this);