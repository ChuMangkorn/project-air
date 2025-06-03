import { TickerData } from '@/types/binance';

interface TickerCardProps {
  ticker: TickerData;
}

const TickerCard: React.FC<TickerCardProps> = ({ ticker }) => {
  const priceChange = parseFloat(ticker.priceChangePercent);
  const isPositive = priceChange >= 0;

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
          {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-mono font-semibold">
            ${parseFloat(ticker.price).toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">24h Change:</span>
          <span className={`font-mono ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            ${parseFloat(ticker.priceChange).toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">24h Volume:</span>
          <span className="font-mono text-sm">
            {parseFloat(ticker.volume).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TickerCard;
