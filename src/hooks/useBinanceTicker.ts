// src/hooks/useBinanceTicker.ts
import { useState, useEffect } from 'react';
import { TickerData, TickerDataNormalized } from '@/types/binance';

export const useBinanceTicker = (symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT']) => {
  const [tickers, setTickers] = useState<TickerDataNormalized[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        console.log('🔄 Hook: Fetching data via API route...');
        setError(null);
        setLoading(true);
        
        const response = await fetch('/api/binance');
        
        if (!response.ok) {
          throw new Error(`API route error! status: ${response.status}`);
        }
        
        const data: TickerData[] = await response.json();
        console.log('📊 Hook: Total data received:', data.length);
        
        if (data.length > 0) {
          console.log('📊 Hook: Sample data structure:', Object.keys(data[0]));
          console.log('📊 Hook: Sample item:', data[0]);
        }
        
        const filteredTickers = symbols.map(symbol => {
          const ticker = data.find(item => item.symbol === symbol);
          
          if (ticker) {
            // แปลง lastPrice เป็น price เพื่อ backward compatibility
            const normalizedTicker: TickerDataNormalized = {
              symbol: ticker.symbol,
              price: ticker.lastPrice || '0',  // ใช้ lastPrice แทน price
              priceChange: ticker.priceChange || '0',
              priceChangePercent: ticker.priceChangePercent || '0',
              volume: ticker.volume || '0',
            };
            
            console.log(`✅ Hook: Found ${symbol}:`, {
              lastPrice: ticker.lastPrice,
              normalizedPrice: normalizedTicker.price
            });
            
            return normalizedTicker;
          } else {
            console.warn(`❌ Hook: Not found ${symbol} in API data`);
            return null;
          }
        }).filter(Boolean) as TickerDataNormalized[];
        
        console.log('🎯 Hook: Final filtered tickers count:', filteredTickers.length);
        
        if (filteredTickers.length === 0) {
          throw new Error('No valid tickers found');
        }
        
        setTickers(filteredTickers);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Hook: Error:', error);
        
        // Mock data
        const mockData: TickerDataNormalized[] = [
          {
            symbol: 'BTCUSDT',
            price: '67234.50',
            priceChange: '1234.50',
            priceChangePercent: '1.87',
            volume: '28456.789'
          },
          {
            symbol: 'ETHUSDT',
            price: '3456.78',
            priceChange: '-45.23',
            priceChangePercent: '-1.29',
            volume: '156789.123'
          }
        ];
        
        console.log('🔄 Hook: Using mock data');
        setTickers(mockData);
        setError('Using mock data - API error');
        setLoading(false);
      }
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 30000);

    return () => clearInterval(interval);
  }, [symbols]);

  return { tickers, loading, error };
};
