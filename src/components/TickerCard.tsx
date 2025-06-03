// src/components/TickerCard.tsx
import { TickerData } from '@/types/binance';
import { TickerDataNormalized } from '@/types/binance';

interface TickerCardProps {
  ticker: TickerDataNormalized;
}

const TickerCard: React.FC<TickerCardProps> = ({ ticker }) => {
  console.log(`🏷️ TickerCard: Rendering ${ticker.symbol}:`, ticker);

  const formatPrice = (price: string | number | undefined | null) => {
    if (!price || price === '' || price === '0' || price === 'undefined' || price === 'null') {
      return 'N/A';
    }
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice) || numPrice <= 0) {
      return 'N/A';
    }
    
    return numPrice.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  const formatChange = (change: string | number | undefined | null) => {
    if (!change || change === '' || change === '0') {
      return '0.00';
    }
    
    const numChange = typeof change === 'string' ? parseFloat(change) : change;
    
    if (isNaN(numChange)) {
      return '0.00';
    }
    
    return numChange.toFixed(2);
  };

  const priceChangePercent = parseFloat(ticker.priceChangePercent || '0');
  const isPositive = priceChangePercent >= 0;

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow border border-border p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">
          {ticker.symbol}
        </h3>
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          isPositive 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isPositive ? '+' : ''}{formatChange(priceChangePercent)}%
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-mono font-semibold">
            ${formatPrice(ticker.price)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">24h Change:</span>
          <span className={`font-mono ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            ${formatChange(ticker.priceChange)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">24h Volume:</span>
          <span className="font-mono text-sm">
            {parseFloat(ticker.volume || '0').toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TickerCard;
