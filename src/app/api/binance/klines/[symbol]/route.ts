import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    // ใช้ await params ตาม Next.js 15
    const { symbol } = await params;
    const { searchParams } = new URL(request.url);
    const interval = searchParams.get('interval') || '1h';
    const limit = searchParams.get('limit') || '24';
    
    console.log(`🔄 Fetching klines for ${symbol} ${interval}...`);
    
    const response = await fetch(
      `https://data-api.binance.vision/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Binance API error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Klines data for ${symbol}:`, data.length, 'candles');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ Klines API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch klines data' },
      { status: 500 }
    );
  }
}
