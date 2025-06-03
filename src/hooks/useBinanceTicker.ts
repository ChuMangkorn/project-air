import { useState, useEffect } from 'react';
import { TickerDataNormalized } from '@/types/binance';

export const useBinanceTicker = (symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT']) => {
  const [tickers, setTickers] = useState<TickerDataNormalized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        console.log('🔄 Fetching real-time ticker data...');
        setError(null);

        const response = await fetch('/api/binance', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          // ไม่ cache เพื่อให้ได้ข้อมูล real-time
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`API error! status: ${response.status}`);
        }

        const data = await response.json();

        // ✅ ตรวจสอบ error อย่างถูกต้อง
        if (data.error) {
          throw new Error(data.error);
        }

        // ✅ ตรวจสอบว่า data เป็น array
        if (!Array.isArray(data)) {
          throw new Error('Invalid ticker data format');
        }

        const filteredTickers = symbols.map(symbol => {
          const ticker = data.find((item: any) => item.symbol === symbol);

          if (ticker && ticker.lastPrice) {
            return {
              symbol: ticker.symbol,
              price: ticker.lastPrice,
              priceChange: ticker.priceChange || '0',
              priceChangePercent: ticker.priceChangePercent || '0',
              volume: ticker.volume || '0',
            };
          }
          return null;
        }).filter(Boolean) as TickerDataNormalized[];

        console.log('✅ Real-time tickers updated:', filteredTickers.length);
        setTickers(filteredTickers);
        setLoading(false);

      } catch (error) {
        console.error('❌ Ticker fetch error:', error);
        setError(`Failed to fetch real-time data: ${error}`);
        setLoading(false);
      }
    };

    // เรียกทันที
    fetchTickers();

    // อัพเดททุก 5 วินาที สำหรับ real-time
    const interval = setInterval(fetchTickers, 5000);

    return () => clearInterval(interval);
  }, [symbols]);

  return { tickers, loading, error };
};
