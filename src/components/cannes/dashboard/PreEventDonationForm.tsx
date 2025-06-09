import React from 'react';
import { motion } from 'framer-motion';

interface PreEventDonationFormProps {
  onDonate: (amount: number, displayName: string, imageUrl: string) => Promise<boolean>;
  isLoading: boolean;
}

const PreEventDonationForm: React.FC<PreEventDonationFormProps> = ({ onDonate, isLoading }) => {
  const [amount, setAmount] = React.useState<string>('0.1');
  const [displayName, setDisplayName] = React.useState<string>('');
  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!displayName) {
      setError('Please enter a display name');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    const result = await onDonate(parseFloat(amount), displayName, imageUrl);
    if (result) {
      setSuccess(true);
      setAmount('0.1');
      setDisplayName('');
      setImageUrl('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else {
      setError('Failed to process donation. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold text-forest mb-4">Become a Green Guardian</h2>
        <p className="text-slate mb-6">
          Support the Decycle project by donating ETH. All donors will be recognized as Green Guardians with custom display names and logos and receive a custom supporter NFT.
        </p>
        
        {success && (
          <div className="mb-4 p-3 bg-electric/10 border border-electric/20 rounded-lg text-forest">
            Thank you for your donation! You are now a Green Guardian.
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-charcoal mb-1">
              Display Name *
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent"
              placeholder="How you want to be displayed"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-charcoal mb-1">
              Logo/Image URL (optional)
            </label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent"
              placeholder="https://example.com/your-logo.png"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm font-medium text-charcoal mb-1">
              Donation Amount (ETH) *
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">ETH</span>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-forest hover:bg-forest-light'
            }`}
          >
            {isLoading ? 'Processing...' : 'Donate & Become a Green Guardian'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default PreEventDonationForm;
