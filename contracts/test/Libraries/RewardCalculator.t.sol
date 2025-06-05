// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../utils/Base.t.sol";
import "../../src/libraries/RewardCalculator.sol";

/**
 * @title RewardCalculatorTest
 * @dev Tests for RewardCalculator library
 */
contract RewardCalculatorTest is BaseTest {
    // Test contract to expose library functions
    RewardCalculatorWrapper wrapper;
    
    // Test constants
    uint256 constant BASE_REWARD = 100 * 10**6; // 100 TRASH
    uint256 constant WEIGHT_KG = 10 * 10**18; // 10 kg (with 18 decimals)
    uint256 constant STAKE_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 constant STAKE_DURATION = 30 days;
    uint256 constant RECYCLING_MULTIPLIER = 150; // 1.5x
    
    function setUp() public override {
        super.setUp();
        
        // Deploy wrapper contract
        wrapper = new RewardCalculatorWrapper();
    }
    
    /**
     * @dev Test calculating base recycling reward
     */
    function testCalculateBaseRecyclingReward() public {
        // Calculate base recycling reward
        uint256 reward = wrapper.calculateBaseRecyclingReward(WEIGHT_KG);
        
        // Check reward calculation
        assertEq(reward, BASE_REWARD * WEIGHT_KG / 10**18);
    }
    
    /**
     * @dev Test calculating base recycling reward with zero weight
     */
    function testCalculateBaseRecyclingRewardZeroWeight() public {
        // Calculate base recycling reward with zero weight
        uint256 reward = wrapper.calculateBaseRecyclingReward(0);
        
        // Check reward calculation
        assertEq(reward, 0);
    }
    
    /**
     * @dev Test calculating base recycling reward with large weight
     */
    function testCalculateBaseRecyclingRewardLargeWeight() public {
        // Calculate base recycling reward with large weight
        uint256 largeWeight = 1000 * 10**18; // 1000 kg
        uint256 reward = wrapper.calculateBaseRecyclingReward(largeWeight);
        
        // Check reward calculation
        assertEq(reward, BASE_REWARD * largeWeight / 10**18);
    }
    
    /**
     * @dev Test calculating staking reward
     */
    function testCalculateStakingReward() public {
        // Calculate staking reward
        uint256 reward = wrapper.calculateStakingReward(STAKE_AMOUNT, STAKE_DURATION);
        
        // Check reward calculation
        uint256 expectedReward = STAKE_AMOUNT * STAKE_DURATION * wrapper.STAKING_REWARD_RATE() / (365 days * 10000);
        assertEq(reward, expectedReward);
    }
    
    /**
     * @dev Test calculating staking reward with zero amount
     */
    function testCalculateStakingRewardZeroAmount() public {
        // Calculate staking reward with zero amount
        uint256 reward = wrapper.calculateStakingReward(0, STAKE_DURATION);
        
        // Check reward calculation
        assertEq(reward, 0);
    }
    
    /**
     * @dev Test calculating staking reward with zero duration
     */
    function testCalculateStakingRewardZeroDuration() public {
        // Calculate staking reward with zero duration
        uint256 reward = wrapper.calculateStakingReward(STAKE_AMOUNT, 0);
        
        // Check reward calculation
        assertEq(reward, 0);
    }
    
    /**
     * @dev Test calculating staking reward with large amount and duration
     */
    function testCalculateStakingRewardLargeValues() public {
        // Calculate staking reward with large values
        uint256 largeAmount = 1000000 * 10**6; // 1,000,000 USDC
        uint256 longDuration = 365 days * 10; // 10 years
        uint256 reward = wrapper.calculateStakingReward(largeAmount, longDuration);
        
        // Check reward calculation
        uint256 expectedReward = largeAmount * longDuration * wrapper.STAKING_REWARD_RATE() / (365 days * 10000);
        assertEq(reward, expectedReward);
    }
    
    /**
     * @dev Test applying recycling multiplier
     */
    function testApplyRecyclingMultiplier() public {
        // Apply recycling multiplier
        uint256 baseReward = 100 * 10**6; // 100 TRASH
        uint256 multipliedReward = wrapper.applyRecyclingMultiplier(baseReward, RECYCLING_MULTIPLIER);
        
        // Check multiplier application
        uint256 expectedReward = baseReward * RECYCLING_MULTIPLIER / 100;
        assertEq(multipliedReward, expectedReward);
    }
    
    /**
     * @dev Test applying recycling multiplier with zero reward
     */
    function testApplyRecyclingMultiplierZeroReward() public {
        // Apply recycling multiplier with zero reward
        uint256 multipliedReward = wrapper.applyRecyclingMultiplier(0, RECYCLING_MULTIPLIER);
        
        // Check multiplier application
        assertEq(multipliedReward, 0);
    }
    
    /**
     * @dev Test applying recycling multiplier with zero multiplier
     */
    function testApplyRecyclingMultiplierZeroMultiplier() public {
        // Apply recycling multiplier with zero multiplier
        uint256 baseReward = 100 * 10**6; // 100 TRASH
        uint256 multipliedReward = wrapper.applyRecyclingMultiplier(baseReward, 0);
        
        // Check multiplier application
        assertEq(multipliedReward, 0);
    }
    
    /**
     * @dev Test applying recycling multiplier with 100% multiplier
     */
    function testApplyRecyclingMultiplier100Percent() public {
        // Apply recycling multiplier with 100% multiplier
        uint256 baseReward = 100 * 10**6; // 100 TRASH
        uint256 multipliedReward = wrapper.applyRecyclingMultiplier(baseReward, 100);
        
        // Check multiplier application
        assertEq(multipliedReward, baseReward);
    }
    
    /**
     * @dev Test calculating quest reward
     */
    function testCalculateQuestReward() public {
        // Calculate quest reward
        uint256 baseReward = 100 * 10**6; // 100 TRASH
        uint256 questMultiplier = 200; // 2x
        uint256 questReward = wrapper.calculateQuestReward(baseReward, questMultiplier);
        
        // Check reward calculation
        uint256 expectedReward = baseReward * questMultiplier / 100;
        assertEq(questReward, expectedReward);
    }
    
    /**
     * @dev Test calculating quest reward with zero reward
     */
    function testCalculateQuestRewardZeroReward() public {
        // Calculate quest reward with zero reward
        uint256 questReward = wrapper.calculateQuestReward(0, 200);
        
        // Check reward calculation
        assertEq(questReward, 0);
    }
    
    /**
     * @dev Test calculating quest reward with zero multiplier
     */
    function testCalculateQuestRewardZeroMultiplier() public {
        // Calculate quest reward with zero multiplier
        uint256 baseReward = 100 * 10**6; // 100 TRASH
        uint256 questReward = wrapper.calculateQuestReward(baseReward, 0);
        
        // Check reward calculation
        assertEq(questReward, 0);
    }
    
    /**
     * @dev Test calculating total reward
     */
    function testCalculateTotalReward() public {
        // Calculate total reward
        uint256 baseReward = 100 * 10**6; // 100 TRASH
        uint256 stakingReward = 50 * 10**6; // 50 TRASH
        uint256 questReward = 30 * 10**6; // 30 TRASH
        uint256 totalReward = wrapper.calculateTotalReward(baseReward, stakingReward, questReward);
        
        // Check total reward calculation
        assertEq(totalReward, baseReward + stakingReward + questReward);
    }
    
    /**
     * @dev Test calculating total reward with zero values
     */
    function testCalculateTotalRewardZeroValues() public {
        // Calculate total reward with zero values
        uint256 totalReward = wrapper.calculateTotalReward(0, 0, 0);
        
        // Check total reward calculation
        assertEq(totalReward, 0);
    }
    
    /**
     * @dev Test calculating total reward with only base reward
     */
    function testCalculateTotalRewardOnlyBaseReward() public {
        // Calculate total reward with only base reward
        uint256 baseReward = 100 * 10**6; // 100 TRASH
        uint256 totalReward = wrapper.calculateTotalReward(baseReward, 0, 0);
        
        // Check total reward calculation
        assertEq(totalReward, baseReward);
    }
    
    /**
     * @dev Test calculating total reward with only staking reward
     */
    function testCalculateTotalRewardOnlyStakingReward() public {
        // Calculate total reward with only staking reward
        uint256 stakingReward = 50 * 10**6; // 50 TRASH
        uint256 totalReward = wrapper.calculateTotalReward(0, stakingReward, 0);
        
        // Check total reward calculation
        assertEq(totalReward, stakingReward);
    }
    
    /**
     * @dev Test calculating total reward with only quest reward
     */
    function testCalculateTotalRewardOnlyQuestReward() public {
        // Calculate total reward with only quest reward
        uint256 questReward = 30 * 10**6; // 30 TRASH
        uint256 totalReward = wrapper.calculateTotalReward(0, 0, questReward);
        
        // Check total reward calculation
        assertEq(totalReward, questReward);
    }
    
    /**
     * @dev Test calculating total reward with large values
     */
    function testCalculateTotalRewardLargeValues() public {
        // Calculate total reward with large values
        uint256 largeBaseReward = 1000000 * 10**6; // 1,000,000 TRASH
        uint256 largeStakingReward = 500000 * 10**6; // 500,000 TRASH
        uint256 largeQuestReward = 300000 * 10**6; // 300,000 TRASH
        uint256 totalReward = wrapper.calculateTotalReward(largeBaseReward, largeStakingReward, largeQuestReward);
        
        // Check total reward calculation
        assertEq(totalReward, largeBaseReward + largeStakingReward + largeQuestReward);
    }
}

/**
 * @title RewardCalculatorWrapper
 * @dev Wrapper contract to expose RewardCalculator library functions for testing
 */
contract RewardCalculatorWrapper {
    uint256 public constant BASE_REWARD_PER_KG = 100 * 10**6; // 100 TRASH tokens per kg
    uint256 public constant STAKING_REWARD_RATE = 500; // 5% annual rate (in basis points)
    
    function calculateBaseRecyclingReward(uint256 weightInKg) public pure returns (uint256) {
        return RewardCalculator.calculateBaseRecyclingReward(weightInKg, BASE_REWARD_PER_KG);
    }
    
    function calculateStakingReward(uint256 stakeAmount, uint256 stakeDuration) public pure returns (uint256) {
        return RewardCalculator.calculateStakingReward(stakeAmount, stakeDuration, STAKING_REWARD_RATE);
    }
    
    function applyRecyclingMultiplier(uint256 baseReward, uint256 multiplier) public pure returns (uint256) {
        return RewardCalculator.applyRecyclingMultiplier(baseReward, multiplier);
    }
    
    function calculateQuestReward(uint256 baseReward, uint256 questMultiplier) public pure returns (uint256) {
        return RewardCalculator.calculateQuestReward(baseReward, questMultiplier);
    }
    
    function calculateTotalReward(uint256 baseReward, uint256 stakingReward, uint256 questReward) public pure returns (uint256) {
        return RewardCalculator.calculateTotalReward(baseReward, stakingReward, questReward);
    }
}
