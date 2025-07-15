import React from 'react';
import {
  Box,
  VStack,
  Container,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';
import { CryptoProvider, useCrypto } from './context/cryptoContext';
import { useCryptoWebSocket } from './hooks/useCryptoWebSocket';
import { PriceCard } from './components/priceCard';
import { CoinSelector } from './components/coinSelector';
import type { CoinSymbol } from './types/crypto';

// Main dashboard component (inside CryptoProvider)
const CryptoDashboard: React.FC = () => {
  const { state, selectCoin } = useCrypto();
  const { selectedCoin } = state;
  
  // WebSocket connection for selected coin
  const {
    price,
    connectionStatus,
    error,
    isLoading,
    reconnect,
  } = useCryptoWebSocket(selectedCoin);

  const handleCoinSelect = (coin: CoinSymbol) => {
    if (coin !== selectedCoin) {
      selectCoin(coin);
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg="linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #f33f99ff 100%)"
      w="100vw" 
      display="flex" 
      justifyContent="center"
    >
      <Container maxW="6xl" py={{ base: 4, md: 6 }} px={{ base: 4, md: 8 }} w="full">
        <VStack gap={{ base: 4, md: 6 }} align="center">
          {/* Header */}
          <Box textAlign="center" mb={{ base: 2, md: 3 }}>
            <Heading
              
              size="4xl"
              color="white"
              fontWeight="600"
              letterSpacing="tight"
              textShadow="0 2px 4px rgba(0,0,0,0.2)"
            >
              Crypto Price Tracker
            </Heading>
          </Box>

          {/* Coin Selector */}
          <CoinSelector
            selectedCoin={selectedCoin}
            onCoinSelect={handleCoinSelect}
            prices={state.prices}
            isLoading={isLoading}
          />

          {/* Price Display */}
          <Flex
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 4, md: 6, lg: 8 }}
            w="full"
            justify="center"
            align="stretch"
          >
            {/* Main Price Card */}
            <Box flex="1" w={{ base: "100%", md: "auto" }} maxW={{ base: "none", md: "md" }} mx={{ base: "0", md: "0" }}>
              <PriceCard
                price={price}
                connectionStatus={connectionStatus}
                error={error}
                isLoading={isLoading}
                onReconnect={reconnect}
              />
            </Box>

            {/* Connection Info & Stats */}
            <Box
              flex="1"
              w={{ base: "100%", md: "auto" }}
              maxW={{ base: "none", md: "md" }}
              mx={{ base: "0", md: "0" }}
              bg="white"
              rounded="lg"
              p={6}
              border="1px"
              borderColor="gray.200"
            >
              <Heading size="md" mb={4} color="gray.700">
                Connection Info
              </Heading>
              
              <VStack gap={3} align="stretch">
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Selected Pair
                  </Text>
                  <Text fontWeight="semibold" fontSize="lg">
                    {selectedCoin}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    WebSocket Status
                  </Text>
                  <Text
                    fontWeight="semibold"
                    color={
                      connectionStatus === 'Open'
                        ? 'green.500'
                        : connectionStatus === 'Connecting'
                        ? 'yellow.500'
                        : 'red.500'
                    }
                  >
                    {connectionStatus}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Data Source
                  </Text>
                  <Text fontWeight="semibold">
                    Binance WebSocket API
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Update Frequency
                  </Text>
                  <Text fontWeight="semibold">
                    Real-time (~1-2s)
                  </Text>
                </Box>

                {error && (
                  <Box
                    bg="red.50"
                    border="1px"
                    borderColor="red.200"
                    rounded="md"
                    p={3}
                    mt={2}
                  >
                    <Text fontSize="sm" color="red.700">
                      <strong>Error:</strong> {error}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

// Main App component with providers
const App: React.FC = () => {
  return (
    <CryptoProvider>
      <CryptoDashboard />
    </CryptoProvider>
  );
};

export default App;