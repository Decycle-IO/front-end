import React, { useState } from 'react';
import { useConnect, useAccount, useDisconnect, useBalance, type Connector } from 'wagmi';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import type { ConnectWalletProps } from '../../../types/ui';
import { WalletButton } from './WalletButton';
import { useAuth } from '../../../hooks/useAuth';

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  onConnect,
  onDisconnect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connectors, connect, isPending, error } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isCorrectNetwork, switchNetwork } = useAuth();
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  });

  const handleConnect = (connector: Connector) => {
    connect({ connector });
    setIsModalOpen(false);
    if (onConnect) onConnect();
  };

  const handleDisconnect = () => {
    disconnect();
    if (onDisconnect) onDisconnect();
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center">
        {!isCorrectNetwork && (
          <button 
            onClick={switchNetwork}
            className="mr-2 text-xs px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
          >
            Wrong Network
          </button>
        )}
        {balance && (
          <div className="hidden md:flex items-center mr-3">
            <span className="text-xs font-medium text-forest">
              {parseFloat(balance.formatted).toFixed(2)} {balance.symbol}
            </span>
          </div>
        )}
        <WalletButton address={address} onDisconnect={handleDisconnect} />
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="primary"
        size="sm"
      >
        Connect Wallet
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Connect Wallet</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error.message}
              </div>
            )}

            <div className="space-y-4">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  disabled={isPending}
                  fullWidth
                  variant="outline"
                  isLoading={isPending}
                >
                  {connector.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
