import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { avalancheFuji } from '../config/chains';
import { networkConfig } from '../config/contracts';
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// App metadata for wallet connections
const appInfo = {
  appName: 'Garbage DApp',
  description: 'Gamified Recycling System DApp',
  iconUrl: `${window.location.origin}/Decycle Logo (1).png`,
};

// Create a Wagmi config
const config = createConfig({
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http(networkConfig.rpcUrl),
  },
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: appInfo.appName,
    }),
    injected(),
  ],
});

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
