import { NextRequest, NextResponse } from 'next/server';
import shopify from '@/lib/shopify';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const hmac = request.headers.get('x-shopify-hmac-sha256');
    const topic = request.headers.get('x-shopify-topic');
    const shop = request.headers.get('x-shopify-shop-domain');

    const isValid = await shopify.webhooks.validate({
      rawBody: body,
      rawRequest: request as any,
      rawResponse: NextResponse as any,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid webhook' }, { status: 401 });
    }

    const orderData = JSON.parse(body);

    const whatsappVerified = orderData.note_attributes?.find(
      (attr: any) => attr.name === 'whatsapp_verified'
    )?.value === 'true';

    const verifiedPhone = orderData.note_attributes?.find(
      (attr: any) => attr.name === 'verified_phone'
    )?.value;

    const codSelected = orderData.note_attributes?.find(
      (attr: any) => attr.name === 'cod_selected'
    )?.value === 'true';

    if (codSelected && whatsappVerified) {
      console.log('COD Order with WhatsApp verification:', {
        orderId: orderData.id,
        orderNumber: orderData.order_number,
        customer: orderData.customer,
        verifiedPhone: verifiedPhone,
        total: orderData.total_price,
      });

      try {
        const session = shopify.session.customAppSession(shop!);
        const client = new shopify.clients.Rest({ session });
        
        await client.post({
          path: `orders/${orderData.id}/metafields`,
          data: {
            metafield: {
              namespace: 'cod_verification',
              key: 'whatsapp_verified',
              value: 'true',
              type: 'single_line_text_field',
            },
          },
        });

        await client.post({
          path: `orders/${orderData.id}/metafields`,
          data: {
            metafield: {
              namespace: 'cod_verification',
              key: 'verified_phone',
              value: verifiedPhone || '',
              type: 'single_line_text_field',
            },
          },
        });
      } catch (metafieldError) {
        console.error('Metafield creation error:', metafieldError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}