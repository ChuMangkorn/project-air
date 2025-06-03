'use client';

import { useState, useEffect } from 'react';

interface KlineData {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface PriceChartProps {
  symbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ symbol }) => {
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(true);
  // เปลี่ยนจาก interval เป็น timeInterval
  const [timeInterval, setTimeInterval] = useState('1h');

  useEffect(() => {
    const fetchKlineData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeInterval}&limit=24`
        );
        const data = await response.json();
        
        const formattedData: KlineData[] = data.map((item: any[]) => ({
          openTime: item[0],
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4],
          volume: item[5],
        }));
        
        setKlineData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching kline data:', error);
        setLoading(false);
      }
    };

    fetchKlineData();
    // ใช้ window.setInterval เพื่อให้ชัดเจนว่าเรียกฟังก์ชันจาก global scope
    const intervalId = window.setInterval(fetchKlineData, 60000);

    // แก้ไขการ cleanup
    return () => {
      window.clearInterval(intervalId);
    };
  }, [symbol, timeInterval]); // เปลี่ยน interval เป็น timeInterval

  // แก้ไขการคำนวณ maxPrice และ minPrice
  const maxPrice = klineData.length > 0 
    ? Math.max(...klineData.map(d => parseFloat(d.high)))
    : 0;
  const minPrice = klineData.length > 0 
    ? Math.min(...klineData.map(d => parseFloat(d.low)))
    : 0;
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {symbol} Price Chart
        </h3>
        <select
          value={timeInterval}
          onChange={(e) => setTimeInterval(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          <option value="1m">1m</option>
          <option value="5m">5m</option>
          <option value="15m">15m</option>
          <option value="1h">1h</option>
          <option value="4h">4h</option>
          <option value="1d">1d</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : klineData.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
      ) : (
        <div className="h-64 flex items-end space-x-1">
          {klineData.map((candle, index) => {
            const open = parseFloat(candle.open);
            const close = parseFloat(candle.close);
            const high = parseFloat(candle.high);
            const low = parseFloat(candle.low);
            
            const isGreen = close > open;
            const bodyHeight = Math.abs(close - open) / priceRange * 200;
            const wickTop = (high - Math.max(open, close)) / priceRange * 200;
            const wickBottom = (Math.min(open, close) - low) / priceRange * 200;
            
            return (
              <div key={index} className="flex flex-col items-center" style={{ width: '100%' }}>
                <div 
                  className="w-0.5 bg-gray-400"
                  style={{ height: `${Math.max(wickTop, 0)}px` }}
                />
                <div
                  className={`w-3 ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ height: `${Math.max(bodyHeight, 1)}px` }}
                />
                <div 
                  className="w-0.5 bg-gray-400"
                  style={{ height: `${Math.max(wickBottom, 0)}px` }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PriceChart;
