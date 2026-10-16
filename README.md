# STEAMBAZARI — Rockstar Games Hesab Satışı və Təsdiqləmə Mərkəzi

Azərbaycan dilində Rockstar Games oyun hesablarının (GTA V, RDR 2, RDR 1, GTA IV, GTA Trilogy və s.) rəsmi və zəmanətli satışı, anbar idarəetməsi və Google OAuth 2.0 ilə qorunan 2FA təsdiqləmə platforması.

---

## 🚀 Texnoloji Arxitektura

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
- **Dizayn və UX:** Qaranlıq premium oyun interfeysi (`#08080c`, `#111119`), Rockstar qırmızı vurğuları, şüşə (glassmorphism) panellər, responsiv dizayn (desktop, planşet, mobil).
- **Valyuta:** Azərbaycan Manatı (AZN / ₼).
- **Verilənlər Bazası:** Prisma ORM ilə SQLite (lokal dərhal işə salma üçün sıfır asılılıq) və PostgreSQL dəstəyi.
- **Kriptoqrafiya & Təhlükəsizlik:**
  - Hesab parolları və Google tokenləri serverdə **AES-256-GCM** ilə şifrələnir.
  - İstifadəçi şifrələri **Bcrypt** ilə həşlənir.
  - Rollara əsaslanan giriş nəzarəti (**RBAC**: Customer vs Admin).
  - Təhlükəsiz JWT sessiyaları və HTTP-only çərəzlər.
  - Həssas məlumatları kənarlaşdıran (redacted) **Audit Jurnalı**.
- **Google Gmail İnteqrasiyası:**
  - Rəsmi Google OAuth 2.0 flow.
  - Yalnız minimum `gmail.readonly` icazəsi.
  - Müştərilər heç vaxt ixtiyari email axtara bilməz; yalnız həmin sifarişə təyin edilmiş Rockstar hesabının emaili üzrə Rockstar 2FA kodları axtarılır.

---

## 📄 Layihə Səhifələri (13 Səhifə)

1. **Əsas Səhifə (`/`)** — Rockstar bannerləri, ən çox satılan hesablar, 3 addımlıq iş mexanizmi, zəmanət göstəriciləri.
2. **Oyun Kataloqu (`/catalog`)** — Bütün Rockstar oyunları üzrə kateqoriyalar, axtarış, sıralama və canlı anbar stoku.
3. **Məhsul Detalları (`/catalog/[id]`)** — Məhsul xüsusiyyətləri, anbar vəziyyəti, çatdırılma qaydası, "İndi Al" və "Səbətə At".
4. **Səbət (`/cart`)** — Əlavə edilmiş oyunlar, say tənzimlənməsi, promo kod endirimi (`ROCKSTAR10`), AZN xülasəsi.
5. **Sifarişin Rəsmiləşdirilməsi (`/checkout`)** — Alıcı məlumatları, yerli ödəniş metodları (Bank Kartı, m10, MilliÖn), zəmanət razılaşması və ani sifariş.
6. **Müştəri Sifarişləri (`/orders` & `/orders/[id]`)** — Sifariş tarixi, şifrəsi açılmış Rockstar login və parolu (tək kliklə kopyalama) və **Canlı 2FA Təsdiq Kodu İstəmə Mərkəzi**.
7. **Müştəri Dəstəyi (`/support`)** — Dəstək bileti göndərmə, WhatsApp və Telegram sürətli əlaqə, FAQ bölməsi.
8. **Admin Girişi (`/admin/login` & `/login`)** — Təhlükəsiz admin portalı və 1-klikli sınaq düyməsi.
9. **Admin Dashboard (`/admin`)** — Cəmi gəlir (AZN), sifariş sayı, anbar stoku, 2FA növbəsi və son tranzaksiyalar.
10. **Məhsul və Anbar İdarəetməsi (`/admin/inventory`)** — Anbardakı hesabların siyahısı, AES-256-GCM ilə yeni hesab əlavə edilməsi və yeni oyun yaratma modalı.
11. **Sifarişlərin İdarə Edilməsi (`/admin/orders`)** — Sifariş statuslarının dərhal dəyişdirilməsi, axtarış və detallar.
12. **2FA Təsdiqləmələr və Gmail İnteqrasiyası (`/admin/verifications` & `/admin/email-integration`)** — Müştəri 2FA sorğuları, bir toxunuşla Gmail-də Rockstar kodunu axtarıb buraxma, əllə kod daxil etmə və Google OAuth 2.0 idarəetməsi.
13. **Audit Qeydləri və Tənzimləmələr (`/admin/audit-logs` & `/admin/settings`)** — Bütün admin hərəkətlərinin qeydləri, IP ünvanı, şifrələmə statusu və arxitektura göstəriciləri.

---

## 🔑 Demo Giriş Məlumatları

| Rol | Email | Şifrə |
|-----|-------|-------|
| **Baş İnzibatçı (Admin)** | `admin@steambazari.az` | `AdminSecurePassword2026!` |
| **Demo Müştəri** | `elvin.aliyev@gmail.com` | `CustomerPassword2026!` |

---

## 🛠️ Lokal Quraşdırma və İşə Salma

### 1. Layihə Qovluğuna Keçid
```powershell
cd C:\Users\ikinci_el_noutbuklar\Desktop\steambazari
```

### 2. Ətraf Mühit Faylı (.env)
Layihə daxilində hazır `.env` faylı mövcuddur. Nümunə üçün `.env.example` faylına baxa bilərsiniz:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="steambazari-secure-jwt-session-secret-key-2026-production"
ENCRYPTION_SECRET_KEY="c3ab5249f76a08c8e14674068351052601249876543210abcedf0123456789ab"
GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/admin/email-integration/callback"
```

### 3. Prisma Bazasının Hazırlanması və İlkin Məlumatların Yazılması
```powershell
# Baza cədvəllərinin formalaşdırılması
npx prisma db push

# Demo Rockstar hesablarının və sifarişlərin bazaya yazılması
node prisma/seed.js
```

### 4. Təhlükəsizlik və Funksional Testlərin İcrası
```powershell
node scripts/test-runner.js
```

### 5. İnkişaf Serverinin (Dev Server) Başladılması
```powershell
npm run dev
```
Saytı brauzerdə açın: `http://localhost:3000`

---

## 🔐 Google OAuth 2.0 Gmail İnteqrasiyasının Quraşdırılması

1. [Google Cloud Console](https://console.cloud.google.com/) platformasına daxil olun.
2. Yeni layihə yaradın və **APIs & Services > Library** bölməsindən **Gmail API**-ni aktiv edin.
3. **Credentials > Create Credentials > OAuth client ID** bölməsindən Web tətbiqi yaradın.
4. **Authorized redirect URIs** sahəsinə əlavə edin:
   `http://localhost:3000/api/admin/email-integration/callback`
5. Alınan `Client ID` və `Client Secret` dəyərlərini `.env` faylına daxil edin.
6. Admin paneldən **Gmail İnteqrasiyası** bölməsinə keçib **Google ilə Bağla** düyməsini sıxın.

---

## 🛡️ Təhlükəsizlik Standartları

- **Plaintext qadağası:** Parollar və recovery kodları yalnız AES-256-GCM formatında saxlanılır.
- **İzolyasiya:** Müştəri digər müştərinin heç bir məlumatını görə bilməz.
- **Səlahiyyətli Sorğu:** 2FA sorğusu göndərildikdə, sistem emaili müştəridən almır; yalnız bazada sifariş üçün satılmış rəsmi hesabın emailini hədəf alır.
