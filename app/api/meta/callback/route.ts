import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

/* ===============================
   SAFE FETCH
================================ */
async function safeFetch(url: string, options: RequestInit = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const text = await res.text();
    let data: any;

    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
    };
  } finally {
    clearTimeout(timeout);
  }
}

/* ===============================
   POPUP RESPONSE
================================ */
function createPopupResponse(success: boolean, message: string, shopId?: string) {
  const bg = success
    ? 'linear-gradient(135deg,#667eea,#764ba2)'
    : 'linear-gradient(135deg,#f093fb,#f5576c)';

  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${success ? 'Başarılı' : 'Hata'}</title>
<style>
body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;
background:${bg};color:#fff;font-family:sans-serif}
.box{background:rgba(255,255,255,.15);padding:40px;border-radius:16px;text-align:center}
</style>
</head>
<body>
<div class="box">
<h2>${message}</h2>
<p>Bu pencere otomatik kapanacaktır</p>
</div>
<script>
if(window.opener){
  window.opener.postMessage({
    type:'${success ? 'META_OAUTH_SUCCESS' : 'META_OAUTH_ERROR'}',
    message:'${message}',
    ${shopId ? `shopId:'${shopId}',` : ''}
  },'*');
  setTimeout(()=>window.close(),2000);
}
</script>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}

/* ===============================
   CALLBACK
================================ */
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      return createPopupResponse(false, 'Meta yetkilendirme iptal edildi.');
    }

    if (!code || !state) {
      return createPopupResponse(false, 'Geçersiz OAuth parametreleri.');
    }

    const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
    const shopId = decoded?.shopId;

    if (!shopId) {
      return createPopupResponse(false, 'Geçersiz state parametresi.');
    }

    /* ACCESS TOKEN */
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', process.env.META_APP_ID!);
    tokenUrl.searchParams.set('client_secret', process.env.META_APP_SECRET!);
    tokenUrl.searchParams.set('redirect_uri', process.env.META_REDIRECT_URI!);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await safeFetch(tokenUrl.toString());

    if (!tokenRes.ok || !tokenRes.data.access_token) {
      return createPopupResponse(false, 'Meta access token alınamadı.');
    }

    const accessToken = tokenRes.data.access_token;

    /* LONG LIVED TOKEN */
    const longUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
    longUrl.searchParams.set('grant_type', 'fb_exchange_token');
    longUrl.searchParams.set('client_id', process.env.META_APP_ID!);
    longUrl.searchParams.set('client_secret', process.env.META_APP_SECRET!);
    longUrl.searchParams.set('fb_exchange_token', accessToken);

    const longRes = await safeFetch(longUrl.toString());
    const finalToken = longRes.data?.access_token || accessToken;

    /* BUSINESS / AD ACCOUNT */
    let businessId: string | null = null;

    const bizRes = await safeFetch(
      `https://graph.facebook.com/v18.0/me/businesses?access_token=${finalToken}`
    );

    if (bizRes.ok && bizRes.data?.data?.length) {
      businessId = bizRes.data.data[0].id;
    } else {
      const adRes = await safeFetch(
        `https://graph.facebook.com/v18.0/me/adaccounts?access_token=${finalToken}`
      );

      if (adRes.ok && adRes.data?.data?.length) {
        businessId = adRes.data.data[0].id.replace('act_', '');
      }
    }

    if (!businessId) {
      return createPopupResponse(
        false,
        'Meta Business veya Ad Account bulunamadı.'
      );
    }

    /* DB */
    await prisma.metaIntegration.upsert({
      where: { shopId },
      create: {
        shopId,
        metaBusinessAccountId: businessId,
        metaAccessToken: finalToken,
        isActive: true,
      },
      update: {
        metaBusinessAccountId: businessId,
        metaAccessToken: finalToken,
        isActive: true,
        updatedAt: new Date(),
      },
    });

    return createPopupResponse(
      true,
      'Meta hesabınız başarıyla bağlandı.',
      shopId
    );

  } catch (err: any) {
    console.error('Meta OAuth callback fatal error', {
      message: err?.message,
      cause: err?.cause,
    });

    return createPopupResponse(
      false,
      'Meta bağlantısı zaman aşımına uğradı. Lütfen tekrar deneyin.'
    );
  } finally {
    await prisma.$disconnect();
  }
}
