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
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json({
        error: 'Telefon numarası ve kod gerekli'
      }, { status: 400, headers: corsHeaders });
    }

    // Telefon numarasını temizle
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Kodları oku
    const codes = await readCodes();
    const verification = codes[cleanPhone];

    if (!verification) {
      return NextResponse.json({
        error: 'Bu telefon numarası için kod bulunamadı',
        verified: false
      }, { status: 400, headers: corsHeaders });
    }

    // Süre kontrolü
    const expiresAt = new Date(verification.expiresAt);
    if (expiresAt < new Date()) {
      delete codes[cleanPhone];
      await writeCodes(codes);
      return NextResponse.json({
        error: 'Kod süresi dolmuş. Lütfen yeni kod isteyin',
        verified: false
      }, { status: 400, headers: corsHeaders });
    }

    // Deneme sayısı kontrolü
    if (verification.attempts >= 3) {
      delete codes[cleanPhone];
      await writeCodes(codes);
      return NextResponse.json({
        error: 'Çok fazla hatalı deneme. Lütfen yeni kod isteyin',
        verified: false
      }, { status: 400, headers: corsHeaders });
    }

    // Kod kontrolü
    if (verification.code !== code) {
      verification.attempts += 1;
      codes[cleanPhone] = verification;
      await writeCodes(codes);
      
      return NextResponse.json({
        error: `Hatalı kod. Kalan deneme: ${3 - verification.attempts}`,
        verified: false
      }, { status: 400, headers: corsHeaders });
    }

    // Başarılı doğrulama - kodu sil
    delete codes[cleanPhone];
    await writeCodes(codes);

    return NextResponse.json({
      success: true,
      message: 'Telefon numarası başarıyla doğrulandı',
      verified: true,
      phoneNumber: cleanPhone
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({
      error: 'Kod doğrulanırken hata oluştu'
    }, { status: 500, headers: corsHeaders });
  }
}