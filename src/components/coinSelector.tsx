import React from 'react';
import {
  Button,
  ButtonGroup,
  Box,
  Text,
  Badge,
} from '@chakra-ui/react';
import type { CoinSymbol, CoinPrice } from '../types/crypto';

interface CoinSelectorProps {
  selectedCoin: CoinSymbol;
  onCoinSelect: (coin: CoinSymbol) => void;
  prices: Record<CoinSymbol, CoinPrice | null>;
  isLoading: boolean;
}

// Coin metadata
const COIN_INFO: Record<CoinSymbol, { name: string; symbol: string }> = {
  BTCUSDT: { name: 'Bitcoin', symbol: 'BTC' },
  ETHUSDT: { name: 'Ethereum', symbol: 'ETH' },
  BNBUSDT: { name: 'BNB', symbol: 'BNB' },
  ADAUSDT: { name: 'Cardano', symbol: 'ADA' },
  DOTUSDT: { name: 'Polkadot', symbol: 'DOT' },
};

// Format price for quick preview
const formatQuickPrice = (price: number): string => {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  if (price >= 1) {
    return `$${price.toFixed(2)}`;
  }
  return `$${price.toFixed(4)}`;
};

export const CoinSelector: React.FC<CoinSelectorProps> = ({
  selectedCoin,
  onCoinSelect,
  prices,
  isLoading,
}) => {
  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.200"
      rounded="lg"
      p={4}
      w="full"
      maxW="4xl"
    >
      <Text fontSize="lg" fontWeight="semibold" mb={4} textAlign="center" color="#e91e63">
        Select Cryptocurrency
      </Text>
      
      <ButtonGroup
        variant="outline"
        size="lg"
        w="full"
        flexWrap="wrap"
        justifyContent="center"
        gap={2}
      >
        {(Object.keys(COIN_INFO) as CoinSymbol[]).map((coin) => {
          const coinInfo = COIN_INFO[coin];
          const price = prices[coin];
          const isSelected = selectedCoin === coin;
          const hasPrice = price !== null;

          return (
            <Button
              key={coin}
              onClick={() => onCoinSelect(coin)}
              loading={isLoading && isSelected}
              bg={isSelected ? '#e91e63' : '#ff9a8b'}
              color="white"
              border="2px solid"
              borderColor={isSelected ? '#e91e63' : '#ff9a8b'}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
                bg: isSelected ? '#d81b60' : '#ff8a7a',
              }}
              size="lg"
              minW="140px"
              h="auto"
              py={3}
              px={4}
              flexDirection="column"
              position="relative"
              transition="all 0.2s"
              title={`${coinInfo.name} (${coinInfo.symbol})`}
            >
              {/* Coin Symbol */}
              <Text fontSize="lg" fontWeight="bold" lineHeight="1.2">
                {coinInfo.symbol}
              </Text>
              
              {/* Coin Name */}
              <Text fontSize="xs" opacity={0.8} lineHeight="1.2">
                {coinInfo.name}
              </Text>
              
              {/* Price Preview - Only show for selected */}
              {hasPrice && price && isSelected && (
                <Text fontSize="sm" fontWeight="semibold" mt={1}>
                  {formatQuickPrice(price.price)}
                </Text>
              )}
              
              {/* Change Badge - Only show for selected */}
              {hasPrice && price && isSelected && (
                <Badge
                  size="sm"
                  colorScheme={price.change >= 0 ? 'green' : 'red'}
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  fontSize="10px"
                  borderRadius="full"
                  px={2}
                >
                  {price.change >= 0 ? '+' : ''}{price.changePercent.toFixed(1)}%
                </Badge>
              )}
              
              {/* Selection Indicator */}
              {isSelected && (
                <Box
                  position="absolute"
                  bottom="-2px"
                  left="50%"
                  transform="translateX(-50%)"
                  w="6px"
                  h="6px"
                  bg="#e91e63"
                  borderRadius="full"
                />
              )}
            </Button>
          );
        })}
      </ButtonGroup>
      
      {/* Additional Info */}
      <Text fontSize="xs" color="white" opacity={0.8} textAlign="center" mt={4}>
        Click on any cryptocurrency to view real-time price data
      </Text>
    </Box>
  );
};