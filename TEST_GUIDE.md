# 🧪 Test Rehberi - Shopify COD WhatsApp Verification

Bu rehber, uygulamanızı gerçek bir Shopify mağazasında test etmeniz için adım adım talimatlar içerir.

## 📋 Ön Hazırlık

### 1. Gerekli Bilgiler
- ✅ Shopify Partner hesabı
- ✅ Development store (test mağazası)
- ✅ ngrok hesabı ve kurulumu
- ✅ WhatsApp Business API credentials

### 2. Mevcut Durumunuz
Ekran görüntüsüne göre:
- ✅ App oluşturulmuş: "COD Verification"
- ✅ App URL: `https://79f18b2df442.ngrok-free.app`
- ✅ Redirect URL: `https://79f18b2df442.ngrok-free.app/api/auth/callback`
- ✅ Scopes: `read_checkouts, read_orders, write_orders`
- ✅ Released: Jan 13, 2026 at 1:25 AM UTC

## 🚀 Adım Adım Test Süreci

### Adım 1: Development Server'ı Başlatın

```bash
cd shopify-cod-app
npm run dev
```

Server `http://localhost:3000` adresinde çalışacak.

### Adım 2: ngrok Tunnel'ı Başlatın

Yeni bir terminal açın:

```bash
ngrok http 3000
```

ngrok size bir URL verecek (örn: `https://79f18b2df442.ngrok-free.app`)

**ÖNEMLİ:** Bu URL'i `.env` ve `.env.local` dosyalarında güncelleyin:
```env
SHOPIFY_APP_URL=https://your-new-ngrok-url.ngrok-free.app
```

### Adım 3: Shopify Partner Dashboard'da URL'i Güncelleyin

1. [Shopify Partners](https://partners.shopify.com/) > Apps > COD Verification
2. **Configuration** > **App setup** > **URLs**
3. **App URL**: ngrok URL'inizi girin
4. **Allowed redirection URL(s)**: `https://your-ngrok-url/api/auth/callback`
5. **Save** butonuna tıklayın

### Adım 4: Test Mağazanıza Yükleyin

#### Yöntem 1: Partner Dashboard'dan
1. Partner Dashboard'da "Test on development store" butonuna tıklayın
2. Development store'unuzu seçin
3. "Install app" butonuna tıklayın

#### Yöntem 2: Doğrudan URL ile
Tarayıcınızda şu URL'i açın:
```
https://your-ngrok-url.ngrok-free.app/api/auth?shop=your-store.myshopify.com
```

### Adım 5: OAuth Akışını Tamamlayın

1. Shopify izin sayfası açılacak
2. "Install app" butonuna tıklayın
3. Admin panel sayfasına yönlendirileceksiniz

## 🧪 Test Senaryoları

### Test 1: Admin Panel Testi

1. Uygulamayı yükledikten sonra admin paneli açılmalı
2. Şu ayarları görmeli ve değiştirebilmelisiniz:
   - ✅ Kapıda Ödeme (COD) aktif/pasif
   - ✅ WhatsApp Doğrulama aktif/pasif
   - ✅ Popup başlığı ve açıklaması
3. "Ayarları Kaydet" butonuna tıklayın
4. Başarı mesajı görmelisiniz

**Test URL:** `https://your-ngrok-url.ngrok-free.app/`

### Test 2: WhatsApp API Testi

Basit test sayfasını kullanarak WhatsApp API'yi test edin:

**Test URL:** `https://your-ngrok-url.ngrok-free.app/test`

1. Telefon numaranızı girin (örn: 905551234567)
2. "Kod Gönder" butonuna tıklayın
3. Sonuç alanında:
   - ✅ `success: true` görmelisiniz
   - ✅ `code` alanında 6 haneli kod görmelisiniz
   - ✅ WhatsApp'ınıza mesaj gelmeli (API bağlıysa)
4. Gelen kodu "Doğrulama Kodu" alanına girin
5. "Kodu Doğrula" butonuna tıklayın
6. `verified: true` görmelisiniz

### Test 3: Settings API Testi

Terminal'de:

```bash
# Ayarları getir
curl https://your-ngrok-url.ngrok-free.app/api/settings

# Ayarları kaydet
curl -X POST https://your-ngrok-url.ngrok-free.app/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "settings": {
      "codEnabled": true,
      "whatsappEnabled": true,
      "popupTitle": "Test Başlık",
      "popupDescription": "Test Açıklama"
    }
  }'
```

### Test 4: Checkout Extension Testi (İleri Seviye)

**NOT:** Checkout UI Extension'ı test etmek için Shopify Plus veya development store'da checkout extensibility aktif olmalı.

1. Test mağazanızda bir ürün sepete ekleyin
2. Checkout sayfasına gidin
3. Popup'ı görmeli ve test edebilmelisiniz

## 🔍 Hata Ayıklama

### Yaygın Sorunlar ve Çözümleri

#### 1. "App URL mismatch" Hatası
**Çözüm:** 
- `.env` dosyasındaki URL'i kontrol edin
- Shopify Partner Dashboard'daki URL'i kontrol edin
- Her ikisinin de aynı olduğundan emin olun

#### 2. "Invalid HMAC" Hatası
**Çözüm:**
- `SHOPIFY_API_SECRET` değerini kontrol edin
- Partner Dashboard'dan doğru secret'ı kopyalayın

#### 3. WhatsApp Mesajı Gelmiyor
**Çözüm:**
- WhatsApp Business API credentials'larını kontrol edin
- Test sayfasında dönen `code` değerini kullanın
- Console'da hata loglarını kontrol edin

#### 4. ngrok "Too Many Connections" Hatası
**Çözüm:**
- ngrok'u yeniden başlatın
- Ücretsiz plan limitlerini kontrol edin

## 📊 Log Kontrolü

Development sırasında logları takip edin:

```bash
# Terminal'de server loglarını izleyin
npm run dev

# Başka bir terminal'de ngrok loglarını izleyin
ngrok http 3000 --log=stdout
```

## ✅ Test Checklist

Tüm testleri tamamladıktan sonra:

- [ ] Admin panel açılıyor
- [ ] Ayarlar kaydediliyor
- [ ] WhatsApp kodu gönderiliyor
- [ ] Kod doğrulama çalışıyor
- [ ] Settings API çalışıyor
- [ ] OAuth akışı sorunsuz
- [ ] ngrok tunnel stabil

## 🎯 Sonraki Adımlar

Test başarılı olduktan sonra:

1. **Checkout Extension Deploy:**
   ```bash
   cd extensions/checkout-ui
   npm install
   shopify app deploy
   ```

2. **Production Deployment:**
   - Vercel, Railway veya Heroku'ya deploy edin
   - Production URL'i Shopify Partner Dashboard'da güncelleyin
   - Environment variables'ları production'da ayarlayın

3. **WhatsApp Template Onayı:**
   - Meta Business Suite'de template onayı alın
   - Production'da gerçek mesajlar gönderin

## 🆘 Destek

Sorun yaşarsanız:

1. **Console Logları:** Browser console ve terminal loglarını kontrol edin
2. **Network Tab:** API isteklerini ve yanıtlarını inceleyin
3. **Test Sayfası:** `/test` sayfasını kullanarak API'leri test edin
4. **Shopify Logs:** Partner Dashboard > Apps > COD Verification > API activity

## 📝 Test Notları

Test sırasında karşılaştığınız sorunları buraya not edin:

```
Tarih: ___________
Sorun: ___________
Çözüm: ___________
```

---

**Başarılar!** 🚀

Herhangi bir sorunla karşılaşırsanız, logları ve hata mesajlarını paylaşın.