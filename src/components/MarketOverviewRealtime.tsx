import { useBinanceMarketOverview } from '@/hooks/useBinanceMiniTicker';

export default function MarketOverviewRealtime() {
  const { overview, error } = useBinanceMarketOverview();

  if (error) return (
    <div className="bg-red-100 text-red-700 p-4 rounded">
      {error}
    </div>
  );

  if (!overview) return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <div className="animate-pulse h-8 bg-muted rounded w-3/4"></div>
      <div className="animate-pulse h-4 bg-muted rounded w-1/2 mt-4"></div>
    </div>
  );

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Market Overview (Real-time)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Coins</p>
          <p className="text-xl font-bold text-foreground">
            {overview.totalCoins}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">24h Volume</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            ${overview.totalVolume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">BTC Price</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
            ${overview.btcPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">BTC Dominance</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {overview.btcDominance.toFixed(2)}%
          </p>
        </div>
      </div>
      <div className="mt-2 text-xs text-muted-foreground text-right">
        Real-time via Binance WebSocket
      </div>
    </div>
  );
}
