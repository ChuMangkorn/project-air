import { useState } from 'react';
import { useRobustWebSocket } from '@/hooks/useRobustWebSocket';

export default function TickerRealtime() {
  const [price, setPrice] = useState('0.00');

  const { isConnected } = useRobustWebSocket({
    url: 'wss://stream.binance.com:9443/ws/btcusdt@ticker',
    onMessage: (data) => {
      if (data.e === '24hrTicker') {
        setPrice(data.c);
      }
    },
    reconnectAttempts: 10,
    reconnectInterval: 1000,
    heartbeatInterval: 30000
  });

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <h2 className="text-xl font-bold">BTC/USDT</h2>
      </div>
      <div className="text-2xl font-mono">${price}</div>
    </div>
  );
}
