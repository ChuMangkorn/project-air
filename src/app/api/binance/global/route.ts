import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔄 Fetching global market stats...');

    // เรียก API หลายตัวพร้อมกัน
    const [tickerResponse, btcResponse] = await Promise.all([
      fetch('https://data-api.binance.vision/api/v3/ticker/24hr'),
      fetch('https://data-api.binance.vision/api/v3/ticker/price?symbol=BTCUSDT')
    ]);

    if (!tickerResponse.ok || !btcResponse.ok) {
      throw new Error('Failed to fetch market data');
    }

    const [allTickers, btcData] = await Promise.all([
      tickerResponse.json(),
      btcResponse.json()
    ]);

    // คำนวณ market stats จากข้อมูลจริง
    const totalVolume24h = allTickers.reduce((sum: number, ticker: any) => {
      return sum + parseFloat(ticker.quoteVolume || 0);
    }, 0);

    const marketStats = {
      totalCoins: allTickers.length,
      totalMarketCap: totalVolume24h * 10, // ประมาณการ
      totalVolume24h: totalVolume24h,
      btcPrice: parseFloat(btcData.price),
      btcDominance: 52.3 // ค่าประมาณ
    };

    console.log('✅ Global market stats calculated');

    return NextResponse.json(marketStats, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ Global market stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global market stats' },
      { status: 500 }
    );
  }
}
