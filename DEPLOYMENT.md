# Shopify COD WhatsApp Verification App - Deployment Guide

## Architecture Overview

This app implements WhatsApp-verified Cash on Delivery (COD) for Shopify stores using:
- **Checkout UI Extension**: Inline verification flow at checkout
- **Theme App Extension**: Cart page COD selection popup
- **Next.js Backend**: API endpoints for WhatsApp verification
- **Shopify API 2026-01**: Latest API version

## Core Components

### 1. Checkout UI Extension
- **Location**: `extensions/checkout-ui/`
- **Target**: `purchase.checkout.block.render`
- **Function**: Shows inline WhatsApp verification when COD is selected
- **Compliance**: No modals, no checkout blocking, UX-based flow

### 2. Theme App Extension
- **Location**: `extensions/theme-app-extension/`
- **Function**: Intercepts checkout button on cart page
- **Flow**: Shows popup → User selects COD → WhatsApp verification → Sets cart attributes → Proceeds to checkout

### 3. Backend APIs
- `/api/whatsapp/send-code`: Sends WhatsApp OTP
- `/api/whatsapp/verify-code`: Verifies OTP
- `/api/webhooks/orders/create`: Stores verification in order metafields
- `/api/settings`: Admin panel settings

## Deployment Steps

### 1. Environment Setup

Create `.env.local`:
```
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-domain.ngrok-free.app
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
```

### 2. Install Dependencies

```bash
cd shopify-cod-app
npm install
cd extensions/checkout-ui
npm install
cd ../..
```

### 3. Configure App

Update `shopify.app.toml`:
```toml
application_url = "https://your-domain.ngrok-free.app"
client_id = "your_client_id"
```

Update `extensions/checkout-ui/shopify.extension.toml`:
```toml
[extensions.settings]
[[extensions.settings.fields]]
key = "app_url"
type = "single_line_text_field"
name = "App URL"
description = "Your app's public URL"
```

### 4. Deploy Extensions

```bash
npm run shopify app deploy
```

### 5. Configure Theme Extension

1. Go to Shopify Admin → Online Store → Themes
2. Click "Customize"
3. Add App Block: "COD WhatsApp Popup"
4. Place it in the theme (recommended: footer or header)
5. Save theme

### 6. Configure Checkout Extension

1. Go to Shopify Admin → Settings → Checkout
2. Find "COD WhatsApp Checkout" extension
3. Add to checkout (will appear at top)
4. Configure app_url setting
5. Save

### 7. Enable Payment Methods

1. Go to Shopify Admin → Settings → Payments
2. Enable "Manual payment methods"
3. Add "Cash on Delivery (COD)" as manual payment
4. Save

## Flow Diagram

```
Cart Page
    ↓
User clicks "Checkout"
    ↓
Theme Extension Popup Opens
    ↓
User selects "COD" or "Online"
    ↓
If COD selected:
    ↓
WhatsApp Verification Flow
    ↓
Enter Phone → Send Code → Verify Code
    ↓
Cart attributes set:
- cod_selected: true
- whatsapp_verified: true
- verified_phone: +90XXXXXXXXXX
    ↓
Redirect to /checkout
    ↓
Checkout UI Extension detects COD
    ↓
Shows verification status banner
    ↓
User completes checkout
    ↓
Order created with metafields:
- cod_verification.whatsapp_verified
- cod_verification.verified_phone
```

## Admin Panel Features

Access at: `https://your-domain.ngrok-free.app`

- Enable/Disable COD
- Enable/Disable WhatsApp verification
- Configure popup text
- View connection status

## Testing

### Local Testing

1. Start ngrok:
```bash
ngrok http 3000
```

2. Update URLs in:
- `.env.local`
- `shopify.app.toml`
- Extension settings

3. Start dev server:
```bash
npm run dev
```

4. Test flow:
- Add product to cart
- Click checkout
- Select COD
- Complete WhatsApp verification
- Proceed to checkout
- Verify inline banner shows
- Complete order
- Check order metafields in admin

### Production Testing

1. Deploy to production hosting (Vercel/Railway/etc)
2. Update all URLs to production domain
3. Redeploy extensions
4. Test complete flow
5. Verify webhook receives order data
6. Check metafields are stored

## Shopify Review Compliance

✅ **No checkout blocking**: Uses UX-based flow
✅ **No custom popups in checkout**: Only Shopify UI components
✅ **No window manipulation**: No location overrides
✅ **Proper API usage**: Uses 2026-01 API
✅ **Webhook validation**: HMAC verification
✅ **Secure data handling**: Phone numbers in metafields
✅ **User consent**: Clear verification flow

## Troubleshooting

### Extension not showing
- Check extension is deployed
- Verify app is installed on store
- Check extension settings in admin

### WhatsApp codes not sending
- Verify WHATSAPP_ACCESS_TOKEN
- Check WHATSAPP_PHONE_NUMBER_ID
- Review API logs

### Verification not persisting
- Check cart attributes are set
- Verify webhook is receiving data
- Check metafield creation

### Checkout extension errors
- Verify app_url setting is correct
- Check API endpoints are accessible
- Review browser console for errors

## Security Notes

- All API calls use HTTPS
- Webhook HMAC validation
- Phone numbers stored securely
- OTP codes expire in 5 minutes
- Maximum 3 verification attempts
- Codes deleted after verification

## Support

For issues or questions:
1. Check logs in Shopify Admin → Apps → Your App
2. Review browser console
3. Check webhook delivery status
4. Verify all environment variables

## Production Checklist

- [ ] Environment variables configured
- [ ] ngrok replaced with production domain
- [ ] Extensions deployed
- [ ] Theme extension added to theme
- [ ] Checkout extension configured
- [ ] Manual payment method enabled
- [ ] WhatsApp Business API configured
- [ ] Webhooks registered
- [ ] Admin panel accessible
- [ ] Complete flow tested
- [ ] Order metafields verified
- [ ] App submitted for review