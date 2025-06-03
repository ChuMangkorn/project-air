'use client';

import { useState, useEffect } from 'react';

interface OrderBookEntry {
  price: string;
  quantity: string;
}

interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface OrderBookProps {
  symbol: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
  const [orderBook, setOrderBook] = useState<OrderBookData>({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        console.log(`🔄 Fetching real-time order book for ${symbol}...`);
        setError(null);

        const response = await fetch(`/api/binance/orderbook/${symbol}`, {
          method: 'GET',
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // ✅ ตรวจสอบ error อย่างถูกต้อง
        if (data.error) {
          throw new Error(data.error);
        }

        // ✅ ตรวจสอบว่ามี bids และ asks
        if (!data.bids || !data.asks) {
          throw new Error('Invalid order book data');
        }

        setOrderBook({
          bids: data.bids.map(([price, quantity]: string[]) => ({ price, quantity })),
          asks: data.asks.map(([price, quantity]: string[]) => ({ price, quantity }))
        });

        console.log(`✅ Real-time order book for ${symbol} updated`);
        setLoading(false);
      } catch (error) {
        console.error('❌ Order book fetch error:', error);
        setError(`Failed to fetch order book: ${error}`);
        setLoading(false);
      }
    };

    fetchOrderBook();
    // อัพเดททุก 2 วินาที สำหรับ real-time order book
    const interval = setInterval(fetchOrderBook, 2000);

    return () => clearInterval(interval);
  }, [symbol]);

  const formatPrice = (price: string) => parseFloat(price).toFixed(2);
  const formatQuantity = (quantity: string) => parseFloat(quantity).toFixed(6);

  if (loading) {
    return (
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Order Book (Real-time)</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Order Book - {symbol} (Real-time)
        </h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
            Asks (Sell)
          </h4>
          <div className="space-y-1">
            {orderBook.asks.slice().reverse().map((ask, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-red-600 dark:text-red-400 font-mono">
                  ${formatPrice(ask.price)}
                </span>
                <span className="text-muted-foreground font-mono">
                  {formatQuantity(ask.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
            Bids (Buy)
          </h4>
          <div className="space-y-1">
            {orderBook.bids.map((bid, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-green-600 dark:text-green-400 font-mono">
                  ${formatPrice(bid.price)}
                </span>
                <span className="text-muted-foreground font-mono">
                  {formatQuantity(bid.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
