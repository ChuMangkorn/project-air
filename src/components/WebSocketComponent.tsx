import { useEffect, useRef, useState } from 'react';

export function useBinanceTrades(symbol: string) {
  const [trades, setTrades] = useState<any[]>([]);
  const [wsError, setWsError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    function connect() {
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isMounted) setWsError(null);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (isMounted) setTrades(prev => [...prev.slice(-19), data]);
      };

      ws.onerror = (event) => {
        setWsError("ขาดการเชื่อมต่อกับเซิร์ฟเวอร์ (WebSocket)");
        console.error('❌ WebSocket error:', event);
      };

      ws.onclose = (event) => {
        setWsError("เชื่อมต่อ WebSocket หลุด กำลังพยายามเชื่อมใหม่...");
        // Auto-reconnect หลัง 5 วินาที
        if (isMounted) {
          reconnectTimeout = setTimeout(connect, 5000);
        }
      };
    }

    connect();

    return () => {
      isMounted = false;
      wsRef.current?.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [symbol]);

  return { trades, wsError };
}
