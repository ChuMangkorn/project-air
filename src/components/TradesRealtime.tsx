import { useBinanceTrades } from '@/hooks/useBinanceTrades';

export default function TradesRealtime({ symbol = 'BTCUSDT' }) {
  const trades = useBinanceTrades(symbol);

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Recent Trades ({symbol})</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left">Time</th>
              <th className="text-right">Price</th>
              <th className="text-right">Qty</th>
            </tr>
          </thead>
          <tbody>
            {trades.slice().reverse().map((trade, i) => (
              <tr key={i}>
                <td>{new Date(trade.time).toLocaleTimeString()}</td>
                <td className="text-right font-mono">${parseFloat(trade.price).toFixed(2)}</td>
                <td className="text-right font-mono">{parseFloat(trade.quantity).toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
