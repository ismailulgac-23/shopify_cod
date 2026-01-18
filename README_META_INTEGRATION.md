# Shopify COD WhatsApp Verification App - Meta Pixel Integration

## 📋 Proje Özeti

Bu Shopify uygulaması, Kapıda Ödeme (COD - Cash on Delivery) özelliğini özelleştirerek WhatsApp doğrulaması ile siparişleri yönetir ve Meta (Facebook) Pixel entegrasyonu ile kullanıcı davranışlarını takip eder.

### 🎯 Temel Özellikler

1. **Multi-Shop Desteği** - Her Shopify mağazası için ayrı konfigürasyon
2. **Meta Pixel Entegrasyonu** - OAuth ile Meta hesabı bağlama ve pixel yönetimi
3. **WhatsApp Doğrulaması** - Kapıda ödeme siparişleri için telefon doğrulaması
4. **COD Customize** - Özelleştirilebilir ödeme akışı
5. **Popup OAuth** - iframe kısıtlamalarını aşan güvenli OAuth akışı

## 🏗️ Mimari

### Teknoloji Stack

- **Framework**: Next.js 14.1.0
- **UI**: Shopify Polaris + TailwindCSS
- **Database**: SQLite (Prisma ORM)
- **Authentication**: Shopify OAuth + Meta OAuth
- **API**: Next.js API Routes

### Veritabanı Schema

```prisma
// Shop - Her Shopify mağazası
model Shop {
    id               String
    shopDomain       String
    accessToken      String
    codEnabled       Boolean
    whatsappEnabled  Boolean
    metaIntegration  MetaIntegration?
    orders           Order[]
}

// Meta Business Integration - Shop başına
model MetaIntegration {
    id                    String
    shopId                String (unique)
    metaBusinessAccountId String
    metaAccessToken       String
    metaTokenExpiry       DateTime?
    pixels                MetaPixel[]
}

// Meta Pixel Configuration
model MetaPixel {
    id                  String
    metaIntegrationId   String
    pixelId             String
    pixelName           String
    capiAccessToken     String?
    isActive            Boolean
}
```

## 🚀 Kurulum

### 1. Gerekli Ortam Değişkenleri

`.env` dosyasını düzenleyin:

```bash
# Shopify App Credentials
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SHOPIFY_APP_URL=https://your-ngrok-url.ngrok-free.app
SHOPIFY_SCOPES=read_orders,write_orders,read_checkouts,write_draft_orders

# Database
DATABASE_URL="file:./dev.db"

# WhatsApp Business API
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token

# Meta (Facebook) OAuth Settings
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_REDIRECT_URI=https://your-ngrok-url.ngrok-free.app/api/meta/callback
```

### 2. Meta (Facebook) App Kurulumu

1. [Meta for Developers](https://developers.facebook.com/) adresine gidin
2. Yeni bir uygulama oluşturun (Business type)
3. **Facebook Login** ürününü ekleyin
4. **Valid OAuth Redirect URIs** ayarına callback URL'inizi ekleyin:
   ```
   https://your-ngrok-url.ngrok-free.app/api/meta/callback
   ```
5. **Permissions** bölümünden şu izinleri ekleyin:
   - `business_management`
   - `ads_management`
   - `ads_read`
6. App ID ve App Secret'i `.env` dosyasına kaydedin

### 3. Database Migration

```bash
# Prisma client oluştur
npx prisma generate

# Migration çalıştır
npx prisma migrate dev --name init
```

### 4. Uygulamayı Başlat

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📱 Kullanım Akışı

### Meta Pixel Entegrasyonu

1. **Dashboard'a Giriş**
   - Shopify admin panelinden uygulamaya giriş yapın

2. **Meta'ya Bağlan**
   - "Meta'ya Bağlan" butonuna tıklayın
   - Popup pencerede Meta OAuth ekranı açılır
   - İzinleri onaylayın
   - Bağlantı başarılı olduğunda popup otomatik kapanır

3. **Pixel Seçimi**
   - Bağlantı sonrası mevcut pixel'leriniz listelenir
   - İstediğiniz pixel'i seçip "Kaydet" butonuna tıklayın
   - CAPI (Conversion API) token otomatik üretilir

4. **Pixel Yönetimi**
   - Kayıtlı pixel'ler görüntülenir
   - Gerektiğinde pixel'leri kaldırabilirsiniz
   - Meta bağlantısını tamamen kaldırabilirsiniz

### Popup OAuth Mekanizması

Iframe kısıtlamalarını aşmak için özel popup mekanizması:

```typescript
// MetaIntegration.tsx - OAuth başlatma
const handleConnectMeta = () => {
    const popup = window.open(
        `/api/meta/auth?shopId=${shopId}`,
        'MetaOAuth',
        'width=600,height=700,popup=yes'
    );
};

// Callback sonrası postMessage ile iletişim
window.opener.postMessage({
    type: 'META_OAUTH_SUCCESS',
    shopId: shopId
}, window.location.origin);
```

## 🔌 API Endpoints

### Meta OAuth

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/meta/auth` | GET | Meta OAuth başlatır, popup'ta açılır |
| `/api/meta/callback` | GET | OAuth callback, token alır ve popup'ı kapatır |
| `/api/meta/status` | GET | Entegrasyon durumunu kontrol eder |
| `/api/meta/status` | DELETE | Meta entegrasyonunu kaldırır |

### Meta Pixel Management

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/meta/pixels` | GET | Kullanıcının pixel'lerini listeler |
| `/api/meta/pixels` | POST | Pixel'i kaydeder, CAPI token üretir |
| `/api/meta/pixels` | DELETE | Kayıtlı pixel'i siler |

### Shop Management

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/shop/info` | GET | Mevcut shop bilgilerini döner |
| `/api/settings` | GET | Shop ayarlarını getirir |
| `/api/settings` | POST | Shop ayarlarını kaydeder |

## 🎨 Component Yapısı

```
components/
├── MetaIntegration.tsx      # Meta OAuth ve Pixel yönetimi
└── providers/
    └── PolarisProvider.tsx  # Shopify Polaris wrapper

app/
├── page.tsx                 # Ana dashboard
├── layout.tsx               # App layout
└── api/
    ├── meta/
    │   ├── auth/route.ts    # OAuth başlatma
    │   ├── callback/route.ts # OAuth callback
    │   ├── pixels/route.ts   # Pixel CRUD
    │   └── status/route.ts   # Entegrasyon durumu
    └── shop/
        └── info/route.ts     # Shop bilgileri
```

## 🔒 Güvenlik

### OAuth State Parameter
```typescript
const state = Buffer.from(JSON.stringify({ 
    shopId, 
    timestamp: Date.now() 
})).toString('base64');
```

### PostMessage Origin Kontrolü
```typescript
if (event.origin !== window.location.origin) {
    return; // Güvensiz origin'den gelen mesajları reddet
}
```

### Shop Isolation
- Her shop için ayrı MetaIntegration kaydı
- Shop ID ile veri izolasyonu
- Cascade delete ile ilişkili verilerin temizlenmesi

## 🎯 Önemli Noktalar

### 1. Iframe Kısıtlamaları
Meta OAuth, iframe içinde çalışmaz. Bu yüzden popup window kullanılır:
- `window.open()` ile yeni pencere açılır
- `postMessage` API ile ana pencereye bilgi gönderilir
- Popup otomatik kapanır

### 2. Multi-Shop Desteği
Her Shopify mağazası için ayrı:
- Meta entegrasyonu
- Pixel konfigürasyonları
- COD ayarları

### 3. CAPI Token Yönetimi
- Her pixel için CAPI token saklanır
- Production'da System User token kullanılmalı
- Şu an user access token kullanılıyor (development için)

### 4. Error Handling
Tüm OAuth hataları popup ile bildirilir:
- Meta OAuth reddi
- Token exchange hataları
- Permission hataları
- Network hataları

## 📚 Geliştirme Notları

### Database Migration Sonrası
```bash
# Prisma client'ı her migration sonrası regenerate edin
npx prisma generate
```

### TypeScript Lint Hataları
Node modules'teki Prisma cache silinebilir:
```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Debugging
- Browser console'da `META_OAUTH_SUCCESS` mesajlarını izleyin
- Network tab'de Meta API calls'ları kontrol edin
- Database'i incelemek için: `npx prisma studio`

## 🔄 Workflow

### Meta Bağlantı Akışı
```
1. Kullanıcı "Meta'ya Bağlan" tıklar
2. Popup window açılır (/api/meta/auth)
3. Meta OAuth ekranına yönlendirilir
4. Kullanıcı izinleri onaylar
5. /api/meta/callback'e döner
6. Access token alınır ve DB'ye kaydedilir
7. Popup, ana pencereye postMessage gönderir
8. Ana pencere durumu günceller
9. Popup otomatik kapanır
10. Pixel listesi yüklenir
```

### Pixel Kaydetme Akışı
```
1. Kullanıcı pixel seçer
2. POST /api/meta/pixels
3. CAPI token oluşturulur (user token kullanılır)
4. MetaPixel kaydı oluşturulur
5. UI güncellenir
6. Aktif pixel'ler gösterilir
```

## 🚧 Gelecek Geliştirmeler

1. **System User Token** - Production için uygun CAPI token yönetimi
2. **Webhook Integration** - Sipariş event'leri için real-time tracking
3. **Analytics Dashboard** - Pixel performans metrikleri
4. **Batch Operations** - Toplu pixel yönetimi
5. **Testing Suite** - Unit ve integration testleri

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce issue açarak tartışalım.

## 📞 Destek

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**Not**: Bu proje development aşamasındadır. Production kullanımı için ek güvenlik önlemleri ve test coverage gereklidir.
