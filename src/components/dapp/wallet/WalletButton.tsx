import React, { useState } from 'react';
import Button from '../../ui/Button';
import Card from '../../ui/Card';
import type { WalletButtonProps } from '../../../types/ui';

export const WalletButton: React.FC<WalletButtonProps> = ({
  address,
  onDisconnect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // Could use toast notification here
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="py-1 px-3"
      >
        {address ? formatAddress(address) : 'Connect Wallet'}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50">
          <Card className="w-60 shadow-lg">
            <div className="space-y-3">
              <div className="text-xs text-gray-500">Connected Address</div>
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">{formatAddress(address || '')}</div>
                <button
                  onClick={copyToClipboard}
                  className="text-forest hover:text-forest-light text-xs"
                >
                  Copy
                </button>
              </div>

              <Button
                onClick={() => {
                  setIsOpen(false);
                  if (onDisconnect) onDisconnect();
                }}
                variant="secondary"
                size="sm"
                fullWidth
              >
                Disconnect
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
