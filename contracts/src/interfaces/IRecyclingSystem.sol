// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title IRecyclingSystem
 * @dev Interface for the RecyclingSystem contract
 */
interface IRecyclingSystem {
    enum RecyclableType { PLASTIC, METAL, OTHER }

    /**
     * @dev Emitted when a new garbage can is created
     */
    event GarbageCanCreated(uint256 indexed id, string location);
    
    /**
     * @dev Emitted when a stake is deposited for a pending garbage can
     */
    event StakeDeposited(uint256 indexed pendingGarbageCanId, address indexed staker, uint256 amount);
    
    /**
     * @dev Emitted when a garbage can is deployed
     */
    event GarbageCanDeployed(uint256 indexed pendingGarbageCanId, uint256 indexed garbageCanId);
    
    /**
     * @dev Emitted when the fill level of a garbage can is updated
     */
    event FillLevelUpdated(uint256 indexed garbageCanId, RecyclableType recyclableType, uint256 amount, uint256 value);
    
    /**
     * @dev Emitted when the contents of a garbage can are purchased
     */
    event ContentsPurchased(uint256 indexed garbageCanId, address indexed collector, uint256 value);
    
    /**
     * @dev Emitted when the contents of a garbage can are purchased with detailed information
     */
    event DetailedContentsPurchased(
        uint256 indexed garbageCanId, 
        address indexed collector, 
        uint256 plasticLevel, 
        uint256 metalLevel, 
        uint256 otherLevel, 
        uint256 value
    );
    
    /**
     * @dev Emitted when rewards are distributed to stake NFT holders
     */
    event RewardsDistributed(uint256 indexed garbageCanId, uint256 totalAmount);

    /**
     * @dev Creates a new pending garbage can that needs staking
     * @param location The physical location of the garbage can
     * @param targetAmount The amount of USDC needed to deploy the garbage can
     * @return The ID of the newly created pending garbage can
     */
    function createPendingGarbageCan(string memory location, uint256 targetAmount) external returns (uint256);

    /**
     * @dev Updates the fill level and value of a garbage can
     * @param garbageCanId The ID of the garbage can
     * @param recyclableType The type of recyclable being deposited
     * @param amount The amount being deposited
     * @param value The value of the deposit
     */
    function updateFillLevel(
        uint256 garbageCanId,
        RecyclableType recyclableType,
        uint256 amount,
        uint256 value
    ) external;

    /**
     * @dev Allows collectors to purchase the contents of a garbage can
     * @param garbageCanId The ID of the garbage can to purchase contents from
     */
    function buyContents(uint256 garbageCanId) external;

    /**
     * @dev Returns information about a garbage can
     * @param garbageCanId The ID of the garbage can
     * @return location The physical location of the garbage can
     * @return currentValue The current value of the garbage can's contents
     * @return isActive Whether the garbage can is active
     * @return isLocked Whether the garbage can is locked
     * @return deploymentTimestamp When the garbage can was deployed
     * @return lastEmptiedTimestamp When the garbage can was last emptied
     * @return totalStaked The total amount staked for the garbage can
     */
    function getGarbageCanInfo(uint256 garbageCanId) external view returns (
        string memory location,
        uint256 currentValue,
        bool isActive,
        bool isLocked,
        uint256 deploymentTimestamp,
        uint256 lastEmptiedTimestamp,
        uint256 totalStaked
    );

    /**
     * @dev Returns the fill level of a garbage can for a specific recyclable type
     * @param garbageCanId The ID of the garbage can
     * @param recyclableType The type of recyclable
     * @return The fill level
     */
    function getFillLevel(uint256 garbageCanId, RecyclableType recyclableType) external view returns (uint256);

    /**
     * @dev Returns information about a pending garbage can
     * @param pendingGarbageCanId The ID of the pending garbage can
     * @return location The physical location of the garbage can
     * @return targetAmount The target amount of USDC needed to deploy the garbage can
     * @return currentAmount The current amount of USDC staked
     * @return isDeployed Whether the garbage can has been deployed
     */
    function getPendingGarbageCanInfo(uint256 pendingGarbageCanId) external view returns (
        string memory location,
        uint256 targetAmount,
        uint256 currentAmount,
        bool isDeployed
    );

    /**
     * @dev Returns the stake amount for a specific address in a pending garbage can
     * @param pendingGarbageCanId The ID of the pending garbage can
     * @param staker The address of the staker
     * @return The stake amount
     */
    function getStakeAmount(uint256 pendingGarbageCanId, address staker) external view returns (uint256);

    /**
     * @dev Returns all fill levels for a garbage can
     * @param garbageCanId The ID of the garbage can
     * @return plasticLevel The fill level for plastic
     * @return metalLevel The fill level for metal
     * @return otherLevel The fill level for other materials
     */
    function getGarbageCanFillLevels(uint256 garbageCanId) external view returns (
        uint256 plasticLevel,
        uint256 metalLevel,
        uint256 otherLevel
    );

    /**
     * @dev Returns all pending garbage cans
     * @return Array of pending garbage can IDs
     */
    function getAllPendingGarbageCans() external view returns (uint256[] memory);

    /**
     * @dev Returns all active garbage cans
     * @return Array of active garbage can IDs
     */
    function getAllActiveGarbageCans() external view returns (uint256[] memory);

    /**
     * @dev Returns all garbage cans with pagination
     * @param offset The offset to start from
     * @param limit The maximum number of garbage cans to return
     * @return Array of garbage can IDs
     */
    function getAllGarbageCans(uint256 offset, uint256 limit) external view returns (uint256[] memory);

    /**
     * @dev Returns garbage cans by location
     * @param location The location to search for
     * @return Array of garbage can IDs
     */
    function getGarbageCansByLocation(string memory location) external view returns (uint256[] memory);

    /**
     * @dev Returns the total number of garbage cans
     * @return The total number of garbage cans
     */
    function getTotalGarbageCans() external view returns (uint256);

    /**
     * @dev Returns the total number of pending garbage cans
     * @return The total number of pending garbage cans
     */
    function getTotalPendingGarbageCans() external view returns (uint256);

    /**
     * @dev Returns the total number of active garbage cans
     * @return The total number of active garbage cans
     */
    function getTotalActiveGarbageCans() external view returns (uint256);

    /**
     * @dev Returns system statistics
     * @return totalGarbageCans The total number of garbage cans
     * @return totalPendingGarbageCans The total number of pending garbage cans
     * @return totalActiveGarbageCans The total number of active garbage cans
     * @return totalStaked The total amount staked across all garbage cans
     * @return totalRecycled The total amount recycled across all garbage cans
     * @return totalValue The total value of all garbage cans
     */
    function getSystemStats() external view returns (
        uint256 totalGarbageCans,
        uint256 totalPendingGarbageCans,
        uint256 totalActiveGarbageCans,
        uint256 totalStaked,
        uint256 totalRecycled,
        uint256 totalValue
    );

    /**
     * @dev Deposits a stake for a pending garbage can
     * @param pendingGarbageCanId The ID of the pending garbage can
     * @param amount The amount to stake
     * @return The ID of the newly minted stake NFT
     */
    function depositStake(uint256 pendingGarbageCanId, uint256 amount) external returns (uint256);

    /**
     * @dev Deploys a garbage can
     * @param pendingGarbageCanId The ID of the pending garbage can
     * @return The ID of the newly deployed garbage can
     */
    function deployGarbageCan(uint256 pendingGarbageCanId) external returns (uint256);
    
    /**
     * @dev Gets the recycled weight for a user
     * @param user The user to get the recycled weight for
     * @return The recycled weight
     */
    function getUserRecycledWeight(address user) external view returns (uint256);
    
    /**
     * @dev Gets the recycling count for a user
     * @param user The user to get the recycling count for
     * @return The recycling count
     */
    function getUserRecyclingCount(address user) external view returns (uint256);
    
    /**
     * @dev Gets the staked amount for a user
     * @param user The user to get the staked amount for
     * @return The staked amount
     */
    function getUserStakedAmount(address user) external view returns (uint256);
    
    /**
     * @dev Gets the stake duration for a user
     * @param user The user to get the stake duration for
     * @return The stake duration
     */
    function getUserStakeDuration(address user) external view returns (uint256);
    
    /**
     * @dev Gets the current purchase percentage
     * @return The purchase percentage in basis points (100% = 10000)
     */
    function getPurchasePercentage() external view returns (uint256);
    
    /**
     * @dev Sets the purchase percentage
     * @param percentage The new purchase percentage in basis points (100% = 10000)
     */
    function setPurchasePercentage(uint256 percentage) external;
}
