// src/app/api/binance/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔄 API Route: Fetching from Binance...');
    
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Route: Got data, length:', data.length);
    
    
    if (data.length > 0) {
      console.log('📊 API Route: Sample item fields:', Object.keys(data[0]));
      console.log('📊 API Route: Sample item:', data[0]);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ API Route Error:', error);
    
    
    const mockData = [
      {
        symbol: 'BTCUSDT',
        lastPrice: '67234.50',
        priceChange: '1234.50',
        priceChangePercent: '1.87',
        volume: '28456.789'
      },
      {
        symbol: 'ETHUSDT',
        lastPrice: '3456.78',
        priceChange: '-45.23',
        priceChangePercent: '-1.29',
        volume: '156789.123'
      }
    ];
    
    return NextResponse.json(mockData);
  }
}
