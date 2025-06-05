// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../interfaces/IRecyclingSystem.sol";

/**
 * @title MockRecyclingSystem
 * @dev Mock contract for testing RecyclingSystem functionality
 */
contract MockRecyclingSystem is IRecyclingSystem {
    /**
     * @dev Constructor
     */
    constructor() {}
    /**
     * @dev Mapping of user to recycled weight
     */
    mapping(address => uint256) private _userRecycledWeight;
    
    /**
     * @dev Mapping of user to recycling count
     */
    mapping(address => uint256) private _userRecyclingCount;
    
    /**
     * @dev Mapping of user to staked amount
     */
    mapping(address => uint256) private _userStakedAmount;
    
    /**
     * @dev Mapping of user to stake duration
     */
    mapping(address => uint256) private _userStakeDuration;
    
    /**
     * @dev Sets the recycled weight for a user (for testing)
     * @param user The user to set the recycled weight for
     * @param weight The recycled weight
     */
    function setUserRecycledWeight(address user, uint256 weight) external {
        _userRecycledWeight[user] = weight;
    }
    
    /**
     * @dev Gets the recycled weight for a user
     * @param user The user to get the recycled weight for
     * @return The recycled weight
     */
    function getUserRecycledWeight(address user) external view returns (uint256) {
        return _userRecycledWeight[user];
    }
    
    /**
     * @dev Sets the recycling count for a user (for testing)
     * @param user The user to set the recycling count for
     * @param count The recycling count
     */
    function setUserRecyclingCount(address user, uint256 count) external {
        _userRecyclingCount[user] = count;
    }
    
    /**
     * @dev Gets the recycling count for a user
     * @param user The user to get the recycling count for
     * @return The recycling count
     */
    function getUserRecyclingCount(address user) external view returns (uint256) {
        return _userRecyclingCount[user];
    }
    
    /**
     * @dev Sets the staked amount for a user (for testing)
     * @param user The user to set the staked amount for
     * @param amount The staked amount
     */
    function setUserStakedAmount(address user, uint256 amount) external {
        _userStakedAmount[user] = amount;
    }
    
    /**
     * @dev Gets the staked amount for a user
     * @param user The user to get the staked amount for
     * @return The staked amount
     */
    function getUserStakedAmount(address user) external view returns (uint256) {
        return _userStakedAmount[user];
    }
    
    /**
     * @dev Sets the stake duration for a user (for testing)
     * @param user The user to set the stake duration for
     * @param duration The stake duration
     */
    function setUserStakeDuration(address user, uint256 duration) external {
        _userStakeDuration[user] = duration;
    }
    
    /**
     * @dev Gets the stake duration for a user
     * @param user The user to get the stake duration for
     * @return The stake duration
     */
    function getUserStakeDuration(address user) external view returns (uint256) {
        return _userStakeDuration[user];
    }
    
    /**
     * @dev Gets the current purchase percentage
     * @return The purchase percentage in basis points (100% = 10000)
     */
    function getPurchasePercentage() external pure returns (uint256) {
        return 5000; // Default 50%
    }
    
    /**
     * @dev Sets the purchase percentage
     * @param percentage The new purchase percentage in basis points (100% = 10000)
     */
    function setPurchasePercentage(uint256 percentage) external pure {
        // Mock implementation - does nothing
    }
    
    // Implement required interface methods with empty implementations
    function createPendingGarbageCan(string memory, uint256) external pure returns (uint256) {
        return 0;
    }
    
    function updateFillLevel(uint256, RecyclableType, uint256, uint256) external pure {}
    
    function buyContents(uint256) external pure {}
    
    function getGarbageCanInfo(uint256) external pure returns (
        string memory,
        uint256,
        bool,
        bool,
        uint256,
        uint256,
        uint256
    ) {
        return ("", 0, false, false, 0, 0, 0);
    }
    
    function getFillLevel(uint256, RecyclableType) external pure returns (uint256) {
        return 0;
    }
    
    function getPendingGarbageCanInfo(uint256) external pure returns (
        string memory,
        uint256,
        uint256,
        bool
    ) {
        return ("", 0, 0, false);
    }
    
    function getStakeAmount(uint256, address) external pure returns (uint256) {
        return 0;
    }
    
    function getGarbageCanFillLevels(uint256) external pure returns (
        uint256,
        uint256,
        uint256
    ) {
        return (0, 0, 0);
    }
    
    function getAllPendingGarbageCans() external pure returns (uint256[] memory) {
        return new uint256[](0);
    }
    
    function getAllActiveGarbageCans() external pure returns (uint256[] memory) {
        return new uint256[](0);
    }
    
    function getAllGarbageCans(uint256, uint256) external pure returns (uint256[] memory) {
        return new uint256[](0);
    }
    
    function getGarbageCansByLocation(string memory) external pure returns (uint256[] memory) {
        return new uint256[](0);
    }
    
    function getTotalGarbageCans() external pure returns (uint256) {
        return 0;
    }
    
    function getTotalPendingGarbageCans() external pure returns (uint256) {
        return 0;
    }
    
    function getTotalActiveGarbageCans() external pure returns (uint256) {
        return 0;
    }
    
    function getSystemStats() external pure returns (
        uint256,
        uint256,
        uint256,
        uint256,
        uint256,
        uint256
    ) {
        return (0, 0, 0, 0, 0, 0);
    }
    
    function depositStake(uint256, uint256) external pure returns (uint256) {
        return 0;
    }
    
    function deployGarbageCan(uint256) external pure returns (uint256) {
        return 0;
    }
}
