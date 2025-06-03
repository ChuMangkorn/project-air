import { useEffect, useState } from 'react';

type MiniTicker = {
  s: string; // symbol เช่น 'BTCUSDT'
  c: string; // close price (string)
  v: string; // 24h base asset volume (string)
  q: string; // 24h quote volume (string, USDT)
};

type MarketOverview = {
  totalCoins: number;
  totalVolume24h: number;
  btcDominance: number;
  btcPrice: number;
};

export function useBinanceMarketOverview(): MarketOverview | null {
  const [overview, setOverview] = useState<MarketOverview | null>(null);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');
    ws.onmessage = (event) => {
      const tickers: MiniTicker[] = JSON.parse(event.data);
      const totalCoins = tickers.length;
      const totalVolume24h = tickers.reduce((sum, t) => sum + parseFloat(t.q), 0);
      const btc = tickers.find(t => t.s === 'BTCUSDT');
      const btcVolume = btc ? parseFloat(btc.q) : 0;
      const btcPrice = btc ? parseFloat(btc.c) : 0;
      const btcDominance = totalVolume24h > 0 ? (btcVolume / totalVolume24h) * 100 : 0;

      setOverview({
        totalCoins,
        totalVolume24h,
        btcDominance,
        btcPrice,
      });
    };
    
    return () => ws.close();
  }, []);

  return overview;
}
