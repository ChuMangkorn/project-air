import { useEffect, useState } from 'react';

interface Trade {
  price: string;
  quantity: string;
  symbol: string;
  time: number;
}

export function useBinanceTrades(symbol: string) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const trade: Trade = {
        price: data.p,
        quantity: data.q,
        symbol: data.s,
        time: data.T,
      };
      setTrades((prev) => [...prev.slice(-19), trade]); // เก็บ 20 รายการล่าสุด
    };
    return () => ws.close();
  }, [symbol]);

  return trades;
}
