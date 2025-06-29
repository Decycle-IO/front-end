import { useState, useEffect } from 'react';

// Types for trash can
export interface TrashCan {
  id: number;
  location: string;
  fillLevel: number; // percentage
  costToCollect: number; // in USDC
  lastEmptied: string; // ISO date string
  isActive: boolean;
}

// Types for collection filter
export interface CollectionFilter {
  minFillLevel?: number;
  onlyActive?: boolean;
  searchTerm?: string;
}

// Return type for the hook
interface UseTrashCanCollectionReturn {
  trashCans: TrashCan[];
  isLoading: boolean;
  collectTrash: (canId: number) => Promise<boolean>;
}

// Mock data for trash cans
const mockTrashCans: TrashCan[] = [
  {
    id: 1,
    location: 'Central Park, NYC',
    fillLevel: 85,
    costToCollect: 5,
    lastEmptied: '2025-06-15T10:30:00Z',
    isActive: true
  },
  {
    id: 2,
    location: 'Times Square, NYC',
    fillLevel: 72,
    costToCollect: 4,
    lastEmptied: '2025-06-16T14:45:00Z',
    isActive: true
  },
  {
    id: 3,
    location: 'Brooklyn Bridge, NYC',
    fillLevel: 45,
    costToCollect: 3,
    lastEmptied: '2025-06-18T09:15:00Z',
    isActive: true
  },
  {
    id: 4,
    location: 'Battery Park, NYC',
    fillLevel: 30,
    costToCollect: 2,
    lastEmptied: '2025-06-19T16:20:00Z',
    isActive: true
  },
  {
    id: 5,
    location: 'High Line, NYC',
    fillLevel: 65,
    costToCollect: 3.5,
    lastEmptied: '2025-06-17T11:10:00Z',
    isActive: true
  },
  {
    id: 6,
    location: 'Washington Square Park, NYC',
    fillLevel: 90,
    costToCollect: 5.5,
    lastEmptied: '2025-06-14T08:30:00Z',
    isActive: true
  },
  {
    id: 7,
    location: 'Union Square, NYC',
    fillLevel: 15,
    costToCollect: 2,
    lastEmptied: '2025-06-20T07:45:00Z',
    isActive: true
  },
  {
    id: 8,
    location: 'Madison Square Park, NYC',
    fillLevel: 50,
    costToCollect: 3,
    lastEmptied: '2025-06-18T13:20:00Z',
    isActive: true
  },
  {
    id: 9,
    location: 'Bryant Park, NYC',
    fillLevel: 78,
    costToCollect: 4.5,
    lastEmptied: '2025-06-16T10:15:00Z',
    isActive: false
  }
];

/**
 * Hook for fetching and interacting with trash cans for collection
 */
export const useTrashCanCollection = (filter?: CollectionFilter): UseTrashCanCollectionReturn => {
  const [trashCans, setTrashCans] = useState<TrashCan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call
    const fetchTrashCans = async (): Promise<void> => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be an API call with filters
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Apply filters to mock data
        let filteredCans = [...mockTrashCans];
        
        if (filter) {
          if (filter.minFillLevel !== undefined) {
            filteredCans = filteredCans.filter(can => can.fillLevel >= filter.minFillLevel!);
          }
          
          if (filter.onlyActive) {
            filteredCans = filteredCans.filter(can => can.isActive);
          }
          
          if (filter.searchTerm) {
            const searchTermLower = filter.searchTerm.toLowerCase();
            filteredCans = filteredCans.filter(can => 
              can.location.toLowerCase().includes(searchTermLower)
            );
          }
        }
        
        setTrashCans(filteredCans);
      } catch (error) {
        console.error('Error fetching trash cans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTrashCans();
  }, [filter]);

  /**
   * Collect trash from a specific can
   * @param canId The ID of the trash can to collect from
   * @returns Promise resolving to a boolean indicating success
   */
  const collectTrash = async (canId: number): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the local state to reflect the collection
      setTrashCans(prevCans => 
        prevCans.map(can => 
          can.id === canId 
            ? { 
                ...can, 
                fillLevel: 0, 
                lastEmptied: new Date().toISOString() 
              } 
            : can
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error collecting trash:', error);
      return false;
    }
  };

  return {
    trashCans,
    isLoading,
    collectTrash
  };
};
