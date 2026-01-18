# Changelog

## [1.0.0] - 2026-01-13

### ✨ Yeni Özellikler

- ✅ Next.js 16 tabanlı Shopify App yapısı
- ✅ Shopify OAuth 2.0 authentication
- ✅ Polaris UI ile Admin panel
- ✅ AppProvider entegrasyonu
- ✅ Çoklu dil desteği (Türkçe/İngilizce)
- ✅ WhatsApp Business API entegrasyonu
- ✅ Checkout UI Extension
- ✅ COD (Kapıda Ödeme) sipariş oluşturma
- ✅ Webhook handlers (orders/create, app/uninstalled)
- ✅ Prisma ORM şeması
- ✅ i18n translation sistemi

### 📦 Bileşenler

#### API Endpoints
- `/api/auth` - OAuth başlatma
- `/api/auth/callback` - OAuth callback
- `/api/whatsapp/send-code` - WhatsApp doğrulama kodu gönderme
- `/api/whatsapp/verify-code` - Kod doğrulama
- `/api/orders/create-cod` - COD siparişi oluşturma
- `/api/webhooks/orders/create` - Sipariş webhook'u
- `/api/webhooks/app/uninstalled` - Uygulama kaldırma webhook'u

#### UI Bileşenleri
- `PolarisProvider` - Polaris AppProvider wrapper
- Admin Panel - Ayarlar yönetimi
- Checkout Extension - Ödeme sayfası popup'ı

#### i18n
- Türkçe çeviriler (`lib/i18n/tr.json`)
- İngilizce çeviriler (`lib/i18n/en.json`)
- `useTranslation` hook'u

### 🔧 Yapılandırma

- `.env.local` - Ortam değişkenleri
- `shopify.app.toml` - Shopify app yapılandırması
- `prisma/schema.prisma` - Veritabanı şeması
- `tsconfig.json` - TypeScript yapılandırması

### 📚 Dokümantasyon

- `README.md` - Genel dokümantasyon
- `SETUP_GUIDE.md` - Detaylı kurulum rehberi
- `CHANGELOG.md` - Değişiklik günlüğü

### 🐛 Bilinen Sorunlar

- Prisma 7 ile uyumluluk (geçici çözüm uygulandı)
- React 19 ile Polaris uyumluluk uyarıları (çalışıyor)

### 📝 Yapılacaklar

- [ ] Prisma veritabanı migration'larını tamamla
- [ ] Rate limiting ekle
- [ ] Email bildirimleri
- [ ] SMS yedek doğrulama
- [ ] Analytics dashboard
- [ ] Sipariş takip sistemi
- [ ] Unit testler
- [ ] E2E testler

### 🚀 Deployment

- Vercel, Railway, Heroku destekli
- ngrok ile local development
- Production-ready yapı

---

## Notlar

Bu sürüm production'a hazır temel yapıyı içerir. Prisma entegrasyonu için TODO'lar bırakılmıştır. WhatsApp Business API için template onayı gereklidir.