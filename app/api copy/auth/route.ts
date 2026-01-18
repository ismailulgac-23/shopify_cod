import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const shop = request.nextUrl.searchParams.get('shop');

  if (!shop) {
    return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.SHOPIFY_API_KEY;
    const scopes = process.env.SHOPIFY_SCOPES || 'read_orders,write_orders';
    const redirectUri = `${process.env.SHOPIFY_APP_URL}/api/auth/callback`;
    
    // Manuel OAuth URL oluştur
    const authUrl = `https://${shop}/admin/oauth/authorize?` +
      `client_id=${apiKey}&` +
      `scope=${scopes}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${Date.now()}`;

    console.log('🔐 OAuth başlatılıyor:', shop);
    console.log('📍 Redirect URI:', redirectUri);

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error('❌ Auth error:', error);
    return NextResponse.json({
      error: 'Authentication failed',
      details: error.message
    }, { status: 500 });
  }
}