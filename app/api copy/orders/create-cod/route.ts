import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  console.log('🧪 [COD API] GET test');

  return NextResponse.json(
    {
      status: 'OK',
      message: 'COD API is running (Next.js 14 App Router)',
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('🚀 [COD API] POST çağrıldı');
    console.log('📦 Body:', JSON.stringify(body, null, 2));

    // Browser IP'yi request header'larından al
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const clientIp = forwardedFor?.split(',')[0] || realIp || req.headers.get('x-forwarded-for')?.split(',')[0] || null;

    const {
      shop,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerCity,
      customerCountry,
      customerZip,
      cartItems,
      totalAmount,
      cartToken,
      landingPage,
      referringSite,
      userAgent,
    } = body;

    console.log('🌐 Client IP:', clientIp);

    // ZORUNLU KONTROLLER
    if (!customerName || !customerPhone || !customerAddress || !shop) {
      console.error('❌ Eksik zorunlu alanlar');
      return NextResponse.json(
        {
          error: 'Eksik zorunlu alanlar',
          required: ['shop', 'customerName', 'customerPhone', 'customerAddress'],
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Database'den shop bilgisini ve access token'ı al
    const shopRecord = await prisma.shop.findUnique({
      where: { shopDomain: shop },
    });

    if (!shopRecord || !shopRecord.accessToken) {
      console.error('❌ Shop bulunamadı veya access token yok:', shop);
      return NextResponse.json(
        {
          error: 'Mağaza yapılandırması bulunamadı',
          details: 'Lütfen uygulamayı yeniden yükleyin'
        },
        { status: 500, headers: corsHeaders }
      );
    }

    const accessToken = shopRecord.accessToken;
    console.log('✅ Access token bulundu, shop:', shop);

    // Draft Order kullanarak conversion tracking sağla
    const shopifyApiUrl = `https://${shop}/admin/api/2024-10/draft_orders.json`;
    
    console.log('🔑 Access Token (ilk 20 karakter):', accessToken);
    console.log('📝 Draft Order oluşturuluyor (conversion tracking için)...');

    // Sipariş verilerini hazırla
    const lineItems = cartItems?.map((item: any) => ({
      variant_id: item.variant_id || item.id,
      quantity: item.quantity,
      price: (item.price / 100).toFixed(2), // cents to dollars
    })) || [];

    const draftOrderData = {
      draft_order: {
        line_items: lineItems,
        customer: {
          first_name: customerName.split(' ')[0] || customerName,
          last_name: customerName.split(' ').slice(1).join(' ') || '',
          email: customerEmail || `${Date.now()}@cod-order.local`,
          phone: customerPhone,
        },
        shipping_address: {
          first_name: customerName.split(' ')[0] || customerName,
          last_name: customerName.split(' ').slice(1).join(' ') || '',
          address1: customerAddress,
          city: customerCity || '',
          province: customerCity || '',
          country: customerCountry || 'TR',
          zip: customerZip || '',
          phone: customerPhone,
        },
        billing_address: {
          first_name: customerName.split(' ')[0] || customerName,
          last_name: customerName.split(' ').slice(1).join(' ') || '',
          address1: customerAddress,
          city: customerCity || '',
          province: customerCity || '',
          country: customerCountry || 'TR',
          zip: customerZip || '',
          phone: customerPhone,
        },
        note: 'Kapıda Ödeme (COD) - WhatsApp Doğrulamalı Sipariş\nCheckout Token: ' + (cartToken || `cod_${Date.now()}`),
        tags: 'COD, WhatsApp-Verified',
        use_customer_default_address: false,
      },
    };

    console.log('📤 Shopify API\'ye gönderiliyor:', shopifyApiUrl);

    const draftResponse = await fetch(shopifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify(draftOrderData),
    });

    const draftData = await draftResponse.json();

    if (!draftResponse.ok) {
      console.error('❌ Shopify Draft Order hatası:', draftData);
      return NextResponse.json(
        {
          error: 'Draft Order oluşturulamadı',
          details: draftData.errors || draftData,
        },
        { status: draftResponse.status, headers: corsHeaders }
      );
    }

    console.log('✅ Draft Order oluşturuldu:', draftData.draft_order.id);

    // Draft Order'ı complete et (gerçek sipariş oluştur)
    const completeUrl = `https://${shop}/admin/api/2024-10/draft_orders/${draftData.draft_order.id}/complete.json`;
    
    const completeResponse = await fetch(completeUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        payment_pending: true, // COD için ödeme bekliyor
      }),
    });

    const completeData = await completeResponse.json();

    if (!completeResponse.ok) {
      console.error('❌ Draft Order complete hatası:', completeData);
      return NextResponse.json(
        {
          error: 'Sipariş tamamlanamadı',
          details: completeData.errors || completeData,
        },
        { status: completeResponse.status, headers: corsHeaders }
      );
    }

    const finalOrder = completeData.draft_order;
    console.log('✅ Sipariş tamamlandı:', finalOrder.order_id);
    console.log('📋 Order Status URL:', finalOrder.order?.order_status_url);

    // Database'e siparişi kaydet
    try {
      await prisma.order.create({
        data: {
          shopId: shopRecord.id,
          orderId: finalOrder.order_id?.toString() || draftData.draft_order.id.toString(),
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          customerAddress,
          customerCity: customerCity || '',
          customerCountry: customerCountry || 'TR',
          customerZip: customerZip || null,
          whatsappVerified: false,
          paymentMethod: 'COD',
          orderStatus: 'pending',
          totalAmount: totalAmount ? totalAmount / 100 : 0,
        },
      });
      console.log('✅ Sipariş database\'e kaydedildi');
    } catch (dbError: any) {
      console.error('⚠️ Database kayıt hatası:', dbError.message);
      // Database hatası olsa bile Shopify siparişi oluşturuldu, devam et
    }

    const response = {
      success: true,
      orderId: finalOrder.order_id || draftData.draft_order.id,
      orderNumber: finalOrder.name || draftData.draft_order.name,
      orderName: finalOrder.name || draftData.draft_order.name,
      orderStatusUrl: finalOrder.order?.order_status_url || `https://${shop}/account/orders/${finalOrder.order_id}`,
      checkoutToken: cartToken,
      shop,
      message: 'COD siparişi başarıyla oluşturuldu (Draft Order → Complete)',
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail || 'N/A',
        address: customerAddress,
        city: customerCity,
        country: customerCountry,
        zip: customerZip,
      },
      order: {
        items: cartItems?.length || 0,
        total: totalAmount,
        currency: 'TRY',
      },
      timestamp: new Date().toISOString(),
    };

    console.log('📤 Response:', response);

    return NextResponse.json(response, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: any) {
    console.error('❌ [COD API] HATA:', error);

    return NextResponse.json(
      {
        error: 'Sipariş oluşturulurken hata oluştu',
        details: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  } finally {
    await prisma.$disconnect();
  }
}