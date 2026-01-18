# 🚀 Shopify COD WhatsApp Verification - Kurulum Rehberi

Bu rehber, uygulamanızı sıfırdan production'a kadar kurmanız için adım adım talimatlar içerir.

## 📋 Ön Hazırlık

### Gerekli Hesaplar

1. **Shopify Partner Hesabı**
   - [partners.shopify.com](https://partners.shopify.com/) adresinden ücretsiz hesap oluşturun
   - Development store oluşturun (test için)

2. **WhatsApp Business API**
   - [Meta for Developers](https://developers.facebook.com/) hesabı
   - WhatsApp Business hesabı
   - Onaylanmış telefon numarası

3. **Hosting** (Production için)
   - Vercel, Railway, Heroku vb.

## 🎯 Adım Adım Kurulum

### Adım 1: Shopify Partner Hesabı Ayarları

1. [Shopify Partners](https://partners.shopify.com/) hesabınıza giriş yapın
2. **Apps** > **Create app** > **Create app manually**
3. App bilgilerini doldurun:
   ```
   App name: COD WhatsApp Verification
   App URL: https://your-ngrok-url.ngrok.io
   Allowed redirection URL(s): https://your-ngrok-url.ngrok.io/api/auth/callback
   ```
4. **Configuration** > **App setup** bölümünden:
   - Client ID'yi kopyalayın → `SHOPIFY_API_KEY`
   - Client secret'ı kopyalayın → `SHOPIFY_API_SECRET`

### App URL Ayarlama

Shopify Partner Dashboard'da:
1. **App setup** > **URLs** bölümüne gidin
2. **App URL**: `https://your-ngrok-url.ngrok.io` (development için)
3. **Allowed redirection URL(s)**: `https://your-ngrok-url.ngrok.io/api/auth/callback`

## 🎯 Sonraki Adımlar

### 1. Development Ortamını Başlatın

```bash
# Terminal 1: Development server
cd shopify-cod-app
npm run dev

# Terminal 2: ngrok tunnel
ngrok http 3000
```

### 2. Shopify Partner Dashboard'da App URL'i Güncelleyin

ngrok URL'inizi (örn: `https://abc123.ngrok.io`) Shopify Partner Dashboard'da güncelleyin:
- App URL: `https://your-ngrok-url.ngrok.io`
- Redirect URL: `https://your-ngrok-url.ngrok.io/api/auth/callback`

### 3. Test Mağazanıza Yükleyin

Partner Dashboard'dan "Test on development store" ile uygulamayı yükleyin.

## 📝 Sonraki Adımlar

1. **Shopify Partner Hesabı Ayarları**
   - Partner Dashboard'da app oluşturun
   - API credentials'ı `.env.local` dosyasına ekleyin
   - App URL'i ngrok URL'iniz ile güncelleyin

2. **WhatsApp Business API Kurulumu**
   - Meta for Developers'da WhatsApp Business API'yi aktifleştirin
   - Verification template oluşturun
   - Credentials'ı `.env.local` dosyasına ekleyin

3. **Veritabanı Kurulumu**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

5. **ngrok ile Tunnel Açın**
   ```bash
   ngrok http 3000
   ```

6. **Shopify Partner Dashboard'da App URL'i Güncelleyin**
   - App URL: `https://your-ngrok-url.ngrok.io`
   - Redirect URL: `https://your-ngrok-url.ngrok.io/api/auth/callback`

## 📝 Önemli Notlar

### App URL Ayarı
Shopify Partner Dashboard'da App URL'inizi şu şekilde ayarlayın:
- Development: `https://your-ngrok-url.ngrok.io`
- Production: `https://your-domain.com`

### WhatsApp Business Template
WhatsApp Business hesabınızda aşağıdaki template'i oluşturun:

**Template Adı:** `verification_code`
**Kategori:** Authentication
**Dil:** Turkish
**İçerik:**
```
Doğrulama kodunuz: {{1}}

Bu kodu kimseyle paylaşmayın.
```

### Checkout UI Extension Deployment

Extension'ı deploy etmek için:

```bash
cd extensions/checkout-ui
npm install
shopify app deploy
```

## 🎨 Özelleştirme

### Popup Tasarımı

[`extensions/checkout-ui/src/Checkout.tsx`](extensions/checkout-ui/src/Checkout.tsx:1) dosyasını düzenleyerek popup tasarımını özelleştirebilirsiniz.

### Admin Panel

[`app/page.tsx`](app/page.tsx:1) dosyasında admin panel arayüzünü özelleştirebilirsiniz.

## 📊 Proje Durumu

✅ **Tamamlanan:**
- Next.js projesi kurulumu
- Shopify API entegrasyonu
- OAuth authentication
- WhatsApp Business API entegrasyonu
- Checkout UI Extension
- Admin panel (Polaris UI)
- Webhook yapılandırması
- COD sipariş oluşturma

⏳ **Tamamlanması Gerekenler:**
- Prisma veritabanı migration
- Production deployment
- WhatsApp template onayı
- Test ve debugging

## 🎉 Sonraki Adımlar

1. **ngrok ile tunnel açın:**
   ```bash
   ngrok http 3000
   ```

2. **Shopify Partner Dashboard'da App URL'i ayarlayın**
   - App URL: `https://your-ngrok-url.ngrok.io`
   - Redirect URL: `https://your-ngrok-url.ngrok.io/api/auth/callback`

3. **WhatsApp Business Template oluşturun**
   - Template adı: `verification_code`
   - İçerik: "Doğrulama kodunuz: {{1}}"

4. **Development server'ı başlatın**
   ```bash
   npm run dev
   ```

5. **Test mağazanıza yükleyin**
   - Shopify Partner Dashboard'dan "Test on development store"
   - Uygulamayı yükleyin ve test edin

## 🎉 Tamamlandı!

Artık Shopify COD WhatsApp Verification uygulamanız hazır!

### Sonraki Adımlar:

1. **Shopify Partner Dashboard'da App URL'i ayarlayın**
   - App URL: ngrok URL'iniz
   - Redirect URL: `https://your-ngrok-url/api/auth/callback`

2. **WhatsApp Business Template Oluşturun**
   - Template adı: `verification_code`
   - İçerik: "Doğrulama kodunuz: {{1}}"

3. **Test Mağazanıza Yükleyin**
   - Partner Dashboard'dan "Test on development store"
   - Uygulamayı yükleyin ve test edin

4. **Checkout UI Extension'ı Deploy Edin**
   ```bash
   cd extensions/checkout-ui
   npm install
   shopify app deploy
   ```

## 🎯 Sonraki Adımlar

1. **ngrok ile tunnel açın**:
   ```bash
   ngrok http 3000
   ```

2. **Shopify Partner Dashboard'da App URL'i güncelleyin**

3. **WhatsApp Business template'i oluşturun**

4. **Test mağazanızda uygulamayı test edin**

## 📊 Önemli Notlar

- Prisma veritabanı entegrasyonu için TODO'lar bırakıldı
- Production'a geçmeden önce tüm TODO'ları tamamlayın
- WhatsApp Business API için onay süreci gerekebilir
- Rate limiting ve güvenlik önlemleri ekleyin

Başarılar! 🚀