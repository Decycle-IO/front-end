import { useCallback, useEffect, useState } from 'react';
import { useReadContract, useWriteContract, useAccount, useChainId, useSwitchChain } from 'wagmi';
import { contractAddresses, trashGenesisABI } from '../config/contracts';
import { parseEther } from 'viem';
import toast from 'react-hot-toast';
import { avalancheFuji } from '../config/chains';

// Define the sale phase enum to match the contract
export const SalePhase = {
  NotStarted: 0,
  Private: 1,
  Whitelist: 2,
  Public: 3,
  Ended: 4
} as const;

export type SalePhase = typeof SalePhase[keyof typeof SalePhase];

// Define the phase configuration type
export interface PhaseConfig {
  tokenPrice: bigint;
  hardCap: bigint;
  minContribution: bigint;
  maxContribution: bigint;
  startTime: bigint;
  endTime: bigint;
}

// Define the current phase info type
export interface CurrentPhaseInfo {
  phase: SalePhase;
  tokenPrice: bigint;
  hardCap: bigint;
  raised: bigint;
  startTime: bigint;
  endTime: bigint;
  minContribution: bigint;
  maxContribution: bigint;
}

// Define the sale stats type
export interface SaleStats {
  totalRaised: bigint;
  totalSold: bigint;
  totalUsers: bigint;
}

// Define the user contributions type
export interface UserContributions {
  privateContribution: bigint;
  whitelistContribution: bigint;
  publicContribution: bigint;
  totalContribution: bigint;
}

export const useTrashGenesis = () => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  
  // Network state
  const [networkError, setNetworkError] = useState<string | null>(null);
  
  // Check if contract is deployed
  const isContractDeployed = contractAddresses.trashGenesis !== "0x0000000000000000000000000000000000000000";
  
  // Check if user is on the correct network
  const isCorrectNetwork = chainId === avalancheFuji.id;

  // Check if user is whitelisted
  const { data: isWhitelisted, isLoading: isWhitelistLoading, refetch: refetchWhitelist } = useReadContract({
    address: contractAddresses.trashGenesis as `0x${string}`,
    abi: trashGenesisABI,
    functionName: 'whitelist',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Get current phase info
  const { data: phaseInfoData, isLoading: isPhaseInfoLoading, refetch: refetchPhaseInfo } = useReadContract({
    address: contractAddresses.trashGenesis as `0x${string}`,
    abi: trashGenesisABI,
    functionName: 'getCurrentPhaseInfo',
  });
  
  // Get current phase directly from phaseInfoData
  const currentPhase = phaseInfoData ? (phaseInfoData as readonly [number, ...unknown[]])[0] : undefined;

  // Get sale stats
  const { data: saleStatsData, isLoading: isSaleStatsLoading, refetch: refetchSaleStats } = useReadContract({
    address: contractAddresses.trashGenesis as `0x${string}`,
    abi: trashGenesisABI,
    functionName: 'getSaleStats',
  });

  // Get user contributions
  const { data: userContributionsData, isLoading: isUserContributionsLoading, refetch: refetchUserContributions } = useReadContract({
    address: contractAddresses.trashGenesis as `0x${string}`,
    abi: trashGenesisABI,
    functionName: 'getUserContributions',
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Get ETH price in USD
  const { data: ethPriceUSD, isLoading: isEthPriceLoading, refetch: refetchEthPrice } = useReadContract({
    address: contractAddresses.trashGenesis as `0x${string}`,
    abi: trashGenesisABI,
    functionName: 'ethPriceUSD',
  });

  // Calculate token amount based on ETH amount
  const calculateTokenAmount = useCallback(
    async (ethAmount: string) => {
      if (!isContractDeployed || !ethAmount || isNaN(parseFloat(ethAmount)) || !phaseInfoData) return '0';

      try {
        // Get the current token price from phaseInfo
        const typedData = phaseInfoData as [
          number,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint,
          bigint
        ];
        
        const [, tokenPrice] = typedData;
        
        // Convert ETH to wei (1 ETH = 10^18 wei)
        const ethAmountWei = parseEther(ethAmount);
        
        // Calculate token amount: (ethAmount * 10^6) / tokenPrice
        // tokenPrice is in USD per token with 6 decimals (e.g., $0.01 = 10000)
        // We need to convert ETH to USD first using ethPriceUSD
        if (!ethPriceUSD) return '0';
        
        // ethPriceUSD is in USD with 8 decimals (e.g., $2000 = 200000000000)
        // Calculate USD value: ethAmount * ethPriceUSD / 10^8
        const ethPriceUSDValue = ethPriceUSD as bigint;
        const usdValue = (ethAmountWei * ethPriceUSDValue) / BigInt(10 ** 8);
        
        // Calculate token amount: usdValue * 10^6 / tokenPrice
        const tokenAmount = (usdValue * BigInt(10 ** 6)) / tokenPrice;
        
        return tokenAmount.toString();
      } catch (error) {
        console.error('Error calculating token amount:', error);
        return '0';
      }
    },
    [phaseInfoData, ethPriceUSD, isContractDeployed]
  );

  // Switch to Avalanche Fuji network
  const switchToAvalancheFuji = useCallback(() => {
    try {
      switchChain({ chainId: avalancheFuji.id });
      toast.success(`Switching to ${avalancheFuji.name}`);
    } catch (error) {
      console.error('Error switching chain:', error);
      setNetworkError(`Failed to switch to ${avalancheFuji.name}. Please try manually.`);
      toast.error('Network switch failed');
    }
  }, [switchChain]);

  // Reset network errors when chain changes
  useEffect(() => {
    setNetworkError(null);
  }, [chainId]);

  // Contribute to the sale
  const contribute = useCallback(
    async (amount: string) => {
      if (!isContractDeployed) {
        toast.error('Contract not deployed');
        return;
      }
      
      if (!isConnected || !address) {
        toast.error('Please connect your wallet');
        return;
      }

      let realTimeChainId: number;
      try {
        if (window.ethereum) {
          const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          realTimeChainId = parseInt(chainIdHex, 16);
        } else {
          throw new Error('No ethereum provider found');
        }
      } catch (error) {
        console.error('Failed to get real-time chain ID:', error);
        toast.error('Failed to verify network. Please try again.');
        return;
      }

      // Auto-switch network if needed
      if (realTimeChainId !== avalancheFuji.id || !isCorrectNetwork || chainId !== avalancheFuji.id) {
        try {
          await switchChain({ chainId: avalancheFuji.id });
          // Wait a moment for the network switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Re-verify the chain after switch
          const newChainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
          const newChainId = parseInt(newChainIdHex, 16);
          
          if (newChainId !== avalancheFuji.id) {
            return;
          }
        } catch (error) {
          console.error('Failed to switch network:', error);
          return;
        }
      }

      try {
        const parsedAmount = parseEther(amount);
        
        const tx = await writeContractAsync({
          address: contractAddresses.trashGenesis as `0x${string}`,
          abi: trashGenesisABI,
          functionName: 'contribute',
          value: parsedAmount,
        });

        toast.success('Contribution successful');
        
        // Refetch data
        refetchWhitelist();
        refetchPhaseInfo();
        refetchSaleStats();
        refetchUserContributions();
        refetchEthPrice();
        
        return tx;
      } catch (error) {
        console.error('Contribution error:', error);
        toast.error('Contribution failed');
        throw error;
      }
    },
    [
      isContractDeployed,
      isConnected,
      address,
      isCorrectNetwork,
      chainId,
      switchChain,
      writeContractAsync,
      refetchWhitelist,
      refetchPhaseInfo,
      refetchSaleStats,
      refetchUserContributions,
      refetchEthPrice
    ]
  );

  // Format phase info data
  const formatPhaseInfo = useCallback((data: unknown): CurrentPhaseInfo | null => {
    if (!data) return null;
    
    const typedData = data as [
      number,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint
    ];
    
    const [phase, tokenPrice, hardCap, raised, startTime, endTime, minContribution, maxContribution] = typedData;
    
    return {
      phase: phase as SalePhase,
      tokenPrice,
      hardCap,
      raised,
      startTime,
      endTime,
      minContribution,
      maxContribution
    };
  }, []);

  // Format sale stats data
  const formatSaleStats = useCallback((data: unknown): SaleStats | null => {
    if (!data) return null;
    
    const typedData = data as [bigint, bigint, bigint];
    const [totalRaised, totalSold, totalUsers] = typedData;
    
    return {
      totalRaised,
      totalSold,
      totalUsers
    };
  }, []);

  // Format user contributions data
  const formatUserContributions = useCallback((data: unknown): UserContributions | null => {
    if (!data) return null;
    
    const typedData = data as [
      bigint,
      bigint,
      bigint,
      bigint
    ];
    
    const [privateContribution, whitelistContribution, publicContribution, totalContribution] = typedData;
    
    return {
      privateContribution,
      whitelistContribution,
      publicContribution,
      totalContribution
    };
  }, []);

  // Refetch all data
  const refetchAll = useCallback(() => {
    refetchWhitelist();
    refetchPhaseInfo();
    refetchSaleStats();
    if (isConnected && address) {
      refetchUserContributions();
    }
    refetchEthPrice();
  }, [
    refetchWhitelist,
    refetchPhaseInfo,
    refetchSaleStats,
    refetchUserContributions,
    refetchEthPrice,
    isConnected,
    address
  ]);

  return {
    // Data
    isContractDeployed,
    currentPhase: currentPhase as SalePhase | undefined,
    isWhitelisted: !!isWhitelisted,
    phaseInfo: formatPhaseInfo(phaseInfoData),
    saleStats: formatSaleStats(saleStatsData),
    userContributions: formatUserContributions(userContributionsData),
    ethPriceUSD: ethPriceUSD as bigint,
    
    // Network status
    isCorrectNetwork,
    isNetworkSwitching: isSwitchingChain,
    networkError,
    chainId,
    
    // Loading states
    isWhitelistLoading,
    isPhaseInfoLoading,
    isSaleStatsLoading,
    isUserContributionsLoading,
    isEthPriceLoading,
    isWritePending,
    
    // Network functions
    switchToAvalancheFuji,
    
    // Contract functions
    calculateTokenAmount,
    contribute,
    refetchAll,
    
    // Refetch functions
    refetchWhitelist,
    refetchPhaseInfo,
    refetchSaleStats,
    refetchUserContributions,
    refetchEthPrice,
  };
};
