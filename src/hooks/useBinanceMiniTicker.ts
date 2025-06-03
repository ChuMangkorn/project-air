import { useEffect, useRef, useState } from 'react';

type MiniTicker = {
  s: string; // symbol
  c: string; // close price
  v: string; // 24h base volume
  q: string; // 24h quote volume
};

type MarketOverview = {
  totalCoins: number;
  totalVolume24h: number;
  btcDominance: number;
  btcPrice: number;
};

export function useBinanceMarketOverview(): { overview: MarketOverview | null, error: string | null } {
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    function connect() {
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/!miniTicker@arr');
      wsRef.current = ws;

      ws.onopen = () => {
        if (isMounted) setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const tickers: MiniTicker[] = JSON.parse(event.data);
          const totalCoins = tickers.length;
          const totalVolume24h = tickers.reduce((sum, t) => sum + parseFloat(t.q), 0);
          const btc = tickers.find(t => t.s === 'BTCUSDT');
          const btcVolume = btc ? parseFloat(btc.q) : 0;
          const btcPrice = btc ? parseFloat(btc.c) : 0;
          const btcDominance = totalVolume24h > 0 ? (btcVolume / totalVolume24h) * 100 : 0;

          if (isMounted) {
            setOverview({
              totalCoins,
              totalVolume24h,
              btcDominance,
              btcPrice,
            });
          }
        } catch (e) {
          if (isMounted) setError('Parse error');
        }
      };

      ws.onerror = (event) => {
        if (isMounted) setError('WebSocket error');
        console.error('❌ WebSocket error:', event);
      };

      ws.onclose = (event) => {
        if (isMounted) setError(`WebSocket closed: ${event.code}`);
        // Auto-reconnect after 5s
        reconnectRef.current = setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      isMounted = false;
      if (wsRef.current) wsRef.current.close();
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, []);

  return { overview, error };
}
