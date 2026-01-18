# Prisma Kurulum ve Migrate Komutları

## Adım 1: Prisma Client'ı Yeniden Oluştur
```bash
cd shopify-cod-app
npx prisma generate
```

## Adım 2: Veritabanı Migrate
```bash
npx prisma migrate dev --name init
```

## Adım 3: Prisma Studio'yu Aç (Opsiyonel - Veritabanını Görüntüle)
```bash
npx prisma studio
```

## Sorun Yaşarsan:

### Eğer izin hatası alırsan:
```bash
sudo rm -rf node_modules/.prisma
npx prisma generate
```

### Eğer cache sorunu varsa:
```bash
rm -rf node_modules/.prisma
rm -rf prisma/dev.db*
npx prisma generate
npx prisma migrate dev --name init
```

### Tüm node_modules'ü yeniden yükle:
```bash
rm -rf node_modules
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## Başarılı Kurulum Sonrası:

1. Veritabanı oluşturuldu: `prisma/dev.db`
2. Prisma Client hazır
3. Artık uygulamayı çalıştırabilirsin:

```bash
npm run dev
```

## Not:
- `prisma.config.ts` dosyası artık mevcut ve doğru yapılandırılmış
- `schema.prisma` dosyası Prisma 7 formatında güncellendi
- DATABASE_URL `.env.local` dosyasında tanımlı: `file:./dev.db`