'use client';

import { useState, useEffect } from 'react';

interface MarketStatsData {
  totalCoins: number;
  totalMarketCap: number;
  totalVolume24h: number;
  btcPrice: number;
  btcDominance: number;
}

const MarketStats: React.FC = () => {
  const [stats, setStats] = useState<MarketStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        console.log('🔄 Fetching real-time market stats...');
        setError(null);
        
        const response = await fetch('/api/binance/global', {
          method: 'GET',
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        console.log('✅ Real-time market stats updated');
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('❌ Market stats fetch error:', error);
        setError(`Failed to fetch market stats: ${error}`);
        setLoading(false);
      }
    };

    fetchMarketStats();
    // อัพเดททุก 30 วินาที
    const interval = setInterval(fetchMarketStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  if (loading || !stats) {
    return (
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Market Overview (Real-time)</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">BTC Price</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
            ${stats.btcPrice.toLocaleString()}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">24h Volume</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatNumber(stats.totalVolume24h)}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Pairs</p>
          <p className="text-xl font-bold text-foreground">
            {stats.totalCoins.toLocaleString()}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">BTC Dominance</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {stats.btcDominance}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;
