import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CryptoState, CryptoAction, CoinSymbol } from '../types/crypto';

// Initial state
const initialState: CryptoState = {
  prices: {
    BTCUSDT: null,
    ETHUSDT: null,     //başlangıçta hepsi null
    BNBUSDT: null,
    ADAUSDT: null,
    DOTUSDT: null,
  },
  connectionStatus: 'Uninstantiated',  //websoxket bağlantı durumunu henüz kurulmadı yapıyoruz
  selectedCoin: 'BTCUSDT',  //varsayılan seçili coini bitcoin yaptık
  error: null,   //hata yok
  isLoading: false,   // yükleniyor durumu kapalı
};

// Context = crypto veri istasyonudur, içerdiği değerler de bu üçüdür
interface CryptoContextType {
  state: CryptoState;      //mevcut durum verileri
  dispatch: React.Dispatch<CryptoAction>;     //eylem gönderme fonksiyonu
  selectCoin: (symbol: CoinSymbol) => void;   //coin seçmek için yardımcı fonksiyon
}

// boş bir context oluşturuyoruz
const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

// Reducer function tanımladık, state ve action parametreleri alacak, state parametresinin tipine göre dönecek
function cryptoReducer(state: CryptoState, action: CryptoAction): CryptoState {
  switch (action.type) {
    case 'SET_CONNECTION_STATUS':
      return {
        ...state,   //mevcut state'i kopyala
        connectionStatus: action.payload,    //action durumunu güncelle
        error: action.payload === 'Open' ? null : state.error,
      };

    case 'UPDATE_PRICE':
      return {
        ...state,
        prices: {
          ...state.prices,
          [action.payload.symbol]: action.payload.price,  //sembolü action.payload.symbol olanın fiyatını güncellemek için
        },
        isLoading: false,
        error: null,
      };

    case 'SELECT_COIN':
      return {
        ...state,
        selectedCoin: action.payload,
        isLoading: true,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'RESET_STATE':
      return {
        ...initialState,
        selectedCoin: state.selectedCoin, // Keep selected coin
      };

    default:
      return state;
  }
}

// Provider component
interface CryptoProviderProps {
  children: ReactNode;
}

export const CryptoProvider: React.FC<CryptoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cryptoReducer, initialState);

  // Helper functions
  const selectCoin = (symbol: CoinSymbol) => {
    dispatch({ type: 'SELECT_COIN', payload: symbol });
  };

  // contexte gönderilecek değerleri paketliyor
  const value: CryptoContextType = {
    state,
    dispatch,   //State'i değiştirmek için action gönderen güvenli postacı
    selectCoin,
  };

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = (): CryptoContextType => {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};

export { CryptoContext };