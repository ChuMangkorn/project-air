import { TickerData } from '@/types/binance';

interface TickerCardProps {
  ticker: TickerData;
}

const TickerCard: React.FC<TickerCardProps> = ({ ticker }) => {
  const priceChange = parseFloat(ticker.priceChangePercent);
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {ticker.symbol}
        </h3>
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          isPositive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Price:</span>
          <span className="font-mono font-semibold">
            ${parseFloat(ticker.price).toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">24h Change:</span>
          <span className={`font-mono ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            ${parseFloat(ticker.priceChange).toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">24h Volume:</span>
          <span className="font-mono text-sm">
            {parseFloat(ticker.volume).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TickerCard;
