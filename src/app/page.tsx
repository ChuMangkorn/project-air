'use client';

import { useState } from 'react';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { useBinanceTicker } from '@/hooks/useBinanceTicker';
import TradeList from '@/components/ui/TradeList';
import TickerCard from '@/components/TickerCard';
import PriceChart from '@/components/ui/PriceChart';
import OrderBook from '@/components/ui/OrderBook';
import MarketStats from '@/components/ui/MarketStats';

const POPULAR_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { trades, isConnected, error } = useBinanceWebSocket(selectedSymbol);
  const { tickers, loading } = useBinanceTicker(POPULAR_SYMBOLS);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Binance Trading Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time cryptocurrency trading data
          </p>
        </header>

        {/* Market Stats */}
        <div className="mb-8">
          <MarketStats />
        </div>

        {/* Symbol Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Trading Pair:
          </label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {POPULAR_SYMBOLS.map(symbol => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Ticker Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading market data...</p>
            </div>
          ) : (
            tickers.map(ticker => (
              <TickerCard key={ticker.symbol} ticker={ticker} />
            ))
          )}
        </div>

        {/* Chart and Order Book */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PriceChart symbol={selectedSymbol} />
          <OrderBook symbol={selectedSymbol} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Trade List */}
        <TradeList trades={trades} isConnected={isConnected} />
      </div>
    </div>
  );
}
