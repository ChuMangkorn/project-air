export interface BinanceTradeData {
  e: string;        // Event type
  E: number;        // Event time
  s: string;        // Symbol
  t: number;        // Trade ID
  p: string;        // Price
  q: string;        // Quantity
  b: number;        // Buyer order ID
  a: number;        // Seller order ID
  T: number;        // Trade time
  m: boolean;       // Is the buyer the market maker?
  M: boolean;       // Ignore
}

export interface TradeDisplay {
  id: number;
  symbol: string;
  price: number;
  quantity: number;
  time: Date;
  isBuyerMaker: boolean;
}

export interface TickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  volume: string;
}
