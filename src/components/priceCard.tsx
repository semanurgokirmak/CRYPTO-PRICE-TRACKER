import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
} from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import type { CoinPrice, ConnectionStatus } from '../types/crypto';

interface PriceCardProps {
  price: CoinPrice | null;
  connectionStatus: ConnectionStatus;
  error: string | null;
  isLoading: boolean;
  onReconnect: () => void;
}

// Ffiyatları formatlamak için, ondalık basamak sayısını ayarlıyoruz
const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return price.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 8,
  });
};

// 24 saatlik işlem hacmi değerini formatlamak için, K, M, B gibi kısaltmalar kullanıyoruz
const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(2)}B`;
  }
  if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(2)}M`;
  }
  if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)}K`;
  }
  return volume.toFixed(2);
};

// Bağlantı durumuna göre renk belirlemek için, durumun tipine göre renk döndürüyoruz
const getStatusColor = (status: ConnectionStatus): string => {
  switch (status) {
    case 'Open':
      return 'green';
    case 'Connecting':
      return 'yellow';
    case 'Closed':
    case 'Closing':
      return 'red';
    default:
      return 'gray';
  }
};

export const PriceCard: React.FC<PriceCardProps> = ({
  price,
  connectionStatus,
  error,
  isLoading,
  onReconnect,
}) => {
  // hata durumu
  if (error) {
    return (
      <Box maxW={{ base: "none", md: "md" }} w="full">
        <Box
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="lg"
          p={4}
        >
          <Text color="red.800" fontWeight="bold" mb={2}>
            Connection Error!
          </Text>
          <Text color="red.700" fontSize="sm">
            {error}
          </Text>
        </Box>
        <Button
          mt={4}
          colorScheme="red"
          variant="outline"
          onClick={onReconnect}
          w="full"
        >
          Retry Connection
        </Button>
      </Box>
    );
  }

  return (
    <Box
      maxW={{ base: "none", md: "md" }}
      w="full"
      bg="white"
      boxShadow="xl"
      rounded="lg"
      p={6}
      border="1px"
      borderColor="gray.200"
    >
      {/* Header with symbol and status */}
      <HStack justify="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color="gray.700">
          {price?.symbol || 'Loading...'}
        </Text>
        <Badge colorScheme={getStatusColor(connectionStatus)} variant="subtle">
          {connectionStatus}
        </Badge>
      </HStack>

      {/* Main price display */}
      <VStack gap={4} align="stretch">
        <Box>
          <Text fontSize="sm" color="gray.500" mb={1}>
            Current Price (USDT)
          </Text>
          {!isLoading && price !== null ? (
            <Text fontSize="3xl" fontWeight="bold" color="blue.500">
              ${price ? formatPrice(price.price) : '0.00'}
            </Text>
          ) : (
            <Box bg="gray.200" h="12" borderRadius="md" />
          )}
          {price && (
            <HStack mt={2}>
              <Text
                fontSize="sm"
                color={price.change >= 0 ? 'green.500' : 'red.500'}
                fontWeight="semibold"
              >
                {price.change >= 0 ? '↗' : '↘'} {price.changePercent.toFixed(2)}% (${Math.abs(price.change).toFixed(4)})
              </Text>
            </HStack>
          )}
        </Box>

        {/* 24h Stats */}
        {price && (
          <HStack justify="space-between" gap={4}>
            <Box flex={1}>
              <Text fontSize="sm" color="gray.500">
                24h High
              </Text>
              <Text fontWeight="semibold" color="green.500">
                ${formatPrice(price.high24h)}
              </Text>
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" color="gray.500">
                24h Low
              </Text>
              <Text fontWeight="semibold" color="red.500">
                ${formatPrice(price.low24h)}
              </Text>
            </Box>
          </HStack>
        )}

        {/* Volume */}
        {price && (
          <Box>
            <Text fontSize="sm" color="gray.500">
              24h Volume
            </Text>
            <Text fontWeight="semibold">
              {formatVolume(price.volume)} {price.symbol.replace('USDT', '')}
            </Text>
          </Box>
        )}

        {/* Last update */}
        {price && (
          <Text fontSize="xs" color="gray.400" textAlign="center">
            Last updated {formatDistanceToNow(price.lastUpdate)} ago
          </Text>
        )}
      </VStack>
    </Box>
  );
};