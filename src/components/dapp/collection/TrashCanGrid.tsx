import React, { useState } from 'react';
import { type TrashCan, type CollectionFilter } from '../../../hooks/dapp/useTrashCanCollection';
import { TrashCanCard } from '../ui/TrashCanCard';
import { ActionSheet } from '../ui/ActionSheet';
import { ActionButton } from '../ui/ActionButton';

// Static data for marketing screenshots
const staticTrashCans: TrashCan[] = [
  {
    id: 1,
    location: 'Champs-Élysées, Paris',
    fillLevel: 85,
    costToCollect: 5,
    lastEmptied: '2025-06-15T10:30:00Z',
    isActive: true
  },
  {
    id: 2,
    location: 'Alexanderplatz, Berlin',
    fillLevel: 72,
    costToCollect: 4,
    lastEmptied: '2025-06-16T14:45:00Z',
    isActive: true
  },
  {
    id: 3,
    location: 'Marienplatz, Munich',
    fillLevel: 45,
    costToCollect: 3,
    lastEmptied: '2025-06-18T09:15:00Z',
    isActive: true
  },
  {
    id: 4,
    location: 'Place de la Bastille, Paris',
    fillLevel: 30,
    costToCollect: 2,
    lastEmptied: '2025-06-19T16:20:00Z',
    isActive: true
  },
  {
    id: 5,
    location: 'Promenade des Anglais, Nice',
    fillLevel: 65,
    costToCollect: 3.5,
    lastEmptied: '2025-06-17T11:10:00Z',
    isActive: true
  },
  {
    id: 6,
    location: 'Kurfürstendamm, Berlin',
    fillLevel: 90,
    costToCollect: 5.5,
    lastEmptied: '2025-06-14T08:30:00Z',
    isActive: true
  }
];

export const TrashCanGrid: React.FC = () => {
  const [filter, setFilter] = useState<CollectionFilter>({
    minFillLevel: 0,
    onlyActive: true
  });
  const [selectedCanId, setSelectedCanId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Using static data for marketing screenshots
  const trashCans = staticTrashCans;
  const isLoading = false;

  // Handle collecting trash
  const handleCollect = (canId: number): void => {
    setSelectedCanId(canId);
    setIsPaymentOpen(true);
  };

  // Handle payment confirmation
  const handlePaymentConfirm = (): void => {
    if (selectedCanId === null) return;
    
    setIsProcessing(true);
    
    // Simulate success for marketing screenshots
    setTimeout(() => {
      setIsSuccess(true);
      
      // Close payment modal after success
      setTimeout(() => {
        setIsPaymentOpen(false);
        setIsSuccess(false);
        setIsProcessing(false);
        setSelectedCanId(null);
      }, 2000);
    }, 1000);
  };

  // Get selected can details
  const selectedCan = selectedCanId !== null 
    ? trashCans.find(can => can.id === selectedCanId) 
    : null;

  return (
    <div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-forest/10 p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && trashCans.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-forest/10 p-8 text-center">
          <div className="bg-forest/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-forest" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-forest mb-2">No Trash Cans Found</h3>
          <p className="text-slate mb-6">
            No trash cans match your current filters. Try adjusting your search criteria.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 bg-electric text-white font-medium rounded-lg hover:bg-electric/90 transition-colors"
            onClick={() => {
              setFilter({ minFillLevel: 0, onlyActive: true });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reset Filters
          </button>
        </div>
      )}

      {/* Trash Can Grid */}
      {!isLoading && trashCans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trashCans.map((trashCan) => (
            <TrashCanCard
              key={trashCan.id}
              trashCan={trashCan}
              onCollect={handleCollect}
              isCollecting={isProcessing && selectedCanId === trashCan.id}
            />
          ))}
        </div>
      )}

      {/* Filter Action Sheet */}
      <ActionSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filter Trash Cans"
      >
        <div className="space-y-6">
          {/* Fill Level Filter */}
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Minimum Fill Level
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={filter.minFillLevel ?? 0}
                onChange={(e) => setFilter({ ...filter, minFillLevel: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-forest font-medium">{filter.minFillLevel ?? 0}%</span>
            </div>
          </div>

          {/* Active Only Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activeOnly"
              checked={filter.onlyActive ?? false}
              onChange={(e) => setFilter({ ...filter, onlyActive: e.target.checked })}
              className="w-5 h-5 text-electric bg-gray-100 rounded border-gray-300 focus:ring-electric"
            />
            <label htmlFor="activeOnly" className="ml-2 text-sm font-medium text-forest">
              Show only active trash cans
            </label>
          </div>

          {/* Apply Button */}
          <ActionButton
            label="Apply Filters"
            onClick={() => setIsFilterOpen(false)}
            fullWidth
            variant="primary"
          />
        </div>
      </ActionSheet>

      {/* Payment Action Sheet */}
      <ActionSheet
        isOpen={isPaymentOpen}
        onClose={() => !isProcessing && setIsPaymentOpen(false)}
        title={isSuccess ? "Collection Successful!" : "Confirm Collection"}
      >
        {selectedCan && (
          <div className="space-y-6">
            {isSuccess ? (
              <div className="text-center py-4">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-forest mb-2">Collection Successful!</h3>
                <p className="text-slate mb-2">
                  The trash can at {selectedCan.location} has been unlocked.
                </p>
                <p className="text-sm text-forest font-medium">
                  You can now collect the trash and earn rewards.
                </p>
              </div>
            ) : (
              <>
                <div className="bg-forest/5 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate">Location</span>
                    <span className="text-forest font-medium">{selectedCan.location}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate">Fill Level</span>
                    <span className="text-forest font-medium">{selectedCan.fillLevel}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate">Cost to Collect</span>
                    <span className="text-forest font-medium">{selectedCan.costToCollect} USDC</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Paying will unlock the trash can for collection. You'll earn TRASH tokens as a reward after recycling.
                      </p>
                    </div>
                  </div>
                </div>

                <ActionButton
                  label={`Pay ${selectedCan.costToCollect} USDC to Collect`}
                  onClick={handlePaymentConfirm}
                  isLoading={isProcessing}
                  fullWidth
                  variant="primary"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  }
                />
              </>
            )}
          </div>
        )}
      </ActionSheet>
    </div>
  );
};
