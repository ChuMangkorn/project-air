'use client';

import { useState, useEffect } from 'react';

interface MarketStatsData {
  totalCoins: number;
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
}

const MarketStats: React.FC = () => {
  const [stats, setStats] = useState<MarketStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        // จำลองข้อมูล Market Stats (ในการใช้งานจริงอาจใช้ CoinGecko API)
        const mockStats: MarketStatsData = {
          totalCoins: 2847,
          totalMarketCap: 2340000000000,
          totalVolume24h: 89500000000,
          btcDominance: 52.3
        };
        
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching market stats:', error);
        setLoading(false);
      }
    };

    fetchMarketStats();
    const interval = setInterval(fetchMarketStats, 30000); // Update every 30 seconds

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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Market Cap</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatNumber(stats.totalMarketCap)}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">24h Volume</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatNumber(stats.totalVolume24h)}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Coins</p>
          <p className="text-xl font-bold text-foreground">
            {stats.totalCoins.toLocaleString()}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">BTC Dominance</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {stats.btcDominance}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketStats;
