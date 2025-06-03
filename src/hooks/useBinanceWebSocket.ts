import { useState, useEffect, useCallback, useRef } from 'react';
import { BinanceTradeData, TradeDisplay } from '@/types/binance';

export const useBinanceWebSocket = (symbol: string = 'btcusdt') => {
  const [trades, setTrades] = useState<TradeDisplay[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connectWebSocket = useCallback(() => {
    try {

      if (wsRef.current) {
        wsRef.current.close();
      }

      console.log(`🔄 Connecting to Binance WebSocket for ${symbol}...`);
      
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
      wsRef.current = ws;


      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.warn('⏰ WebSocket connection timeout');
          ws.close();
          setError('Connection timeout');
          setIsConnected(false);
        }
      }, 10000);

      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0; // รีเซ็ต attempts เมื่อเชื่อมต่อสำเร็จ
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

          setTrades(prevTrades => [newTrade, ...prevTrades.slice(0, 49)]);
        } catch (err) {
          console.error('❌ Error parsing WebSocket data:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        clearTimeout(connectionTimeout);
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        clearTimeout(connectionTimeout);
        setIsConnected(false);

        // Auto-reconnect logic
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000); // Exponential backoff
          console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connectWebSocket();
          }, delay);
        } else {
          setError('Max reconnection attempts reached');
          console.error('❌ Max reconnection attempts reached');
        }
      };

      return ws;
    } catch (err) {
      console.error('❌ Failed to create WebSocket:', err);
      setError('Failed to create WebSocket connection');
      setIsConnected(false);
      return null;
    }
  }, [symbol]);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      // Cleanup
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectWebSocket]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setError(null);
    connectWebSocket();
  }, [connectWebSocket]);

  return { trades, isConnected, error, reconnect };
};
