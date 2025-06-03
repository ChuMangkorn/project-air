import { useBinanceOrderBook } from '@/hooks/useBinanceOrderBook';

export default function OrderBookRealtime({ symbol = 'BTCUSDT' }) {
  const { bids, asks, error } = useBinanceOrderBook(symbol);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Order Book ({symbol})</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Asks</h4>
          <div className="space-y-1">
            {asks.slice(0, 10).reverse().map(([price, qty], i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-red-600 dark:text-red-400 font-mono">${parseFloat(price).toFixed(2)}</span>
                <span className="text-muted-foreground font-mono">{parseFloat(qty).toFixed(6)}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Bids</h4>
          <div className="space-y-1">
            {bids.slice(0, 10).map(([price, qty], i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-green-600 dark:text-green-400 font-mono">${parseFloat(price).toFixed(2)}</span>
                <span className="text-muted-foreground font-mono">{parseFloat(qty).toFixed(6)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
