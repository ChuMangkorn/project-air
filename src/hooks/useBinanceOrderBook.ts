import { useEffect, useRef, useState } from 'react';

type OrderBookEntry = [string, string];

interface WebSocketData {
  u: number;
  b: Array<[string, string]>;
  a: Array<[string, string]>;
}

interface DepthSnapshot {
  lastUpdateId: number;
  bids: Array<[string, string]>;
  asks: Array<[string, string]>;
}

export function useBinanceOrderBook(symbol: string, depth: number = 10) {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const buffer = useRef<WebSocketData[]>([]);
  const lastUpdateId = useRef<number | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let active = true;

    async function init() {
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth@100ms`);
      ws.onmessage = (event) => {
        const data: WebSocketData = JSON.parse(event.data);
        buffer.current.push(data);
      };
      ws.onerror = () => setError('WebSocket error');

      const res = await fetch(`https://data-api.binance.vision/api/v3/depth?symbol=${symbol}&limit=1000`);
      const snapshot: DepthSnapshot = await res.json();
      if (!active) return;

      lastUpdateId.current = snapshot.lastUpdateId;
      let localBids = [...snapshot.bids];
      let localAsks = [...snapshot.asks];

      buffer.current = buffer.current.filter(e => e.u >= snapshot.lastUpdateId);
      buffer.current.forEach(applyEvent);

      ws.onmessage = (event) => {
        const data: WebSocketData = JSON.parse(event.data);
        applyEvent(data);
      };

      function applyEvent(data: WebSocketData) {
        data.b.forEach(([price, qty]) => {
          if (parseFloat(qty) === 0) {
            localBids = localBids.filter(([p]) => p !== price);
          } else {
            const idx = localBids.findIndex(([p]) => p === price);
            if (idx !== -1) localBids[idx][1] = qty;
            else localBids.push([price, qty]);
          }
        });

        data.a.forEach(([price, qty]) => {
          if (parseFloat(qty) === 0) {
            localAsks = localAsks.filter(([p]) => p !== price);
          } else {
            const idx = localAsks.findIndex(([p]) => p === price);
            if (idx !== -1) localAsks[idx][1] = qty;
            else localAsks.push([price, qty]);
          }
        });

        localBids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
        localAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));

        setBids(localBids.slice(0, depth));
        setAsks(localAsks.slice(0, depth));
      }
    }

    init();

    return () => {
      active = false;
      ws?.close();
      buffer.current = [];
      lastUpdateId.current = null;
    };
  }, [symbol, depth]);

  return { bids, asks, error };
}
