// WebSocket bağlantı durumları
export type ConnectionStatus = 'Connecting' | 'Open' | 'Closing' | 'Closed' | 'Uninstantiated';

// Binance WebSocket ticker yanıtı
export interface BinanceTickerData {
  e: string;          // Event type (24hrTicker)
  E: number;          // Event time
  s: string;          // Symbol (BTCUSDT)
  p: string;          // Price change
  P: string;          // Price change percent
  w: string;          // Weighted average price
  x: string;          // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string;          // Last price
  Q: string;          // Last quantity
  b: string;          // Best bid price
  B: string;          // Best bid quantity
  a: string;          // Best ask price
  A: string;          // Best ask quantity
  o: string;          // Open price
  h: string;          // High price
  l: string;          // Low price
  v: string;          // Total traded base asset volume
  q: string;          // Total traded quote asset volume
  O: number;          // Statistics open time
  C: number;          // Statistics close time
  F: number;          // First trade ID
  L: number;          // Last trade Id
  n: number;          // Total count of trades
}

// Binanceden gelen ham verinin formatlamış halleri
export interface CoinPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  lastUpdate: Date;
}

// Desteklenen coin sembolleri
export type CoinSymbol = 'BTCUSDT' | 'ETHUSDT' | 'BNBUSDT' | 'ADAUSDT' | 'DOTUSDT';

// Context state
export interface CryptoState {
  prices: Record<CoinSymbol, CoinPrice | null>;
  connectionStatus: ConnectionStatus;
  selectedCoin: CoinSymbol;
  error: string | null;
  isLoading: boolean;
}

// Context actions
export type CryptoAction =
  | { type: 'SET_CONNECTION_STATUS'; payload: ConnectionStatus }
  | { type: 'UPDATE_PRICE'; payload: { symbol: CoinSymbol; price: CoinPrice } }
  | { type: 'SELECT_COIN'; payload: CoinSymbol }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_STATE' };

// Hook return type
export interface UseCryptoWebSocketReturn {
  price: CoinPrice | null;
  connectionStatus: ConnectionStatus;
  error: string | null;
  isLoading: boolean;
  reconnect: () => void;
}