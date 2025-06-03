// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { useBinanceTicker } from '@/hooks/useBinanceTicker';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TradeList from '@/components/ui/TradeList';
import TickerCard from '@/components/TickerCard';
import PriceChart from '@/components/ui/PriceChart';
import OrderBook from '@/components/ui/OrderBook';
import MarketStats from '@/components/ui/MarketStats';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import SkeletonCard from '@/components/ui/SkeletonCard';
import MarketOverviewRealtime from '@/components/MarketOverviewRealtime';
import OrderBookRealtime from '@/components/OrderBookRealtime';
import TradesRealtime from '@/components/TradesRealtime';
import TickerRealtime from '@/components/TickerRealtime';

const POPULAR_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { trades, isConnected, error, reconnect } = useBinanceWebSocket(selectedSymbol);
  const { tickers, loading, error: tickerError } = useBinanceTicker(POPULAR_SYMBOLS);

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <MarketOverviewRealtime />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <TickerRealtime />
        <OrderBookRealtime symbol="BTCUSDT" />
        <TradesRealtime symbol="BTCUSDT" />
      </div>
        {/* Header - Responsive */}
        <header className={`mb-6 md:mb-8 ${isMobile ? 'text-center' : 'flex items-center justify-between'}`}>
          <div className={isMobile ? 'mb-4' : ''}>
            <h1 className={`font-bold mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              Binance Trading Dashboard
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Real-time cryptocurrency trading data
            </p>
          </div>
          <DarkModeToggle />
        </header>

        {/* Market Stats - Full width on mobile */}
        <div className="mb-6 md:mb-8">
          <MarketStats />
        </div>

        {/* Symbol Selector - Full width on mobile */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Select Trading Pair:
          </label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-card text-card-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {POPULAR_SYMBOLS.map(symbol => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Ticker Cards - Responsive Grid */}
        <div className={`grid gap-4 mb-6 md:mb-8 ${isMobile
            ? 'grid-cols-1'
            : isTablet
              ? 'grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-2 lg:grid-cols-5'
          }`}>
          {loading ? (
            // แสดง Skeleton Cards แทน loading spinner
            Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            tickers.map(ticker => (
              <TickerCard key={ticker.symbol} ticker={ticker} />
            ))
          )}
        </div>

        {/* Chart and Order Book - Stack on mobile */}
        <div className={`gap-6 mb-6 md:mb-8 ${isMobile ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-2'
          }`}>
          <PriceChart symbol={selectedSymbol} />
          <OrderBook symbol={selectedSymbol} />
        </div>

        {/* Error Messages */}
        {(error || tickerError) && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded mb-6 text-sm md:text-base">
            {error || tickerError}
          </div>
        )}

        {/* Trade List */}
        <TradeList
          trades={trades}
          isConnected={isConnected}
          error={error}
          onReconnect={reconnect}
        />
      </div>
    </div>
  );
}
