# Shopify COD WhatsApp Verification App

A Shopify public app that enables WhatsApp-verified Cash on Delivery (COD) payments, built with Next.js and Shopify App Bridge.

## Features

- ✅ WhatsApp OTP verification for COD orders
- ✅ Inline checkout verification flow (Shopify policy compliant)
- ✅ Cart page payment method selection
- ✅ Order metafield storage for verification status
- ✅ Admin panel for app configuration
- ✅ Shopify API 2026-01 (latest)
- ✅ No checkout blocking or manipulation
- ✅ UX-based verification flow

## Architecture

### Checkout UI Extension
- **Target**: `purchase.checkout.block.render`
- **Location**: Top of checkout page
- **Function**: Shows inline WhatsApp verification when COD is selected
- **Compliance**: Uses only Shopify UI components, no modals

### Theme App Extension
- **Location**: Cart page
- **Function**: Payment method selection popup
- **Flow**: COD selection → WhatsApp verification → Cart attributes → Checkout

### Backend APIs
- `/api/whatsapp/send-code` - Send WhatsApp OTP
- `/api/whatsapp/verify-code` - Verify OTP
- `/api/webhooks/orders/create` - Store verification in order metafields
- `/api/settings` - Admin panel settings

## Quick Start

### Prerequisites
- Node.js 18+
- Shopify Partner account
- WhatsApp Business API access
- ngrok (for local development)

### Installation

```bash
cd shopify-cod-app
npm install
cd extensions/checkout-ui
npm install
cd ../..
```

### Configuration

1. Create `.env.local`:
```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-domain.ngrok-free.app
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
```

2. Update `shopify.app.toml`:
```toml
application_url = "https://your-domain.ngrok-free.app"
client_id = "your_client_id"
```

### Development

```bash
npm run dev
```

### Deployment

```bash
npm run deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## User Flow

1. Customer adds products to cart
2. Clicks "Checkout" button
3. Theme extension popup appears
4. Customer selects "COD" or "Online Payment"
5. If COD selected:
   - Enter phone number
   - Receive WhatsApp OTP
   - Verify OTP
   - Cart attributes set
6. Redirect to checkout
7. Checkout extension shows verification status
8. Customer completes order
9. Order created with verification metafields

## Admin Panel

Access at your app URL to:
- Enable/disable COD
- Enable/disable WhatsApp verification
- Configure popup text
- View connection status

## Shopify Policy Compliance

✅ **No checkout blocking**: UX-based flow only
✅ **No custom popups in checkout**: Shopify UI components only
✅ **No window manipulation**: No location overrides
✅ **Proper API usage**: Latest API version (2026-01)
✅ **Webhook validation**: HMAC verification
✅ **Secure data handling**: Encrypted storage

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **UI**: Shopify Polaris
- **Backend**: Next.js API Routes
- **Shopify**: App Bridge, Shopify API 2026-01
- **Extensions**: Checkout UI Extension, Theme App Extension
- **Verification**: WhatsApp Business API

## File Structure

```
shopify-cod-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── settings/
│   │   ├── whatsapp/
│   │   └── webhooks/
│   ├── layout.tsx
│   └── page.tsx
├── extensions/
│   ├── checkout-ui/
│   │   ├── src/Checkout.tsx
│   │   └── shopify.extension.toml
│   └── theme-app-extension/
│       ├── assets/cod-popup.js
│       ├── blocks/app-block.liquid
│       └── shopify.extension.toml
├── lib/
│   ├── shopify.ts
│   └── i18n/
├── components/
├── .env.local
├── shopify.app.toml
└── package.json
```

## Security

- HTTPS only
- HMAC webhook validation
- OTP expiration (5 minutes)
- Maximum 3 verification attempts
- Secure phone number storage
- Environment variable protection

## Testing

### Local Testing
1. Start ngrok: `ngrok http 3000`
2. Update URLs in config files
3. Run `npm run dev`
4. Test complete flow

### Production Testing
1. Deploy to production
2. Update all URLs
3. Redeploy extensions
4. Test end-to-end flow

## Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting guide.

## License

MIT

## Support

For issues or questions, check:
- Shopify Admin → Apps → Your App (logs)
- Browser console
- Webhook delivery status
- Environment variables
