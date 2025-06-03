'use client';

import { useState } from 'react';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { useBinanceTicker } from '@/hooks/useBinanceTicker';
import TradeList from '@/components/ui/TradeList';
import TickerCard from '@/components/TickerCard';
import PriceChart from '@/components/ui/PriceChart';
import OrderBook from '@/components/ui/OrderBook';
import MarketStats from '@/components/ui/MarketStats';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

const POPULAR_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { trades, isConnected, error } = useBinanceWebSocket(selectedSymbol);
  const { tickers, loading } = useBinanceTicker(POPULAR_SYMBOLS);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Binance Trading Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time cryptocurrency trading data
            </p>
          </div>
          <DarkModeToggle />
        </header>

        {/* Market Stats */}
        <div className="mb-8">
          <MarketStats />
        </div>

        {/* Symbol Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Trading Pair:
          </label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="px-3 py-2 bg-card text-card-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading market data...</p>
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
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Trade List */}
        <TradeList trades={trades} isConnected={isConnected} />
      </div>
    </div>
  );
}
