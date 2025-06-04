import { useMemo } from "react";
import { useBinanceTrades } from "@/hooks/useBinanceTrades";

export default function TradesRealtime({ symbol = "BTCUSDT" }) {
  const { trades, wsError } = useBinanceTrades(symbol);

  // แสดง 100 รายการล่าสุด (ใหม่สุดบน)
  const recentTrades = useMemo(() => [...trades.slice(-100)].reverse(), [trades]);

  // คำนวณ max volume ใน 100 รายการนี้
  const maxVolume = useMemo(
    () => Math.max(...recentTrades.map(t => parseFloat(t.q) || 0), 1), // กันกรณี q เป็น 0
    [recentTrades]
  );

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Order Book ({symbol})</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      {wsError && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-3 py-2 rounded mb-4 text-sm">
          {wsError}
        </div>
      )}
      {/* ...header และ error... */}
      <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-muted">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b border-border z-10">
            <tr>
              <th className="text-left py-2 text-muted-foreground font-medium">Time</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Price</th>
              <th className="text-right py-2 text-muted-foreground font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTrades.map(t => {
              const price = t.p !== undefined && t.p !== null ? parseFloat(t.p) : 0;
              const amount = t.q !== undefined && t.q !== null ? parseFloat(t.q) : 0;
              const isSell = t.m === true || t.m === "true";
              return (
                <tr key={t.t} className="border-b border-border/40 hover:bg-muted/50 relative">
                  <td className="py-2 text-muted-foreground">
                    {t.T ? new Date(t.T).toLocaleTimeString() : "-"}
                  </td>
                  <td className={`text-right py-2 font-mono ${isSell ? 'text-red-500' : 'text-green-500'}`}>
                    ${price.toFixed(2)}
                  </td>
                  <td className="text-right py-2 font-mono text-muted-foreground">
                    {amount.toFixed(6)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div >
  );
}
