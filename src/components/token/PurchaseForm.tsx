import React, { useState } from 'react';
import Button from '../ui/Button';

const PurchaseForm: React.FC = () => {
  const [ethAmount, setEthAmount] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // Current whitelist round rate
  const currentRate = 0.0015; // $ per TRASH token
  const ethPrice = 2500; // $ per ETH (example value)
  
  // Calculate TRASH tokens based on ETH amount
  const calculateTokens = (eth: string): string => {
    if (!eth || isNaN(parseFloat(eth))) return '0';
    
    const ethValue = parseFloat(eth);
    const dollarValue = ethValue * ethPrice;
    const tokens = dollarValue / currentRate;
    
    return tokens.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setIsConnected(true);
      return;
    }
    
    // Here would be the actual donation logic
    alert(`Thank you for your donation of ${ethAmount} ETH!`);
  };
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate">Current Round</span>
          <span className="text-sm font-medium text-forest">Whitelist</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-slate">Token Rate</span>
          <span className="text-sm font-medium text-forest">$0.0015 per $TRASH</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate">Min. Donation</span>
          <span className="text-sm font-medium text-forest">0.1 ETH</span>
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
            min="0.1"
            step="0.1"
            className="w-full p-2 border border-forest/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric"
            placeholder="0.0"
            required
          />
        </div>
        
        <div className="bg-forest/5 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-slate">You'll Receive</span>
            <span className="text-lg font-bold text-forest">{calculateTokens(ethAmount)} $TRASH</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate">USD Value</span>
            <span className="text-sm font-medium text-forest">
              ${ethAmount ? (parseFloat(ethAmount) * ethPrice).toLocaleString() : '0'}
            </span>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
        >
          {isConnected ? 'Make Donation' : 'Connect Wallet'}
        </Button>
        
        <p className="text-xs text-slate mt-3 text-center">
          By donating, you agree to our terms and acknowledge that you're receiving $TRASH tokens for in-game use only.
        </p>
      </form>
    </div>
  );
};

export default PurchaseForm;
