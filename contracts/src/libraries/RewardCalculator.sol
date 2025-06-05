// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

/**
 * @title RewardCalculator
 * @dev Library for calculating and distributing rewards
 */
library RewardCalculator {
    /**
     * @dev Error thrown when the total share is zero
     */
    error ZeroTotalShare();

    /**
     * @dev Error thrown when the reward amount is zero
     */
    error ZeroRewardAmount();

    /**
     * @dev Error thrown when the number of recipients is zero
     */
    error ZeroRecipients();

    /**
     * @dev Calculates rewards for each recipient based on their share
     * @param shares Array of shares for each recipient
     * @param totalShare The total share
     * @param rewardAmount The total reward amount to distribute
     * @return Array of reward amounts for each recipient
     */
    function calculateRewards(
        uint256[] memory shares,
        uint256 totalShare,
        uint256 rewardAmount
    ) internal pure returns (uint256[] memory) {
        if (totalShare == 0) {
            revert ZeroTotalShare();
        }

        if (rewardAmount == 0) {
            revert ZeroRewardAmount();
        }

        if (shares.length == 0) {
            revert ZeroRecipients();
        }

        uint256[] memory rewards = new uint256[](shares.length);
        uint256 remainingReward = rewardAmount;

        // Calculate rewards for each recipient except the last one
        for (uint256 i = 0; i < shares.length - 1; i++) {
            rewards[i] = (rewardAmount * shares[i]) / totalShare;
            remainingReward -= rewards[i];
        }

        // Assign the remaining reward to the last recipient to avoid rounding errors
        rewards[shares.length - 1] = remainingReward;

        return rewards;
    }

    /**
     * @dev Calculates the reward for a single recipient based on their share
     * @param share The share of the recipient
     * @param totalShare The total share
     * @param rewardAmount The total reward amount to distribute
     * @return The reward amount for the recipient
     */
    function calculateReward(
        uint256 share,
        uint256 totalShare,
        uint256 rewardAmount
    ) internal pure returns (uint256) {
        if (totalShare == 0) {
            revert ZeroTotalShare();
        }

        if (rewardAmount == 0) {
            revert ZeroRewardAmount();
        }

        return (rewardAmount * share) / totalShare;
    }

    /**
     * @dev Calculates the platform fee
     * @param amount The amount to calculate the fee from
     * @param feePercentage The fee percentage in basis points (100% = 10000)
     * @return The fee amount
     */
    function calculatePlatformFee(
        uint256 amount,
        uint256 feePercentage
    ) internal pure returns (uint256) {
        return (amount * feePercentage) / 10000;
    }

    /**
     * @dev Calculates the amount after deducting the platform fee
     * @param amount The original amount
     * @param feePercentage The fee percentage in basis points (100% = 10000)
     * @return The amount after fee deduction
     */
    function calculateAmountAfterFee(
        uint256 amount,
        uint256 feePercentage
    ) internal pure returns (uint256) {
        uint256 fee = calculatePlatformFee(amount, feePercentage);
        return amount - fee;
    }

    /**
     * @dev Calculates the payment amount based on the value and platform fee
     * @param value The value of the garbage can contents
     * @param feePercentage The fee percentage in basis points (100% = 10000)
     * @return The payment amount
     */
    function calculatePaymentAmount(
        uint256 value,
        uint256 feePercentage
    ) internal pure returns (uint256) {
        // Payment amount is the value plus the platform fee
        return value + calculatePlatformFee(value, feePercentage);
    }
    
    /**
     * @dev Calculates the base recycling reward
     * @param weightInKg The weight of recycled materials in kg (with 18 decimals)
     * @param baseRewardPerKg The base reward per kg
     * @return The base recycling reward
     */
    function calculateBaseRecyclingReward(
        uint256 weightInKg,
        uint256 baseRewardPerKg
    ) internal pure returns (uint256) {
        return (baseRewardPerKg * weightInKg) / 10**18;
    }
    
    /**
     * @dev Calculates the staking reward
     * @param stakeAmount The amount staked
     * @param stakeDuration The duration of the stake in seconds
     * @param stakingRewardRate The annual staking reward rate in basis points (100% = 10000)
     * @return The staking reward
     */
    function calculateStakingReward(
        uint256 stakeAmount,
        uint256 stakeDuration,
        uint256 stakingRewardRate
    ) internal pure returns (uint256) {
        if (stakeAmount == 0 || stakeDuration == 0) {
            return 0;
        }
        
        // Calculate reward based on amount, duration, and annual rate
        return (stakeAmount * stakeDuration * stakingRewardRate) / (365 days * 10000);
    }
    
    /**
     * @dev Applies a recycling multiplier to a base reward
     * @param baseReward The base reward
     * @param multiplier The multiplier in percentage (100 = 100%)
     * @return The multiplied reward
     */
    function applyRecyclingMultiplier(
        uint256 baseReward,
        uint256 multiplier
    ) internal pure returns (uint256) {
        return (baseReward * multiplier) / 100;
    }
    
    /**
     * @dev Calculates the quest reward
     * @param baseReward The base reward
     * @param questMultiplier The quest multiplier in percentage (100 = 100%)
     * @return The quest reward
     */
    function calculateQuestReward(
        uint256 baseReward,
        uint256 questMultiplier
    ) internal pure returns (uint256) {
        return (baseReward * questMultiplier) / 100;
    }
    
    /**
     * @dev Calculates the total reward
     * @param baseReward The base recycling reward
     * @param stakingReward The staking reward
     * @param questReward The quest reward
     * @return The total reward
     */
    function calculateTotalReward(
        uint256 baseReward,
        uint256 stakingReward,
        uint256 questReward
    ) internal pure returns (uint256) {
        return baseReward + stakingReward + questReward;
    }
}
