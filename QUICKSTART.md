# ⚡ Hızlı Başlangıç - 5 Dakikada Test Edin!

## 🎯 Şu Anda Yapmanız Gerekenler

### 1. Development Server'ı Başlatın (Terminal 1)

```bash
cd shopify-cod-app
npm run dev
```

✅ Server `http://localhost:3000` adresinde çalışacak

### 2. ngrok'u Başlatın (Terminal 2)

```bash
ngrok http 3000
```

✅ Size bir URL verecek: `https://XXXXX.ngrok-free.app`

**ÖNEMLİ:** Eğer ngrok URL'iniz değiştiyse, `.env` dosyasını güncelleyin ve server'ı yeniden başlatın!

### 3. Test Sayfasını Açın

Tarayıcınızda:
```
http://localhost:3000/test
```

veya

```
https://your-ngrok-url.ngrok-free.app/test
```

### 4. WhatsApp Doğrulamayı Test Edin

1. Telefon numaranızı girin (örn: `905551234567`)
2. "Kod Gönder" butonuna tıklayın
3. Sonuç alanında 6 haneli kodu göreceksiniz
4. Kodu girerek doğrulayın

✅ **Başarılı!** WhatsApp API çalışıyor!

### 5. Admin Panel'i Test Edin

```
http://localhost:3000/
```

veya

```
https://your-ngrok-url.ngrok-free.app/
```

✅ Ayarları değiştirip kaydedin!

## 🏪 Shopify Mağazasında Test

### Hızlı Yükleme

Tarayıcınızda şu URL'i açın (kendi bilgilerinizle):

```
https://your-ngrok-url.ngrok-free.app/api/auth?shop=your-store.myshopify.com
```

**Örnek:**
```
https://api2.gustoapp.net/api/auth?shop=test-store-123.myshopify.com
```

### Adımlar:

1. ✅ URL'i tarayıcıda açın
2. ✅ Shopify izin sayfası açılacak
3. ✅ "Install app" butonuna tıklayın
4. ✅ Admin panel açılacak
5. ✅ Ayarları test edin!

## 🎉 Tamamlandı!

Artık uygulamanız çalışıyor! 

### Sonraki Adımlar:

1. **Detaylı Test:** [`TEST_GUIDE.md`](TEST_GUIDE.md) dosyasına bakın
2. **Kurulum:** [`SETUP_GUIDE.md`](SETUP_GUIDE.md) dosyasına bakın
3. **Dokümantasyon:** [`README.md`](README.md) dosyasına bakın

## 🆘 Sorun mu Var?

### ngrok URL Değişti
```bash
# .env dosyasını güncelleyin
SHOPIFY_APP_URL=https://new-ngrok-url.ngrok-free.app

# Server'ı yeniden başlatın
npm run dev
```

### Port Zaten Kullanımda
```bash
# Farklı port kullanın
npm run dev -- -p 3001

# ngrok'u da güncelleyin
ngrok http 3001
```

### WhatsApp Mesajı Gelmiyor
- Test sayfasında dönen `code` değerini kullanın
- WhatsApp API credentials'larını kontrol edin
- Console loglarını kontrol edin

## 📊 Hızlı Kontrol

- [ ] `npm run dev` çalışıyor
- [ ] `ngrok http 3000` çalışıyor
- [ ] `/test` sayfası açılıyor
- [ ] Kod gönderme çalışıyor
- [ ] Kod doğrulama çalışıyor
- [ ] Admin panel açılıyor
- [ ] Ayarlar kaydediliyor

Hepsi ✅ ise hazırsınız! 🚀