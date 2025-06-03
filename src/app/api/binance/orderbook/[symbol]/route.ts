import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    // ใช้ await params ตาม Next.js 15
    const { symbol } = await params;
    console.log(`🔄 Fetching order book for ${symbol}...`);
    
    const response = await fetch(
      `https://data.binance/api/v3/depth?symbol=${symbol}&limit=20`,
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
    console.log(`✅ Order book data for ${symbol}:`, data.bids?.length, 'bids');
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ Order Book API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order book data' },
      { status: 500 }
    );
  }
}
