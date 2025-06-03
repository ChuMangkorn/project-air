import { TradeDisplay } from '@/types/binance';

interface TradeListProps {
  trades: TradeDisplay[];
  isConnected: boolean;
}

const TradeList: React.FC<TradeListProps> = ({ trades, isConnected }) => {
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
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Trades</h2>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium text-gray-700">Time</th>
              <th className="text-right py-2 px-3 font-medium text-gray-700">Price</th>
              <th className="text-right py-2 px-3 font-medium text-gray-700">Quantity</th>
              <th className="text-center py-2 px-3 font-medium text-gray-700">Side</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={`${trade.id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-600">
                  {formatTime(trade.time)}
                </td>
                <td className={`py-2 px-3 text-right font-mono ${
                  trade.isBuyerMaker ? 'text-red-600' : 'text-green-600'
                }`}>
                  ${formatPrice(trade.price)}
                </td>
                <td className="py-2 px-3 text-right font-mono text-gray-700">
                  {trade.quantity.toFixed(6)}
                </td>
                <td className="py-2 px-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.isBuyerMaker 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {trade.isBuyerMaker ? 'SELL' : 'BUY'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeList;
