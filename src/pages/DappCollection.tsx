import React from 'react';
import { DAppLayout } from '../components/layout/DAppLayout';
import { TrashCanGrid } from '../components/dapp/collection/TrashCanGrid';
import { useTrashCanCollection } from '../hooks/dapp/useTrashCanCollection';

export const DappCollection: React.FC = () => {
  useTrashCanCollection({ minFillLevel: 0, onlyActive: true });

  return (
    <DAppLayout>
      <div className="container mx-auto px-4 py-4">

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button className="flex items-center justify-center px-4 py-2 bg-electric text-white font-medium rounded-lg whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Nearby
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-forest/10 text-forest font-medium rounded-lg whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            Filter
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-forest/10 text-forest font-medium rounded-lg whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            High Fill
          </button>
          <button className="flex items-center justify-center px-4 py-2 bg-forest/10 text-forest font-medium rounded-lg whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Rewards
          </button>
        </div>

        {/* Trash Can Grid */}
        <TrashCanGrid />

        {/* How It Works - Compact Version */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mt-4 text-xs">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2">
              <span className="text-xs font-medium text-blue-800">How It Works: </span>
              <span className="text-xs text-blue-700">
                Browse cans → Pay fee → Collect waste → Earn TRASH tokens
              </span>
            </div>
          </div>
        </div>
      </div>
    </DAppLayout>
  );
};
