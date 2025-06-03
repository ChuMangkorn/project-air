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

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=10`
        );
        const data = await response.json();
        
        setOrderBook({
          bids: data.bids.map(([price, quantity]: string[]) => ({ price, quantity })),
          asks: data.asks.map(([price, quantity]: string[]) => ({ price, quantity }))
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order book:', error);
        setLoading(false);
      }
    };

    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [symbol]);

  const formatPrice = (price: string) => parseFloat(price).toFixed(2);
  const formatQuantity = (quantity: string) => parseFloat(quantity).toFixed(6);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Book</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Order Book - {symbol}
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Asks (Sell Orders) */}
        <div>
          <h4 className="text-sm font-medium text-red-600 mb-2">Asks (Sell)</h4>
          <div className="space-y-1">
            {orderBook.asks.slice().reverse().map((ask, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-red-600 font-mono">${formatPrice(ask.price)}</span>
                <span className="text-gray-600 font-mono">{formatQuantity(ask.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div>
          <h4 className="text-sm font-medium text-green-600 mb-2">Bids (Buy)</h4>
          <div className="space-y-1">
            {orderBook.bids.map((bid, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span className="text-green-600 font-mono">${formatPrice(bid.price)}</span>
                <span className="text-gray-600 font-mono">{formatQuantity(bid.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
