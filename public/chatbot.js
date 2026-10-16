// ============================================================
// STEAMBAZARI.AZ - AI CHATBOT
// Ağıllı köməkçi - Azərbaycan dilində
// ============================================================

(function() {
    'use strict';

    // ==========================================================
    // KONFİQURASİYA
    // ==========================================================
    const CONFIG = {
        GEMINI_API_KEY: '',
        GEMINI_MODEL: 'gemini-2.0-flash',

        OPENAI_API_KEY: '',
        OPENAI_MODEL: 'gpt-4o-mini',

        ADMIN_WHATSAPP: '994559308887',
        ADMIN_WP_TEXT: 'Salam Elçan Bəy, saytınızdan gəldim. Ətraflı suallarım var.',

        BOT_NAME: 'SteamBazari AI',
        BOT_LOGO: 'sekiller/chatbot-logo.png',

        WELCOME_MSG: 'Salam! 👋 Mən SteamBazari AI köməkçisiyəm. Oyunlar, sifarişlər və sayt haqqında suallarınızı cavablandıra bilərəm. Necə kömək edə bilərəm?',

        // Proxy (PHP) - hosting-də API çağırışları üçün
        PROXY_URL: 'chatbot-proxy.php',

        THEME: 'dark'
    };

    // ==========================================================
    // OYUN MƏLUMATLARI
    // ==========================================================
            const GAMES = [
        { title: 'The Blood of Dawnwalker', price: '9.99 AZN', category: 'ÖZƏL OYUNLAR', genre: 'Aksiya / Macəra', desc: 'Rebel Wolves tərəfindən Unreal Engine 5 ilə hazırlanan açıq dünya dark fantasy RPG. 14-cü əsrdə qədim Avropada baş verir. Gündüzlər insan, gecələr vampir olan Coen rolunda ailəni qurtarmaq. Eclipse Edition rəqəmsal soundtrack və komik kitab ehtiva edir. 💰 9,99 AZN' },
        { title: 'Assassin\'s Creed IV Black Flag', price: '9.99 AZN', category: 'ÖZƏL OYUNLAR', genre: 'Aksiya / Macəra', desc: '' },
        { title: 'Onimusha: Way of the Sword', price: '9.99 AZN', category: 'ÖZƏL OYUNLAR', genre: 'Aksiya / Macəra', desc: 'Capcom tərəfindən hazırlanan 2026-cı il action-adventure oyunu. Miyamoto Musashi rolunda Edo dövrü Kyotosunu bürümüş bədheybət Genma ordusuna qarşı döyüş. 20 ildən çoxdur davam edən seriyanın yeni hissəsi. 💰 9,99 AZN' },
        { title: '007 First Light', price: '7.99 AZN', category: 'ÖZƏL OYUNLAR', genre: 'Aksiya / Macəra', desc: '' },
        { title: 'Resonance: A Plague Tale Legacy', price: '9.99 AZN', category: 'ÖZƏL OYUNLAR', genre: 'Aksiya / Macəra', desc: 'Asobo Studio tərəfindən A Plague Tale seriyasının prequel oyunu. Sophia rolunda Minotavr adasına səyahət, qorxulu tapmacalar həll et, əfsanəvi varlıqla üzləş. 2026-cı il action-adventure oyunu. 💰 9,99 AZN' },
        { title: 'NBA 2K27 Deluxe', price: '9.99 AZN', category: 'ÖZƏL OYUNLAR', genre: 'Aksiya / Macəra', desc: 'Visual Concepts tərəfindən hazırlanan 2K tərəfindən yayımlanan 2026 basketbol simulyasiyası. MyCAREER, MyTEAM və MyNBA rejimləri. Deluxe Edition 100.000 VC və erkən giriş əlavə etdiyi bonuslar daxil edir. 💰 9,99 AZN' },
        { title: 'Mortal Shell II: Devout Edition', price: '9.99 AZN', category: 'ÖZƏL OYUNLAR', genre: 'Aksiya / Macəra', desc: 'Cold Symmetry tərəfindən hazırlanan 2026-cı il dark fantasy souls-like action RPG. 2020-ci il hitinin müstəqil davamı olaraq dağıdılmış dünyada yeni Shell-lər, amansız boss döyüşləri və dərin döyüş sistemi təqdim edir. Devout Edition 72 saat erkən giriş və səkkiz Obsidian Shell dərisi daxil edir. 💰 9,99 AZN' },
        { title: 'Beast of Reincarnation Deluxe', price: '9.99 AZN', category: 'ÖZƏL OYUNLAR', genre: 'Aksiya / Macəra', desc: 'Pokémon yaradıcıları Game Freak tərəfindən hazırlanan, Fictions nəşri ilə 2026-cı il action RPG. 4026-cı ildə post-apokaliptik Yaponiyada Emma və sadiq iti Koo ilə "bir insan, bir it" macərası. Deluxe Edition 100.000 Amber, Koo üçün Shiba dəriləri və Emma üçün Big Dipper silahı daxil edir. 💰 9,99 AZN' },
        { title: 'Resident Evil 2 Remake', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Resident Evil 3 Remake', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Resident Evil 4 Remake', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Resident Evil 7 Biohazard', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Resident Evil Village', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Reanimal', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Days Gone', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Silent Hill 2 Remake', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Silent Hill f', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Dying Light', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Dying Light 2', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Outlast', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Outlast 2', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'The Outlast Trials', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Dying Light: The Beast', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Alan Wake', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Alan Wake 2', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'The Last of Us Part I', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'The Last of Us Part II', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Alien Isolation', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Pragmata', price: '6.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Resident Evil Requiem', price: '7.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Crimson Desert', price: '6.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'MADiSON', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'The Mortuary Assistant', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'The Evil Within', price: '5.99 AZN', category: 'Qorxulu oyunlar', genre: 'Qorxu', desc: '' },
        { title: 'Call of Duty: Modern Warfare', price: '9.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Call of Duty: Modern Warfare II', price: '9.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Call of Duty: Modern Warfare III', price: '9.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Call of Duty: Black Ops 6', price: '9.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Call of Duty: Black Ops Cold War', price: '9.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Call of Duty:WWII', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Call of Duty: Black Ops 1', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Call of Duty: Black Ops 2', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Call of Duty: Black Ops III', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Battlefield 1', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Battlefield 6', price: '7.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Mafia: Definitive Edition', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Mafia II', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Mafia: The Old Country', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Far Cry 5', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Far Cry 6', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Metro 2033', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Metro Last Light', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Metro Exodus', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Bodycam', price: '9.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Sekiro', price: '5.99 AZN', category: 'Aksiyon Oyunları', genre: 'Aksiya', desc: '' },
        { title: 'Grand Theft Auto V', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Red Dead Redemption 2', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Cyberpunk 2077', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Grand Theft Auto: The Trilogy', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'God of War', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'God of War Ragnarök', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Elden Ring', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'The Witcher 3: Wild Hunt', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Horizon Zero Dawn / Forbidden West', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Clair Obscur: Expedition 33', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Forza Horizon 6', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Hogwarts Legacy', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Ghost of Tsushima', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Kingdom Come: Deliverance', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Kingdom Come: Deliverance II', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Marvel\'s Spider-Man Remastered', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Marvel\'s Spider-Man 2', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Watch Dogs', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Watch Dogs 2', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Watch Dogs: Legion', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Forza Horizon 5', price: '7.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Stalker 2', price: '5.99 AZN', category: 'Açıq Dünya oyunları', genre: 'Açıq Dünya', desc: '' },
        { title: 'Hitman 3', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Hitman: Absolution', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Indiana Jones and the Great Circle', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Uncharted 4: A Thief\'s End', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Tomb Raider', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Rise of the Tomb Raider', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Assassin\'s Creed Unity', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Assassin\'s Creed Origins', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Assassin\'s Creed Valhalla', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Assassin\'s Creed Shadows', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Assassin\'s Creed Odyssey', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'Assassin\'s Creed III', price: '5.99 AZN', category: 'Gizlilik,Macəra oyunları', genre: 'Macəra', desc: '' },
        { title: 'EA Sports FC 23', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'EA Sports FC 24', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'EA Sports FC 25', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'EA Sports FC 26', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'WWE26', price: '', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'WWE 2K26', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'A Way Out', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'It Takes Two', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Split Fiction', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Detroit: Become Human', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Death Stranding 2', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Death Stranding 1', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Mortal Kombat 11', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Mortal Kombat 1', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Mount & Blade', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Euro Truck Simulator 2', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Taxi Life: A City Driving Simulator', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Assetto Corsa', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'PES 2021', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'FM26', price: '5.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'NBA 2K26', price: '7.99 AZN', category: 'Sport,Digər oyunlar', genre: 'İdman', desc: '' },
        { title: 'Grand Theft Auto V', price: 'Offline 19,99 AZN | Universal 34,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Red Dead Redemption 2', price: 'Offline 19,99 AZN | Universal 44,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'The Last of Us Part I', price: 'Offline 14,99 AZN | Universal 27,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'The Last of Us Part II', price: 'Offline 19,99 AZN | Universal 29,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Uncharted 4: A Thief\'s End', price: 'Offline 14,99 AZN | Universal 24,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Mafia: The Old Country', price: 'Offline 15,99 AZN | Universal 37,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Resident Evil 7: Biohazard', price: 'Offline 14,99 AZN | Universal 20,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Resident Evil Village', price: 'Offline 14,99 AZN | Universal 24,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'EA Sports FC 25', price: 'Offline 19,99 AZN | Universal 29,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Call of Duty: Modern Warfare III', price: 'Offline 19,99 AZN | Universal 31,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Resident Evil 4 Remake', price: 'Offline 19,99 AZN | Universal 34,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'The Witcher 3: Wild Hunt', price: 'Offline 17,99 AZN | Universal 29,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Deluxe Edition PS5 - Forza Horizon 5', price: 'Offline 19,99 AZN | Universal 49,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Deluxe Edition PS5 - Resident Evil Requiem', price: 'Offline 19,99 AZN | Universal 79,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Deluxe Edition PS5 - Reanimal', price: 'Offline 19,99 AZN | Universal 79,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Deluxe Edition PS5 - First Light', price: 'Offline 23,99 AZN | Universal 79,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'PlayStation 250 TL Hədiyyə Kartı', price: '14,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'PlayStation 500 TL Hədiyyə Kartı', price: '24,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'PlayStation 750 TL Hədiyyə Kartı', price: '36,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'PlayStation 1000 TL Hədiyyə Kartı', price: '45,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'PlayStation 1500 TL Hədiyyə Kartı', price: '64,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'PlayStation 2000 TL Hədiyyə Kartı', price: '84,99 AZN', category: 'PS4/PS5 OYUNLARI', genre: 'PlayStation', desc: '' },
        { title: 'Forza Horizon 6', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Forza Horizon 5', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Call of Duty: Modern Warfare', price: '11.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Call of Duty: Modern Warfare II', price: '11.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Call of Duty: Modern Warfare III', price: '11.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Call of Duty: Black Ops 6', price: '11.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'It Takes Two', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'A Way Out', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Bodycam', price: '9.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'The Outlast Trials', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Valheim', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'The Forest', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'DayZ', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Remnant II', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Pro Soccer Online', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Dead by Daylight', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Dead Island 2', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Back 4 Blood', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Diablo IV', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'The Texas Chain Saw Massacre', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Escape the Backrooms', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Palworld', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'State of Decay 2', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Subnautica 2', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'World War Z', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Rematch Online', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'SnowRunner', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Undisputed', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'Arc Raiders', price: '7.99 AZN', category: 'ONLINE PC OYUNLARI', genre: 'Online PC', desc: '' },
        { title: 'GTA5 + RDR2', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'GTA V + RDR 2 TAM GİRİŞ VƏ ÖMÜR BOYU ZƏMANƏT. Bir hesabla oyun dünyasının iki nəhənginə sahib olun! Tamamilə sizə məxsus və bütün məlumatları dəyişdirilə bilən VIP hesab. Rockstar Games (Social Club) vasitəsilə ani çatdırılma ilə sizi gözləyir. Niyə bu Hesabı Alırsınız? Tam Nəzarət Sizdədir: E-poçt, parol və istifadəçi adı da daxil olmaqla bütün məlumatlara sahib ola bilərsiniz. Hesab tamamilə sizə məxsusdur. Sıfır Ban Riski: FiveM, Online və Story rejimlərində heç bir məhdudiyyət yoxdur.… 💰 55,99 AZN' },
        { title: 'GTA 5', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'GTA V TAM GİRİŞ VƏ ÖMÜR BOYU ZƏMANƏT. Tamamilə sizə məxsus və bütün məlumatları dəyişdirilə bilən hesab, Steam (Social Club) vasitəsilə ani çatdırılma ilə sizi gözləyir. Niyə bu Hesabı Alırsınız? Tam Nəzarət Sizdədir: E-poçt, parol və istifadəçi adı da daxil olmaqla bütün məlumatlara sahib ola bilərsiniz. Hesab tamamilə sizə məxsusdur. Sıfır Ban Riski: FiveM, Online və Story rejimlərində heç bir məhdudiyyət yoxdur.…a 💰 29,99 AZN' },
        { title: 'FC 26', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Bu elanı aldığınız zaman FC 26 olan Steam hesabı alacaqsınız. Bütün məlumatlar fərdiləşdirilə bilər; istədiyiniz kimi dəyişdirə bilərsiniz. E-poçt + İstifadəçi adı + Şifrə kimi təqdim olunur.Bütün modlara daxil ola və onlayn serverlərə qoşula bilərsiniz. Hesablar tamamilə yenidir, 0 saatlıq oyun müddəti var. Hesablarımız Ban olunmayıb. Bölgə Hindistandır. 💰 24,99 AZN' },
        { title: 'A Way Out', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Aldıqdan sonra avtomatik olaraq A way Out oyunu olan tam girişli EA hesabı alacaqsınız.[Hesablarımız zəmanətlidir,bansiz və problemsizdir. [E-poçt, parol və istifadəçi adı kimi bütün hesab məlumatları heç bir problem olmadan dəyişdirilə bilər. [Hesablar şəxsi hesablar olduğundan, bütün onlayn oyun rejimlərinə daxil ola bilərsiniz. [Hesabda dostlarınızla oynaya bilərsiniz. 💰 24,99 AZN' },
        { title: 'Red dead Redemption 2', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'İkili Platforma Dəstəyi:RDR 2 oyunu ilə əlaqəli Steam və Social Club hesabları tam giriş ilə təqdim olunur.Bansiz və Lisenziyalı:Onlayn və Hekayə rejimlərində tamamilə qadağansız. Orijinal lisenziyalı oyunu mümkün olan ən təhlükəsiz şəkildə yaşayın.Tam Nəzarət: E-poçt, parol və istifadəçi adı da daxil olmaqla bütün məlumatlar dəyişdirilə bilər.… 💰= 29,99 AZN' },
        { title: 'Witcher 3', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Bu elanı aldığınız zaman Witcher 3 oyunu olan Steam hesabı alacaqsınız. Bütün məlumatlar fərdiləşdirilə bilər; istədiyiniz kimi dəyişdirə bilərsiniz. Bu, E-poçt + İstifadəçi adı + Şifrə kimi təqdim olunur. 💰 17,99 AZN' },
        { title: 'Assassins Creed Origins', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Bu elanı aldığınız zaman Assassins creed origins oyunu olan Steam hesabı alacaqsınız. Bütün məlumatlar fərdiləşdirilə bilər; istədiyiniz kimi dəyişdirə bilərsiniz. Bu, E-poçt + İstifadəçi adı + Şifrə kimi təqdim olunur. 💰 21,99 AZN' },
        { title: 'Assassins Creed Odyssey', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Bu elanı aldığınız zaman Assasinss creed Odyssey oyunu olan Steam hesabı alacaqsınız. Bütün məlumatlar fərdiləşdirilə bilər; istədiyiniz kimi dəyişdirə bilərsiniz. Bu, E-poçt + İstifadəçi adı + Şifrə kimi təqdim olunur. 💰 26,99 AZN' },
        { title: 'Minecraft', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Bu elanı aldığınız zaman Minecraft oyunu olan Microsoft hesabı alacaqsınız. Bütün məlumatlar fərdiləşdirilə bilər; istədiyiniz kimi dəyişdirə bilərsiniz. Bu, E-poçt + İstifadəçi adı + Şifrə kimi təqdim olunur. 💰 31,99 AZN' },
        { title: 'Battlefield 1', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Bu elanı aldığınız zaman BattleField 1 oyunu olan Ea hesabı alacaqsınız. Bütün məlumatlar fərdiləşdirilə bilər; istədiyiniz kimi dəyişdirə bilərsiniz. Bu, E-poçt + İstifadəçi adı + Şifrə kimi təqdim olunur. 💰 16,99 AZN' },
        { title: 'Rust', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Bu elanı aldığınız zaman Rust oyunu olan Steam hesabı alacaqsınız. Bütün məlumatlar fərdiləşdirilə bilər; istədiyiniz kimi dəyişdirə bilərsiniz. Bu, E-poçt + İstifadəçi adı + Şifrə kimi təqdim olunur. 💰 29,99 AZN' },
        { title: 'Steam Random Hesab', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Hesablar Steam hesabları kimi təqdim olunur.Çıxan oyunlar şansa bağlidir.Bütün məlumatlarini dəyişdirə bilərsiniz. 💰 3,99 AZN' },
        { title: 'Ubisoft Account + 10', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Hesablar Ubisoft (Uplay) hesabları kimi təqdim olunur. Bir çox oyunçu tərəfindən bilinən və tanınan 10-dan çox yüksək keyfiyyətli oyun çixan hesab alacaqsınız. 💰 11,99 AZN' },
        { title: 'Ubisoft Account + 20', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Hesablar Ubisoft (Uplay) hesabları kimi təqdim olunur. Bir çox oyunçu tərəfindən bilinən və tanınan 20-dən çox yüksək keyfiyyətli oyun çixan hesab alacaqsınız. 💰 16,99 AZN' },
        { title: 'Epic Games Account + 50', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Hesablar şəxsi Epic Games hesabları kimi təqdim olunur. Bunlar paylaşılan hesablar deyil; onlar tamamilə sizin şəxsi hesablarınızdır.Hesablarda minimum 50 oyun var.Siz 50-dən çox yüksək keyfiyyətli oyun olan hesablar alacaqsınız ki, bunların da əksəriyyəti pulludur və əksər oyunçular tərəfindən yaxşı tanınır. 💰 9,99 AZN' },
        { title: 'Epic Games Account + 100', price: '', category: 'MƏLUMATLARI DƏYİŞƏN HESABLAR', genre: 'Hesab', desc: 'Hesablar şəxsi Epic Games hesabları kimi təqdim olunur. Bunlar paylaşılan hesablar deyil; onlar tamamilə sizin şəxsi hesablarınızdır.Hesablarda minimum 50 oyun var.Siz 100-dən çox yüksək keyfiyyətli oyun olan hesablar alacaqsınız ki, bunların da əksəriyyəti pulludur və əksər oyunçular tərəfindən yaxşı tanınır. 💰 15,99 AZN' },
        { title: 'Canva Pro', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '♾️ Məhsul sizin şəxsi hesabınıza verilir. Siyahını satın aldıqdan sonra sadəcə Canva-da qeydiyyatdan keçmiş e-poçt ünvanınızı təqdim edin. Məhsul ömürlük etibarlıdır və 2 illik zəmanətlə təqdim olunur. 💰 5,99 AZN' },
        { title: 'Duolingo Plus', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '♾️ Məhsul hesabınıza bağlıdır. Siyahını satın aldıqdan sonra sadəcə Duolingo-da qeydiyyatdan keçmiş e-poçt ünvanınızı təqdim edin. Məhsul ömürlük etibarlıdır və 2 illik zəmanətlə təqdim olunur. 💰 5,99 AZN' },
        { title: 'Spotify Premium', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '📅 4 Aylıq 💰 5,99 AZN' },
        { title: 'Windows lisenziya', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '🔑 Lisenziya Açarı| Məhsul sizə rəqəmsal kod kimi çatdırılacaq.Açar yalnız bir cihaz üçün keçərlidir.Kodu aktivləşdirmə bölməsinə birbaşa daxil etməklə məhsulu aktivləşdirə bilərsiniz: xxxx-xxxx-xxxx-xxxx. 💰 8,99 AZN' },
        { title: 'Kaspersky Antivirus', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '📅 3 Aylıq — 8,99 AZN 📅 6 Aylıq — 15,99 AZN 📅 1 İllik — 20,99 AZN|BU HESAB DEYİL;Sizin öz hesabiniza göndərilir.Alarkən sadəcə e-poçt ünvanınızı daxil edin.' },
        { title: 'GeForce NOW', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '1 Aylıq Performance 25,99 AZN 1 Aylıq Ultimate 35,99 AZN|Avropa serveridir.TR serveri deyil,vpnsiz rahat şəkildə oynaya bilərsiz.RTX 4080 qrafik kartına malikdir, 120FPS dəstəkləyir, 8 saatlıq sessiya müddəti təklif edir, 4K çözünürlüyünü dəstəkləyir, növbədə gözləməyi aradan qaldırır və ayda 100 saatlıq oyun vaxtı təmin edir.' },
        { title: 'Xbox Game Pass Standart', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '📅 1 Aylıq — 5,99 AZN Bu məhsulu aldığınız zaman 1 ay müddətində etibarlı olan Xbox Game Pass ilə Microsoft hesabı alacaqsınız.Hesablar mağazamıza məxsusdur.Problemsiz şəkildə öz hesabiniza keçid edib online oyunları oynaya bilərsiniz.EA Play, Ubisoft, Minecraft, Riot, Battle.net oyunları və Rockstar games oyunları daxil deyil.Əlavə platformalar tələb edən oyunlar oynana bilməz.' },
        { title: 'Xbox Game Pass Standart', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '📅 3 Aylıq — 11,99 AZN Bu məhsulu aldığınız zaman 3 ay müddətində etibarlı olan Xbox Game Pass ilə Microsoft hesabı alacaqsınız.Hesablar mağazamıza məxsusdur.Problemsiz şəkildə öz hesabiniza keçid edib online oyunları oynaya bilərsiniz.EA Play, Ubisoft, Minecraft, Riot, Battle.net oyunları və Rockstar games oyunları daxil deyil.Əlavə platformalar tələb edən oyunlar oynana bilməz.' },
        { title: 'Xbox Game Pass Standart', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '📅 1 illik — 26,99 AZN Bu məhsulu aldığınız zaman 12 ay müddətində etibarlı olan Xbox Game Pass ilə Microsoft hesabı alacaqsınız.Hesablar mağazamıza məxsusdur.Problemsiz şəkildə öz hesabiniza keçid edib online oyunları oynaya bilərsiniz.EA Play, Ubisoft, Minecraft, Riot, Battle.net oyunları və Rockstar games oyunları daxil deyil.Əlavə platformalar tələb edən oyunlar oynana bilməz.' },
        { title: 'Xbox Game Pass Ultimate', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '📅 1 Aylıq — 7,99 AZN Bu məhsulu aldığınız zaman 1 ay müddətində etibarlı olan Xbox Game Pass Ultimate ilə Microsoft hesabı alacaqsınız.Hesablar mağazamıza məxsusdur.Problemsiz şəkildə öz hesabiniza keçid edib online oyunları oynaya bilərsiniz.Konsolda oynamaq mümkündür ancaq offline şəkildə.EA Play, Ubisoft, Minecraft, Riot, Battle.net oyunları və Rockstar games oyunları daxil deyil.Əlavə platformalar tələb edən oyunlar oynana bilməz.' },
        { title: 'Xbox Game Pass Ultimate', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '📅 3 Aylıq — 14,99 AZN Bu məhsulu aldığınız zaman 3 ay müddətində etibarlı olan Xbox Game Pass Ultimate ilə Microsoft hesabı alacaqsınız.Hesablar mağazamıza məxsusdur.Problemsiz şəkildə öz hesabiniza keçid edib online oyunları oynaya bilərsiniz.Konsolda oynamaq mümkündür ancaq offline şəkildə.EA Play, Ubisoft, Minecraft, Riot, Battle.net oyunları və Rockstar games oyunları daxil deyil.Əlavə platformalar tələb edən oyunlar oynana bilməz.' },
        { title: 'Xbox Game Pass Ultimate', price: '', category: 'RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR', genre: 'Rəqəmsal', desc: '📅 1 illik — 29,99 AZN Bu məhsulu aldığınız zaman 12 ay müddətində etibarlı olan Xbox Game Pass Ultimate ilə Microsoft hesabı alacaqsınız.Hesablar mağazamıza məxsusdur.Problemsiz şəkildə öz hesabiniza keçid edib online oyunları oynaya bilərsiniz.Konsolda oynamaq mümkündür ancaq offline şəkildə.EA Play, Ubisoft, Minecraft, Riot, Battle.net oyunları və Rockstar games oyunları daxil deyil.Əlavə platformalar tələb edən oyunlar oynana bilməz.' },
        // XBOX SERIES X/S OYUNLARI
        { title: '007 First Light', price: '22.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Xbox Series X/S üçün hazırlanmış yeni 007 oyunu. James Bond-un gənclik dövrünü əks etdirən aksiyon-macəra oyunu.' },
        { title: 'Resident Evil Requiem Deluxe Edition', price: '24.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Capcom tərəfindən hazırlanan Resident Evil seriyasının yeni hissəsi. Qorxu-macəra janrında.' },
        { title: "Assassin's Creed Mirage Deluxe Edition", price: '14.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: "Ubisoft Bordeaux tərəfindən hazırlanmış 2023-cü il action-adventure oyunu. Bağdadda, 9-cu əsrdə keçir. Basim ibn Ishaq rolunda parkur, gizlilik və qətl missiyaları." },
        { title: 'FC26 Ultimate Edition Online', price: '29.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'EA Sports tərəfindən hazırlanan futbol simulyatoru. Ultimate Edition Online xüsusiyyətləri ilə.' },
        { title: 'Call of Duty Modern Warfare 2', price: '19.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Infinity Ward tərəfindən hazırlanan FPS oyunu. Modern Warfare seriyasının davamı.' },
        { title: 'Resident Evil 4 Remake', price: '19.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Capcom tərəfindən yenidən hazırlanmış klassik RE4. Leon Kennedy rolunda qorxu-macəra.' },
        { title: 'Crimson Desert Deluxe Edition', price: '24.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Pearl Abyss tərəfindən hazırlanan açıq dünya aksiyon RPG oyunu.' },
        { title: 'Hitman 3', price: '19.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'IO Interactive tərəfindən hazırlanan gizlilik-aksiyon oyunu. Agent 47-nin son missiyaları.' },
        { title: 'Red Dead Redemption 2 Ultimate Edition', price: '29.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Rockstar Games tərəfindən hazırlanan açıq dünya Vəhşi Qərb oyunu. Ultimate Edition bonus məzmunları ilə.' },
        { title: 'Mafia The Old Country Deluxe Edition', price: '24.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Hangar 13 tərəfindən hazırlanan açıq dünya aksiyon oyunu. Mafia seriyasının yeni hissəsi.' },
        { title: 'Mafia Trilogy', price: '19.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Mafia seriyasının üç oyununu bir yerdə. Definitive Edition.' },
        { title: 'UFC 5 Deluxe Edition', price: '24.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'EA Vancouver tərəfindən hazırlanmış MMA simulyasiya oyunu. Frostbite mühərriki, Real Impact System, realist zədələmə sistemi.' },
        { title: 'Call of Duty Modern Warfare 3', price: '24.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Infinity Ward tərəfindən hazırlanan FPS oyunu. Modern Warfare seriyasının 3-cü hissəsi.' },
        { title: 'GTA 5 Online', price: '19.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Rockstar Games tərəfindən hazırlanan açıq dünya aksiyon oyunu. Online multiplayer.' },
        { title: 'Call of Duty Cold War', price: '24.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Activision tərəfindən hazırlanan FPS oyunu. Soyuq Müharibə dövründə keçən hekayə.' },
        { title: 'Call of Duty Vanguard', price: '19.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Sledgehammer Games tərəfindən hazırlanan FPS oyunu. İkinci Dünya Müharibəsi dövründə keçir.' },
        { title: 'Call of Duty Modern Warfare 2019', price: '24.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Infinity Ward tərəfindən hazırlanan FPS oyunu. Modern Warfare seriyasının yenidən başlanğıcı.' },
        { title: "Assassin's Creed Black Flag Resynced Deluxe Edition", price: '29.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: "Ubisoft tərəfindən yenidən hazırlanmış klassik AC Black Flag. Dəniz macəraları ilə." },
        { title: 'Silent Hill F', price: '29.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: 'Konami tərəfindən hazırlanan psixoloji qorxu oyunu. Silent Hill seriyasının yeni hissəsi.' },
        { title: 'NBA 2K27', price: '34.99 AZN', category: 'XBOX SERIES X/S OYUNLARI', genre: 'Xbox', desc: '2K tərəfindən hazırlanan basketbol simulyatoru. NBA 2K seriyasının ən son hissəsi.' },
    ];

    const FAQ_DATA = [
        { q: 'Sifariş necə verilir?', a: 'Saytda oyunu seçin, sifariş et düyməsinə basın və WhatsApp ilə yazın. Ödənişdən sonra Steam key 5-30 dəqiqə ərzində göndərilir.' },
        { q: 'Ödəniş üsulları nədir?', a: 'Nağd və bank kartı ilə ödəniş mümkündür. Ödəniş sifariş təsdiqləndikdən sonra həyata keçirilir.' },
        { q: 'Steam key necə aktivləşdirilir?', a: 'Steam-i açın → Oyunlar → Steam-də məhsul aktivləşdir → key-i daxil edin. HTML: 1 dəfə istifadə oluna bilər.' },
        { q: 'Çatdırılma nə qədər çəkir?', a: 'Sifariş təsdiqləndikdən sonra 5-30 dəqiqə ərzində WhatsApp ilə key göndərilir.' },
        { q: 'Endirimlər olur?', a: 'Bəli! Saytda davamlı endirimlər və giveaway-lər keçirilir. Çarxdan kupon qazana bilərsiniz.' },
        { q: 'Admin ilə necə əlaqə saxlamaq olar?', a: 'WhatsApp: +994 55 930 88 87 — hər zaman əlaqə saxlayın!' },
        { q: 'Giveaway necə işləyir?', a: 'Saytda giveaway bölməsinə keçin və iştirak edin. Qalib həftəlik elan olunur.' },
        { q: 'Oyunları necə almaq olar?', a: 'Saytda oyun kartına "Sifariş et" düyməsinə basın → WhatsApp açılır → ödəniş edin → key-i alın!' }
    ];

    // ==========================================================
    // DƏYİŞƏNLƏR
    // ==========================================================
    let chatHistory = [];
    let isOpen = false;
    let isProcessing = false;
    let unreadCount = 0;
    let toggle, panel, messages, input, sendBtn, quickActions;

    // ==========================================================
    // WIDGET YARAT
    // ==========================================================
    function createWidget() {
        toggle = document.getElementById('chatbotToggleBtn');
        if (!toggle) {
            // Düymə yoxdursa özümüz yaradırıq
            toggle = document.createElement('button');
            toggle.id = 'chatbotToggleBtn';
            toggle.innerHTML = '💬';
            toggle.className = 'chatbot-toggle';
            document.body.appendChild(toggle);
        }
        toggle.innerHTML = `
            <span class="chat-icon"><img src="${CONFIG.BOT_LOGO}" alt="AI köməkçi" onerror="this.outerHTML='💬'"></span>
            <span class="close-icon" style="display:none;">✕</span>
            <span class="badge-new" id="chatBadge" style="display:none;">0</span>
        `;
        toggle.className = 'chatbot-toggle';

        // Digər skriptlərin inline style-nı təmizlə
        toggle.style.cssText = '';

        panel = document.createElement('div');
        panel.className = 'chatbot-panel';
        panel.id = 'chatbotPanel';
        panel.innerHTML = `
            <div class="chatbot-header">
                <button class="chatbot-back-btn" onclick="window.chatbot && chatbot.close()" title="Geri" aria-label="Geri"><i class="fas fa-arrow-left"></i></button>
                <div class="chatbot-avatar"><img src="${CONFIG.BOT_LOGO}" alt="SteamBazari AI" onerror="this.outerHTML='🤖'"></div>
                <div class="chatbot-header-info">
                    <h3>${CONFIG.BOT_NAME}</h3>
                    <div class="status">
                        <span class="dot"></span>
                        Aktiv köməkçi
                    </div>
                </div>
                <div class="chatbot-header-actions">
                    <button class="chatbot-action-btn" onclick="window.chatbot && chatbot.clearChat()" title="Təmizlə" aria-label="Təmizlə"><i class="fas fa-trash-can"></i></button>
                    <button class="chatbot-action-btn chatbot-close-desktop" onclick="window.chatbot && chatbot.close()" title="Bağla" aria-label="Bağla"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="chatbot-messages" id="chatMessages"></div>
            <div class="quick-actions" id="quickActions"></div>
            <div class="chatbot-input-wrap">
                <div class="chatbot-input-row">
                    <textarea class="chatbot-input" id="chatInput" placeholder="Mesajınızı yazın..." rows="1"></textarea>
                    <button class="chatbot-send-btn" id="chatSendBtn" aria-label="Göndər"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        messages = document.getElementById('chatMessages');
        input = document.getElementById('chatInput');
        sendBtn = document.getElementById('chatSendBtn');
        quickActions = document.getElementById('quickActions');

        // Event listeners
        toggle.addEventListener('click', function() { playClickSound(); toggleChat(); });
        sendBtn.addEventListener('click', function() { playClickSound(); sendMessage(); });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                playClickSound();
                sendMessage();
            }
            setTimeout(function() {
                input.style.height = 'auto';
                input.style.height = Math.min(input.scrollHeight, 100) + 'px';
            }, 0);
        });

        // Mobile Visual Viewport idarəetməsi (Virtual klaviatura üçün)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', function() {
                if (isOpen && window.innerWidth <= 768 && panel) {
                    panel.style.height = window.visualViewport.height + 'px';
                    if (messages) messages.scrollTop = messages.scrollHeight;
                }
            });
            window.visualViewport.addEventListener('scroll', function() {
                if (isOpen && window.innerWidth <= 768 && panel) {
                    panel.style.top = (window.visualViewport.offsetTop || 0) + 'px';
                }
            });
        }
    }

    // ==========================================================
    // AÇ / BAĞLA
    // ==========================================================
    function toggleChat() {
        if (isOpen) close(); else open();
    }

    function open() {
        isOpen = true;
        if (!messages) createWidget();
        panel.classList.add('active');
        toggle.classList.add('active');
        document.body.classList.add('chatbot-open');
        unreadCount = 0;
        updateBadge();

        if (window.innerWidth <= 768 && window.visualViewport) {
            panel.style.height = window.visualViewport.height + 'px';
        }

        if (window.innerWidth > 768) {
            input.focus();
        }

        if (chatHistory.length === 0) {
            setTimeout(function() {
                addBotMessage(CONFIG.WELCOME_MSG);
                showQuickActions();
            }, 300);
        }
    }

    function close() {
        isOpen = false;
        panel.classList.remove('active');
        toggle.classList.remove('active');
        document.body.classList.remove('chatbot-open');
        if (panel && window.innerWidth <= 768) {
            panel.style.height = '';
            panel.style.top = '';
        }
    }

    function clearChat() {
        messages.innerHTML = '';
        chatHistory = [];
        addBotMessage('Sohbet təmizləndi. Yeni sualınızı yazın! ✨');
    }

    function updateBadge() {
        var badge = document.getElementById('chatBadge');
        if (badge) {
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
            badge.textContent = unreadCount;
        }
    }

    // ==========================================================
    // MESAJ ƏLAVƏ ET
    // ==========================================================
    function addBotMessage(text) {
        var d = document.createElement('div');
        d.className = 'chat-msg bot';
        d.innerHTML = formatMessage(text);
        var time = document.createElement('div');
        time.className = 'msg-time';
        time.textContent = new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
        d.appendChild(time);
        messages.appendChild(d);
        messages.scrollTop = messages.scrollHeight;
    }

    function addUserMessage(text) {
        var d = document.createElement('div');
        d.className = 'chat-msg user';
        d.textContent = text;
        var time = document.createElement('div');
        time.className = 'msg-time';
        time.textContent = new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
        d.appendChild(time);
        messages.appendChild(d);
        messages.scrollTop = messages.scrollHeight;
    }

    function addErrorMessage(text) {
        var d = document.createElement('div');
        d.className = 'chat-msg error';
        d.innerHTML = text;
        messages.appendChild(d);
        messages.scrollTop = messages.scrollHeight;
    }

    // Markdown-lite formatlama
    function formatMessage(text) {
        var out = String(text);
        out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>');
        out = out.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        out = out.replace(/\*(.*?)\*/g, '<i>$1</i>');
        out = out.replace(/^### (.*)$/gm, '<div class="msg-subtitle">$1</div>');
        out = out.replace(/\n/g, '<br>');
        out = out.replace(/^\s*[-•] (.*)$/gm, '<div class="msg-li">• $1</div>');
        out = out.replace(/(\+994[\d\s]+)/g, '<a href="https://wa.me/$1" target="_blank" style="color:#25d366;font-weight:700;">$1</a>');
        return out;
    }

    // ==========================================================
    // TYPING GÖSTERGESİ
    // ==========================================================
    function showTyping() {
        var t = document.createElement('div');
        t.className = 'typing-indicator';
        t.id = 'typingIndicator';
        t.innerHTML = '<span></span><span></span><span></span>';
        messages.appendChild(t);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
        var t = document.getElementById('typingIndicator');
        if (t) t.remove();
    }

    // ==========================================================
    // SƏS EFFEKTLƏRİ
    // ==========================================================
    function playClickSound() {
        try {
            var s = document.getElementById('clickSound');
            if (s) { s.currentTime = 0; s.volume = 0.35; s.play().catch(function() {}); }
        } catch (e) {}
    }

    // ==========================================================
    // SÜRƏTLİ DÜYMƏLƏR
    // ==========================================================
    function showQuickActions() {
        if (!quickActions) return;
        quickActions.innerHTML = '';
        var actions = [
            { label: '🎮 Oyun tövsiyəsi', value: 'Mənə yaxşı oyun tövsiyə et' },
            { label: '💰 Qiymətlər', value: 'Qiymətlər nədir?' },
            { label: '🛒 Sifariş', value: 'Sifariş necə verilir?' },
            { label: '👤 Adminlə əlaqə', value: '__ADMIN__' },
            { label: '🎁 Giveaway', value: 'Giveaway necə işləyir?' },
            { label: '🎰 Çarx', value: 'Çarx necə işləyir?' }
        ];
        actions.forEach(function(a) {
            var btn = document.createElement('button');
            btn.className = 'quick-action-btn';
            btn.textContent = a.label;
            btn.addEventListener('click', function() { playClickSound(); sendMessage(a.value); });
            quickActions.appendChild(btn);
        });
    }

    // ==========================================================
    // ADMIN ƏLAQƏ AXINI
    // ==========================================================
    // Axın: null | { step: 'name'|'question'|'game'|'confirm', name, question, game }
    var adminFlow = null;
    var flowButtonsEl = null;

    function startAdminFlow() {
        // Köhnə axın düymələrini sil
        if (flowButtonsEl) { flowButtonsEl.remove(); flowButtonsEl = null; }
        adminFlow = { step: 'name', name: '', question: '', game: '' };
        addUserMessage('👤 Adminlə əlaqə');
        saveToHistory('user', 'Adminlə əlaqə');
        addBotMessage('👤 **Adminlə əlaqə** seçdiniz.\n\nSizi adminə bağlamaq üçün bir neçə məlumat toplayacağam.\n\n✏️ **Adınızı yazın** — məsələn: *Tural*');
        saveToHistory('assistant', 'Adminlə əlaqə üçün istifadəçinin adı soruşuldu.');
    }

    function adminGameButtons() {
        return [
            { label: '🚗 GTA V', value: 'GTA V' },
            { label: '⚽ EA FC', value: 'EA Sports FC' },
            { label: '🤖 Cyberpunk 2077', value: 'Cyberpunk 2077' },
            { label: '⚔️ Elden Ring', value: 'Elden Ring' },
            { label: '🎮 God of War', value: 'God of War' },
            { label: '💬 Qeyd etmədim', value: '*' }
        ];
    }

    function showFlowButtons(buttons) {
        if (flowButtonsEl) { flowButtonsEl.remove(); flowButtonsEl = null; }
        var wrap = document.createElement('div');
        wrap.className = 'chat-buttons';
        buttons.forEach(function(b) {
            var btn = document.createElement('button');
            btn.className = 'chat-btn' + (b.cls ? ' ' + b.cls : '');
            btn.textContent = b.label;
            btn.addEventListener('click', function() {
                playClickSound();
                var v = (b.value === undefined) ? b.label : b.value;
                sendMessage(v);
            });
            wrap.appendChild(btn);
        });
        messages.appendChild(wrap);
        flowButtonsEl = wrap;
        messages.scrollTop = messages.scrollHeight;
    }

    function isAdminStartIntent(t) {
        return /^__ADMIN__$/.test(t) ||
            /adminə bağla|adminle elaqə|adminlə əlaqə|məni admin|bagla|bağla|elaqe et|əlaqə et|adminə yaz|adminle yaz/i.test(t);
    }

    function getAdminFlowReply(userText) {
        var t = (userText || '').trim();

        // Ad soruşulur
        if (adminFlow.step === 'name') {
            if (t.length < 2) {
                return { text: 'Zəhmət olmasa adınızı yazın — məsələn: *Tural* 😊' };
            }
            adminFlow.name = t;
            adminFlow.step = 'question';
            return {
                text: '👤 Salam, **' + t + '**!\n\n📝 İndi **sualınızı yazın** — adminə ötürəcəm.\n\n(Məsələn: *EA FC 26-nın qiyməti nədir?*)'
            };
        }

        // Sual soruşulur
        if (adminFlow.step === 'question') {
            if (t.length < 3) {
                return { text: 'Zəhmət olmasa sualınızı bir az geniş yazın 😊' };
            }
            adminFlow.question = t;
            adminFlow.step = 'game';
            return {
                text: '📝 Sualınız qeyd olundu.\n\n🎮 **Bu sual hansı oyunla bağlıdır?**\nAşağıdan seçin və ya oyunun adını yazın:',
                buttons: adminGameButtons()
            };
        }

        // Oyun seçilir
        if (adminFlow.step === 'game') {
            adminFlow.game = (t === '*') ? 'Qeyd edilməyib' : t;
            adminFlow.step = 'confirm';
            return {
                text: '📋 **Təsdiq üçün məlumatlarınız:**\n\n👤 **Ad:** ' + adminFlow.name + '\n🎮 **Oyun:** ' + adminFlow.game + '\n📝 **Sual:** *' + adminFlow.question + '*\n\n⬇️ Aşağıdan **"Göndər"** düyməsinə basın — mesajınız adminə göndəriləcək:',
                buttons: [
                    { label: '✅ Göndər', value: 'GONDER', cls: 'primary' },
                    { label: '↩️ Ləğv et', value: 'LEGV', cls: 'cancel' }
                ]
            };
        }

        // Təsdiq
        if (adminFlow.step === 'confirm') {
            if (/^(TESDIQ|GONDER|göndər|gonder|yolla|yola sal)$/i.test(t)) {
                var waText = 'Salam Elcan bəy, saytınızdan gəldim!\n\n👤 Adım: ' + adminFlow.name +
                    '\n🎮 Oyun: ' + adminFlow.game +
                    '\n📝 Sualım: ' + adminFlow.question;
                var url = 'https://wa.me/' + CONFIG.ADMIN_WHATSAPP + '?text=' + encodeURIComponent(waText);
                var savedName = adminFlow.name;
                adminFlow = null;
                if (flowButtonsEl) { flowButtonsEl.remove(); flowButtonsEl = null; }
                window.open(url, '_blank');
                return {
                    text: '✅ **Mesajınız göndərilməyə hazırdır!**\n\nŞablon dolu şəkildə açılıb — yalnız **Göndər** düyməsinə basın, ' + savedName + '!\n\n📩 Admin tezliklə sizə cavab verəcək. 😊'
                };
            }
            adminFlow = null;
            if (flowButtonsEl) { flowButtonsEl.remove(); flowButtonsEl = null; }
            return { text: '🙂 Yaxşı, adminlə əlaqəni ləğv etdik. Başqa sualınız varsa, yazın!' };
        }

        return { text: '🙂 Yazın!' };
    }

    // ==========================================================
    // MESAJ GÖNDƏR
    // ==========================================================
    async function sendMessage(text) {
        var userText = text || input.value.trim();
        if (!userText || isProcessing) return;
        input.value = '';
        isProcessing = true;

        // Admin axını başlat
        if (!adminFlow && isAdminStartIntent(userText)) {
            isProcessing = false;
            startAdminFlow();
            return;
        }

        addUserMessage(userText);
        saveToHistory('user', userText);

        // Admin axını davam et
        if (adminFlow) {
            showTyping();
            await new Promise(function(res) { setTimeout(res, 400); });
            var adminResult = getAdminFlowReply(userText);
            hideTyping();
            // Düymə keçid dəyərlərini gözəl etiketlərlə göstər
            var displayText = userText;
            if (userText === 'TESDIQ' || userText === 'GONDER') displayText = '✅ Göndər';
            if (userText === 'LEGV') displayText = '↩️ Ləğv et';
            if (displayText !== userText) {
                var uMsg = messages.querySelector('.chat-msg.user:last-child');
                if (uMsg) uMsg.textContent = displayText;
            }
            addBotMessage(adminResult.text);
            saveToHistory('assistant', adminResult.text);
            if (adminResult.buttons) showFlowButtons(adminResult.buttons);
            // Sürətli düymələri gizlət/göstər
            if (adminFlow) {
                if (quickActions) quickActions.style.display = 'none';
            } else {
                if (quickActions) quickActions.style.display = 'flex';
            }
            isProcessing = false;
            return;
        }

        showTyping();
        var reply = await getReply(userText);
        hideTyping();
        addBotMessage(reply);
        saveToHistory('assistant', reply);
        isProcessing = false;
    }

    // ==========================================================
    // CAVAB İSTEHSALI
    // ==========================================================
    async function getReply(userText) {
        // Əvvəlcə API-yə cəhd et
        if (CONFIG.GEMINI_API_KEY) {
            var geminiReply = await callGemini(userText);
            if (geminiReply) return geminiReply;
        }
        if (CONFIG.OPENAI_API_KEY) {
            var openaiReply = await callOpenAI(userText);
            if (openaiReply) return openaiReply;
        }
        // API yoxdursa, local cavab
        return getLocalReply(userText);
    }

    // ==========================================================
    // GEMINI API
    // ==========================================================
    async function callGemini(userText) {
        try {
            var systemPrompt = buildSystemPrompt();
            var history = chatHistory.slice(-6).map(function(m) {
                return (m.role === 'user' ? 'İstifadəçi' : 'Köməkçi') + ': ' + m.text;
            }).join('\n');
            var fullPrompt = systemPrompt + '\n\nSöhbət:\n' + history + '\n\nİstifadəçi: ' + userText + '\n\nKöməkçi:';

            // Proxy ilə cəhd et
            if (CONFIG.PROXY_URL) {
                try {
                    var res = await fetch(CONFIG.PROXY_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            provider: 'gemini',
                            message: userText,
                            system: systemPrompt,
                            history: chatHistory.slice(-6)
                        })
                    });
                    if (res.ok) {
                        var data = await res.json();
                        if (data.reply) return data.reply;
                    }
                } catch (e) {
                    console.log('Gemini proxy xətası, direct cəhd:', e.message);
                }
            }

            // Direkt API cəhd
            var response = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/' + CONFIG.GEMINI_MODEL + ':generateContent?key=' + CONFIG.GEMINI_API_KEY,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: fullPrompt }] }],
                        generationConfig: { temperature: 0.7, maxOutputTokens: 1024, topP: 0.9 }
                    })
                }
            );
            if (response.ok) {
                var data = await response.json();
                var reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                return reply.replace(/^Köməkçi:\s*/i, '').trim() || null;
            }
        } catch (e) {
            console.log('Gemini xətası:', e.message);
        }
        return null;
    }

    // ==========================================================
    // OPENAI API
    // ==========================================================
    async function callOpenAI(userText) {
        try {
            var systemPrompt = buildSystemPrompt();
            var history = chatHistory.slice(-6).map(function(m) {
                return (m.role === 'user' ? 'İstifadəçi' : 'Köməkçi') + ': ' + m.text;
            }).join('\n');
            var messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: 'Söhbət:\n' + history + '\n\nİstifadəçi: ' + userText }
            ];

            // Proxy ilə cəhd et
            if (CONFIG.PROXY_URL) {
                try {
                    var res = await fetch(CONFIG.PROXY_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            provider: 'openai',
                            message: userText,
                            system: systemPrompt,
                            history: chatHistory.slice(-6)
                        })
                    });
                    if (res.ok) {
                        var data = await res.json();
                        if (data.reply) return data.reply;
                    }
                } catch (e) {
                    console.log('OpenAI proxy xətası, direct cəhd:', e.message);
                }
            }

            // Direkt API cəhd
            var response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + CONFIG.OPENAI_API_KEY
                },
                body: JSON.stringify({
                    model: CONFIG.OPENAI_MODEL,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 400,
                    top_p: 0.9
                })
            });
            if (response.ok) {
                var data = await response.json();
                var reply = data?.choices?.[0]?.message?.content || '';
                return reply.replace(/^Köməkçi:\s*/i, '').trim() || null;
            }
        } catch (e) {
            console.log('OpenAI xətası:', e.message);
        }
        return null;
    }

    // ==========================================================
    // SISTEM PROMPT
    // ==========================================================
    function buildSystemPrompt() {
        var gameList = GAMES.map(function(g) {
            return '- ' + g.title + ' — ' + gamePriceLabel(g) + ' (' + g.category + ')';
        }).join('\n');

        return `Sən SteamBazari.az saytının AI köməkçisisən. Adın SteamBazari AI.

Sənin vəzifən:
1. Oyunlar haqqında məlumat vermək
2. Qiymətləri bildirmək
3. Sifariş, ödəniş, çatdırılma haqqında kömək etmək
4. FAQ suallarına cavab vermək

CAVAB QAYDALARI:
- Həmişə Azərbaycan dilində cavab ver
- Dostcanlı və köməkcil ol
- Cavabları qısa və faydalı saxla
- Qiymətləri AZN ilə qeyd et
- YALNIZ aşağıdakı siyahıda olan oyunlar haqqında məlumat ver. Siyahıda olmayan oyun haqqında uydurma qışmətləri demə.
- Oyun tövsiyə edərkən ad, qiymət və kateqoriyanı qeyd et
- "Məlumatları dəyişən hesablar" və "Rəqəmsal abunəliklər" saytın məhsullarıdır, onları da tövsiyə edə bilərsən

MÖVCUD OYUNLAR (${GAMES.length} məhsul):
${gameList}

FAQ:
${FAQ_DATA.map(f => '- ' + f.q).join('\n')}

Sayt bölmələri: Özəl oyunlar, Qorxu, Aksiyon, Açıq Dünya, Gizlilik/Macəra, İdman, PlayStation (PS4/PS5), Online PC, Məlumatları dəyişən hesablar, Rəqəmsal məhsullar/abunəliklər (Canva, Spotify, Kaspersky, GeForce NOW, Xbox Game Pass), Giveaway, Çarx

Ödəniş: Nağd və kart ilə ödəniş mümkündür.
Çatdırılma: Sifariş təsdiqləndikdən sonra 5-30 dəqiqə ərzində WhatsApp ilə göndərilir.
Adminlə əlaqə: WhatsApp +994 55 930 88 87

Əgər suala cavab tapa bilmirsənsə, istifadəçiyə "WhatsApp vasitəsilə adminlə əlaqə saxlamağı" tövsiyə et.`;
    }

    // ==========================================================
    // OYUN MƏLUMAT KÖMƏKÇİLƏRİ (real sayt məlumatlarına əsaslanır)
    // ==========================================================
    function gameMinPrice(g) {
        var txt = ((g.price || '') + ' ' + (g.desc || ''));
        var nums = [];
        var m;
        var re = /(\d+[.,]\d+)\s*(?:azn|manat)/gi;
        while ((m = re.exec(txt)) !== null) {
            nums.push(parseFloat(m[1].replace(',', '.')));
        }
        if (nums.length === 0) return null;
        return Math.min.apply(null, nums);
    }

    function gamePriceLabel(g) {
        if (g.price) return g.price;
        var p = gameMinPrice(g);
        return p ? p.toFixed(2) + ' AZN' : 'Saytda qeyd olunub';
    }

    function findGame(text) {
        var raw = ' ' + String(text).toLowerCase() + ' ';
        var qt = raw.replace(/[^a-z0-9əöüğıçş ]+/g, ' ').split(/\s+/).filter(function(w) { return w.length >= 2; });
        var best = null, bestScore = 0;
        for (var i = 0; i < GAMES.length; i++) {
            var g = GAMES[i];
            var tl = g.title.toLowerCase();
            var score = 0;
            if (raw.indexOf(tl) >= 0) score += 40;
            for (var j = 0; j < qt.length; j++) {
                var w = qt[j];
                if (tl.indexOf(w) >= 0) score += (w.length >= 5 ? 5 : 3);
            }
            // Birləşik axtarış: "gamepass" -> "xbox game pass standart"
            var compact = tl.replace(/[^a-z0-9əöüğıçş]/g, '');
            if (compact.length > 4) {
                for (var k = 0; k < qt.length; k++) {
                    var cw = qt[k].replace(/[^a-z0-9əöüğıçş]/g, '');
                    if (cw.length >= 5 && compact.indexOf(cw) >= 0) score += 4;
                }
            }
            if (score > bestScore) { bestScore = score; best = g; }
        }
        return bestScore >= 4 ? best : null;
    }

    function catGames(cat) {
        return GAMES.filter(function(g) { return g.category === cat; });
    }

    function listGames(arr, max) {
        return arr.slice(0, max || 6).map(function(g) {
            return '• **' + g.title + '** — ' + gamePriceLabel(g);
        }).join('\n');
    }

    // ==========================================================
    // LOCAL CAVAB SİSTEMİ
    // ==========================================================
    function getLocalReply(text) {
        var t = text.toLowerCase().trim();
        if (t.length < 2) return 'Sualınızı yazın, kömək edim! 😊';

        // Salamlaşma
        if (/salam|hey|selam|hi|hello|merhaba|günaydın/.test(t))
            return '👋 **Salam!** SteamBazari AI köməkçisiyəm. Oyunlar, qiymətlər və sifarişlər haqqında sualınızı yazın!';

        // Təşəkkür
        if (/tşk|sağ ol|sag ol|thanks|thank|minnət|çox gözəl|xosbəxt/.test(t))
            return '🌟 **Buyurun!** Hər zaman kömək etməyə hazıram. Başqa sualınız varsa, yazın!';

        // Necəsən
        if (/necəsən|necesen|nə var|ne var|nə yaxşı|halın/.test(t))
            return '😊 **Yaxşıyam, təşəkkürlər!** Sizə necə kömək edə bilərəm? Oyun tövsiyəsi, qiymət və ya sifariş haqqında sualınız var?';

        // Admin / sahib
        if (/əlcan|elcan|admin|sahib|kimdir|kim olur/.test(t))
            return '👤 **SteamBazari.az** — Elçan tərəfindən yaradılmış oyun satış platformasıdır.\n📞 WhatsApp: +994 55 930 88 87';

        // Sayt haqqında
        if (/sayt|steambazari|platforma|nədir|nedir|haqqında|haqqinda|nə edir|ne edir/.test(t))
            return '🌐 **SteamBazari.az** — Azərbaycanda rəqəmsal oyun satışı platformasıdır.\n\n✅ Steam, PlayStation, Xbox oyunları\n✅ Rəqəmsal məhsullar\n✅ Sürətli çatdırılma (5-30 dəq)\n✅ Nağd/kart ilə ödəniş\n✅ Giveaway və Çarx oyunları';

        // Ödəniş
        if (/ödəniş|odenis|pul|kart|nağd|nagd|visa|mastercard|payment/.test(t))
            return '💳 **Ödəniş:**\n\n✅ Nağd ödəniş\n✅ Bank kartı (Visa/Mastercard)\n\nÖdəniş sifariş təsdiqləndikdən sonra həyata keçirilir.';

        // Çatdırılma
        if (/çatdırılma|catdirilma|göndər|göndərilmə|nə vaxt|neçə dəqiqə|qədər/.test(t))
            return '📦 **Çatdırılma:**\n\n⏱️ Sifariş təsdiqləndikdən sonra **5-30 dəqiqə** ərzində WhatsApp ilə göndərilir.\n🎮 Steam key-i WhatsApp vasitəsilə alacaqsınız.';

        // Sifariş
        if (/sifariş|sifarish|necə ver|necə al|necə sifariş|alqı|satın al|buy|order/.test(t))
            return '🛒 **Sifariş prosesi:**\n\n1️⃣ Saytda oyunu seçin\n2️⃣ "Sifariş et" düyməsinə basın\n3️⃣ WhatsApp-dan yazın\n4️⃣ Ödənişi edin\n5️⃣ Steam key-i WhatsApp ilə alın\n\n📞 WhatsApp: +994 55 930 88 87';

        // Steam key
        if (/steam|key|keylər|keyler|activation|aktivləşdirmə|aktivleshdirme/.test(t))
            return '🔑 **Steam Key:**\n\nSifariş tamamlandıqdan sonra Steam key WhatsApp ilə göndərilir.\n\nAktivləşdirmə:\n1️⃣ Steam-i açın\n2️⃣ "Oyunlar" → "Steam-də aktivləşdir"\n3️⃣ Key-i daxil edin\n\n⚠️ Hər key yalnız 1 dəfə istifadə oluna bilər!';

        // Giveaway
        if (/giveaway|vergi|hədiyyə|hediyyə|pulsuz|free|lotereya/.test(t))
            return '🎁 **Giveaway:**\n\nSaytda pulsuz giveaway-lər keçiririk! Həftəlik yeni oyunlar udmaq şansınız var.\n\nÇarx fırladıb hədiyyə qazana bilərsiniz!';

        // Çarx
        if (/çarx|carx|fırla|firla|slot|spin|wheel|oynamaq/.test(t))
            return '🎰 **Çarx:**\n\nSaytdakı çarxı fırladaraq hədiyyə qazana bilərsiniz!\n\nKredit lazımdır → Çarxı fırladın → Hədiyyəni qazanın!\n\n(Alt menyuda "Çarx" bölməsinə keçin)';

        // Əlaqə / WhatsApp
        if (/əlaqə|elaqə|whatsapp|wp|telefon|nömrə|nomre|zəng|call/.test(t))
            return '📞 **Əlaqə:**\n\n📱 WhatsApp: +994 55 930 88 87\n\nHər zaman yazın, cavab verəcəyik!';

        // Problem
        if (/problem|şikayət|xəta|xeta|olmur|işləmir|islemir|work/.test(t))
            return '🛠️ **Problem:**\n\nZəhmət olmasa WhatsApp ilə əlaqə saxlayın:\n📞 +994 55 930 88 87\n\nSizə kömək edəcəklər!';

        // Endirim
        if (/endirim|endirimin|sale|discount|kupon|coupon|promo/.test(t))
            return '🏷️ **Endirimlər:**\n\nSaytda davamlı olaraq endirimlər keçiririk!\n\nHəmçinin Çarx fırladıb kupon qazana bilərsiniz!';

        // Oyun axtarışı (adi, kateqoriya, hesab, abunəlik)
        // Qeyd: "oyunlar", "bölmə" kimi listing sorğularında xüsusi məhsul tapıntısını görməzlikdən gəl
        // (məsələn "playstation oyunları" -> PlayStation bölməsi cavab versin, gift card yox)
        var findGuarded = /oyunlar|oyunları|oyunların|hansı oyun|hansıları|siyahısı|bölmə|bölməsi/.test(t);
        var foundGame = findGuarded ? null : findGame(t);
        if (foundGame) {
            var gx = foundGame;
            var pricePart = gamePriceLabel(gx);
            var descSnippet = gx.desc ? String(gx.desc).slice(0, 160) : '';
            return '🎮 **' + gx.title + '**\n💰 Qiymət: ' + pricePart + '\n📂 Kateqoriya: ' + gx.category +
                (descSnippet ? '\n\n📋 ' + descSnippet : '') +
                '\n\n📲 Saytın "Sifariş et" düyməsi ilə ala bilərsiniz!';
        }

        // Qiymət axtarışı
        var pm = t.match(/(\d+[\.,]?\d*)\s*(azn|manat)/);
        if (pm) {
            var pr = parseFloat(pm[1].replace(',', '.'));
            var found = GAMES.map(function(g) {
                return { g: g, p: gameMinPrice(g) };
            }).filter(function(x) { return x.p !== null && x.p <= pr; })
              .sort(function(a, b) { return a.p - b.p; })
              .map(function(x) { return x.g; })
              .slice(0, 6);
            if (found.length > 0) {
                return '💰 **' + pr + ' AZN-dən ucuz oyunlar:**\n\n' + listGames(found) + '\n\n... və daha çox! Saytda bütün oyunlara baxın.';
            }
            return '💰 ' + pr + ' AZN-dən ucuz oyunlar tapılmadı. Saytdakı qiymətlərə baxın!';
        }

        // Janr axtarışı
        var genres = {
            'qorxu|horror|dehşet|qorxulu': 'Qorxu',
            'aksiya|action|döyüş|dovus': 'Aksiya',
            'sürət|yarış|yaris|speed|racing|surət|suret': 'Yarış',
            'macəra|adventure|exploration': 'Macəra',
            'idman|sport|football|futbol|basket': 'İdman',
            'simulator|simulyator|uçuş|ucuş': 'Simulator',
            'sandbox|açıq dünya|open world': 'Açıq Dünya',
            'multiplayer|online|çox oyuncu|coop|koop': 'Multiplayer',
            'soulslike|dark souls': 'Soulslike',
			'rpg|rol': 'RPG'
        };
        for (var pat in genres) {
            if (new RegExp(pat, 'i').test(t)) {
                var gm = GAMES.filter(function(g) {
                    return g.genre && g.genre.toLowerCase().indexOf(genres[pat].toLowerCase()) >= 0;
                });
                if (gm.length > 0) {
                    return '🎮 **' + genres[pat] + ' oyunları:**\n\n' + listGames(gm);
                }
            }
        }

        // Ən ucuz
        if (/ucuz|az pul|ən ucuz|en ucuz|cheapest/.test(t)) {
            var sorted = GAMES.map(function(g) {
                return { g: g, p: gameMinPrice(g) };
            }).filter(function(x) { return x.p !== null; })
              .sort(function(a, b) { return a.p - b.p; })
              .map(function(x) { return x.g; });
            return '💰 **Ən ucuz oyunlar:**\n\n' + listGames(sorted) + '\n\n... və daha çox! Saytda bütün oyunlara baxın.';
        }

        // Rəqəmsal məhsullar / abunəliklər
        if (/rəqəmsal|reqemsal|abunə|abune|digital|subscription|lisenziya|lisensiya/.test(t)) {
            var rq = catGames('RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR');
            if (rq.length > 0) {
                return '💠 **Rəqəmsal məhsullar və abunəliklər:**\n\n' + listGames(rq, 8) + '\n\n👥 **Hesab seçimi üçün saytdan soruşun və ya adminlə əlaqə saxlayın!**';
            }
        }

        // Hesablar
        if (/məlumatları|melumatlari|dəyişən|deyisen|hesab ama|2 el|ikinci/.test(t)) {
            var hs = catGames('MƏLUMATLARI DƏYİŞƏN HESABLAR');
            if (hs.length > 0) {
                return '👥 **Məlumatları dəyişən hesablar:**\n\n' + listGames(hs, 8) + '\n\nBu hesablarda e-poçt, parol və ad istədiyiniz kimi dəyişdirilə bilər.';
            }
        }

        // Populyar
        if (/populyar|best|top|məşhur|ən çox|en cox|bestseller|əla/.test(t)) {
            var popNames = ['GTA5 + RDR2', 'EA Sports FC 26', 'Cyberpunk 2077', 'Elden Ring', 'Call of Duty: Modern Warfare III'];
            var pop = [];
            for (var pi = 0; pi < popNames.length; pi++) {
                var pg = GAMES.filter(function(g) { return g.title === popNames[pi]; })[0] || GAMES.filter(function(g) { return g.title.toLowerCase().indexOf(popNames[pi].toLowerCase().slice(0, 8)) >= 0; })[0];
                if (pg && pop.indexOf(pg.title) < 0) pop.push(pg);
            }
            if (pop.length > 0) return '🔥 **Ən çox satılan oyunlar:**\n\n' + listGames(pop);
        }

        // Yeni / özəl oyunlar
        if (/yeni|new|latest|çıxan|gələn|coming|özəl|ozel|xüsusi|xususi/.test(t)) {
            var yeni = catGames('ÖZƏL OYUNLAR');
            if (yeni.length > 0) return '🆕 **Yeni / özəl oyunlar:**\n\n' + listGames(yeni);
        }

        // PlayStation
        if (/playstation|ps4|ps5|psn/.test(t)) {
            var ps = catGames('PS4/PS5 OYUNLARI');
            if (ps.length > 0) return '🎮 **PlayStation (PS4/PS5) oyunları:**\n\n' + listGames(ps) + '\n\nQiymətlər: Offline hesab / Universal hesab seçiminə görədir.';
        }

        // Xbox
        if (/xbox|x-box/.test(t)) {
            var xb = catGames('XBOX SERIES X/S OYUNLARI');
            if (xb.length > 0) {
                return '🎮 **Xbox Series X/S oyunları:**\n\n' + listGames(xb);
            }
            var gp = catGames('RƏQƏMSAL HESABLAR VƏ ABUNƏLİKLƏR').filter(function(g) { return /gamepass/i.test(g.title); });
            return '🎮 **Xbox:**\n\nOyunlar yaxın zamanda əlavə olunacaq.\n\n💠 Amma **Xbox Game Pass** abunəliyi mövcuddur:\n\n' + listGames(gp, 3);
        }

        // PC
        if (/pc|komputer|laptop|windows|computer/.test(t)) {
            var pc = catGames('ONLINE PC OYUNLARI');
            if (pc.length > 0) return '💻 **Online PC oyunları:**\n\n' + listGames(pc) + '\n\n📲 Bütün oyunlar Steam key formatındadır.';
        }

        // Nə oynayıq / tövsiyə
        if (/nə oynayaq|ne oynayaq|nə oyna|ne oyna|tövsiyə|tovsiye|recommend|ən yaxşı|en yaxshi/.test(t)) {
            var pref = ['Qorxu', 'Aksiya', 'Açıq Dünya', 'Yarış', 'İdman', 'RPG'];
            var lines = [];
            for (var gi = 0; gi < pref.length; gi++) {
                var gg = GAMES.filter(function(g) { return g.genre && g.genre.toLowerCase().indexOf(pref[gi].toLowerCase()) >= 0; })[0];
                if (gg) lines.push('**' + pref[gi] + ':** ' + gg.title + ' — ' + gamePriceLabel(gg));
            }
            if (lines.length > 0) return '🎮 **Oyun tövsiyələri:**\n\n' + lines.join('\n') + '\n\nBaşqa janr maraqlandırır? Yazın!';
        }

        // FAQ
        for (var j = 0; j < FAQ_DATA.length; j++) {
            var q = FAQ_DATA[j].q.toLowerCase();
            if (t.indexOf(q.slice(0, 10)) >= 0 || q.indexOf(t.slice(0, 10)) >= 0) {
                return FAQ_DATA[j].a;
            }
        }

        // Default
        return '🤖 **Sualınızı başa düşmədim.**\n\n**Mən bu mövzularda kömək edə bilərəm:**\n\n🎮 Oyun tövsiyəsi — "Mənə qorxu oyunu tövsiyə et"\n🔍 Oyun axtar — "Cyberpunk var mı?"\n💰 Qiymət — "5.99 AZN oyunlar"\n❓ Sifariş — "Sifariş necə verilir?"\n📞 Əlaqə — "WhatsApp nömrəniz?"\n\n🎮 ' + GAMES.length + ' oyun haqqında məlumatım var!';
    }

    // ==========================================================
    // TARİXÇƏ
    // ==========================================================
    function saveToHistory(role, text) {
        chatHistory.push({ role: role, text: text, time: Date.now() });
        if (chatHistory.length > 50) chatHistory.shift();
    }

    // ==========================================================
    // INIT
    // ==========================================================
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createWidget);
        } else {
            createWidget();
        }
    }

    // ==========================================================
    // PUBLIC API
    // ==========================================================
    window.chatbot = {
        open: open,
        close: close,
        toggle: toggleChat,
        clearChat: clearChat,
        send: function(text) {
            input.value = text;
            sendMessage(text);
        }
    };

    init();

    console.log('%c🤖 SteamBazari AI Chatbot yükləndi!', 'color: #06bfff; font-size: 14px; font-weight: bold;');
    console.log('%c🌐 ' + GAMES.length + ' oyun məlumatı yükləndi', 'color: #4caf50; font-size: 12px;');

})();