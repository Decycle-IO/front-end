import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import WalletConnectModal from '../ui/WalletConnectModal';
import { useTrashGenesis } from '../../hooks/useTrashGenesis';
import { formatUnits } from 'viem';
import { SalePhase } from '../../hooks/useTrashGenesis';
import { useAccount } from 'wagmi';
import { avalancheFuji } from '../../config/chains';

const PurchaseForm: React.FC = () => {
  const [ethAmount, setEthAmount] = useState<string>('0.01');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [calculatedTokens, setCalculatedTokens] = useState<string>('0');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Format number with K, M, B suffixes
  const formatNumberWithSuffix = (num: number, decimals: number = 1): string => {
    if (num === 0) return '0';
    
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    
    if (absNum >= 1e12) {
      return sign + (absNum / 1e12).toFixed(decimals) + 'T';
    } else if (absNum >= 1e9) {
      return sign + (absNum / 1e9).toFixed(decimals) + 'B';
    } else if (absNum >= 1e6) {
      return sign + (absNum / 1e6).toFixed(decimals) + 'M';
    } else if (absNum >= 1e3) {
      return sign + (absNum / 1e3).toFixed(decimals) + 'K';
    } else {
      return sign + absNum.toFixed(decimals);
    }
  };
  
  // Format token amount with suffix
  const formatTokenAmount = (tokenAmount: string): string => {
    if (!tokenAmount || tokenAmount === '0') return '0';
    
    try {
      const num = Number(formatUnits(BigInt(tokenAmount), 18));
      return formatNumberWithSuffix(num, 1);
    } catch (error) {
      console.error('Error formatting token amount:', error);
      return '0';
    }
  };
  
  const { isConnected } = useAccount();
  
  const {
    isContractDeployed,
    phaseInfo,
    ethPriceUSD,
    isWhitelistLoading,
    isPhaseInfoLoading,
    isEthPriceLoading,
    isWritePending,
    calculateTokenAmount,
    contribute,
    // Network status
    isCorrectNetwork,
    isNetworkSwitching,
    networkError,
    // Network functions
    switchToAvalancheFuji
  } = useTrashGenesis();
  
  // Calculate TRASH tokens based on ETH amount
  useEffect(() => {
    const getTokenAmount = async () => {
      if (!ethAmount || isNaN(parseFloat(ethAmount))) {
        setCalculatedTokens('0');
        return;
      }
      
      try {
        const tokens = await calculateTokenAmount(ethAmount);
        setCalculatedTokens(tokens);
      } catch (error) {
        console.error('Error calculating tokens:', error);
        setCalculatedTokens('0');
      }
    };
    
    getTokenAmount();
  }, [ethAmount, calculateTokenAmount]);
  
  
  // Get current phase name
  const getCurrentPhaseName = (): string => {
    if (!isContractDeployed) return 'Contract Not Deployed';
    if (!phaseInfo) return 'Loading...';
    
    switch (phaseInfo.phase) {
      case SalePhase.NotStarted:
        return 'Not Started';
      case SalePhase.Private:
        return 'Private';
      case SalePhase.Whitelist:
        return 'Whitelist';
      case SalePhase.Public:
        return 'Public';
      case SalePhase.Ended:
        return 'Ended';
      default:
        return 'Unknown';
    }
  };
  
  // Format token price
  const formatTokenPrice = (): string => {
    if (!phaseInfo) return '$0.0000';
    return `$${(Number(phaseInfo.tokenPrice) / 1e6).toFixed(4)}`;
  };
  
  // Format min contribution
  const formatMinContribution = (): string => {
    if (!phaseInfo) return '0.1 ETH';
    return `${formatUnits(phaseInfo.minContribution, 18)} ETH`;
  };
  
  // Calculate USD value
  const calculateUsdValue = (): string => {
    if (!ethAmount || isNaN(parseFloat(ethAmount)) || !ethPriceUSD) return '0';
    
    const ethValue = parseFloat(ethAmount);
    const dollarValue = ethValue * Number(formatUnits(ethPriceUSD, 8));
    
    return dollarValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  
  // Handle wallet connection
  const handleConnectWallet = () => {
    setIsModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setIsModalOpen(true);
      return;
    }
    
    try {
      setIsLoading(true);
      await contribute(ethAmount);
      setIsLoading(false);
    } catch (error) {
      console.error('Contribution error:', error);
      setIsLoading(false);
    }
  };
  
  const isDataLoading = isWhitelistLoading || isPhaseInfoLoading || isEthPriceLoading;
  const isNetworkLoading = isNetworkSwitching;
  
  // Render network action button
  const renderNetworkActionButton = () => {
    if (!isConnected) {
      return (
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </Button>
      );
    }
    
    if (!isCorrectNetwork) {
      return (
        <Button
          type="button"
          variant="primary"
          size="lg"
          fullWidth
          onClick={switchToAvalancheFuji}
          disabled={isNetworkSwitching}
        >
          {isNetworkSwitching ? 'Switching Network...' : `Switch to ${avalancheFuji.name}`}
        </Button>
      );
    }
    
    return (
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={isDataLoading || isLoading || isWritePending || isNetworkLoading}
      >
        {isLoading || isWritePending ? 'Processing...' : 'Make Donation'}
      </Button>
    );
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate">Current Round</span>
          <span className="text-sm font-medium text-forest">{getCurrentPhaseName()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate">Token Rate</span>
          <span className="text-sm font-medium text-forest">{formatTokenPrice()} per $TRASH</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate">Min. Donation</span>
          <span className="text-sm font-medium text-forest">{formatMinContribution()}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="ethAmount" className="block text-sm font-medium text-slate mb-1">
            Donation Amount (ETH)
          </label>
          <input
            type="number"
            id="ethAmount"
            value={ethAmount}
            onChange={(e) => setEthAmount(e.target.value)}
            min="0.01"
            max="5"
            step="0.01"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
              !isCorrectNetwork && isConnected 
                ? 'border-red-300 bg-red-50 text-red-500 cursor-not-allowed' 
                : 'border-forest/20 focus:ring-electric'
            }`}
            placeholder="0.0"
            required
            disabled={isDataLoading || isLoading || isWritePending || (!isCorrectNetwork && isConnected)}
          />
          {!isCorrectNetwork && isConnected && (
            <p className="text-xs text-red-600 mt-1">
              Input disabled - Switch to Avalanche Fuji to make donations
            </p>
          )}
        </div>
        
        <div className="bg-forest/5 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate">You'll Receive</span>
            <span className="text-lg font-bold text-forest">
              {isDataLoading ? 'Loading...' : `~${formatTokenAmount(calculatedTokens)} $TRASH`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate">USD Value</span>
            <span className="text-sm font-medium text-forest">
              ${isDataLoading ? 'Loading...' : calculateUsdValue()}
            </span>
          </div>
        </div>
        
        {/* Network status message */}
        {isConnected && !isCorrectNetwork && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800">
            <p className="font-medium">Network Change Required</p>
            <p>Please switch to Avalanche Fuji Testnet to make a donation.</p>
          </div>
        )}
        
        {/* Network error message */}
        {networkError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-sm text-red-800">
            <p className="font-medium">Network Error</p>
            <p>{networkError}</p>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              className="mt-2"
              onClick={switchToAvalancheFuji}
            >
              Try Again
            </Button>
          </div>
        )}
        
        {renderNetworkActionButton()}
        
        <p className="text-xs text-slate mt-3 text-center">
          By donating, you agree to our terms and acknowledge that you're receiving $TRASH tokens in exchange for in-game use.
        </p>
      </form>
      
      <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default PurchaseForm;
