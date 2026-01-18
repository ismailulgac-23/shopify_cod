import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CODES_FILE = path.join(process.cwd(), 'data', 'verification-codes.json');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS request için preflight handler
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Kodları oku
async function readCodes() {
  try {
    const data = await fs.readFile(CODES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

// Kodları kaydet
async function writeCodes(codes: any) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(CODES_FILE, JSON.stringify(codes, null, 2));
  } catch (error) {
    console.error('Write codes error:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Telefon numarası gerekli' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Telefon numarasını temizle
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // 6 haneli doğrulama kodu oluştur
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 dakika

    // Kodu dosyaya kaydet
    const codes = await readCodes();
    codes[cleanPhone] = {
      code: verificationCode,
      expiresAt: expiresAt.toISOString(),
      attempts: 0
    };
    await writeCodes(codes);

    // WhatsApp Business API ile kod gönder
    try {
      const whatsappResponse = await fetch(
        `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: cleanPhone,
            type: 'text',
            text: {
              body: `Doğrulama kodunuz: ${verificationCode}\n\nBu kodu kimseyle paylaşmayın.\nKod 5 dakika geçerlidir.`
            }
          }),
        }
      );

      if (!whatsappResponse.ok) {
        const error = await whatsappResponse.json();
        console.error('WhatsApp API error:', error);
        
        // WhatsApp hatası olsa bile development'ta kodu döndür
        return NextResponse.json({
          success: true,
          message: 'Kod oluşturuldu (WhatsApp gönderimi başarısız)',
          code: verificationCode, // Development için
          warning: 'WhatsApp API hatası'
        }, { headers: corsHeaders });
      }

      console.log('WhatsApp message sent successfully to:', cleanPhone);
    } catch (whatsappError) {
      console.error('WhatsApp send error:', whatsappError);
      // WhatsApp hatası olsa bile kodu kaydet ve döndür
    }

    return NextResponse.json({
      success: true,
      message: 'Doğrulama kodu gönderildi',
      code: verificationCode, // Development için - production'da kaldırın
      expiresAt: expiresAt.toISOString()
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: 'Kod gönderilirken hata oluştu' },
      { status: 500, headers: corsHeaders }
    );
  }
}