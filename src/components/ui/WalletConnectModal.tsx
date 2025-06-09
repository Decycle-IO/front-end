import React, { useState } from 'react';
import { useConnect } from 'wagmi';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { connect, connectors, isPending } = useConnect();
  const [connectingId, setConnectingId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Get specific connectors
  const metaMaskConnector = connectors.find(c => c.id === 'metaMask');
  const coinbaseWalletConnector = connectors.find(c => c.id === 'coinbaseWallet');
  const injectedConnector = connectors.find(c => c.id === 'injected');
  
  // Handle wallet connection
  const handleConnect = (connector: typeof metaMaskConnector) => {
    if (connector) {
      setConnectingId(connector.id);
      try {
        connect({ connector });
        onClose();
      } catch (error: unknown) {
        console.error('Connection error:', error);
      } finally {
        setConnectingId(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-forest mb-6">Connect Wallet</h2>
        
        <div className="space-y-4">
          {/* MetaMask */}
          {metaMaskConnector && (
            <button
              onClick={() => handleConnect(metaMaskConnector)}
              disabled={isPending || connectingId === 'metaMask'}
              className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-forest/5 transition-colors"
            >
              <div className="flex items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-8 h-8 mr-3" />
                <span className="font-medium">MetaMask</span>
              </div>
              {(isPending || connectingId === 'metaMask') && (
                <span className="text-sm text-gray-500">Connecting...</span>
              )}
            </button>
          )}
          
          {/* Coinbase Wallet */}
          {coinbaseWalletConnector && (
            <button
              onClick={() => handleConnect(coinbaseWalletConnector)}
              disabled={isPending || connectingId === 'coinbaseWallet'}
              className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-forest/5 transition-colors"
            >
              <div className="flex items-center">
                <img src="https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.png" alt="Coinbase Wallet" className="w-8 h-8 mr-3" />
                <span className="font-medium">Coinbase Wallet</span>
              </div>
              {(isPending || connectingId === 'coinbaseWallet') && (
                <span className="text-sm text-gray-500">Connecting...</span>
              )}
            </button>
          )}
          
          {/* Injected Wallet (for other browser wallets) */}
          {injectedConnector && injectedConnector.id !== 'metaMask' && (
            <button
              onClick={() => handleConnect(injectedConnector)}
              disabled={isPending || connectingId === 'injected'}
              className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-forest/5 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Browser Wallet</span>
              </div>
              {(isPending || connectingId === 'injected') && (
                <span className="text-sm text-gray-500">Connecting...</span>
              )}
            </button>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>New to Ethereum wallets?</p>
          <a 
            href="https://ethereum.org/en/wallets/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-forest hover:underline"
          >
            Learn more about wallets
          </a>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
