// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./IRecyclingSystem.sol";

/**
 * @title IRecyclingSystemView
 * @dev Interface for view functions related to the RecyclingSystem
 */
interface IRecyclingSystemView {
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
    function getFillLevel(uint256 garbageCanId, IRecyclingSystem.RecyclableType recyclableType) external view returns (uint256);

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
}
