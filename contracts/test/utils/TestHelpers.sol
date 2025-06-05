// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../../lib/openzeppelin-contracts/lib/forge-std/src/Test.sol";
import "../../src/interfaces/IRecyclingSystem.sol";
import "../../src/interfaces/IQuestSystem.sol";

/**
 * @title TestHelpers
 * @dev Helper functions and utilities for testing
 */
library TestHelpers {
    /**
     * @dev Creates a mock garbage can for testing
     * @param location The location of the garbage can
     * @param targetAmount The target amount for the garbage can
     * @return The garbage can data
     */
    function createMockGarbageCan(
        string memory location,
        uint256 targetAmount
    ) internal pure returns (bytes memory) {
        return abi.encode(location, targetAmount);
    }

    /**
     * @dev Creates a mock quest for testing
     * @param name The name of the quest
     * @param description The description of the quest
     * @param requiredAmount The required amount to complete the quest
     * @param rewardAmount The reward amount for completing the quest
     * @param nftReward Whether to reward an NFT
     * @param nftURI The URI for the NFT
     * @return The quest data
     */
    function createMockQuest(
        string memory name,
        string memory description,
        uint256 requiredAmount,
        uint256 rewardAmount,
        bool nftReward,
        string memory nftURI
    ) internal pure returns (bytes memory) {
        return abi.encode(name, description, requiredAmount, rewardAmount, nftReward, nftURI);
    }

    /**
     * @dev Converts a RecyclableType to a string
     * @param recyclableType The recyclable type
     * @return The string representation
     */
    function recyclableTypeToString(
        IRecyclingSystem.RecyclableType recyclableType
    ) internal pure returns (string memory) {
        if (recyclableType == IRecyclingSystem.RecyclableType.PLASTIC) {
            return "PLASTIC";
        } else if (recyclableType == IRecyclingSystem.RecyclableType.METAL) {
            return "METAL";
        } else {
            return "OTHER";
        }
    }

    /**
     * @dev Converts a QuestType to a string
     * @param questType The quest type
     * @return The string representation
     */
    function questTypeToString(
        IQuestSystem.QuestType questType
    ) internal pure returns (string memory) {
        if (questType == IQuestSystem.QuestType.FIRST_RECYCLER) {
            return "FIRST_RECYCLER";
        } else if (questType == IQuestSystem.QuestType.WEEKLY_WARRIOR) {
            return "WEEKLY_WARRIOR";
        } else if (questType == IQuestSystem.QuestType.EARTH_CHAMPION) {
            return "EARTH_CHAMPION";
        } else if (questType == IQuestSystem.QuestType.MATERIAL_MASTER) {
            return "MATERIAL_MASTER";
        } else {
            return "CUSTOM";
        }
    }

    /**
     * @dev Calculates the expected reward based on share percentage
     * @param sharePercentage The share percentage
     * @param totalSharePercentage The total share percentage
     * @param totalRewards The total rewards
     * @return The expected reward
     */
    function calculateExpectedReward(
        uint256 sharePercentage,
        uint256 totalSharePercentage,
        uint256 totalRewards
    ) internal pure returns (uint256) {
        return (totalRewards * sharePercentage) / totalSharePercentage;
    }

    /**
     * @dev Calculates the expected share percentage
     * @param amount The staked amount
     * @param targetAmount The target amount
     * @return The expected share percentage
     */
    function calculateExpectedSharePercentage(
        uint256 amount,
        uint256 targetAmount
    ) internal pure returns (uint256) {
        return (amount * 10000) / targetAmount;
    }
}

/**
 * @title MockProver
 * @dev Mock contract for testing email verification
 */
contract MockProver {
    bool public verificationResult;
    
    constructor(bool _verificationResult) {
        verificationResult = _verificationResult;
    }
    
    function verify() external view returns (bool) {
        return verificationResult;
    }
}
