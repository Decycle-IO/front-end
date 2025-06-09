import { useCallback, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { networkConfig } from '../../contracts.config';
import { useContracts } from './useContracts';

// Define Ethereum provider type
type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
};

export const useAuth = () => {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { refetchAll } = useContracts();
  
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is on the correct network
  useEffect(() => {
    if (isConnected && chainId) {
      setIsCorrectNetwork(chainId === networkConfig.chainId);
    } else {
      setIsCorrectNetwork(false);
    }
  }, [isConnected, chainId]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      await connect({ connector: injected() });
      refetchAll();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  }, [connect, refetchAll]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  }, [disconnect]);

  // Switch network
  const switchNetwork = useCallback(async () => {
    const ethereum = window.ethereum as EthereumProvider | undefined;
    
    if (!ethereum) {
      alert('Please install MetaMask to use this feature');
      return;
    }

    setIsLoading(true);
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkConfig.chainId.toString(16)}` }],
      });
    } catch (switchError: unknown) {
      // This error code indicates that the chain has not been added to MetaMask
      if (typeof switchError === 'object' && switchError !== null && 'code' in switchError && switchError.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${networkConfig.chainId.toString(16)}`,
                chainName: networkConfig.name,
                rpcUrls: [networkConfig.rpcUrl],
                blockExplorerUrls: [networkConfig.blockExplorer],
                nativeCurrency: {
                  name: 'AVAX',
                  symbol: 'AVAX',
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      } else {
        console.error('Error switching network:', switchError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format address for display
  const formatAddress = useCallback((addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  return {
    address,
    isConnected,
    isCorrectNetwork,
    isLoading,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    formatAddress,
  };
};
