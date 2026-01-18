# Shopify Custom App Kurulum Rehberi

Bu rehber, geliştirdiğiniz Shopify uygulamasını App Store'da yayınlamadan, sadece kendi mağazanızda (veya belirli mağazalarda) nasıl kullanacağınızı anlatır.

## Yöntem: Custom Distribution (Özel Dağıtım)

Mevcut uygulamanız OAuth ve Embedded App yapısında olduğu için, Shopify Partners üzerinden "Custom Distribution" yöntemini kullanmak en sağlıklısıdır.

### 1. Hazırlık
Uygulamanızın çalıştığından emin olun:
- **Lokalde:** `npm run dev` komutu çalışıyor olmalı ve tünel (ngrok/Cloudflare) açık olmalı.
- **Sunucuda:** Uygulamanızı Vercel, Railway vb. bir yere deploy ettiyseniz çalışır durumda olmalı.

### 2. URL Ayarları
1. [Shopify Partners Dashboard](https://partners.shopify.com) adresine gidin.
2. **Apps** > **Uygulamanız** > **App setup** sayfasına girin.
3. URL'lerinizi kontrol edin:
   - **App URL:** `https://sizin-app-adresiniz.com` (veya ngrok adresi)
   - **Allowed redirection URL(s):** 
     - `https://sizin-app-adresiniz.com/api/auth/callback`
     - `https://sizin-app-adresiniz.com/api/auth/shopify/callback`
     - `https://sizin-app-adresiniz.com/api/meta/callback` (Meta entegrasyonu için)

### 3. Dağıtım (Distribution)
1. Sol menüden **Distribution** sekmesine tıklayın.
2. **Custom Distribution** seçeneğini seçin (eğer Public Distribution seçiliyse değiştirebilirsiniz).
3. **"Choose custom distribution"** butonuna tıklayın.

### 4. Mağaza Ekleme ve Link Alma
1. **App Store Listing** sayfasına gidin (Custom app olunca bu adım bazen atlanabilir ama info girmek gerekebilir).
2. Tekrar **Distribution** sayfasına dönün.
3. **"Create link"** veya **"Add store"** butonuna tıklayın.
4. Uygulamayı kuracağınız mağazanın tam alan adını girin: `magaza-adiniz.myshopify.com`
5. **"Generate link"** butonuna basın.

### 5. Kurulum
1. Oluşturulan linki kopyalayın.
2. Tarayıcının yeni bir sekmesinde bu linki açın.
3. Mağazanıza yönlendirileceksiniz.
4. İzin ekranında **"Install App"** diyerek kurulumu tamamlayın.

### 6. Meta Pixels ve COD Ayarları
Uygulamanız kurulduktan sonra Shopify Admin panelinizde **Apps** (Uygulamalar) altında görünecektir. Tıklayıp açın:
1. **Meta Pixel Entegrasyonu:** Facebook hesabınızı bağlayın ve pixelinizi seçin.
2. **Ayarlar:** COD ve WhatsApp ayarlarını yapın.

Tebrikler! App Store onayı beklemeden sadece kendi mağazanızda çalışan uygulamanız hazır.
