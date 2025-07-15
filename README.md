# Crypto Price Tracker 🚀

Real-time kripto para fiyat takip uygulaması. Binance WebSocket API kullanarak Bitcoin, Ethereum, BNB, Cardano ve Polkadot fiyatlarını gerçek zamanlı olarak görüntüler.

## 🛠️ Teknolojiler

- **React 19** + **TypeScript**
- **Chakra UI v3** - Modern UI komponenleri
- **Vite** - Hızlı build tool
- **react-use-websocket** - WebSocket yönetimi
- **Binance WebSocket API** - Real-time veri kaynağı

## 📁 Proje Yapısı

```
src/
├── components/           # UI Bileşenleri
│   ├── coinSelector.tsx  # Coin seçim butonları
│   └── priceCard.tsx     # Fiyat gösterim kartı
├── context/              # Global State
│   └── cryptoContext.tsx # Context + Reducer
├── hooks/                # Custom Hook'lar
│   └── useCryptoWebSocket.ts # WebSocket yönetimi
├── types/                # TypeScript Tipleri
│   └── crypto.ts         # Interface tanımları
├── App.tsx              # Ana component
└── main.tsx             # Giriş noktası
```

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
```

## 💡 Özellikler

✅ **Real-time Updates** - Kesintisiz fiyat güncellemeleri  
✅ **Auto-reconnection** - Bağlantı koptuğunda otomatik yeniden bağlanma  
✅ **Memory Leak Prevention** - Cleanup fonksiyonları ile güvenli kaynak yönetimi  
✅ **Error Handling** - Kapsamlı hata yönetimi  
✅ **Responsive Design** - Mobil ve desktop uyumlu  
✅ **TypeScript** - Tip güvenliği  

## 🎯 Desteklenen Coinler

- **BTC/USDT** - Bitcoin
- **ETH/USDT** - Ethereum  
- **BNB/USDT** - BNB
- **ADA/USDT** - Cardano
- **DOT/USDT** - Polkadot

## 🔧 Teknik Detaylar

### WebSocket Yönetimi
- Binance WebSocket API entegrasyonu
- Custom hook ile bağlantı soyutlaması
- Automatic reconnection strategy

### State Management
- React Context API kullanımı
- useReducer pattern ile complex state updates
- Global state için centralized management

### Performance
- Efficient re-render optimization
- Memory leak prevention
- Cleanup functions for WebSocket connections

## 📊 Gösterilen Veriler

- **Güncel Fiyat** (USDT)
- **24h Değişim** (miktar ve %)
- **24h Yüksek/Düşük**
- **24h Volume**
- **Son Güncelleme Zamanı**

