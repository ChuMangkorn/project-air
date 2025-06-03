// src/hooks/useBinanceWebSocket.ts
import { useState, useEffect, useCallback } from 'react';
import { BinanceTradeData, TradeDisplay } from '@/types/binance';

export const useBinanceWebSocket = (symbol: string = 'btcusdt') => {
  const [trades, setTrades] = useState<TradeDisplay[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data: BinanceTradeData = JSON.parse(event.data);
        
        const newTrade: TradeDisplay = {
          id: data.t,
          symbol: data.s,
          price: parseFloat(data.p),
          quantity: parseFloat(data.q),
          time: new Date(data.T),
          isBuyerMaker: data.m,
        };

        setTrades(prevTrades => [newTrade, ...prevTrades.slice(0, 49)]); // Keep last 50 trades
      } catch (err) {
        console.error('Error parsing WebSocket data:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return ws;
  }, [symbol]);

  useEffect(() => {
    const ws = connectWebSocket();
    
    return () => {
      ws.close();
    };
  }, [connectWebSocket]);

  return { trades, isConnected, error };
};
