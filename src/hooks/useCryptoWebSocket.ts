import { useEffect, useCallback, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useCrypto } from '../context/cryptoContext';
import type { 
  BinanceTickerData, 
  CoinPrice, 
  CoinSymbol, 
  ConnectionStatus,
  UseCryptoWebSocketReturn 
} from '../types/crypto';

// Connection status mapping
//readyState değerini alıyor, statusMapten o değere karşılık gelen stringi döndürüyor
const getConnectionStatus = (readyState: ReadyState): ConnectionStatus => {
  const statusMap: Record<ReadyState, ConnectionStatus> = {
    [ReadyState.CONNECTING]: 'Connecting', 
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  };
  return statusMap[readyState];
};

//Binance WebSocket'ten gelen veri tamamen string formatında ama bazılarının tipini değiştirip matematiksel işlem yapmamız gerekiyor
const parseBinanceData = (data: BinanceTickerData): CoinPrice => {
  return {
    symbol: data.s,
    price: parseFloat(data.c),
    change: parseFloat(data.p),
    changePercent: parseFloat(data.P),
    high24h: parseFloat(data.h),
    low24h: parseFloat(data.l),
    volume: parseFloat(data.v),
    lastUpdate: new Date(),
  };
};

//  seçtiğimiz coini alır, binance'a bağlanır ve sürekli veri akışını başlatır
const createWebSocketUrl = (symbol: CoinSymbol): string => {
  return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
};

export const useCryptoWebSocket = (symbol: CoinSymbol): UseCryptoWebSocketReturn => {
  const { state, dispatch } = useCrypto();  // contextten state ve dispatch fonksiyonlarını alıyoruz
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);  //yeniden bağlanma için bir timeout referansı oluşturduk
  const prevSymbolRef = useRef<CoinSymbol>(symbol);
  const lastDataTimeRef = useRef<number>(Date.now()); // Son veri gelme zamanı

  // seçili coin için websocket URL hazırlıyoruz
  const socketUrl = createWebSocketUrl(symbol);

  // Symbol değiştiğinde eski bağlantıyı temizle
  useEffect(() => {
    if (prevSymbolRef.current !== symbol) {
      console.log(`Symbol changed from ${prevSymbolRef.current} to ${symbol}`);
      dispatch({ type: 'SET_LOADING', payload: true });
      prevSymbolRef.current = symbol;
    }
  }, [symbol, dispatch]);

  // WebSocket connection
  const {
    lastMessage, // binanceden gelen son veri-mesaj
    readyState,    // WebSocket'in mevcut durumu. open closing closed gibi değerler alabilir
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => {    //binance'a bağlandığımızda tetiklenir
      console.log(`WebSocket connected to ${symbol}`);
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Open' });    //globaldeki state durumunu open yapar
      dispatch({ type: 'SET_ERROR', payload: null });  // hata mesajını temizler
      dispatch({ type: 'SET_LOADING', payload: false }); // yükleniyor durumunu kapatır
      
      //Eğer önceden ayarlanmış bir yeniden bağlanma timer'ı varsa onu iptal ediyoruz çünkü artık bağlıyız
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    },
    onClose: () => {
      console.log(`WebSocket disconnected from ${symbol}`);
    },
    onError: (event) => {
      console.error('WebSocket error:', event);
      dispatch({ type: 'SET_ERROR', payload: 'WebSocket connection error' });  //state'e hata mesajını veriyor
      dispatch({ type: 'SET_LOADING', payload: false });
    },
    shouldReconnect: (closeEvent) => {
      return closeEvent.code !== 1000;  //kapanma kodu 1000 değilse yeniden bağlan
    },
    reconnectAttempts: 10,  // yeniden bağlanma denemesi sayısı
    reconnectInterval: 3000, // yeniden bağlanma denemeleri arasındaki süre
  });

  // bu fonksiyon özetle Binance'tan gelen her mesajı alıyor, doğruluyor, temizliyor ve uygulama state'ine kaydediyor. Böylece ekrandaki fiyatlar gerçek zamanlı güncelleniyor.
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data: BinanceTickerData = JSON.parse(lastMessage.data);
        
        if (data.e === '24hrTicker' && data.s === symbol) {
          const priceData = parseBinanceData(data);
          
          // Veri geldi - bağlantı açık ve timestamp güncelle
          lastDataTimeRef.current = Date.now();
          dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'Open' });
          dispatch({ type: 'SET_ERROR', payload: null });
          dispatch({ type: 'SET_LOADING', payload: false });
          
          //global statedeki fiyat bilgisini vs. güncelliyoruz
          dispatch({
            type: 'UPDATE_PRICE',
            payload: {
              symbol: symbol,
              price: priceData,
            },
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Error parsing price data' });
      }
    }
  }, [lastMessage, symbol, dispatch]);

  // sadece Connecting için durumunda loading oluyor
  useEffect(() => {
    const status = getConnectionStatus(readyState);
    
    //eğer durum Connecting ise, yükleniyor durumunu aç ve durumu güncelle
    if (status === 'Connecting') {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
    }
  }, [readyState, dispatch]);

  // Manual reconnect fonksiyonu
  const reconnect = useCallback(() => {
    const ws = getWebSocket();   
    if (ws) {
      ws.close();
    }
  }, [getWebSocket]);

  //başka bir coin seçildiğinde veya component unmount olduğunda WebSocket'i temizle
  useEffect(() => {
    return () => {
      console.log(`Cleaning up WebSocket for ${symbol}`);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [symbol]);

  return {
    price: state.prices[symbol],
    connectionStatus: state.connectionStatus,
    error: state.error,
    isLoading: state.isLoading,
    reconnect,
  };
};