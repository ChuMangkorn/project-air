// src/hooks/useBinanceTicker.ts
import { useState, useEffect } from 'react';
import { TickerData } from '@/types/binance';

export const useBinanceTicker = (symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT']) => {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data: TickerData[] = await response.json();
        
        const filteredTickers = data.filter(ticker => 
          symbols.includes(ticker.symbol)
        );
        
        setTickers(filteredTickers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ticker data:', error);
        setLoading(false);
      }
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [symbols]);

  return { tickers, loading };
};
