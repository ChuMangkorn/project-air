// src/app/api/binance/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔄 API Route: Fetching from Binance...');

    const response = await fetch('https://data-api.binance.vision/api/v3/ticker/24hr', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Real-time data fetched:', data.length, 'symbols');


    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ Binance API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real-time data' },
      { status: 500 }
    );
  }
}