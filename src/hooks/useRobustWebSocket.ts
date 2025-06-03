import { useEffect, useRef, useState } from 'react';

type WebSocketConfig = {
  url: string;
  onMessage: (data: any) => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
};

export function useRobustWebSocket(config: WebSocketConfig) {
  const {
    url,
    onMessage,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000
  } = config;

  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  const connect = () => {
    if (reconnectCountRef.current >= reconnectAttempts) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!isMountedRef.current) return;
      setIsConnected(true);
      reconnectCountRef.current = 0;
      startHeartbeat();
    };

    ws.onmessage = (event) => {
      if (!isMountedRef.current) return;
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Message parsing error:', error);
      }
    };

    ws.onerror = (error) => {
      if (!isMountedRef.current) return;
      onError?.(error);
      handleReconnect();
    };

    ws.onclose = () => {
      if (!isMountedRef.current) return;
      setIsConnected(false);
      handleReconnect();
    };
  };

  const handleReconnect = () => {
    if (reconnectCountRef.current < reconnectAttempts) {
      reconnectCountRef.current += 1;
      setTimeout(connect, reconnectInterval * Math.pow(2, reconnectCountRef.current));
    }
  };

  const startHeartbeat = () => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, heartbeatInterval);
  };

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      wsRef.current?.close();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
    // eslint-disable-next-line
  }, [url]);

  return { isConnected };
}
