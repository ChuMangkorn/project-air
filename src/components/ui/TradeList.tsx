// src/components/ui/TradeList.tsx
import { TradeDisplay } from '@/types/binance';

interface TradeListProps {
  trades: TradeDisplay[];
  isConnected: boolean;
  error?: string | null;
  onReconnect?: () => void;
}

const TradeList: React.FC<TradeListProps> = ({ trades, isConnected, error, onReconnect }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString();
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Trades</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {error && onReconnect && (
            <button
              onClick={onReconnect}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 font-medium text-muted-foreground">Time</th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">Price</th>
              <th className="text-right py-2 px-3 font-medium text-muted-foreground">Quantity</th>
              <th className="text-center py-2 px-3 font-medium text-muted-foreground">Side</th>
            </tr>
          </thead>
          <tbody>
            {trades.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-muted-foreground">
                  {isConnected ? 'Waiting for trades...' : 'No connection'}
                </td>
              </tr>
            ) : (
              trades.map((trade, index) => (
                <tr key={`${trade.id}-${index}`} className="border-b border-border hover:bg-muted/50">
                  <td className="py-2 px-3 text-muted-foreground">
                    {formatTime(trade.time)}
                  </td>
                  <td className={`py-2 px-3 text-right font-mono ${
                    trade.isBuyerMaker ? 'text-red-500' : 'text-green-500'
                  }`}>
                    ${formatPrice(trade.price)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">
                    {trade.quantity.toFixed(6)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.isBuyerMaker 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {trade.isBuyerMaker ? 'SELL' : 'BUY'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeList;
